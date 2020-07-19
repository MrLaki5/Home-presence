from model import AppUser
from utils.email_client import send_email


# Function for adding first time devices into message
def first_time_devices(message, first_time_devices_list):
    message += "------------------------------ \n"
    message += "First time devices: \n"
    message += "\n"
    cnt = 1
    for device in first_time_devices_list:
        message += str(cnt) + ". mac: " + device["mac"] + ", host name: " + device["name"] + "\n"
    message += "------------------------------ \n"
    message += "\n"
    return message


# Main function for managing notifications
def notify(first_time_devices_list):
    message = ""
    should_send = False
    app_user = AppUser.query.first()
    if app_user:
        # Check and add first time devices to message
        if app_user["notification_new_devices"] and len(first_time_devices_list) > 0:
            message = first_time_devices(message, first_time_devices_list)
            should_send = True
        # If there is need (new information) send mail notification
        if should_send:
            send_email("Home-presence status report", message)
