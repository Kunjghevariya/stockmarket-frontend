import React, { useState, useEffect } from 'react';
import Chart from './Chart';
import useWatchlist from './ContextApi/watchlist';
import Modal from './Modal';

const Market = ({ run, setrun }) => {
  const [quantities, setQuantities] = useState([]);
  const [watchlistData, setWatchlist] = useWatchlist(run);
  const [prices, setPrices] = useState({});
  const [modalInfo, setModalInfo] = useState({ show: false, stock: '', type: '' });
  const [modalInput, setModalInput] = useState({ price: '', quantity: '' });

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

  const handleDelete = async (stock) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error("No token found, cannot delete from watchlist.");
      return;
    }

    try {
      const response = await fetch('https://stockmarket-portfolio-backend.onrender.com/api/v1/watchlist/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ stockSymbol: stock }),
      });
      if (!response.ok) {
        throw new Error('Failed to remove from watchlist');
      }

      const data = await response.json();
      setWatchlist(data.stocks || []);
    } catch (error) {
      console.error('Error removing from watchlist:', error.message);
    }
  };

  const handleModalOpen = (stock, type) => {
    setModalInfo({ show: true, stock, type });
  };

  const handleModalClose = () => {
    setModalInfo({ show: false, stock: '', type: '' });
    setModalInput({ price: '', quantity: '' });
  };

  const handleModalSubmit = async () => {
    const { stock, type } = modalInfo;
    const { price, quantity } = modalInput;
    const token = localStorage.getItem('accessToken');

    if (isNaN(quantity) || quantity <= 0 || (type === 'buy' && (isNaN(price) || price <= 0))) {
      alert('Error: Invalid input');
      return;
    }

    if (type === 'buy') {
      try {
        const response = await fetch('https://stockmarket-portfolio-backend.onrender.com/api/v1/portfolio/buy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ symbol: stock, quantity: parseInt(quantity, 10), purchasePrice: parseFloat(price) }),
        });
        if (!response.ok) {
          throw new Error('Failed to buy stock');
        }
        const data = await response.json();
        setQuantities(data.portfolio.holdings);
        alert(`You have bought ${quantity} shares of ${stock}`);
      } catch (error) {
        console.error('Error buying stock:', error.message);
      }
    } else {
      try {
        const response = await fetch('https://stockmarket-portfolio-backend.onrender.com/api/v1/portfolio/sell', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ symbol: stock, quantity: parseInt(quantity, 10) }),
        });
        if (!response.ok) {
          throw new Error('Failed to sell stock');
        }
        const data = await response.json();
        setQuantities(data.portfolio.holdings);
        alert(`You have sold ${quantity} shares of ${stock}`);
      } catch (error) {
        console.error('Error selling stock:', error.message);
      }
    }

    handleModalClose();
  };

  return (
    <>
      <header className="bg-violet-500 text-white text-center py-4">
        <h1 className="text-2xl font-bold">Stock Market</h1>
      </header>
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2">
          <div className="p-4">
            {watchlistData.map((stock) => (
              <div key={stock} className="bg-white border-b border-gray-200 p-2 m-2 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{stock}</h2>
                  <p className="text-gray-700">Price: {prices[stock] || 0}</p>
                </div>
                <div className="my-auto">
                  <button
                    className="bg-red-500 text-white rounded-xl p-2 px-3 mx-2 text-lg sm:text-xl"
                    onClick={() => handleModalOpen(stock, 'sell')}
                  >
                    Sell
                  </button>
                  <button
                    className="bg-green-500 text-white rounded-xl p-2 mx-2 px-3 text-lg sm:text-xl"
                    onClick={() => handleModalOpen(stock, 'buy')}
                  >
                    Buy
                  </button>
                  <button
                    className="bg-red-500 text-white rounded-xl p-2 px-3 mx-1 text-lg sm:text-xl"
                    onClick={() => handleDelete(stock)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full sm:w-1/2">
          <div className="chart h-64">
            <Chart />
          </div>
        </div>
      </div>

      <Modal
        show={modalInfo.show}
        onClose={handleModalClose}
        title={modalInfo.type === 'buy' ? 'Buy Stock' : 'Sell Stock'}
        onSubmit={handleModalSubmit}
      >
        {modalInfo.type === 'buy' && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">Price:</label>
            <input
              type="number"
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder={prices[modalInfo.stock] || 0}
              value={modalInput.price}
              onChange={(e) => setModalInput({ ...modalInput, price: e.target.value })}
            />
          </div>
        )}
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">Quantity:</label>
          <input
            type="number"
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            value={modalInput.quantity}
            onChange={(e) => setModalInput({ ...modalInput, quantity: e.target.value })}
          />
        </div>
      </Modal>
    </>
  );
};

export default Market;
