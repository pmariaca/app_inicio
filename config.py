from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

basedir = os.path.abspath(os.path.dirname(__file__))

db = SQLAlchemy()
app = Flask(__name__)

app.secret_key = 'monosecreto'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance/catalog.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#app.static_folder = os.path.join(basedir, 'static')
#app.dist_folder = os.path.join(basedir, 'dist')
db = SQLAlchemy(app)

## pip install "flask-marshmallow[sqlalchemy]"
