from functools import wraps
from flask import request, jsonify
from utils.token_manager import decode_auth_token
from model import AppUser, db, function_now
import pytz
import os


def authentication(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        response = {}
        response["status"] = "fail"
        response["message"] = "Auth token not provided"
        # Get token
        authentication_header = request.headers.get('Authorization')
        print("DEBUG: token: " + authentication_header)
        if not authentication_header:
            return jsonify(response), 403
        token_pars = authentication_header.split(" ")
        if len(token_pars) != 2:
            response["message"] = "Auth token not valid"
            return jsonify(response), 403
        authentication_token = token_pars[1]
        # Get payload from token
        decoded_payload = decode_auth_token(authentication_token)
        if not decoded_payload:
            response["message"] = "Auth token not valid"
            return jsonify(response), 403
        # Check if user is valid
        user = AppUser.query.filter_by(uuid=str(decoded_payload["sub"])).first()
        if user:
            pass
        else:
            response["message"] = "Auth token not valid"
            return jsonify(response), 403
        # Check if token is expired
        tz = pytz.timezone(os.environ['TIMEZONE'])
        time_curr = pytz.utc.localize(user["auth_time"], is_dst=None).astimezone(tz)
        if time_curr == decoded_payload["iat"]:
            response["status"] = "success"
            response["message"] = "User authenticated"
            return f(jsonify(response), *args, **kwargs)
        else:
            response["message"] = "Auth token expired"
            return jsonify(response), 403

    return decorated_function
