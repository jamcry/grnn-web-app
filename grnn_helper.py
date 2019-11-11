import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn import preprocessing, metrics
from sklearn.model_selection import train_test_split
from neupy import algorithms

# Splits the dataset into target(output) and features(input) subsets
def feature_target_split_data(dataframe, target_column, axis=1):
    target_data = np.array(dataframe[target_column])
    feature_data = np.array(dataframe.drop(target_column, axis=axis))
    return target_data, feature_data

# Splits dataset into training and test samples
def train_test_split_data(features, target, test_size=30, random_state=42, scale=True):
    if(scale==True):
        # Normalizes the values with min-max scaling (between 0 and 1)
        features = preprocessing.minmax_scale(features), 
        target = preprocessing.minmax_scale(target)
        
    X_train, X_test, y_train, y_test = train_test_split(
        features, target.reshape(-1, 1), test_size=test_size, random_state=random_state
    )
    return X_train, X_test, y_train, y_test

# Create and returns a new GRNN instance with specified sigma value
def create_grnn(sigma=0.1, verbose=False):
    grnn = algorithms.GRNN(std=sigma, verbose=verbose)
    return grnn

# Calculates and prints MSE and R2 values
def get_errors(predicted, actual):
    mse = np.sum((predicted - actual) **2) # Mean Squared Error (lower is better)
    r2 = metrics.r2_score(actual, predicted) # R-squared Score (1 is the best)
    print("mse: ", mse, " (The smaller the better)")
    print("r2 : ", r2, " (Best is 1)")

# Shows scatter plot with data_1 and data_2 values
def plot_scatter_comparison(data_1, label_1, data_2, label_2, figsize=(15,10), dpi=80, size=150):
    get_range = lambda dataset : np.array([i for i in range(len(dataset))]).reshape(-1, 1)
    range_1, range_2 = get_range(data_1), get_range(data_2)
    figure(num=None, figsize=figsize, dpi=dpi)
    plt.scatter(data_1, range_1, c='b', label=label_1, s=size)
    plt.scatter(data_2, range_2, c='r', label=label_2, s=size)
    plt.legend()
    plt.grid(True)