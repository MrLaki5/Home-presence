from flask import Flask, request, current_app, jsonify
import yaml
import model
import pytz
import os
from model import LogUser, User, db, AppUser, function_now
import datetime
import logging
import utils.workers_manager as workers_manager
from utils.token_manager import encode_auth_token
from utils.email_client import send_email
from sqlalchemy import func, desc, literal
from authentication import authentication
import utils.password_manager as password_manager

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
@authentication
def ping(resp):
    app.logger.debug("Ping!")
    response = {}
    response["status"] = "success"
    response["message"] = "pong"
    return jsonify(response), 200


# Method used for login functionality
@app.route('/login', methods=['POST'])
def login():
    password = request.form.get('password')
    response = {}
    if not password or password == "":
        response["status"] = "fail"
        response["message"] = "Invalid payload"
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200
    password = password_manager.hash_password(password)
    user = AppUser.query.filter_by(password=password).first()
    if user:
        time_login = function_now()
        time_curr = time_login.strftime("%d/%m/%Y, %H:%M:%S")
        user["auth_time"] = time_login
        db.session.commit()
        auth_token = encode_auth_token(str(user["uuid"]), time_curr)
        if auth_token:
            response["status"] = "success"
            response["message"] = "Login successful"
            response["auth_token"] = auth_token.decode("utf-8")
            response = jsonify(response)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 200
        else:
            response["status"] = "fail"
            response["message"] = "Error creating auth token"
            response = jsonify(response)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 401
    else:
        response["status"] = "fail"
        response["message"] = "Wrong password"
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200


# Method used for checking if auth token is valid
@app.route('/is_authenticated', methods=['OPTIONS'])
def check_auth_token_options():
    response = jsonify({'Allow': 'GET'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response, 200


@app.route('/is_authenticated', methods=['GET'])
@authentication
def check_auth_token(resp):
    response = {}
    response["status"] = "success"
    response["message"] = "Token valid"
    response = jsonify(response)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


# Method used for starting workers
@app.route('/workers_start', methods=['OPTIONS'])
def start_workers_options():
    response = jsonify({'Allow': 'GET'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response, 200


@app.route('/workers_start', methods=['GET'])
@authentication
def start_workers(resp):
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


# Method used for stopping workers
@app.route('/workers_stop', methods=['OPTIONS'])
def stop_workers_options():
    response = jsonify({'Allow': 'GET'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response, 200


@app.route('/workers_stop', methods=['GET'])
@authentication
def stop_workers(resp):
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


# Method used for getting workers status
@app.route('/workers_status', methods=['OPTIONS'])
def status_workers_options():
    response = jsonify({'Allow': 'GET'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response, 200


@app.route('/workers_status', methods=['GET'])
@authentication
def status_workers(resp):
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


# Method used for getting and setting settings
@app.route('/settings', methods=['OPTIONS'])
def settings_manager_options():
    response = jsonify({'Allow': 'GET,POST'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', 'POST,GET')
    return response, 200


@app.route('/settings', methods=['GET', 'POST'])
@authentication
def settings_manager(resp):
    response = {}
    app_user = AppUser.query.first()
    if request.method == 'GET':
        workers_settings = workers_manager.get_settings()
        if app_user:
            workers_settings["email_smtp_server"] = app_user["email_smtp_server"]
            workers_settings["email_port"] = app_user["email_port"]
            workers_settings["email_sender"] = app_user["email_sender"]
            workers_settings["email_receiver"] = app_user["email_receiver"]
        response["status"] = "success"
        response["message"] = "Settings aquired"
        response["settings"] = workers_settings
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200
    else:
        data = request.get_json()
        if app_user:
            if "email_smtp_server" in data:
                app_user["email_smtp_server"] = data["email_smtp_server"]
            if "email_port" in data:
                app_user["email_port"] = data["email_port"]
            if "email_sender" in data:
                app_user["email_sender"] = data["email_sender"]
            if "email_receiver" in data:
                app_user["email_receiver"] = data["email_receiver"]
            if "email_sender_password" in data:
                app_user["email_sender_password"] = data["email_sender_password"]
        workers_settings = workers_manager.set_settings(data)
        response["status"] = "success"
        response["message"] = "Settings changed"
        response["settings"] = workers_settings
        response = jsonify(response)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200


# Method used for simple logs of last macs
@app.route('/mac_logs', methods=['OPTIONS'])
def get_mac_logs_options():
    response = jsonify({'Allow': 'GET'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response, 200


@app.route('/mac_logs', methods=['GET'])
@authentication
def get_mac_logs(resp):
    return_macs = []
    macs_db = LogUser.query.limit(5).all()
    tz = pytz.timezone(os.environ['TIMEZONE'])
    for mac_db in macs_db:
        curr_mac = User.query.filter_by(uuid=mac_db["user_uuid"]).first()
        if curr_mac:
            time_curr = pytz.utc.localize(mac_db["time"], is_dst=None).astimezone(tz)
            return_macs.append({"mac": curr_mac["mac_address"], "time": time_curr.strftime("%d/%m/%Y, %H:%M:%S")})
    return_message = {
        "status": "success",
        "mac_logs": return_macs
    }
    response = jsonify(return_message)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return jsonify(return_message), 200


# Method used for getting mac numbers over time
@app.route('/num_logs', methods=['OPTIONS'])
def get_mac_num_options():
    response = jsonify({'Allow': 'GET'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response, 200


@app.route('/num_logs', methods=['GET'])
@authentication
def get_mac_num(resp):
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


# Method used for getting macs in specific time
@app.route('/mac_in_time', methods=['OPTIONS'])
def get_mac_in_time_options():
    response = jsonify({'Allow': 'GET'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response, 200


@app.route('/mac_in_time', methods=['GET'])
@authentication
def get_mac_in_time(resp):
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


# Method used for getting all times for specific mac
@app.route('/time_for_mac', methods=['OPTIONS'])
def get_time_for_mac_options():
    response = jsonify({'Allow': 'POST'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    return response, 200


@app.route('/time_for_mac', methods=['POST'])
@authentication
def get_time_for_mac(resp):
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
    if not mac or mac == "":
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


# Method used for getting all users with specific pattern
@app.route('/users', methods=['OPTIONS'])
def get_users_options():
    response = jsonify({'Allow': 'GET'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response, 200


@app.route('/users', methods=['GET'])
@authentication
def get_users(resp):
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


# Method for getting users ordered by number of active hours
@app.route('/top_by_hours', methods=['OPTIONS'])
def top_by_hours_options():
    response = jsonify({'Allow': 'GET'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response, 200


@app.route('/top_by_hours', methods=['GET'])
@authentication
def top_by_hours(resp):
    # Get parameters
    time_group = request.args.get('time_group')
    time_groups = ["day", "month", "year", "all"]
    if time_group not in time_groups:
        time_group = "day"
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

    user_time_group = None
    if time_group == "day":
        user_time_group = User.day_time_count
    elif time_group == "month":
        user_time_group = User.month_time_count
    elif time_group == "year":
        user_time_group = User.year_time_count
    else:
        user_time_group = User.all_time_count

    return_users = []

    # Get all users with ranks
    users_rank = (db.session.query(func.dense_rank().over(order_by=user_time_group.desc()).label('rnk'), 
                  user_time_group.label("cnt"), 
                  User.name.label("name"), 
                  User.mac_address.label("mac_address"))
                  .filter(user_time_group > 0).subquery())
    # Add pagination
    users_db = db.session.query(users_rank.c.mac_address, 
                                users_rank.c.name, 
                                users_rank.c.cnt, 
                                users_rank.c.rnk).paginate(page_num, per_page, False).items
    # Get count of all
    count = db.session.query(users_rank.c.mac_address, 
                             users_rank.c.name, 
                             users_rank.c.cnt, 
                             users_rank.c.rnk).count()
    
    for user_db in users_db:
        return_users.append({"mac": user_db[0], "name": user_db[1], "count": user_db[2], "rank": user_db[3]})
    return_message = {
        "status": "success",
        "users": return_users,
        "all_user_count": count
    }

    response = jsonify(return_message)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


# Method used for changing specific user name
@app.route('/change_name', methods=['OPTIONS'])
def change_name_options():
    response = jsonify({'Allow': 'POST'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    return response, 200


@app.route('/change_name', methods=['POST'])
@authentication
def change_name(resp):
    new_name = request.form.get("name")
    mac = request.form.get("mac")
    if mac and new_name and new_name != "":
        mac_db = User.query.filter_by(mac_address=mac).first()
        if mac_db:
            mac_db.name = new_name
            db.session.commit()
            return_message = {
                "status": "success",
                "message": "Name change done"
            }
            response = jsonify(return_message)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 200
        else:
            return_message = {
                "status": "fail",
                "message": "Mac does not exist in db"
            }
            response = jsonify(return_message)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 400
    return_message = {
        "status": "fail",
        "message": "Wrong payload"
    }
    response = jsonify(return_message)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 400


# Method used for changing password
@app.route('/change_password', methods=['OPTIONS'])
def change_password_options():
    response = jsonify({'Allow': 'POST'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    return response, 200


@app.route('/change_password', methods=['POST'])
@authentication
def change_password(resp):
    new_password = request.form.get("new_password")
    old_password = request.form.get("old_password")
    if new_password and old_password and new_password != "":
        old_password = password_manager.hash_password(old_password)
        user_db = AppUser.query.filter_by(password=old_password).first()
        if user_db:
            new_password = password_manager.hash_password(new_password)
            user_db.password = new_password
            db.session.commit()
            return_message = {
                "status": "success",
                "message": "Password changed"
            }
            response = jsonify(return_message)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 200
        else:
            return_message = {
                "status": "fail",
                "message": "Wrong old password"
            }
            response = jsonify(return_message)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 400
    return_message = {
        "status": "fail",
        "message": "Wrong payload"
    }
    response = jsonify(return_message)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 400


# Method for testing email credentials
@app.route('/send_test_email', methods=['OPTIONS'])
def send_test_email_options():
    response = jsonify({'Allow': 'GET'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response, 200


@app.route('/send_test_email', methods=['GET'])
@authentication
def send_test_email(resp):
    status, message = send_email("Home-presence status report", "This is test email.")
    if status:
        status = "success"
    else:
        status = "fail"
    return_message = {
        "status": status,
        "message": message
    }
    response = jsonify(return_message)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


# Create flask app and set it up to listen on specific ip and specific port
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
