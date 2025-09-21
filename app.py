import bcrypt
from flask import Flask, render_template, redirect, url_for, jsonify, request, flash, Response
from flask_migrate import Migrate
from flask_socketio import SocketIO, emit
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager, login_required, logout_user, login_user
from database import db, Orders, Admin
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

csrf = CSRFProtect()
csrf.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "index"

@app.route("/")
def index():
  return redirect(url_for("order_list"))

@app.route("/order-list", methods=["GET", "POST"])
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

  return jsonify([orders])

@app.route("/dashboard", methods=["GET", "POST"])
@login_required
def admin():
  return render_template("dashboard.html")

@app.route("/login", methods=["GET", "POST"])
def login():
  if request.method =="POST":
    data = request.get_json()
    name = data.get("name")
    password = data.get("password")
    user = Admin.query.filter_by(name=name).first()
    print(user)
    if not user is None and bcrypt.checkpw(password.encode(), user.password.encode()):
      print("login")
      login_user(user)
      flash("ログイン成功", "success")
      return jsonify({"redirect": url_for("admin")})

    flash("ログインできませんでした", "error")
    return jsonify({"error": "cant login"}), 200
  else:
    return Response(status=404)


@login_manager.user_loader
def load_uer(user_id):
  return Admin.query.get(str(user_id))


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
