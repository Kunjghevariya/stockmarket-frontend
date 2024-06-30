import React, { useEffect, useRef, useState } from 'react';
import Chart from './Chart';
import stockMarketNews from './data';
import useportfolio from './ContextApi/portfolio';
import useWatchlist from './ContextApi/watchlist';


const NewsItem = ({ headline }) => (
  <div className="news-item bg-white p-4 m-2 rounded shadow-md w-full flex-shrink-0">
    <h2 className="font-bold text-lg">{headline}</h2>
  </div>
);

const Datait = ({ symbol, companyName, price, data, }) => (
  <div className="flex justify-between bg-white p-4 m-2 rounded shadow-md w-full flex-shrink-0">
    <div className="1">
      <h2 className="font-bold text-lg">{companyName}</h2>
      <h2 className="text-lg">{symbol}</h2>
    </div>
    <div className="2">
      <h2 className="font-bold text-lg">${price}</h2>

    </div>
  </div>
);

const Dashboard = () => {
  const [invested, setinvested] = useState(0)
  const [portfolio] = useportfolio();
  const [watchlistData, setWatchlist] = useWatchlist();
const [prices, setPrices] = useState({});
const [data, setData] = useState([]);

const generateRandomPrice = () => {
  return (Math.random() * (200 - 10) + 10).toFixed(2);
};

const updatePrices = () => {
  const newPrices = {};
  watchlistData.forEach((stock) => {
    newPrices[stock] = generateRandomPrice();
  });
  setPrices(newPrices);
};

useEffect(() => {
  updatePrices();
  const interval = setInterval(updatePrices, 1000);
  return () => clearInterval(interval);
}, [watchlistData]);



  useEffect(() => {
      if (portfolio.statusCode && portfolio.statusCode.holdings) {
        setData(portfolio.statusCode.holdings);
          setinvested(portfolio.statusCode.totalInvestment)
      }
  }, [portfolio]);

  const newsRef = useRef(null);

  useEffect(() => {
    const newsContainer = newsRef.current;
    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollDelay = 20;

    const scrollNews = () => {
      if (newsContainer) {
        scrollAmount += scrollStep;
        if (scrollAmount >= newsContainer.scrollWidth - newsContainer.clientWidth) {
          scrollAmount = 0;
        }
        newsContainer.scrollLeft = scrollAmount;
      }
    };

    const scrollInterval = setInterval(scrollNews, scrollDelay);

    return () => {
      clearInterval(scrollInterval);
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-5 m-5">
      <div className="w-full md:w-2/3">
        <div
          className="news flex gap-2 overflow-x-scroll scroll-m-0 p-4"
          ref={newsRef}
          style={{ whiteSpace: 'nowrap' }}
        >
          {stockMarketNews.map(news => (
            <NewsItem
              key={news.id}
              headline={news.headline}
            />
          ))}
        </div>
        <div className="portfoliofunc m-5 flex flex-col md:flex-row text-white gap-2">
          <div className="totalinvestment w-full md:w-1/3 bg-orange-400 shadow-orange-300 shadow-lg rounded-md p-4">
            <div>Investment</div>
            <div className="text-5xl">{invested}</div>
          </div>
          <div className="total w-full md:w-1/3 bg-violet-600 rounded-md p-4 shadow-violet-500 shadow-lg">
            <div>*Current Money</div>
            <div className="text-5xl">0</div>
          </div>
          <div className="lossprofit w-full md:w-1/3 bg-black shadow-slate-800 shadow-lg rounded-md p-4">
            <div>*Profit/Loss</div>
            <div className="text-5xl">+0</div>
          </div>
        </div>
        <Chart />
      </div>
      <div className="w-full md:w-1/3">
       {watchlistData.map((stock) => (


                
                  <Datait key={stock} symbol ={stock} companyName={stock} price={prices[stock]} data={data}/>

                

            ))}
      </div>
    </div>
  );
}

export default Dashboard;
