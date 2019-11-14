from flask import Flask
from flask import render_template, request, jsonify, redirect
from flaskwebgui import FlaskUI
import pandas as pd
import numpy as np
from os import path, remove
from grnn_helper import *

# Create and config Flask app
app = Flask(__name__)
# Create UI
ui = FlaskUI(app)
# File path for uploaded datasets
file_path = "./datalast.csv"

# Returns true if a dataset already exists
def dataset_exists():
    return path.exists(file_path)

# Returns an error message if page was requested before upload
def check_prev_dataset():
    if not dataset_exists():
        return "Upload data first. <a href='/'>UPLOAD</a>"

@app.route("/")
def index():
    return render_template("index.html", dataset_exists=dataset_exists())

@app.route("/dataview")
def dataview():
    check_prev_dataset()
    return render_template("dataview.html")

@app.route("/configure")
def config():
    check_prev_dataset()
    return render_template("configure.html")

@app.route("/get/data")
def send_data():
    df = pd.read_csv(file_path)
    return jsonify(
        data_table=df.head().to_html(),
        columns=(list(df.columns)),
        shape=df.shape
    )

@app.route("/loadcsv", methods=["GET"])
def uploadcsv():
    return render_template("index.html")

@app.route("/loadcsv", methods=["POST"])
def loadcsv_view():
    f = request.files["csv_file"]
    if not f:
        return "No file"
    f.save(file_path)
    return redirect("/dataview")

@app.route("/reset")
def reset():
    check_prev_dataset()
    remove(file_path)
    return redirect("/")

@app.route("/train_model", methods=["POST"])
def train_model():
    model_args = request.get_json()
    target_column, sigma, test_size_percentage = model_args[
        "target_column"], model_args["sigma"], model_args["test_size_percentage"]
    df = pd.read_csv(file_path, sep=",")
    model_result = handle_train_test_model(
        dataframe=df,
        target_column=target_column,
        sigma=float(sigma),
        test_size=(int(test_size_percentage)/100.0)
    )
    return jsonify(model_result)

@app.route("/help")
def help():
    return render_template("help.html")
    
if __name__ == "__main__":
    ui.run()