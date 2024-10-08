from flask import Flask, jsonify
import asyncio
from kasa import SmartStrip

app = Flask(__name__)

# TP-Link Smart Power Strip IP address
DEVICE_IP = "192.168.0.11"

# Async function to control the power strip
async def control_device(action):
    dev = SmartStrip(DEVICE_IP)
    await dev.update()  # Ensure device is up-to-date

    if action == "on":
        await dev.turn_on()
    elif action == "off":
        await dev.turn_off()

    await dev.update()  # Fetch the latest state of the device
    return dev.is_on

@app.route('/control/<action>', methods=['GET'])
def control_power_strip(action):
    if action not in ['on', 'off']:
        return jsonify({"error": "Invalid action"}), 400

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    is_on = loop.run_until_complete(control_device(action))

    status = "on" if is_on else "off"
    return jsonify({"status": status})

if __name__ == "__main__":
    app.run(debug=True)
