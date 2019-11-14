# GRNN Web App
![Demo of the app](https://media.giphy.com/media/Uv9DKB6w7DlxAr0InR/giphy.gif)
This is an web application for modeling, training and testing General Regression Neural Networks (GRNN). It is developed with Flask and React. It helps you tweak model parameters to achieve better error scores.

## Installation
It is optional yet advised to run the app inside a virtual environment. venv can be used as follows. Make sure you are in the project directory!

1. First create an environment named "venv" inside the project directory:

```bash
python3 -m venv venv
```
2. Activate the new environment:
```bash
. /venv/bin/activate
```
3. In the environment, install the dependencies using pip:
```bash
pip install -e .
```

## Start with Local Server
1. Register your app to your terminal via following commands:

```bash
export FLASK_APP=main.py # Entry point of the app
export FLASK_ENV=development # or production
```
2. Finally, run the app:
```bash
flask run
```
The app should be live on [http://127.0.0.1:5000/](http://127.0.0.1:5000/).

## Usage
There are two example csv datasets in example_datasets folder that you can use for testing. Just open the app and follow the flow.

Refer to help page in the app for further details about the usage.