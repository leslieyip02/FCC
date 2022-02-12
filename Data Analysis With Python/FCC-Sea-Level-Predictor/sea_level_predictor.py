import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress


def draw_plot():
    # Read data from file
    df = pd.read_csv('epa-sea-level.csv')
    # print(df)

    # Create scatter plot
    plt.figure(figsize=(12, 4))
    plt.scatter(df['Year'], df['CSIRO Adjusted Sea Level'])
    
    # Create first line of best fit
    line = linregress(df['Year'], df['CSIRO Adjusted Sea Level'])
    x = [i for i in range(1880, 2051)]
    y = [line.intercept + line.slope * i for i in x]
    plt.plot(x, y, color='blue')

    # Create second line of best fit
    line = linregress(df['Year'][df['Year'] >= 2000], df['CSIRO Adjusted Sea Level'][df['Year'] >= 2000])
    
    x = [i for i in range(2000, 2051)]
    y = [line.intercept + line.slope * i for i in x]
    plt.plot(x, y, color='red')

    # Add labels and title
    plt.title('Rise in Sea Level')
    plt.xlabel('Year')
    plt.ylabel('Sea Level (inches)')

    # plt.show()

    # Save plot and return data for testing (DO NOT MODIFY)
    plt.savefig('sea_level_plot.png')
    return plt.gca()