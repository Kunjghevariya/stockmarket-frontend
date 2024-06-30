import { useState, useEffect } from "react";
import Cookies from 'js-cookie';


const token = Cookies.get('accessToken');
console.log(token);

function useportfolio() {
    const [portfolio, setPortfolio] = useState({
  
    });

    const fetchPortfolio = async () => {
        try {
            const response = await fetch('http://localhost:8001/api/v1/portfolio/', { credentials: "include" });
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

export default useportfolio;
