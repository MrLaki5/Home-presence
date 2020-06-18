from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import DateTime
import pytz
from datetime import datetime
import uuid
import os

db = SQLAlchemy()
tz = pytz.timezone(os.environ['TIMEZONE'])


def function_now():
    return datetime.now(tz)


class AppUser(db.Model):

    __tablename__ = 'app_user'
    uuid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    password = db.Column(db.String(127), default="", nullable=False)
    auth_time = db.Column(DateTime, default=function_now)

    def __init__(self, password, auth_time=function_now()):
        self.password = password
        self.auth_time = auth_time

    def update(self, data):
        data.pop('uuid')
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()

    def __getitem__(self, key):
        return getattr(self, key)

    def __setitem__(self, key, value):
        return setattr(self, key, value)

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class User(db.Model):

    __tablename__ = 'user'

    uuid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mac_address = db.Column(db.String(127), default="", nullable=False)
    name = db.Column(db.String(127), default="", nullable=True)

    def __init__(self, mac_address, name=""):
        self.mac_address = mac_address
        self.name = name

    def update(self, data):
        data.pop('uuid')
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()

    def __getitem__(self, key):
        return getattr(self, key)

    def __setitem__(self, key, value):
        return setattr(self, key, value)

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class LogUser(db.Model):

    __tablename__ = 'log_user'

    uuid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    time = db.Column(DateTime, default=function_now)
    user_uuid = db.Column(UUID(as_uuid=True), db.ForeignKey('user.uuid'))

    def __init__(self, user_uuid, time):
        self.user_uuid = user_uuid
        self.time = time

    def update(self, data):
        data.pop('uuid')
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()

    def __getitem__(self, key):
        return getattr(self, key)

    def __setitem__(self, key, value):
        return setattr(self, key, value)

    def delete(self):
        db.session.delete(self)
        db.session.commit()
