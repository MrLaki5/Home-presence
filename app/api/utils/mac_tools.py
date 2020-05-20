import re
import subprocess


def get_active_mac_addresses(network_mask):
    # Use arp to get all mac addresses on local network
    addresses = subprocess.check_output(["nmap", "-sn", network_mask])
    # Use regex to extract all mac addresses
    p = re.compile(r'(?:[0-9a-fA-F]{1,}(?:\-|\:)){5}[0-9a-fA-F]{1,}')
    p_hosts = re.compile(r'Nmap\sscan\sreport\sfor\s(.*?)\s\(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\)', re.MULTILINE)
    p_hosts_exist = re.compile(r'Nmap\sscan\sreport\sfor\s', re.MULTILINE)
    # Go through rows and look out for mac addresses and hosts
    mac_addresses = []
    hosts = []
    curr_mac = None
    curr_host = ""
    host_exists_flag = False
    addresses = str(addresses).split("\\n")
    for address in addresses:
        mac_address = re.findall(p, address)
        # If array is longer then 0 there is mac address on line
        if len(mac_address) > 0:
            # If mac address existed, put old one into arrays
            if curr_mac:
                mac_addresses.append(curr_mac)
                hosts.append(curr_host)
                curr_host = ""
            curr_mac = mac_address[0]
        host = re.findall(p_hosts, address)
        # If array is longer then 0 there is host name on line
        if len(host) > 0:
            # If there is mac address and host or host is empty add old values to arrays
            if curr_mac and (curr_host != "" or host_exists_flag):
                mac_addresses.append(curr_mac)
                hosts.append(curr_host)
                curr_mac = None
                host_exists_flag = False
            curr_host = host[0]
        else:
            # If host name doesnt exist in current scan keep it in track
            host_exist = re.findall(p_hosts_exist, address)
            if len(host_exist) > 0:
                host_exists_flag = True
                if curr_mac:
                    mac_addresses.append(curr_mac)
                    hosts.append(curr_host)
                    curr_mac = None
                curr_host = ""
    # If mac exists add last element to arrays
    if curr_mac:
        mac_addresses.append(curr_mac)
        hosts.append(curr_host)
    # Remove broadcast address
    while "ff:ff:ff:ff:ff:ff" in mac_addresses:
        index = mac_addresses.index("ff:ff:ff:ff:ff:ff")
        mac_addresses.pop(index)
        hosts.pop(index)
    return mac_addresses, hosts


if __name__ == "__main__":
    addresses_in, hosts_in = get_active_mac_addresses()
    for mac, host in zip(addresses_in, hosts_in):
        print("Mac: " + mac + ", Host: " + host)
