import jwt
import os


def encode_auth_token(self, user_uuid, time_stamp):
    try:
        payload = {
            'iat': time_stamp,
            'sub': user_uuid
        }
        return jwt.encode(
            payload,
            os.environ['SECRET_KEY'],
            algorithm='HS256'
        )
    except Exception as e:
        return e


def decode_auth_token(auth_token):
    try:
        payload = jwt.decode(auth_token, os.environ['SECRET_KEY'])
        if ("iat" not in payload) or ("sub" not in payload):
            return None
        return payload
    except Exception as ex:
        return None
