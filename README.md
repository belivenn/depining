# Depining - ESP32 Environmental Monitoring

A Solana program for collecting environmental data from ESP32 devices equipped with sensors. This program allows IoT devices to securely store sensor readings on the blockchain.

## Hardware Setup

This program is designed to run on an **ESP32** microcontroller with the following sensors:

- **DHT11** - Temperature and humidity sensor
- **Air530** - GPS module for geolocation data

## What it does

The program handles two main operations:

1. **Initialize Sensor** - Sets up a new ESP32 device on the network
2. **Feed Data** - Records environmental readings from the device's sensors

## Sensor Data

Each ESP32 device can record:
- **Humidity levels** (from DHT11)
- **Temperature readings** (from DHT11)  
- **Heat index calculations** (computed from temperature/humidity)
- **GPS coordinates** (latitude/longitude from Air530)



