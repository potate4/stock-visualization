// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/data.json')
            .then(response => response.json())
            .then(data => setData(data));
    }, []);

    return (
        <div className="App">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Trade Code</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Open</th>
                        <th>Close</th>
                        <th>Volume</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.date}</td>
                            <td>{row.trade_code}</td>
                            <td>{row.high}</td>
                            <td>{row.low}</td>
                            <td>{row.open}</td>
                            <td>{row.close}</td>
                            <td>{row.volume}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
