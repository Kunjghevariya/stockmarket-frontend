import React, { useState, useEffect } from 'react';
import useportfolio from './ContextApi/portfolio';

const Transaction = (token) => {
    const [portfolio] = useportfolio();
    const [data, setData] = useState([]);

    useEffect(() => {
        
        
        if (portfolio.statusCode && portfolio.statusCode.holdings) {
            setData(portfolio.statusCode.holdings);
        }
    }, [portfolio]);

    return (
        <div className="flex profile  bg-white rounded-md shadow-md p-4 mb-5 sm:block w-1/4 ">
          <div className="pic m-3 rounded-full overflow-hidden">
            <img className='h-auto w-full' src="src/assest/Profile Pic.jpg" alt="Profile" />
          </div>
          <div className="name text-center text-3xl">Kunj Ghevariya</div>
        </div> 
    );
};

export default Transaction;
