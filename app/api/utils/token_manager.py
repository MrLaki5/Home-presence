import jwt
import os


def encode_auth_token(user_uuid, time_stamp):
    try:
        payload = {
            'time': time_stamp,
            'sub': user_uuid
        }
        return jwt.encode(
            payload,
            os.environ['SECRET_KEY'],
            algorithm='HS256'
        )
    except Exception as e:
        print("Exception: " + str(e))
        return None


def decode_auth_token(auth_token):
    try:
        jwt_options = {
            'verify_signature': True,
            'verify_exp': False,
            'verify_nbf': False,
            'verify_iat': False,
            'verify_aud': False
        }
        payload = jwt.decode(auth_token, os.environ['SECRET_KEY'], jwt_options)
        if ("time" not in payload) or ("sub" not in payload):
            return None
        return payload
    except Exception as ex:
        print("Exception: " + str(ex))
        return None
