import requests
import csv
import pandas as pd
from datetime import datetime, timedelta
import requests
import xml.etree.ElementTree as ET
import csv
from datetime import datetime, timedelta
import os
from dateutil.tz import tzlocal

fuel_categories = [
    'Coal', 'Hydro', 'Natural Gas', 'Nuclear', 'Oil', 'Other', 
    'Landfill Gas', 'Refuse', 'Solar', 'Wind', 'Wood'
    ]

url_template = "https://webservices.iso-ne.com/api/v1.1/genfuelmix/day/{}"
username = 'alean@bu.edu'
password = 'Mq75eg8pxTBCEKY'
    
def pullAllData(weatherCSVFilename, fuelCSVFilename):
    # weather data
    pullWeatherData(csv_filename=weatherCSVFilename)

    # fuel data
    pullFuelData(output_filename=fuelCSVFilename)

    # combine data into one file



    

def pullWeatherData(csv_filename):
    today = datetime.today().date()

    # Get the latest date from the existing CSV file
    latest_date = get_latest_date_from_csv(csv_filename)

    if latest_date is None:
        # If no existing data, start from a default date (e.g., one year ago)
        start_date = today - timedelta(days=365)
    else:
        # Start fetching data from the day after the latest date in the CSV
        start_date = latest_date + timedelta(days=1)

    # Fetch and append weather data from the latest date to today
    if start_date <= today:
        fetch_weather_data(start_date, today, csv_filename)
    else:
        print("No new data to fetch, the CSV is already up to date.")

def get_latest_date_from_csv(file_path):
 df = pd.read_csv(file_path)  
 print(df.columns)  # Debugging step
 if 'datetime' in df.columns:
    df['datetime'] = pd.to_datetime(df['datetime'], format='%Y-%m-%dT%H:%M:%S', errors='coerce')
    latest_date = df['datetime'].max().date()
    print(latest_date)
 else:
    print("Column 'datetime' not found. Available columns:", df.columns)
 return None

def fetch_weather_data(start_date, end_date, output_file):
    # Format the dates for the API request (YYYY-MM-DD)
    start_date_str = start_date.strftime('%Y-%m-%d')
    end_date_str = end_date.strftime('%Y-%m-%d')

    # Weather API URL with dynamic dates
    url = f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Boston%2CUnited%20States/{start_date_str}/{end_date_str}?unitGroup=us&elements=datetime%2Ctemp%2Cdew%2Chumidity%2Cprecip%2Cpreciptype%2Csnow%2Csnowdepth%2Cwindgust%2Cwindspeed%2Cwinddir%2Cpressure%2Ccloudcover%2Csolarradiation%2Csolarenergy%2Cuvindex%2Csevererisk&include=hours&key=SRGBWC4W94EFX6RMJXBC4L6EN&contentType=csv"
    
    response = requests.get(url)

    if response.status_code != 200:
        print('Unexpected Status code:', response.status_code)
        return

    # Append the new data to the existing CSV file
    with open(output_file, mode='a', newline='') as file:  # Open in append mode
        writer = csv.writer(file)
        csv_reader = csv.reader(response.text.splitlines(), delimiter=',', quotechar='"')

        # Skip the first row (header)
        next(csv_reader)

        # Write the remaining rows to the file
        for row in csv_reader:
            writer.writerow(row)

    print(f"Weather data from {start_date_str} to {end_date_str} has been appended to '{output_file}'")


def pullFuelData(output_filename):
    last_updated_date = get_last_updated_date(output_filename)
    
    if last_updated_date:
        # Set the start date as midnight of the day before the last timestamp
        start_date = fill_previous_date(last_updated_date.strftime('%Y-%m-%d %H:%M:%S%z'))
    else:
        start_date = '20241001'  # Default start date if no previous data

    # Use today's date in the required format
    end_date = datetime.now(tz=tzlocal()).strftime('%Y%m%d')
    
    aggregated_data = []
    
    current_date = datetime.strptime(start_date, '%Y%m%d')
    end_date = datetime.strptime(end_date, '%Y%m%d')
    delta = timedelta(days=1)
    
    while current_date <= end_date:
        date_str = current_date.strftime('%Y%m%d')
        xml_data = get_fuelmix_data_for_date(date_str)
        
        if xml_data:
            daily_data = parse_fuelmix_data(xml_data)
            aggregated_data.extend(daily_data)
        
        current_date += delta
    
    write_to_csv(aggregated_data, output_filename, append=True)
    print(f"Data aggregation complete. Output written to {output_filename}")


def fill_previous_date(last_timestamp):
    """
    This is to get data from last time stamp until midnight of that day
    """
    last_datetime = datetime.strptime(last_timestamp, "%Y-%m-%d %H:%M:%S%z")
    
    # Set the start date to midnight of the previous day
    previous_midnight = (last_datetime - timedelta(days=1)).replace(hour=0, minute=0, second=0)

    # Format the date string for the API request
    start_date = previous_midnight.strftime("%Y%m%d")
    
    return start_date

def get_last_updated_date(filename):
    if not os.path.exists(filename):
        return None  # If file doesn't exist, return None

    with open(filename, mode='r') as file:
        reader = csv.reader(file)
        next(reader)  # Skip the header
        rows = list(reader)
        if rows:
            # Get the last row's date (assuming sorted or appending)
            last_row = rows[-1]
            print(f"Last row in the CSV: {last_row}")  # Debugging output

            # Ensure the row has the expected 'BeginDate' column at index 0
            if len(last_row) > 0 and last_row[0].strip():
                last_date = last_row[0].strip()  # The 'BeginDate' column
                try:
                    # Parse the date-time format with milliseconds and timezone offset
                    return datetime.strptime(last_date, '%Y-%m-%d %H:%M:%S%z')
                except ValueError as e:
                    print(f"Error parsing date: {e}")
                    return None
            else:
                print("The last row does not contain a valid BeginDate.")
                return None
        else:
            print("The CSV file is empty or has no valid rows.")
            return None


# Function to check if a timestamp exists in the CSV
def timestamp_exists(filename, timestamp):
    with open(filename, mode='r') as file:
        reader = csv.reader(file)
        next(reader)  # Skip header
        for row in reader:
            if len(row) > 0 and row[0] == timestamp:
                return True
    return False

# Function to get data from the API for a specific date
def get_fuelmix_data_for_date(date):
    url = url_template.format(date)
    response = requests.get(url, auth=(username, password))
    
    if response.status_code == 200:
        return response.content
    else:
        print(f"Failed to retrieve data for {date}: {response.status_code}")
        return None

# Function to parse the XML response and organize data by timestamp
def parse_fuelmix_data(xml_data):
    root = ET.fromstring(xml_data)
    namespace = {'ns': 'http://WEBSERV.iso-ne.com'}
    
    # List to hold each row's data (one row per timestamp)
    data_rows = []
    
    # Dictionary to keep track of generation values by fuel type for each timestamp
    timestamp_data = {}
    
    for gen_fuel_mix in root.findall('ns:GenFuelMix', namespace):
        begin_date = gen_fuel_mix.find('ns:BeginDate', namespace).text  # Full timestamp (date and time)
        begin_date = begin_date.replace('T', ' ') #???
        # Convert timestamp format from 'YYYY-MM-DDTHH:MM:SS.SSS±HH:MM' to 'YYYY-MM-DD HH:MM:SS±HH:MM'
        parsed_date = datetime.strptime(begin_date, '%Y-%m-%d %H:%M:%S.%f%z')
        formatted_date = parsed_date.strftime('%Y-%m-%d %H:%M:%S%z')  # New format with space
        formatted_date = formatted_date[:-2] + ':' + formatted_date[-2:]
        
        gen_mw = float(gen_fuel_mix.find('ns:GenMw', namespace).text)
        fuel_category = gen_fuel_mix.find('ns:FuelCategory', namespace).text
        
        # Initialize the dictionary for each timestamp
        if formatted_date not in timestamp_data:
            timestamp_data[formatted_date] = {category: 0.0 for category in fuel_categories}
        
        # Only track known fuel categories and accumulate power for this timestamp
        if fuel_category in timestamp_data[formatted_date]:
            timestamp_data[formatted_date][fuel_category] += gen_mw
    
    # Convert the dictionary to a list of rows for CSV writing
    for timestamp, fuel_data in timestamp_data.items():
        row = [timestamp] + [fuel_data.get(category, 0.0) for category in fuel_categories]
        data_rows.append(row)
    
    return data_rows

# Function to write aggregated data to CSV, ensuring no extra blank lines
def load_existing_timestamps(filename):
    timestamps = set()
    if os.path.exists(filename):
        with open(filename, mode='r') as file:
            reader = csv.reader(file)
            next(reader)  # Skip header
            for row in reader:
                if len(row) > 0:
                    timestamps.add(row[0])
    return timestamps

# Updated write_to_csv
def write_to_csv(data, filename, append=False):
    mode = 'a' if append else 'w'
    write_header = not append or not os.path.exists(filename)
    
    # Pre-load all existing timestamps
    existing_timestamps = load_existing_timestamps(filename)
    
    with open(filename, mode=mode, newline='') as file:
        writer = csv.writer(file)
        
        # Only write the header if it's a new file or the first write
        if write_header:
            header = ['BeginDate'] + fuel_categories
            writer.writerow(header)
        
        # Write the data rows in the required format, avoiding duplicate timestamps
        for row in data:
            if row[0] not in existing_timestamps:  # Avoid double writes
                writer.writerow(row)

