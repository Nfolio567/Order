from flask import Flask, render_template, redirect, url_for, jsonify
from flask_migrate import Migrate
from flask_socketio import SocketIO, emit
from database import db, Orders
from dotenv import load_dotenv
import os
from sqlalchemy import event

load_dotenv()
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JSON_AS_ASCII"] = False

socketio = SocketIO(app)

db.init_app(app)

migrate = Migrate(app, db)

@app.route("/")
def index():
  return redirect(url_for("order_list"))

@app.route("/order-list")
def order_list():
  return render_template("order_list.html")

@app.route("/order")
def order():
  return render_template("order.html")

@app.route("/api/list")
def return_list():
  orders = {}
  for i in range(1, int(os.getenv("PLATE_NUM"))):
    order = Orders(id=i)
    order_items = order.items  # 一人の注文の品の詳細取得
    if not order.is_provided:  # 注文されてなかったらスキップ
      continue
    for j in order_items:  # 注文の詳細たちを処理
      options = [k.name for k in j.product.options]  # 配列に変換
      orders[str(i)] = {"ordererId": j.orderer_id, "item": j.product, "options": options, "quantity": j.quantity, "price": j.price}

  return jsonify({orders})

@event.listens_for(Orders, "after_update")
def new_order(_, __, target):
  all_order = []
  order_items = target.items
  for i in order_items:
    all_order.append(i)
  emit("newOrder", all_order)

if __name__ == "__main__":
  '''with app.app_context():
      db.create_all()'''

  socketio.run(app, port=6743, host='0.0.0.0', debug=True)
