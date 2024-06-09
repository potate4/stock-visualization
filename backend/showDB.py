import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# Execute a SQL query to fetch data from a table
cursor.execute('SELECT * FROM stocks')
rows = cursor.fetchall()

# Display the fetched data
for row in rows:
    print(row)

# Close the connection
conn.close()
