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

    def run(self):
        while True:
            sleep(self.sleep_time)
            active_mac_addresses = get_active_mac_addresses()
            with self.app_context:
                current_app.logger.debug("Mac addresses: " + str(active_mac_addresses))
