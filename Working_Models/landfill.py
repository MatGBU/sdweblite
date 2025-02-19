import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from bisect import bisect_left
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.callbacks import ReduceLROnPlateau
from tensorflow.keras import regularizers
from tensorflow.keras.layers import LeakyReLU
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error
import datetime

now = datetime.datetime.now()

def landfill():
    #Loaing Data and Pre-Proccess
    data = pd.read_csv('/Users/dltc2020/Documents/Senior-project/AutoCombine.csv')
    data = data.fillna(0)
    data['BeginDate'] = pd.to_datetime(data['BeginDate']).dt.tz_localize(None)
    data["Sum"] = data[["Coal", "Hydro", "Natural Gas", "Nuclear", "Oil", "Other", "Landfill Gas", "Refuse", "Solar", "Wind", "Wood"]].sum(axis=1)
    data['Previous_Day'] = data['BeginDate'] - pd.Timedelta(days=1)
    data['Previous_2Day'] = data['BeginDate'] - pd.Timedelta(days=2)
    data['Previous_Year'] = data['BeginDate'] - pd.DateOffset(years=1)
    landfill_data = data[['BeginDate', 'Landfill Gas','Previous_Day','Previous_Year','Previous_2Day']].copy()
    # Large computation 
    data['Previous_Year_Landfill'] = data.apply(get_previous_year_Wind, axis=1, reference_df=landfill_data)

    cutoff_date = now - datetime.timedelta(days=14)
    usable_data = data[data['BeginDate'] > cutoff_date].copy()
    solar_data2 = usable_data[['BeginDate', 'Landfill Gas','Previous_Day','Previous_2Day','Previous_Year']].copy()
    usable_data['Previous_Day_Landfill'] = usable_data.apply(get_previous_day_Wind, axis=1, reference_df=solar_data2)
    usable_data['Previous_2Day_Landfill'] = usable_data.apply(get_two_days_before_Wind, axis=1, reference_df=solar_data2)

    usable_data['Hour_of_Day'] = usable_data['BeginDate'].dt.hour
    usable_data['Year'] = usable_data['BeginDate'].dt.year
    usable_data['Month'] = usable_data['BeginDate'].dt.month
    usable_data['Day'] = usable_data['BeginDate'].dt.day
    features = usable_data[['Month','Day','Previous_2Day_Landfill','Sum','Hour_of_Day']]


    # Useless Features , , 
    target = usable_data['Landfill Gas']

    print("Features shape: ", features.shape)
    print('Target shape: ', target.shape)

    X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

    scalar = StandardScaler()
    X_train = scalar.fit_transform(X_train)
    X_test = scalar.transform(X_test)
    model = tf.keras.models.Sequential([
    tf.keras.layers.Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1)
    ])

    model.compile(optimizer='adam', loss='mean_absolute_error')

    history = model.fit(X_train, y_train, epochs=450, validation_split=0.15, batch_size=128)

    test_loss = model.evaluate(X_test, y_test)
    print(f'Test Loss: {test_loss}')

    predictions = model.predict(X_test)
    predictions[predictions < 0] = 0
    flattened_predictions = [0 if (isinstance(pred, np.ndarray) and pred.item() < 0) else (0 if pred < 0 else pred.item() if isinstance(pred, np.ndarray) else pred) for pred in predictions]

    # Calculate Mean Absolute Error (MAE)
    mae = mean_absolute_error(y_test, predictions)

    # Calculate Mean Squared Error (MSE)
    mse = mean_squared_error(y_test, predictions)

    # Calculate Root Mean Squared Error (RMSE)
    rmse = np.sqrt(mse)
    average_y_test = np.mean(y_test)
    percent_error = mae / average_y_test
    with open('landfill_generation_errors.txt', 'a') as file:
        file.write(f'{now.strftime("%Y-%m-%d %H:%M:%S")} - Test Loss: {test_loss}\n')
        file.write(f'{now.strftime("%Y-%m-%d %H:%M:%S")} - Mean Absolute Error (MAE): {mae}\n')
        file.write(f'{now.strftime("%Y-%m-%d %H:%M:%S")} - Mean Squared Error (MSE): {mse}\n')
        file.write(f'{now.strftime("%Y-%m-%d %H:%M:%S")} - Root Mean Squared Error (RMSE): {rmse}\n')
        file.write(f'{now.strftime("%Y-%m-%d %H:%M:%S")} - Percent Error (PERR): {percent_error}\n')

    model.save('LandfillModel.h5')


def get_previous_day_Wind(row, reference_df):
    # Sort reference_df by 'BeginDate' for fast lookups
    sorted_dates = reference_df['BeginDate'].values
    solar_values = reference_df['Landfill Gas'].values

    # Perform binary search to find the index of the closest date
    target_date = row['Previous_Day']
    pos = bisect_left(sorted_dates, target_date)

    # Find the closest date and return corresponding Solar value
    if pos == 0:
        return solar_values[0]
    if pos == len(sorted_dates):
        return solar_values[-1]

    before = sorted_dates[pos - 1]
    after = sorted_dates[pos]

    # Return the Solar value corresponding to the closest date
    if abs(target_date - before) <= abs(target_date - after):
        return solar_values[pos - 1]
    else:
        return solar_values[pos]

def get_two_days_before_Wind(row, reference_df):
    # Sort reference_df by 'BeginDate' for fast lookups
    sorted_dates = reference_df['BeginDate'].values
    solar_values = reference_df['Landfill Gas'].values

    # Calculate two days before
    target_date = row['BeginDate'] - pd.Timedelta(days=2)

    # Perform binary search to find the index of the closest date
    pos = bisect_left(sorted_dates, target_date)

    # Find the closest date and return corresponding Solar value
    if pos == 0:
        return solar_values[0]
    if pos == len(sorted_dates):
        return solar_values[-1]

    before = sorted_dates[pos - 1]
    after = sorted_dates[pos]

    # Return the Solar value corresponding to the closest date
    if abs(target_date - before) <= abs(target_date - after):
        return solar_values[pos - 1]
    else:
        return solar_values[pos]

def get_previous_year_Wind(row, reference_df):
    # Sort reference_df by 'BeginDate' for fast lookups
    sorted_dates = reference_df['BeginDate'].values
    solar_values = reference_df['Landfill Gas'].values

    # Perform binary search to find the index of the closest date
    target_date = row['Previous_Year']
    pos = bisect_left(sorted_dates, target_date)

    # Find the closest date and return corresponding Solar value
    if pos == 0:
        return solar_values[0]
    if pos == len(sorted_dates):
        return solar_values[-1]

    before = sorted_dates[pos - 1]
    after = sorted_dates[pos]

    # Return the Solar value corresponding to the closest date
    if abs(target_date - before) <= abs(target_date - after):
        return solar_values[pos - 1]
    else:
        return solar_values[pos]

landfill()