from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/create", methods=["POST", "GET"])
def create_pj():
    return render_template("create-pj.html")

@app.route("/view", methods=["GET"])
def view_pj():
    return render_template("view-pj.html")

@app.route("/fund", methods=["POST", "GET"])
def fund_pj():
    return render_template("fund-pj.html")

if __name__ == "__main__":
    app.run(debug=True)
