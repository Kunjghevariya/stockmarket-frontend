import { useState, useEffect } from "react";

function useWatchlist(run) {
    const [watchlistData, setWatchlistData] = useState([]);

    const fetchWatchlistData = async () => {
        try {
            const response = await fetch('http://localhost:8001/api/v1/watchlist/', { credentials: "include" });
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
