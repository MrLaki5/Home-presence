import threading
import os
from time import sleep
from flask import current_app
from model import User, db, function_now, LogUser


class DBWorker(threading.Thread):

    def __init__(self, app, mac_worker):
        super(DBWorker, self).__init__()
        self.app_context = app.app_context()
        self.mac_worker = mac_worker
        self.sleep_time = int(os.environ['WORKER_DB_SLEEP_TIME_S'])

    def run(self):
        with self.app_context:
            current_app.logger.debug("DB worker started!")
        while True:
            sleep(self.sleep_time)
            active_set = self.mac_worker.get_active_set()
            with self.app_context:
                curr_time = function_now()
                current_app.logger.debug("DBWorker: update time: " + str(curr_time))
                for item in active_set:
                    user_exists = User.query.filter_by(mac_address=str(item["mac"])).first()
                    if not user_exists:
                        user_exists = User(mac_address=str(item["mac"]), name=str(item["name"]))
                        db.session.add(user_exists)
                        db.session.commit()
                    else:
                        if user_exists["name"] == "" and item["name"] != "":
                            user_exists["name"] = item["name"]
                    log_user = LogUser(user_uuid=user_exists.uuid, time=curr_time)
                    db.session.add(log_user)
                    db.session.commit()
