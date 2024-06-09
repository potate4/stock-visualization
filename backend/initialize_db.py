import sqlite3
import csv

# Establish connection to the SQLite database
conn = sqlite3.connect('database.db')
c = conn.cursor()

# Create the stocks table
c.execute('''
    CREATE TABLE IF NOT EXISTS stocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        trade_code TEXT,
        high REAL,
        low REAL,
        open REAL,
        close REAL,
        volume INTEGER
    )
''')

# Open the CSV file and handle the BOM
with open('data.csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    # Print the headers to confirm the issue is resolved
   # print("CSV Headers:", reader.fieldnames)
    stocks = []
    for row in reader:
        try:
            # Convert the values to appropriate data types
            date = row['date']
            trade_code = row['trade_code']
            high = float(row['high'].replace(',', ''))  # Remove commas before conversion
            low = float(row['low'].replace(',', ''))  # Remove commas before conversion
            open_val = float(row['open'].replace(',', ''))  # Remove commas before conversion
            close = float(row['close'].replace(',', ''))  # Remove commas before conversion
            volume = int(row['volume'].replace(',', ''))  # Remove commas before conversion
            stocks.append((date, trade_code, high, low, open_val, close, volume))
        except ValueError as e:
            print(f"Error converting row: {row}, Error: {e}")

# Insert data into the stocks table
c.executemany('''
    INSERT INTO stocks (date, trade_code, high, low, open, close, volume)
    VALUES (?, ?, ?, ?, ?, ?, ?)
''', stocks)

# Commit changes and close the connection
conn.commit()
conn.close()
