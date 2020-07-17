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
    global tz
    return datetime.now(tz)


class AppUser(db.Model):

    __tablename__ = 'app_user'

    uuid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    password = db.Column(db.String(127), default="", nullable=False)
    auth_time = db.Column(DateTime, default=function_now)
    email_smtp_server = db.Column(db.String(127), default="", nullable=False)
    email_port = db.Column(db.Integer, default=587, nullable=False)
    email_sender = db.Column(db.String(127), default="", nullable=False)
    email_sender_password = db.Column(db.String(127), default="", nullable=False)
    email_receiver = db.Column(db.String(127), default="", nullable=False)

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


class UpdateTime(db.Model):

    __tablename__ = 'update_time'

    uuid = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    last_update = db.Column(DateTime, default=function_now)

    def __init__(self, last_update=function_now()):
        self.last_update = last_update

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
    last_update = db.Column(DateTime, default=function_now)
    all_time_count = db.Column(db.Integer, default=0, nullable=False)
    day_time_count = db.Column(db.Integer, default=0, nullable=False)
    month_time_count = db.Column(db.Integer, default=0, nullable=False)
    year_time_count = db.Column(db.Integer, default=0, nullable=False)

    def __init__(self, mac_address,
                 name="",
                 all_time_count=0,
                 day_time_count=0,
                 month_time_count=0,
                 year_time_count=0,
                 last_update=function_now()):
        self.mac_address = mac_address
        self.name = name
        self.all_time_count = all_time_count
        self.month_time_count = month_time_count
        self.year_time_count = year_time_count
        self.day_time_count = day_time_count
        self.last_update = last_update

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
