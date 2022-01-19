import os
import requests
import sqlite3
from sqlite3 import Error

from flask import Flask, redirect, render_template, request

app = Flask('app')

sandbox_data = False
timeframe = '3m'


# Connect to db
def create_connection(file):
    connection = None
    try:
        connection = sqlite3.connect(file)
    except:
        print(Error)
        print("Well, that sucks.")
    return connection

# Call API to check for stock data
def lookup(symbol, timeframe, sandbox):
    # Due to API credit limits, default to sandbox data if there are not enough credits to make a successful API call to real data
    if sandbox == False:
        # Real URL
        url = f"https://cloud.iexapis.com/stable/stock/{symbol}/chart/{timeframe}?token={os.environ['API_KEY']}"
    else:
        # Sandbox URL
        url = f"https://sandbox.iexapis.com/stable/stock/{symbol}/chart/{timeframe}?token={os.environ['SANDBOX_KEY']}"

    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException:
        if sandbox == False:
          global sandbox_data
          sandbox_data = True
          return lookup(symbol, timeframe, True)
        else:
            return None

    # Return data for each date available
    try:
        quote = response.json()
        stock_data = []
        for day in quote:
            stock_data.append({
                "date": day["date"],
                "price": float(day["close"])
            })
        return stock_data
    except (KeyError, TypeError, ValueError):
        return None

@app.route('/', methods=['GET', 'POST'])
def index():
    connection = create_connection('stocks.db')
    db = connection.cursor()

    if request.method == 'POST':
        symbol = request.form.get('symbol')
        global timeframe
        timeframe = request.form.get('timeframe')
        # If there is a symbol submitted, look it up
        if len(symbol):
            # Handle invalid symbols
            if lookup(symbol, timeframe, True) is None:
                return render_template('error.html', message="Stock not found.")
            # Add symbol to db if it is valid
            db.execute("INSERT INTO stocks (symbol) VALUES(?)", [symbol.upper()])
            connection.commit()
        # Re-render the page
        return redirect('/')

    # Get the stocks that are currently in the db and pass their data into a js variable in index.html for graphing using d3.js
    db.execute("SELECT DISTINCT symbol FROM stocks;")
    stocks = db.fetchall()
    data = {}
    for stock in stocks:
        symbol = stock[0]
        data[symbol] = lookup(symbol, timeframe, False)
    if sandbox_data:
        message = "Due to API limits, the graph data is random."
    else:
        message = ""
    return render_template('index.html', data=data, message=message)

@app.route('/remove', methods=['POST'])
def remove():
  connection = create_connection('stocks.db')
  db = connection.cursor()

  # Remove the submitted symbol from the db and re-render
  symbol = request.form.get('symbol')
  db.execute("DELETE FROM stocks WHERE symbol=?", [symbol.upper()])
  connection.commit()
  return redirect('/')

app.run(host='0.0.0.0', port=8080)
