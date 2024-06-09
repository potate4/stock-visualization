// src/Chart.js
import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

const Chart = ({ data }) => {
    const dates = data.map(row => row.date);
    const closePrices = data.map(row => row.close);
    const volumes = data.map(row => row.volume);

    const lineData = {
        labels: dates,
        datasets: [
            {
                label: 'Close Price',
                data: closePrices,
                fill: false,
                borderColor: 'rgba(75,192,192,1)'
            }
        ]
    };

    const lineOptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                }
            }
        }
    };

    const barData = {
        labels: dates,
        datasets: [
            {
                label: 'Volume',
                data: volumes,
                backgroundColor: 'rgba(153,102,255,0.2)',
                borderColor: 'rgba(153,102,255,1)',
                borderWidth: 1
            }
        ]
    };

    return (
        <div>
            <Line data={lineData} options={lineOptions} />
            <Bar data={barData} />
        </div>
    );
}

export default Chart;
