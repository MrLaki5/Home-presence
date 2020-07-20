import threading
import os
from flask import current_app
from model import db, function_now, LogUser
import pytz


class CleanupWorker(threading.Thread):

    def __init__(self, app):
        super(CleanupWorker, self).__init__()
        self.app_context = app.app_context()
        self.sleep_time = int(os.environ['WORKER_CLEANUP_SLEEP_TIME_S'])
        self.cleanup_time = int(os.environ["WORKER_CLEANUP_TIME_D"])
        self.wait_event = threading.Event()
        self.setting_data_lock = threading.Lock()
        self.tz = pytz.timezone(os.environ['TIMEZONE'])

    def set_settings(self, settings):
        with self.setting_data_lock:
            if ("sleep_time_cleanup" in settings) and (isinstance(settings["sleep_time_cleanup"], int)):
                self.sleep_time = settings["sleep_time_cleanup"]
            if ("cleanup_time_cleanup" in settings) and (isinstance(settings["cleanup_time_cleanup"], int)):
                self.cleanup_time = settings["cleanup_time_cleanup"]

    def get_settings(self, return_settings):
        with self.setting_data_lock:
            return_settings["sleep_time_cleanup"] = self.sleep_time
            return_settings["cleanup_time_cleanup"] = self.cleanup_time
        return return_settings

    def stop_worker(self):
        self.wait_event.set()

    def run(self):
        with self.app_context:
            current_app.logger.debug("Cleanup worker started!")

        while True:
            if self.wait_event.wait(self.sleep_time):
                break

            with self.app_context:
                # Get time
                curr_time = function_now()
                # Go through logs and delete outdated ones
                logs = LogUser.query.all()
                for log in logs:
                    log_time = pytz.utc.localize(log["time"], is_dst=None).astimezone(self.tz)
                    diff_date = curr_time - log_time
                    if diff_date.days >= self.cleanup_time:
                        db.session.delete(log)
                db.session.commit()
                current_app.logger.debug("Cleanup worker: cleanup done, time: " + str(curr_time))

        with self.app_context:
            current_app.logger.debug("Cleanup worker stopped!")
