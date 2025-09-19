from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

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
    app.run(port=6743, host='0.0.0.0', debug=True)
