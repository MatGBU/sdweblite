import pandas as pd

def combineData(weather, fuel, outFile):

    df1 = pd.read_csv(weather, parse_dates=['datetime'])
    df2 = pd.read_csv(fuel, parse_dates=['BeginDate'])

    df2 = df2.rename(columns={'BeginDate': 'datetime'})

    combined_df = pd.merge(df1, df2, on='datetime', how='outer')

    combined_df = combined_df.sort_values(by='datetime').reset_index(drop=True)
    
    combined_df.to_csv(outFile, index=False)
    print(f'saved combined data into {outFile}')


if __name__ == "__main__":
    WEATHER = "/Users/ben/Desktop/Senior-project/Ml/getData/Year_weather.csv"
    FUEL = "/Users/ben/Desktop/Senior-project/Ml/getData/genfuelmix_aggregatedyear.csv"
    outputFile = "/Users/ben/Desktop/Senior-project/Ml/getData/fuelWeatherCombo.csv"
    # WEATHER = "INSERT AVI'S PATH"
    # FUEL = "INSERT AVI'S PATH"

    combineData(weather=WEATHER, fuel=FUEL, outFile=outputFile)

    


