import threading
import os
from flask import current_app
from model import User, db, function_now, LogUser, UpdateTime


def date_checker(date1, date2):
    hour_counter = ((date1.hour == date2.hour) and
                    (date1.day == date2.day) and
                    (date1.month == date2.month) and
                    (date1.year == date2.year))
    day_counter = ((date1.day == date2.day) and
                   (date1.month == date2.month) and
                   (date1.year == date2.year))
    month_counter = ((date1.month == date2.month) and
                     (date1.year == date2.year))
    year_counter = (date1.year == date2.year)
    return not hour_counter, not day_counter, not month_counter, not year_counter


class DBWorker(threading.Thread):

    def __init__(self, app, mac_worker):
        super(DBWorker, self).__init__()
        self.app_context = app.app_context()
        self.mac_worker = mac_worker
        self.sleep_time = int(os.environ['WORKER_DB_SLEEP_TIME_S'])
        self.wait_event = threading.Event()
        self.setting_data_lock = threading.Lock()

    def set_settings(self, settings):
        with self.setting_data_lock:
            if ("sleep_time_db" in settings) and (isinstance(settings["sleep_time_db"], int)):
                self.sleep_time = settings["sleep_time_db"]

    def get_settings(self, return_settings):
        with self.setting_data_lock:
            return_settings["sleep_time_db"] = self.sleep_time
        return return_settings

    def stop_worker(self):
        self.wait_event.set()

    def run(self):
        with self.app_context:
            current_app.logger.debug("DB worker started!")
        while True:
            if self.wait_event.wait(self.sleep_time):
                break
            active_set = self.mac_worker.get_active_set()
            with self.app_context:
                # Get times
                curr_time = function_now()
                update_time = UpdateTime.query.first()
                if not update_time:
                    update_time = UpdateTime(last_update=curr_time)

                # Reset counters for top lists if they need to be reset
                reset_hour_counter, reset_day_counter, reset_month_counter, reset_year_counter = date_checker(
                    update_time["last_update"], curr_time)
                if reset_day_counter or reset_month_counter or reset_year_counter:
                    users = User.query.all()
                    for user in users:
                        if reset_day_counter:
                            user["day_time_count"] = 0
                        if reset_month_counter:
                            user["month_time_count"] = 0
                        if reset_year_counter:
                            user["year_time_count"] = 0
                        db.session.commit()

                # Updating update times
                update_time["last_update"] = curr_time
                db.session.commit()

                current_app.logger.debug("DBWorker: update time: " + str(curr_time))
                for item in active_set:
                    user_exists = User.query.filter_by(mac_address=str(item["mac"])).first()
                    if not user_exists:
                        user_exists = User(mac_address=str(item["mac"]),
                                           name=str(item["name"]),
                                           last_update=curr_time,
                                           all_time_count=1,
                                           day_time_count=1,
                                           month_time_count=1,
                                           year_time_count=1
                                           )
                        db.session.add(user_exists)
                        db.session.commit()
                    else:
                        if user_exists["name"] == "" and item["name"] != "":
                            user_exists["name"] = item["name"]

                    # Increment counters
                    inc_day_counter, inc_day_counter, inc_month_counter, inc_year_counter = date_checker(
                        user_exists["last_update"], curr_time)
                    if inc_day_counter:
                        user_exists["all_time_count"] += 1
                        user_exists["day_time_count"] += 1
                        user_exists["month_time_count"] += 1
                        user_exists["year_time_count"] += 1

                    # Updating user update time
                    user_exists["last_time"] = curr_time

                    # Create log entity
                    log_user = LogUser(user_uuid=user_exists.uuid, time=curr_time)
                    db.session.add(log_user)
                    db.session.commit()
        with self.app_context:
            current_app.logger.debug("DB worker stopped!")
