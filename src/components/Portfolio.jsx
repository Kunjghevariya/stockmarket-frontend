import React, { useState,useEffect } from 'react';
import useportfolio from './ContextApi/portfolio';
import Cookies from 'js-cookie';


const token = Cookies.get('accessToken');
console.log(token);




const Data = ({ item , setinvested, invested }) => (
  <div className="bg-white p-4 m-2  rounded-lg shadow-md flex justify-between">
    <div className="text-xl font-semibold w-1/4 content-center">
       {item.symbol}
    </div>
    <div className="text-xl">
      <div className="text-sm text-gray-500">Invested</div>
      {item.purchasePrice * item.quantity}
     
    </div>
    <div className="text-xl">
      <div className="text-sm text-gray-500">Current</div>
      {0}
    </div>
    <div className="text-xl">
      <div className="text-sm text-gray-500">Quantity</div>
      {item.quantity}
    </div>
  </div>
);

const Portfolio = () => {
  const [data, setData] = useState([]);
  
  const [invested, setinvested] = useState(0)
  const [portfolio] = useportfolio();

  useEffect(() => {
      if (portfolio.statusCode && portfolio.statusCode.holdings) {
          setData(portfolio.statusCode.holdings);
          setinvested(portfolio.statusCode.totalInvestment)
      }
  }, [portfolio]);

  return (
    <div>
      <div className="h-auto sm:h-1/4 bg-violet-500 m-2 p-2 flex flex-wrap justify-center">
        <div className="bg-white m-2 w-full sm:w-1/2 md:w-1/5 p-2 rounded-md">
          <div className="text-gray-500">*Current</div>
          <div className="text-3xl">0</div>
        </div>
        <div className="bg-white m-2 w-full sm:w-1/2 md:w-1/5 p-2 rounded-md">
          <div className="text-gray-500">Invested</div>
          <div className="text-3xl">{invested}</div>
        </div>
        <div className="bg-white m-2 w-full sm:w-1/2 md:w-1/5 p-2 rounded-md">
          <div className="text-gray-500">*Returns</div>
          <div className="text-3xl">0</div>
        </div>
        <div className="bg-white m-2 w-full sm:w-1/2 md:w-1/5 p-2 rounded-md">
          <div className="text-gray-500">*Total Returns %</div>
          <div className="text-3xl">0%</div>
        </div>
      </div>

      <div className="portfolio m-4">
        <div className="text-2xl m-3 text-gray-600">Invested Stocks</div>

          {data.map((item, index) => (
            <Data key={item._id} item={item} setinvested={setinvested} invested={invested} />
          ))}

      </div>
    </div>
  );
}

export default Portfolio;
