Tool to config Lora devices thru downlink.

## Live Demo

You can access the web interface at: https://connect2lora.github.io/config-downlink-tool/

**Note:** The live demo requires a running backend server. Follow the setup instructions below to run the backend.

## Setup and Usage

### Running the Backend Server

To use it:

1. npm install

2. Copy `.env.example` to `.env` and configure your settings:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `MQTT_LORASERVER`: URL of your MQTT server (e.g., `mqtt://loraserver` or `mqtt://localhost:1883`)
   - `APPLICATION_ID`: Your ChirpStack application ID
   - `CHIRPSTACK_VERSION`: Set to `3` for ChirpStack v3 or `4` for ChirpStack v4
   - `PORT`: Server port (default: 3001)

3. nodejs downtool.js

4. Open http://localhost:3001 or use the [GitHub Pages interface](https://connect2lora.github.io/config-downlink-tool/) and configure it to connect to ws://localhost:3001

## Using GitHub Pages

The web interface is published on GitHub Pages and can be accessed at:
https://connect2lora.github.io/config-downlink-tool/

To use it:
1. Run the backend server locally following the steps above
2. Open the GitHub Pages URL in your browser
3. Update the WebSocket URL to point to your local server (default: ws://localhost:3001)
4. Click "Connect"
5. Start sending commands to your LoRa devices