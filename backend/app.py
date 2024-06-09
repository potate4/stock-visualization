# app.py
from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS  # Import CORS from flask_cors module


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes in your Flask app


def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/data', methods=['GET'])
def get_data():
    conn = get_db_connection()
    data = conn.execute('SELECT * FROM stocks').fetchall()
    conn.close()
    return jsonify([dict(row) for row in data])

@app.route('/data/<int:id>', methods=['PUT'])
def update_data(id):
    conn = get_db_connection()
    data = request.json
    conn.execute('UPDATE stocks SET date = ?, trade_code = ?, high = ?, low = ?, open = ?, close = ?, volume = ? WHERE id = ?',
                 (data['date'], data['trade_code'], data['high'], data['low'], data['open'], data['close'], data['volume'], id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Record updated"})

if __name__ == '__main__':
    app.run(debug=True)
