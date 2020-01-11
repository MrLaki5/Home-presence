from flask import Flask, request, current_app, jsonify
import yaml
import model
import pytz
import os
from model import LogUser, User, db
import json
import datetime
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
    return jsonify(response), 200


@app.route('/workers_start', methods=['GET'])
def start_worker():
    worker_mac = MacWorker(current_app._get_current_object())
    worker_db = DBWorker(current_app._get_current_object(), worker_mac)
    worker_mac.start()
    worker_db.start()
    response = {}
    response["status"] = "success"
    response["message"] = "workers started"
    return jsonify(response), 200


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
    return jsonify(return_message), 200


@app.route('/num_logs', methods=['GET'])
def get_mac_num():
    # Get parameters
    top_values = request.args.get('top')
    try:
        top_values = int(top_values)
    except Exception as ex:
        top_values = 10
    time_group = request.args.get('time_group')
    time_groups = ["hour", "day", "month", "year"]
    if time_group not in time_groups:
        time_group = "hour"

    return_nums = []

    # Get users grouped by time and user id
    distinct_users = (db.session.query(
            func.date_trunc(time_group, LogUser.time).label('curr_time'), LogUser.user_uuid.label('count_inner'))
            .group_by('curr_time', LogUser.user_uuid)
            .subquery())

    # Get users grouped by time from user that are grouped by time and id,
    # this will give count of different users per time
    nums_db = (db.session.query(distinct_users.c.curr_time, func.count().label('count'))
               .group_by(distinct_users.c.curr_time)
               .order_by(desc(distinct_users.c.curr_time))
               .limit(top_values)
               .all())

    # Iterate thorough results and put them into json
    tz = pytz.timezone(os.environ['TIMEZONE'])
    for num_db in nums_db:
        # Convert time to given timezone
        time_curr = pytz.utc.localize(num_db[0], is_dst=None).astimezone(tz)
        return_nums.append({"count": num_db[1], "time": time_curr.strftime("%d/%m/%Y, %H:%M:%S")})
    return_message = {
        "status": "success",
        "mac_logs": return_nums
    }
    response = jsonify(return_message)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


@app.route('/mac_in_time', methods=['GET'])
def get_mac_in_time():
    # Get parameters
    try:
        # Convert time from local timezone to UTC (db is in UTC)
        time = request.args.get('time')
        time = datetime.datetime.strptime(time, "%d/%m/%Y, %H:%M:%S")
        tz = pytz.timezone(os.environ['TIMEZONE'])
        time = tz.localize(time, is_dst=None)
        time = time.astimezone(pytz.utc)
        current_app.logger.debug("TIME: " + str(time))
    except Exception as ex:
        current_app.logger.debug("ERROR: " + str(ex))
        time = None
    if not time:
        return_message = {
            "status": "fail",
            "message": "Bad payload"
        }
        return jsonify(return_message), 400
    time_group = request.args.get('time_group')
    time_groups = ["hour", "day", "month", "year"]
    if time_group not in time_groups:
        time_group = "hour"

    return_nums = []

    # Get users grouped by time and user id
    distinct_users = (db.session.query(
            func.date_trunc(time_group, LogUser.time).label('curr_time'), LogUser.user_uuid.label('user_uuid'))
            .group_by('curr_time', LogUser.user_uuid)
            .subquery())

    # Filter with given time and show user ids
    nums_db = (db.session.query(distinct_users.c.user_uuid)
               .filter(distinct_users.c.curr_time == time)
               .all())

    # Iterate thorough results and put them into json
    for num_db in nums_db:
        # Get mac address for user id
        curr_mac = User.query.filter_by(uuid=num_db[0]).first()
        return_nums.append({"mac_address": curr_mac["mac_address"]})
    return_message = {
        "status": "success",
        "mac_logs": return_nums
    }
    return jsonify(return_message), 200


# Create flask app and set it up to listen on specific ip and specific port
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
