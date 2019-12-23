from flask import Flask, request, current_app
import yaml
import model
import pytz
import os
from model import LogUser, User, db
import json
import logging
from utils.mac_worker import MacWorker
from utils.db_worker import DBWorker
from sqlalchemy import func, desc

logging.basicConfig(level=logging.DEBUG)


def create_app():
    app_inner = Flask(__name__)
    db_yaml = yaml.load(open('db.yaml'), Loader=yaml.FullLoader)
    app_inner.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://' + db_yaml['user'] + ':' + db_yaml['password'] + '@' +\
                                                  db_yaml['host'] + ":" + db_yaml['port'] + "/" + db_yaml['db']
    app_inner.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    model.db.init_app(app_inner)
    return app_inner


app = create_app()


# Ping method
@app.route('/ping', methods=['GET'])
def ping():
    app.logger.debug("Ping!")
    response = {}
    response["status"] = "success"
    response["message"] = "pong"
    return json.dumps(response), 200


@app.route('/workers_start', methods=['GET'])
def start_worker():
    worker_mac = MacWorker(current_app._get_current_object())
    worker_db = DBWorker(current_app._get_current_object(), worker_mac)
    worker_mac.start()
    worker_db.start()
    response = {}
    response["status"] = "success"
    response["message"] = "workers started"
    return json.dumps(response), 200


@app.route('/mac_logs', methods=['GET'])
def get_mac_logs():
    return_macs = []
    macs_db = LogUser.query.limit(5).all()
    for mac_db in macs_db:
        curr_mac = User.query.filter_by(uuid=mac_db["user_uuid"]).first()
        if curr_mac:
            return_macs.append({"mac": curr_mac["mac_address"], "time": str(mac_db["time"])})
    return_message = {
        "status": "success",
        "mac_logs": return_macs
    }
    return json.dumps(return_message), 200


@app.route('/num_logs', methods=['GET'])
def get_mac_num():
    return_nums = []
    # nums_db = db.session.query(LogUser.time, func.count(LogUser.user_uuid)).group_by(LogUser.time).all()

    distinct_users = (
        db.session.query(func.date_trunc('hour', LogUser.time).label('h'), LogUser.user_uuid.label('count_inner')).group_by('h', LogUser.user_uuid).subquery()
    )

    nums_db = db.session.query(distinct_users.c.h, func.count().label('count')).group_by(distinct_users.c.h).order_by(desc(distinct_users.c.h)).all()
    tz = pytz.timezone(os.environ['TIMEZONE'])
    for num_db in nums_db:
        time_curr = pytz.utc.localize(num_db[0], is_dst=None).astimezone(tz)
        return_nums.append({"count": num_db[1], "time": time_curr.strftime("%m/%d/%Y, %H:%M:%S")})
    return_message = {
        "status": "success",
        "mac_logs": return_nums
    }
    return json.dumps(return_message), 200


# Create flask app and set it up to listen on specific ip and specific port
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
