from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import asyncio
from kasa import SmartStrip

app = FastAPI()

DEVICE_IP = "192.168.0.133"  # Replace with your actual device IP
strip = SmartStrip(DEVICE_IP)

# Function to turn on the device
async def turn_on_device():
    print("Turning on")
    await strip.update()
    # await strip.turn_on()
    await strip.children[1].turn_on()
    await strip.update()  # Update device state after turning it on


# Function to turn off the device
async def turn_off_device():
    print("Turning off")
    await strip.update()
    # await strip.turn_off()
    await strip.children[1].turn_off()
    await strip.update()  # Update device state after turning it off


# app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
# async def home():
#     with open("templates/index.html") as f:
#         return f.read()

@app.get("/turn_on")
async def turn_on():
    await turn_on_device()
    return {"status": "on"}

@app.get("/turn_off")
async def turn_off():
    await turn_off_device()
    return {"status": "off"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001, log_level="info")
