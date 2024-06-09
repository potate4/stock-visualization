# app.py
from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/data', methods=['GET'])
def get_data():
    page = request.args.get('page', 1, type=int) # Get page query parameter, default to 1
    limit = request.args.get('limit', 10, type=int) # Get limit query parameter, default to 10
    offset = (page - 1) * limit # Calculate offset based on page and limit

    conn = get_db_connection()
    data = conn.execute('SELECT * FROM stocks LIMIT ? OFFSET ?', (limit, offset)).fetchall()
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
