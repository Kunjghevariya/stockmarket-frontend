import { useState, useEffect } from 'react';

const useFetchPrice = (symbol) => {
  const [price, setPrice] = useState(null);
  const apiKey = 'e76dbecff5mshb31c0d084ee300fp193f62jsncc56175d94d4';
  const apiHost = 'apidojo-yahoo-finance-v1.p.rapidapi.com';
  const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes?region=IN&symbols=${symbol}`;

  const fetchPrice = async () => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const result = data?.quoteResponse?.result[0];
      const marketPrice = result?.regularMarketPrice;

      setPrice(marketPrice);
    } catch (error) {
      console.error('Error fetching price data:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchPrice();
    }
  }, [symbol]);

  return [price, setPrice];
};

export default useFetchPrice;
