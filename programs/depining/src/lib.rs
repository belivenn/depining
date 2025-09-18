#![allow(unexpected_cfgs)]
#![allow(deprecated)]
use anchor_lang::prelude::*;

mod constants;
use constants::*;

use crate::errors::SensorError;
mod errors;

declare_id!("H5bdVxHZQ7m9jELoocVRAjvBzS9D4i5hJNNSc8G58yDx");

#[program]
pub mod depining {
    use super::*;

    #[instruction(discriminator = 0)]
    pub fn initialize_sensor(ctx: Context<InitSensor>) -> Result<()> {
        ctx.accounts.init_sensor(&ctx.bumps)?;
        Ok(())
    }
    #[instruction(discriminator = 1)]
    pub fn feed_data(
        ctx: Context<FeedSensorData>,
        humidity: Option<u32>,
        temperature: Option<u32>,
        heat_index: Option<u32>,
        latitude: Option<i32>,
        longitude: Option<i32>,
    ) -> Result<()> {
        ctx.accounts
            .feed_sensor_data(humidity, temperature, heat_index, latitude, longitude)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitSensor<'info> {
    #[account(mut)]
    pub sensor_id: Signer<'info>,
    #[account(
        init,
        payer = sensor_id,
        space = 1 + SensorData::INIT_SPACE,
        seeds = [SENSOR_SEED, sensor_id.key().as_ref()],
        bump,
    )]
    pub sensor_data: Account<'info, SensorData>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitSensor<'info> {
    pub fn init_sensor(&mut self, bumps: &InitSensorBumps) -> Result<()> {
        self.sensor_data.set_inner(SensorData {
            sensor_id: self.sensor_id.key(),
            humidity: None,
            temperature: None,
            heat_index: None,
            latitude: None,
            longitude: None,
            latest_update: Clock::get()?.unix_timestamp,
            slot: Clock::get()?.slot,
            bump: bumps.sensor_data,
        });
        msg!("latest_update: {}", Clock::get()?.unix_timestamp);
        msg!("slot: {}", Clock::get()?.slot);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct FeedSensorData<'info> {
    #[account(mut)]
    pub sensor_id: Signer<'info>,
    #[account(
        mut,
        seeds = [SENSOR_SEED, sensor_data.sensor_id.as_ref()],
        bump = sensor_data.bump,
        has_one = sensor_id,
    )]
    pub sensor_data: Account<'info, SensorData>,
}

impl<'info> FeedSensorData<'info> {
    pub fn feed_sensor_data(
        &mut self,
        humidity: Option<u32>,
        temperature: Option<u32>,
        heat_index: Option<u32>,
        latitude: Option<i32>,
        longitude: Option<i32>,
    ) -> Result<()> {
        self.sensor_data.humidity = humidity;
        self.sensor_data.temperature = temperature;
        self.sensor_data.heat_index = heat_index;
        self.sensor_data.latitude = latitude;
        self.sensor_data.longitude = longitude;
        self.sensor_data.check_and_update()?;

        msg!("humidity: {:?}", self.sensor_data.humidity);
        msg!("temperature: {:?}", self.sensor_data.temperature);
        msg!("heat_index: {:?}", self.sensor_data.heat_index);
        msg!("latitude: {:?}", self.sensor_data.latitude);
        msg!("longitude: {:?}", self.sensor_data.longitude);
        msg!("latest_update: {}", Clock::get()?.unix_timestamp);
        msg!("slot: {}", Clock::get()?.slot);
        Ok(())
    }
}
#[account(discriminator = 1)]
#[derive(InitSpace)]
pub struct SensorData {
    pub sensor_id: Pubkey,
    pub humidity: Option<u32>,
    pub temperature: Option<u32>,
    pub heat_index: Option<u32>,
    pub latitude: Option<i32>,
    pub longitude: Option<i32>,
    pub latest_update: i64,
    pub slot: u64,
    pub bump: u8,
}

impl SensorData {
    pub fn check_and_update(&mut self) -> Result<()> {
        require!(
            self.slot < Clock::get()?.slot,
            SensorError::InvalidTimestamp
        );
        self.latest_update = Clock::get()?.unix_timestamp;
        self.slot = Clock::get()?.slot;
        Ok(())
    }
}
