from flask.cli import FlaskGroup
from model import db
from server import create_app
from model import User, LogUser, AppUser, UpdateTime, function_now
import utils.password_manager as password_manager
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
    # Create default login user
    password = password_manager.hash_password(os.environ['PASSWORD'])
    app_user = AppUser(password=password)

    # Create update times
    update_time = UpdateTime(last_update=function_now())

    # Add entities to session
    db.session.add(app_user)
    db.session.add(update_time)
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
