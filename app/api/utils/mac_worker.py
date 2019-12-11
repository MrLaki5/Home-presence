import threading
from time import sleep
from flask import current_app
from utils.mac_tools import get_active_mac_addresses


class MacWorker(threading.Thread):

    def __init__(self, app):
        super(MacWorker, self).__init__()
        self.app_context = app.app_context()
        # Sleep time In seconds
        self.sleep_time = 10
        self.active_set = []

    def run(self):
        while True:
            sleep(self.sleep_time)
            active_mac_addresses = get_active_mac_addresses()
            for set_mac in self.active_set:
                if set_mac["mac"] in active_mac_addresses:
                    set_mac["count"] += 1
                    active_mac_addresses.remove(set_mac["mac"])
                else:
                    set_mac["count"] = 0
            for active_mac in active_mac_addresses:
                self.active_set.append({"mac": active_mac, "count": 1})
            self.active_set = sorted(self.active_set, key=lambda x: x["count"], reverse=True)
            with self.app_context:
                num = 1
                current_app.logger.debug("======================================================")
                current_app.logger.debug("Addresses list:")
                current_app.logger.debug("======================================================")
                for item in self.active_set:
                    current_app.logger.debug("{:0>2d}".format(num) +
                                             ". Mac: " + str(item["mac"]) +
                                             ", Count: " + str(item["count"])
                                             )
                    num += 1
