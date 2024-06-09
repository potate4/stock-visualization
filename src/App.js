// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const limit = 10; // Number of items per page

    useEffect(() => {
        fetchData(); // Fetch data when component mounts
    }, [currentPage]); // Refetch data when currentPage changes

    const fetchData = () => {
        const offset = (currentPage - 1) * limit; // Calculate offset based on current page
        fetch(`http://localhost:5000/data?page=${currentPage}&limit=${limit}`) // Pass page and limit as query parameters
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data); // Debug statement
                setData(data);
            })
            .catch(error => console.error("Error fetching data:", error)); // Debug statement
    };

    const nextPage = () => {
        setCurrentPage(prevPage => prevPage + 1); // Increment current page
    };

    const prevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1)); // Decrement current page, but not less than 1
    };

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
                    {data.map(row => (
                        <tr key={row.id}>
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
            <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
            <button onClick={nextPage}>Next</button>
        </div>
    );
}

export default App;
