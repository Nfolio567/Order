from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class Orders(db.Model):
  __tablename__ = "orders"
  id = db.Column(db.Integer, primary_key=True, unique=True)
  is_provided = db.Column(db.Boolean)
  items = db.relationship("OrderItems")

product_options = db.Table (
  "product_options",
  db.Column("id", db.Integer, primary_key=True),
  db.Column("product_id", db.Integer, db.ForeignKey("products.id")),
  db.Column("option_id", db.Integer, db.ForeignKey("options.id"))
)

class Products(db.Model):
  __tablename__ = "products"
  id = db.Column(db.Integer, primary_key=True, unique=True)
  name = db.Column(db.Text)
  price = db.Column(db.Numeric(10, 0))
  options = db.relationship("Options", secondary=product_options, back_populates="products")

class Options(db.Model):
  __tablename__ = "options"
  id = db.Column(db.Integer, primary_key=True, unique=True)
  name = db.Column(db.Text)
  price = db.Column(db.Numeric(10, 0))
  products = db.relationship("Products", secondary=product_options, back_populates="options")

class OrderItems(db.Model):
  __tablename__ = "order_items"
  id = db.Column(db.Integer, primary_key=True, unique=True)
  orderer_id = db.Column(db.Integer, db.ForeignKey("orders.id"))
  product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
  product = db.relationship("Products")
  quantity = db.Column(db.Integer)
  price = db.Column(db.Numeric(10, 0))

class Admin(db.Model, UserMixin):
  __tablename__ = "admin"
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.Text)
  password = db.Column(db.Text, unique=True)
