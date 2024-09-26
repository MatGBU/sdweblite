from kasa import Discover, Credentials

found_devices = await Discover.discover()
[dev.model for dev in found_devices.values()]