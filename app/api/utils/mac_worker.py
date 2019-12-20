import threading
import os
import copy
from time import sleep
from flask import current_app
from utils.mac_tools import get_active_mac_addresses


class MacWorker(threading.Thread):

    def __init__(self, app):
        super(MacWorker, self).__init__()
        self.app_context = app.app_context()
        self.active_set = []
        self.active_set_lock = threading.Lock()
        self.max_miss_count = int(os.environ['MAX_MISS_COUNTER'])
        self.sleep_time = int(os.environ['WORKER_MAC_SLEEP_TIME_S'])

    def get_active_set(self):
        with self.active_set_lock:
            return_active_set = copy.deepcopy(self.active_set)
        return return_active_set

    def run(self):
        with self.app_context:
            current_app.logger.debug("MAC worker started!")
        while True:
            sleep(self.sleep_time)
            active_mac_addresses = get_active_mac_addresses()
            with self.active_set_lock:
                for set_mac in self.active_set:
                    if set_mac["mac"] in active_mac_addresses:
                        set_mac["miss_count"] = 0
                        active_mac_addresses.remove(set_mac["mac"])
                    else:
                        set_mac["miss_count"] += 1
                for active_mac in active_mac_addresses:
                    self.active_set.append({"mac": active_mac, "miss_count": 0})
                self.active_set = filter(lambda x: x["miss_count"] < self.max_miss_count, self.active_set)
                self.active_set = sorted(self.active_set, key=lambda x: x["miss_count"], reverse=False)
            with self.app_context:
                num = 1
                current_app.logger.debug("======================================================")
                current_app.logger.debug("Addresses list:")
                current_app.logger.debug("======================================================")
                for item in self.active_set:
                    current_app.logger.debug("{:0>2d}".format(num) +
                                             ". Mac: " + str(item["mac"]) +
                                             ", Miss count: " + str(item["miss_count"])
                                             )
                    num += 1
