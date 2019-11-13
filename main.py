from flask import Flask
from flask import render_template, request, jsonify, redirect
from flaskwebgui import FlaskUI
import pandas as pd
import numpy as np
from os import path, remove
from grnn_helper import *

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

@app.route("/train_model", methods=["POST"])
def train_model():
    model_args = request.get_json()
    target_column, sigma, test_size_percentage = model_args["target_column"], model_args["sigma"], model_args["test_size_percentage"]
    df = pd.read_csv(file_path, sep=",")
    model_result = handle_train_model(
        dataframe=df,
        target_column=target_column,
        sigma=float(sigma),
        test_size=(int(test_size_percentage)/100.0)
    )
    print("model result: ", model_result)
    return jsonify(model_result)

def handle_train_model(dataframe, target_column, sigma, test_size):
    df = dataframe
    # Check if there are empty cells
    if df.isnull().sum().any(): return "There are NaN variables!"
    target, features = feature_target_split_data(df, target_column)
    #return(f"target: {target.shape} ** features: {features.shape}")
    try:
        x_train, x_test, y_train, y_test = train_test_split_data(
            features,
            target.reshape(-1,1),
            test_size=test_size,
            #scale=False
        )
    except ValueError as e:
        print("caught error")
        return {"train_error":"ValueError"}
        print("returned")

    nw = create_grnn(sigma=sigma)
    nw.train(x_train, y_train)
    y_predicted = nw.predict(x_test)
    mse, r2 = get_errors(y_predicted, y_test)
    fig_encoded = plot_scatter_comparison(
        data_2=y_predicted,
        label_2="Prediction",
        data_1=y_test,
        label_1="Actual",
        return_html=True,
        dpi=120,
        size=50
    )
    return {'mse': mse, 'r2': r2, 'fig_encoded': fig_encoded}

if __name__ == "__main__":
    ui.run()