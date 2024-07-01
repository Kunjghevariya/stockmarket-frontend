import { useState, useEffect } from "react";

function useWatchlist(run) {
    const [watchlistData, setWatchlistData] = useState([]);

    const fetchWatchlistData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('https://stockmarket-portfolio-backend.onrender.com/api/v1/watchlist/', {
                credentials: "include",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            
            const data = await response.json();
            setWatchlistData(data.stocks);
        } catch (error) {
            console.error("Failed to fetch watchlist data:", error);
        }
    };

    useEffect(() => {
        fetchWatchlistData();
    }, [run]);

    useEffect(() => {
        console.log("Watchlist data updated:", watchlistData);
    }, [watchlistData]);

    return [watchlistData, fetchWatchlistData];
}

export default useWatchlist;
