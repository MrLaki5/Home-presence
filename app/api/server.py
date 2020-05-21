from flask import Flask, request, current_app, jsonify
import yaml
import model
import pytz
import os
from model import LogUser, User, db
import datetime
import logging
import utils.workers_manager as workers_manager
from sqlalchemy import func, desc, literal

logging.basicConfig(level=logging.DEBUG)


def create_app():
    app_inner = Flask(__name__)
    db_yaml = yaml.load(open('db.yaml'), Loader=yaml.FullLoader)
    app_inner.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://' + db_yaml['user'] + ':' + db_yaml['password'] + '@' + \
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
def start_workers():
    response = {}
    if workers_manager.start_workers(current_app):
        response["status"] = "success"
        response["message"] = "workers started"
    else:
        response["status"] = "fail"
        response["message"] = "workers already started"
    response = jsonify(response)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


@app.route('/workers_stop', methods=['GET'])
def stop_workers():
    response = {}
    if workers_manager.stop_workers():
        response["status"] = "success"
        response["message"] = "workers stopped"
    else:
        response["status"] = "fail"
        response["message"] = "workers already stopped"
    response = jsonify(response)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


@app.route('/workers_status', methods=['GET'])
def status_workers():
    response = {}
    if workers_manager.status_workers():
        response["status"] = "success"
        response["state"] = "running"
    else:
        response["status"] = "success"
        response["state"] = "stopped"
    response = jsonify(response)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


@app.route('/settings', methods=['GET', 'POST'])
def settings_manager():
    response = {}
    if request.method == 'GET':
        workers_settings = workers_manager.get_settings()
        response["status"] = "success"
        response["settings"] = workers_settings
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200
    else:
        data = request.get_json()
        workers_settings = workers_manager.set_settings(data)
        response["status"] = "success"
        response["settings"] = workers_settings
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200


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
    response = jsonify(return_message)
    response.headers.add("Access-Control-Allow-Origin", "*")
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
    per_page = request.args.get('per_page')
    try:
        per_page = int(per_page)
    except Exception as ex:
        per_page = 10
    page_num = request.args.get('page_num')
    try:
        page_num = int(page_num)
    except Exception as ex:
        page_num = 1

    return_nums = []

    # Get users grouped by time and user id
    distinct_users = (db.session.query(
        func.date_trunc(time_group, LogUser.time).label('curr_time'), LogUser.user_uuid.label('user_uuid'))
                      .group_by('curr_time', LogUser.user_uuid)
                      .subquery())

    # Filter with given time and show user ids
    nums_db = (db.session.query(distinct_users.c.user_uuid)
               .filter(distinct_users.c.curr_time == time)
               .paginate(page_num, per_page, False).items)

    # Count with given time and show user ids
    nums_db_count = (db.session.query(distinct_users.c.user_uuid)
                     .filter(distinct_users.c.curr_time == time)
                     .count())

    # Iterate thorough results and put them into json
    for num_db in nums_db:
        # Get mac address for user id
        curr_mac = User.query.filter_by(uuid=num_db[0]).first()
        return_nums.append({"mac": curr_mac["mac_address"], "name": curr_mac["name"]})
    return_message = {
        "status": "success",
        "mac_logs": return_nums,
        "count": nums_db_count
    }
    response = jsonify(return_message)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


@app.route('/time_for_mac', methods=['POST'])
def get_time_for_mac():
    # Get parameters
    per_page = request.form.get('per_page')
    try:
        per_page = int(per_page)
    except Exception as ex:
        per_page = 10
    page_num = request.form.get('page_num')
    try:
        page_num = int(page_num)
    except Exception as ex:
        page_num = 1
    time_group = request.form.get('time_group')
    time_groups = ["hour", "day", "month", "year"]
    if time_group not in time_groups:
        time_group = "hour"
    mac = request.form.get("mac")
    if not mac or mac is "":
        return_message = {
            "status": "fail",
            "mac_logs": "bad payload"
        }
        response = jsonify(return_message)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 400

    return_nums = []

    # Get users grouped by time and user id
    distinct_users = (db.session.query(
        func.date_trunc(time_group, LogUser.time).label('curr_time'), LogUser.user_uuid.label('user_uuid'))
                      .group_by('curr_time', LogUser.user_uuid)
                      .subquery())

    # Get times grouped by time from specific user (filtered by user mac) that are grouped by time and id,
    # this will give present times for specific user
    nums_db = (db.session.query(distinct_users.c.curr_time)
               .group_by(distinct_users.c.curr_time)
               .order_by(desc(distinct_users.c.curr_time))
               .filter(distinct_users.c.user_uuid == User.uuid)
               .filter(User.mac_address == mac)
               .paginate(page_num, per_page, False).items)

    # Get count for times grouped by time from specific user (filtered by user mac) that are grouped by time and id,
    # this will give present times for specific user
    count = (db.session.query(distinct_users.c.curr_time)
             .group_by(distinct_users.c.curr_time)
             .order_by(desc(distinct_users.c.curr_time))
             .filter(distinct_users.c.user_uuid == User.uuid)
             .filter(User.mac_address == mac)
             .count())

    # Iterate thorough results and put them into json
    tz = pytz.timezone(os.environ['TIMEZONE'])
    for num_db in nums_db:
        # Convert time to given timezone
        time_curr = pytz.utc.localize(num_db[0], is_dst=None).astimezone(tz)
        return_nums.append({"time": time_curr.strftime("%d/%m/%Y, %H:%M:%S")})
    return_message = {
        "status": "success",
        "times": return_nums,
        "count": count
    }
    response = jsonify(return_message)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


@app.route('/users', methods=['GET'])
def get_users():
    # Get parameters
    search_name = request.args.get('name')
    if not search_name:
        search_name = ""
    per_page = request.args.get('per_page')
    try:
        per_page = int(per_page)
    except Exception as ex:
        per_page = 10
    page_num = request.args.get('page_num')
    try:
        page_num = int(page_num)
    except Exception as ex:
        page_num = 1

    return_users = []

    # Get all users filtered by given name
    if search_name != "":
        users_db = User.query.filter(User.name.contains(literal(search_name))).paginate(page_num, per_page, False).items
        users_count = User.query.filter(User.name.contains(literal(search_name))).count()
    else:
        users_db = User.query.paginate(page_num, per_page, False).items
        users_count = User.query.count()

    for user_db in users_db:
        return_users.append({"mac": user_db["mac_address"], "name": user_db["name"]})
    return_message = {
        "status": "success",
        "users": return_users,
        "count": users_count
    }
    response = jsonify(return_message)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


@app.route('/change_name', methods=['POST'])
def change_name():
    new_name = request.form.get("name")
    mac = request.form.get("mac")
    if mac and new_name and new_name != "":
        mac_db = User.query.filter_by(mac_address=mac).first()
        if mac_db:
            mac_db.name = new_name
            db.session.commit()
            return_message = {
                "status": "success",
                "message": "name change done"
            }
            response = jsonify(return_message)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 200
        else:
            return_message = {
                "status": "fail",
                "message": "mac does not exist in db"
            }
            response = jsonify(return_message)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 400
    return_message = {
        "status": "fail",
        "message": "wrong payload"
    }
    response = jsonify(return_message)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 400


# Create flask app and set it up to listen on specific ip and specific port
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
