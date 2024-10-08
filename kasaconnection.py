import asyncio
from kasa import Discover


async def main():    #everything as to run inside the async function
    dev = await Discover.discover_single("192.168.0.11",username="gorczam02@gmail.com",password="SeniorDesign28")  #remember to change the password
    await dev.turn_on()   #turns the device on/off
    await dev.update()    #updates the firmware
    for feature_name in dev.features:
     print(feature_name)   
    usage = dev.modules["usage"]    #in theory should display how long something has been plugged into the device, however its not working rn
    print(f"Minutes on this month: {usage.usage_this_month}")
    print(f"Minutes on today: {usage.usage_today}")
if __name__ == "__main__":
    asyncio.run(main())     #run the async function