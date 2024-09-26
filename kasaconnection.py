import asyncio
from kasa import Discover


async def main():
    dev = await Discover.discover("192.168.0.11",username="gorczam02@gmail.com",password="SeniorDesign28.")
    await dev.turn_off()
    await dev.update()
    for feature_name in dev.features:
     print(feature_name)
    usage = dev.modules["usage"]
    print(f"Minutes on this month: {usage.usage_this_month}")
    print(f"Minutes on today: {usage.usage_today}")
if __name__ == "__main__":
    asyncio.run(main())