import asyncio
from kasa import Credentials, Discover

async def main():
    dev = await Discover.discover_single("192.168.0.11",username="mgorczak@bu.edu",password="SeniorDesign28.")  #add password
    await dev.turn_on()
    await dev.update()
    creds = Credentials("mgorczak@bu.edu", "SeniorDesign28.")  #add password
    devices = await Discover.discover(credentials=creds)
    print(len(devices))

if __name__ == "__main__":
    asyncio.run(main())