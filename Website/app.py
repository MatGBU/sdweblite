from flask import Flask, jsonify
import asyncio
from kasa import SmartPlug  # If you're using a smart plug

app = Flask(__name__)

DEVICE_IP = "192.168.0.11"  # Replace with your actual device's IP address

# Function to turn on the device
async def turn_on_device():
    plug = SmartPlug(DEVICE_IP)
    await plug.update()
    await plug.turn_on()
    await plug.update()  # Update device state after turning it on
    return plug.is_on

# Function to turn off the device
async def turn_off_device():
    plug = SmartPlug(DEVICE_IP)
    await plug.update()
    await plug.turn_off()
    await plug.update()  # Update device state after turning it off
    return plug.is_off

# Route to turn on the device
@app.route('/turn_on', methods=['GET'])
def turn_on():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    is_on = loop.run_until_complete(turn_on_device())
    return jsonify({'status': 'on'}) if is_on else jsonify({'error': 'Failed to turn on'})

# Route to turn off the device
@app.route('/turn_off', methods=['GET'])
def turn_off():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    is_off = loop.run_until_complete(turn_off_device())
    return jsonify({'status': 'off'}) if is_off else jsonify({'error': 'Failed to turn off'})

if __name__ == "__main__":
    app.run(debug=True)
