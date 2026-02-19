Tool to config Lora devices thru downlink.

## Live Demo

You can access the web interface at: https://connect2lora.github.io/config-downlink-tool/

**Note:** The live demo requires a running backend server. Follow the setup instructions below to run the backend.

## Setup and Usage

### Running the Backend Server

To use it:

1. npm install

2. Edit mqtt_loraserver in downtool.js to point to your chirpstack. 

3. Set your application id 

4. nodejs downtool.js

5. Open http://localhost:3001 or use the [GitHub Pages interface](https://connect2lora.github.io/config-downlink-tool/) and configure it to connect to ws://localhost:3001

## Using GitHub Pages

The web interface is published on GitHub Pages and can be accessed at:
https://connect2lora.github.io/config-downlink-tool/

To use it:
1. Run the backend server locally following the steps above
2. Open the GitHub Pages URL in your browser
3. Update the WebSocket URL to point to your local server (default: ws://localhost:3001)
4. Click "Connect"
5. Start sending commands to your LoRa devices