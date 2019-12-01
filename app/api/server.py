from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
import yaml
import model
import json

app = Flask(__name__)
dbYaml = yaml.load(open('db.yaml'))
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://' + dbYaml['user'] + ':' + dbYaml['password'] + '@' + dbYaml['host'] + ":" + dbYaml['port'] + "/" + dbYaml['db']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

model.db.init_app(app)

# Ping method
@app.route('/ping', methods = ['GET'])
def ping():
    response = {}
    response["status"] = "success"
    response["message"] = "pong"
    return json.dumps(response), 200


# Create flask app and set it up to listen on specific ip and specific port
if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 8080)
