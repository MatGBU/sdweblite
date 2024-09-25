import asyncio
from kasa import Discover

async def main():
    dev = await Discover.discover_single("127.0.0.1",username="mgorczak@bu.edu",password="")
    await dev.turn_on()
    await dev.update()

if __name__ == "__main__":
    asyncio.run(main())