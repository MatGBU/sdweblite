from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from kasa import SmartStrip
from kasa import Module

app = FastAPI()

DEVICE_IP = "192.168.0.133"  # Replace with your actual device IP
strip = SmartStrip(DEVICE_IP)

### Important commands

# Create a schedule rule for a plug
# sact: 0 for turn off, 1 for turn on
# smin: start minute, where 0 is 00:00
# kasa --host 192.168.0.133 command --child-index 2 --module schedule add_rule 
# '{"stime_opt":0,"wday":[1,1,1,1,1,1,1],"smin":1029,"enable":1,"repeat":1,"etime_opt":-1,"name":"lights on","eact":-1,"month":0,"sact":1,"year":0,"longitude":0,"day":0,"force":0,"latitude":0,"emin":0,"set_overall_enable":{"enable":1}}'



# Function to turn on the device
async def turn_on_device(input):
    print("Turning on")
    await strip.update()
    await strip.children[input].turn_on()
    # strip.children[input].modules['schedule'].data['get_rules']['rule_list']
    # print(strip.children[input].modules)
    print("\n")
    print(strip.children[input].modules['schedule'])
    # print(strip.modules)



    await strip.update()  # Update device state after turning it on


# Function to turn off the device
async def turn_off_device(input):
    print("Turning off")
    await strip.update()
    await strip.children[input].turn_off()
    await strip.update()  # Update device state after turning it off

@app.get("/", response_class=HTMLResponse)

@app.get("/turn_on")
async def turn_on(input: int):
    await turn_on_device(input)
    return {"status": "on"}

@app.get("/turn_off")
async def turn_off(input: int):
    await turn_off_device(input)
    return {"status": "off"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001, log_level="info")
