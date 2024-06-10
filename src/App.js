import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    BarController,
    LinearScale,
    PointElement,
    BarElement,
    Tooltip,
    Legend,
    TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
    LineElement,
    CategoryScale,
    BarController,
    LinearScale,
    PointElement,
    BarElement,
    Tooltip,
    Legend,
    TimeScale
);

const App = () => {
    const API_URL = 'https://sumaiyaahmed.pythonanywhere.com';
    //const API_URL = 'localhost:5000';

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTradeCode, setSelectedTradeCode] = useState('');
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                type: 'line',
                label: 'Close Price',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                yAxisID: 'y-axis-1',
            },
            {
                type: 'bar',
                label: 'Volume',
                data: [],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                yAxisID: 'y-axis-2',
            }
        ]
    });
    const limit = 100;
    const chartRef = useRef(null);

    const fetchData = useCallback(() => {
        fetch(`${API_URL}/data?page=${currentPage}&limit=${limit}`)
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
    }, [API_URL, currentPage]);

    const updateChartData = useCallback(() => {
        const allDates = data.map(row => row.date);
        const filteredData = data.filter(row => row.trade_code === selectedTradeCode);

        const closePrices = allDates.map(date => {
            const found = filteredData.find(row => row.date === date);
            return found ? found.close : null;
        });

        const allClosePrices = data.map(row => row.close);
        const volumes = data.map(row => row.volume);

        setChartData({
            labels: allDates,
            datasets: [
                {
                    type: 'line',
                    label: 'Close Price',
                    data: closePrices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    yAxisID: 'y-axis-1',
                },
                {
                    type: 'line',
                    label: 'Close Price Unfiltered',
                    data: allClosePrices,
                    borderColor: 'rgba(175, 192, 192, 0.5)',
                    backgroundColor: 'rgba(175, 192, 192, 0.2)',
                    yAxisID: 'y-axis-1',
                },
                {
                    type: 'bar',
                    label: 'Volume',
                    data: volumes,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    yAxisID: 'y-axis-2',
                }
            ]
        });
    }, [data, selectedTradeCode]);

    useEffect(() => {
        fetchData();
    }, [currentPage, fetchData]);

    useEffect(() => {
        if (data.length > 0) {
            setSelectedTradeCode(data[0].trade_code); // Ensure a trade code is selected initially
        }
    }, [data]);

    useEffect(() => {
        if (selectedTradeCode) {
            updateChartData();
        }
    }, [data, selectedTradeCode, updateChartData]);

    const updateRow = (id, newData) => {
        fetch(`${API_URL}/data/${id}`, {
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

    const handleTradeCodeChange = (event) => {
        setSelectedTradeCode(event.target.value);
    };

    return (
        <div className="App">
            <div className="chart">
                <select onChange={handleTradeCodeChange} value={selectedTradeCode}>
                    {Array.from(new Set(data.map(row => row.trade_code))).map(tradeCode => (
                        <option key={tradeCode} value={tradeCode}>{tradeCode}</option>
                    ))}
                </select>
                {chartData.labels.length > 0 && (
                    <Line
                        ref={chartRef}
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    type: 'time',
                                    time: {
                                        unit: 'day',
                                    },
                                },
                                'y-axis-1': {
                                    type: 'linear',
                                    position: 'left',
                                },
                                'y-axis-2': {
                                    type: 'linear',
                                    position: 'right',
                                    grid: {
                                        drawOnChartArea: false,
                                    },
                                },
                            },
                        }}
                        height={400}
                        width={800}
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
                        {data.filter(row => row.trade_code === selectedTradeCode).map(row => (
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
