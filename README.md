# Depining - ESP32 Environmental Monitoring

A Solana program for collecting environmental data from ESP32 equipped with sensors. This program allows IoT devices to securely store sensor readings on the blockchain.

## Hardware Setup

This Solana program communicates with **ESP32** microcontrollers that are equipped with the following sensors:

- **DHT11** - Temperature and humidity sensor
- **Air530** - GPS module for geolocation data

## What it does

The program handles two main operations:

1. **Initialize Sensor** - Creates PDA associated with the ESP32.
2. **Feed Data** - Records environmental readings from the device's sensors

## Sensor Data

Each ESP32 device can record:
- **Humidity levels** (from DHT11)
- **Temperature readings** (from DHT11)  
- **Heat index calculations** (computed from temperature/humidity)
- **GPS coordinates** (latitude/longitude from Air530)



