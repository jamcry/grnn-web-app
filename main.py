from flask import Flask
from flask import render_template, request, jsonify, redirect
from flaskwebgui import FlaskUI
import pandas as pd
import numpy as np
from os import path, remove

# Create and config Flask app
app = Flask(__name__)
app.debug=True
app.config.update(
    TEMPLATES_AUTO_RELOAD=True,
    ENV="development"
)
# Create UI
ui = FlaskUI(app, port="5505")

file_path = "./datalast.csv"

def file_exists():
    return path.exists(file_path)

@app.route("/")
def hello():
    return render_template("index.html", file_exists=file_exists())

@app.route("/dataview")
def dataview():
    if not file_exists():
        return "Upload data first. <a href='/'>UPLOAD</a>"
    return render_template("dataview.html")
    
@app.route("/configure")
def config():
    if not file_exists():
        return "Upload data first. <a href='/'>UPLOAD</a>"
    return render_template("configure.html")

@app.route("/get/data")
def senddata():
    df = pd.read_csv(file_path)
    return jsonify(data_table=df.head().to_html(),columns=(list(df.columns)),shape=df.shape)

@app.route("/get/data/columns")
def send_columns():
    df = pd.read_csv(file_path)
    return jsonify(columns=(list(df.columns)))

# /uploadcsv GET
@app.route("/loadcsv", methods=["GET"])
def uploadcsv():
    return render_template("index.html")

# /uploadcsv POST : handle upload
@app.route("/loadcsv", methods=["POST"])
def loadcsv_view():
    f = request.files["csv_file"]
    if not f:
        return "No file"
    f.save(file_path)
    return redirect("/dataview")

@app.route("/reset")
def reset():
    if not file_exists():
        return "No file uploaded. Nothing to remove."
    remove(file_path)
    return redirect("/")

if __name__ == "__main__":
    ui.run()