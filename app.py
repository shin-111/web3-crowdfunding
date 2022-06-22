import os
from flask import Flask, render_template, request, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
#     basedir, "database.db"
# )
app.config["SQLALCHEMY_DATABASE_URI"] = "postgres://mmmrwmdarlwkph:022dd5548597f323078a0f1b52ef4b4e53749fc1911878212a01953521822d1b@ec2-3-224-8-189.compute-1.amazonaws.com:5432/da6rvc5dkgligk"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(100), nullable=False)
    project_description = db.Column(db.String(500), nullable=False)
    project_ETH_needed = db.Column(db.Integer, nullable=False)
    project_milestones = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<Project {self.project_name}>"


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/create", methods=["POST", "GET"])
def create_pj():
    if request.method == "POST":
        name = request.form["project_name"]
        description = request.form["project_description"]
        fund_needed = int(request.form["project_fund"])
        milestones = request.form["project_milestones"]
        new_project = Project(
            project_name=name,
            project_description=description,
            project_ETH_needed=fund_needed,
            project_milestones=milestones,
        )
        db.session.add(new_project)
        db.session.commit()

    return render_template("create-pj.html")


@app.route("/view", methods=["GET"])
def view_pj():
    projects = Project.query.all()
    return render_template("view-pj.html", projects=projects)


@app.route("/project/<int:project_id>", methods=["POST", "GET"])
def single_pj(project_id):
    project = Project.query.get_or_404(project_id)
    return render_template("single-pj.html", project=project)


if __name__ == "__main__":
    app.run(debug=True)
