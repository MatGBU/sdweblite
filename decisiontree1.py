import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt
import numpy as np

# Load the data
data = pd.read_csv('/mnt/data/Final_Merged_Energy_and_Weather_Data.csv')

# Create lagged features for past solar output (lag 1 and lag 2)
data['solar_output_lag1'] = data['Solar'].shift(1)
data['solar_output_lag2'] = data['Solar'].shift(2)

# Drop any rows with missing values due to lagging
data.dropna(inplace=True)

# Define features and target
features = ['temp', 'cloudcover', 'solarradiation', 'solar_output_lag1', 'solar_output_lag2']
X = data[features]
y = data['Solar']

# Split the data into training and testing sets (80/20 split)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

# Initialize and train the Decision Tree Regressor
model = DecisionTreeRegressor(max_depth=5, random_state=42)
model.fit(X_train, y_train)

# Make predictions on the test set
y_pred = model.predict(X_test)

# Calculate RMSE to evaluate performance
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f'RMSE: {rmse}')

# Plot actual vs predicted solar output
plt.figure(figsize=(10, 6))
plt.plot(y_test.index, y_test, label='Actual Solar Output')
plt.plot(y_test.index, y_pred, label='Predicted Solar Output', color='red')
plt.legend()
plt.title('Decision Tree: Actual vs Predicted Solar Output')
plt.show()

