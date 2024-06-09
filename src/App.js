import React, { useState, useEffect } from 'react';
import './App.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const App = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Close Price',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }]
    });
    const limit = 10;

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    useEffect(() => {
        if (data.length > 0) {
            updateChartData();
        }
    }, [data]);

    const fetchData = () => {
        fetch(`http://localhost:5000/data?page=${currentPage}&limit=${limit}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then(data => {
                setData(data);
            })
            .catch(error => console.error("Error fetching data:", error));
    };

    const updateRow = (id, newData) => {
        fetch(`http://localhost:5000/data/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        })
        .then(response => response.json())
        .then(() => {
            fetchData();
        })
        .catch(error => {
            console.error('Error updating data:', error);
        });
    };

    const handleInputChange = (e, id, field) => {
        const newData = [...data];
        const index = newData.findIndex(row => row.id === id);
        newData[index][field] = e.target.value;
        setData(newData);
    };

    const goToNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const goToPrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const updateChartData = () => {
        const labels = data.map(row => row.date);
        const closePrices = data.map(row => row.close);

        setChartData({
            labels: labels,
            datasets: [{
                label: 'Close Price',
                data: closePrices,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }]
        });
    };

    return (
        <div className="App">
            <div className="chart">
                {chartData.labels.length > 0 && (
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false
                        }}
                        height={400} // Adjust height as needed
                        width={800} // Adjust width as needed
                    />
                )}
            </div>
            <div className="table-container">
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(row => (
                            <tr key={row.id}>
                                <td><input type="text" value={row.date} onChange={e => handleInputChange(e, row.id, 'date')} /></td>
                                <td><input type="text" value={row.trade_code} onChange={e => handleInputChange(e, row.id, 'trade_code')} /></td>
                                <td><input type="text" value={row.high} onChange={e => handleInputChange(e, row.id, 'high')} /></td>
                                <td><input type="text" value={row.low} onChange={e => handleInputChange(e, row.id, 'low')} /></td>
                                <td><input type="text" value={row.open} onChange={e => handleInputChange(e, row.id, 'open')} /></td>
                                <td><input type="text" value={row.close} onChange={e => handleInputChange(e, row.id, 'close')} /></td>
                                <td><input type="text" value={row.volume} onChange={e => handleInputChange(e, row.id, 'volume')} /></td>
                                <td>
                                    <button onClick={() => updateRow(row.id, row)}>Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <button onClick={goToPrevPage} disabled={currentPage === 1}>Previous</button>
                <button onClick={goToNextPage}>Next</button>
            </div>
        </div>
    );
}

export default App;
