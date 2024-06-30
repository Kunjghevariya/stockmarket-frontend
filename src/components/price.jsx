import React, { useState, useEffect } from 'react';

function Price({ symbol }) {
  const [price, setPrice] = useState(Number);
const [Currency, setCurrency] = useState("")
const [regopen, setregopen] = useState(Number)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=${symbol}`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': 'ce297505eemsh4812b5289717005p12679bjsn9a2da41e0378',
            'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
          }
        });
        const data = await response.json();
        const marketPrice = data?.quoteResponse?.result[0]?.regularMarketPrice;
        const regOpen = data?.quoteResponse?.result[0]?.regularMarketOpen;
        const currency = data?.quoteResponse?.result[0]?.currency;
        if (marketPrice) {
          setCurrency(currency)
          setPrice(marketPrice);
          setregopen(regOpen);
        } else {
          setPrice("N/A");
          setCurrency("N/A")
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setPrice("Error");
      }
    };

    fetchData();
  }, [symbol]);

  return (
    <div className=''>
      {(regopen<price) && <div className=' text-green-500'>{`${price} ${Currency}`}</div>}
      {(regopen>price) && <div className=' text-red-400'>{`${price} ${Currency}`}</div>}
      
    </div>
  );
}

export default Price;
