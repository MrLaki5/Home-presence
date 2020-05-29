from flask.cli import FlaskGroup
from model import db
from server import create_app
from model import User, LogUser, AppUser
import pytz
import os

cli = FlaskGroup(create_app=create_app)


@cli.command()
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command()
def seed_db():
    app_user = AppUser(password="home-presence")
    db.session.add(app_user)
    db.session.commit()


@cli.command()
def all_users():
    users = User.query.all()
    for user in users:
        print("Username: " + user["name"] + ", mac: " + user["mac_address"])


@cli.command()
def all_logs():
    logs = LogUser.query.all()
    tz = pytz.timezone(os.environ['TIMEZONE'])
    for log in logs:
        print("Time: " + str(pytz.utc.localize(log["time"], is_dst=None).astimezone(tz)))


if __name__ == '__main__':
    cli()
