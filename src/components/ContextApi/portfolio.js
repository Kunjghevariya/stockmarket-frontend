import { useState, useEffect } from "react";

function usePortfolio() {
    const [portfolio, setPortfolio] = useState({});

    const fetchPortfolio = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('https://stockmarket-portfolio-backend.onrender.com/api/v1/portfolio/', {
                credentials: "include",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            
            const data = await response.json();
            setPortfolio(data);
            console.log("Portfolio data fetched:", data);
        } catch (error) {
            console.error("Failed to fetch portfolio data:", error);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    useEffect(() => {
        console.log("Portfolio data updated:", portfolio.holdings);
    }, [portfolio]); 

    return [portfolio, fetchPortfolio];
}

export default usePortfolio;
