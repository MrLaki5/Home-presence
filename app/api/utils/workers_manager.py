from utils.mac_worker import MacWorker
from utils.db_worker import DBWorker
import threading
import os


worker_mac = None
worker_db = None
workers_settings = {
    "sleep_time_db": int(os.environ['WORKER_DB_SLEEP_TIME_S']),
    "network_mask": os.environ['NETWORK_MASK'],
    "sleep_time_mac": int(os.environ['WORKER_MAC_SLEEP_TIME_S']),
    "max_miss_count": int(os.environ['MAX_MISS_COUNTER'])
}
worker_start_flag = threading.Lock()


# Function for starting workers
def start_workers(current_app):
    global worker_mac, worker_db, workers_settings
    response = {}
    with worker_start_flag:
        if (not worker_mac) and (not worker_db):
            worker_mac = MacWorker(current_app._get_current_object())
            worker_db = DBWorker(current_app._get_current_object(), worker_mac)
            worker_mac.set_settings(workers_settings)
            worker_db.set_settings(workers_settings)
            worker_mac.start()
            worker_db.start()
            return True
        else:
            return False


# Function for stopping workers
def stop_workers():
    global worker_mac, worker_db
    response = {}
    with worker_start_flag:
        if worker_mac and worker_db:
            worker_mac.stop_worker()
            worker_db.stop_worker()
            worker_mac.join()
            worker_db.join()
            worker_mac = None
            worker_db = None
            return True
        else:
            return False


# Function for getting status of workers
def status_workers():
    global worker_mac, worker_db
    response = {}
    with worker_start_flag:
        if worker_mac and worker_db:
            return True
        else:
            return False


# Function for getting settings
def get_settings():
    global worker_mac, worker_db, workers_settings
    with worker_start_flag:
        if worker_mac:
            workers_settings = worker_mac.get_settings(workers_settings)
        if worker_db:
            workers_settings = worker_db.get_settings(workers_settings)
    return workers_settings


# Function for setting settings
def set_settings(data):
    global worker_mac, worker_db, workers_settings
    with worker_start_flag:
        if worker_mac and worker_db:
            worker_mac.set_settings(data)
            workers_settings = worker_mac.get_settings(workers_settings)
            worker_db.set_settings(data)
            workers_settings = worker_db.get_settings(workers_settings)
        else:
            if ("max_miss_count" in data) and (isinstance(data["max_miss_count"], int)):
                workers_settings["max_miss_count"] = data["max_miss_count"]
            if ("sleep_time_mac" in data) and (isinstance(data["sleep_time_mac"], int)):
                workers_settings["sleep_time_mac"] = data["sleep_time_mac"]
            if ("network_mask" in data) and (isinstance(data["network_mask"], str)):
                workers_settings["network_mask"] = data["network_mask"]
            if ("sleep_time_db" in data) and (isinstance(data["sleep_time_db"], int)):
                workers_settings["sleep_time_db"] = data["sleep_time_db"]
    return workers_settings
