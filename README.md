# GRNN Web App

This is an web application for modeling and training General Regression Neural Networks (GRNN). It is developed with Flask and React.

## Installation
It is advised to run the app inside a virtual environment. venv can be used as follows. Make sure you are in the project directory!

1. First create an environment named "venv" inside the project directory:

```bash
$python3 -m venv venv
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
The app should be live on [http://127.0.01:5000/](http://127.0.01:5000/).