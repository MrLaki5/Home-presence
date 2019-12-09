import re
import subprocess


def get_active_mac_addresses():
    # Use arp to get all mac addresses on local network
    addresses = subprocess.check_output(["cat", "/proc/net/arp"])
    # Use regex to extract all mac addresses
    p = re.compile(r'(?:[0-9a-fA-F]{1,}(?:\-|\:)){5}[0-9a-fA-F]{1,}')
    mac_addresses = re.findall(p, str(addresses))
    # Remove broadcast address
    while "ff:ff:ff:ff:ff:ff" in mac_addresses:
        mac_addresses.remove("ff:ff:ff:ff:ff:ff")
    return mac_addresses


if __name__ == "__main__":
    print(get_active_mac_addresses())
