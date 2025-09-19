from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Orders(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    is_provided = db.Column(db.Boolean)
    items = db.relationship("OrderItems")

class Products(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.Text)
    options = db.relationship("Options")

class Options(db.Model):
    __tablename__ = "options"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.Text)
    products_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    products = db.relationship("Products", back_populates="options")

class OrderItems(db.Model):
    __tablename__ = "order_items"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    orderer_id = db.Column(db.Integer, db.ForeignKey("orders.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    option_id = db.Column(db.Integer, db.ForeignKey("options.id"))
    quantity = db.Column(db.Integer)
    price = db.Column(db.Numeric(10, 0))
    order = db.relationship("Orders", back_populates="items")
