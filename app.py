from flask import Flask, render_template, redirect, url_for
from flask_migrate import Migrate
from sqlalchemy import false

from database import db
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

migrate = Migrate(app, db)

@app.route("/")
def index():
    return redirect(url_for("order_list"))

@app.route("/order-list")
def order_list():
    return render_template("order_list.html")

@app.route("/order")
def oeder():
    return render_template("order.html")

if __name__ == "__main__":
    '''with app.app_context():
        db.create_all()'''

    app.run(port=6743, host='0.0.0.0', debug=True)
