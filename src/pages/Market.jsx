import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ChartComp from '../components/ChartComp';
import Modal from '../components/Modal';
import Searchbar from '../components/Searchbar';
import Serchs from '../components/Serchs';
import { useWatchlistCtx } from '../context/WatchlistContext';
import useBatchedPrices from '../hooks/useBatchedPrices';
import apiFetch from '../utils/api';

const Market = () => {
const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistCtx();


  // watchlist is array of symbols e.g. ['AAPL']
  const { prices, loading: pricesLoading, refresh, getPriceFor } = useBatchedPrices(watchlist, { pollInterval: 5000, ttl: 4000 });

  const [chart, setChart] = useState([]);
  const [selectedStock, setSelectedStock] = useState(watchlist[0] || null);

  // modal state
  const [modalInfo, setModalInfo] = useState({ show: false, stock: "", type: "" });
  const [modalInput, setModalInput] = useState({ price: "", quantity: "" });

  // search results
  const [results, setResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);

  // load chart
  const loadChart = useCallback(async (symbol) => {
    if (!symbol) return;
    try {
      setSelectedStock(symbol);
      setChart([]); // show loading
      const data = await apiFetch(`/api/v1/chart/${encodeURIComponent(symbol)}?range=1mo`);
      setChart(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Chart error", err);
      setChart([]);
    }
  }, []);

  // initial load when watchlist changes
  useEffect(() => {
    if (watchlist && watchlist.length) {
      // choose selectedStock or first symbol
      const pick = selectedStock || watchlist[0];
      loadChart(pick);
    }
  }, [watchlist, loadChart]);

  // when user selects from search -> add to watchlist and show chart
  const setSymbolFromSearch = async (symbol) => {
    try {
      // optimistic UI: add locally
      addToWatchlist(symbol);
      setSearchOpen(false);
      setResults([]);
      await loadChart(symbol);
      refresh(); // update prices
    } catch (err) {
      console.error('failed to add', err);
    }
  };

  const openModal = (stock, type) => {
    setModalInfo({ show: true, stock, type });
    setModalInput({
      price: type === 'buy' ? (getPriceFor(stock)?.current ?? '') : '',
      quantity: ''
    });
  };

  const closeModal = () => {
    setModalInfo({ show: false, stock: "", type: "" });
    setModalInput({ price: "", quantity: "" });
  };

  const submitTrade = async () => {
    const { stock, type } = modalInfo;
    const { price, quantity } = modalInput;
    if (!quantity || Number(quantity) <= 0) {
      alert("Invalid quantity");
      return;
    }
    try {
      if (type === "buy") {
        await apiFetch("/api/v1/portfolio/buy", {
          method: "POST",
          body: { symbol: stock, quantity: Number(quantity), purchasePrice: Number(price) }
        });
      } else {
        await apiFetch("/api/v1/portfolio/sell", {
          method: "POST",
          body: { symbol: stock, quantity: Number(quantity) }
        });
      }
      alert(type === "buy" ? "Buy Successful" : "Sell Successful");
      closeModal();
    } catch (err) {
      console.error('trade fail', err);
      alert("Trade failed: " + (err?.message || 'unknown'));
    }
  };

  const removeSymbol = async (symbol) => {
    // optimistic UI
    removeFromWatchlist(symbol);
    try {
      await apiFetch('/api/v1/watchlist/remove', { method: 'POST', body: { stockSymbol: symbol } });
    } catch (err) {
      console.error('remove watchlist error', err);
      // optionally refetch watchlist from server
    }
  };

  const addSymbol = async (symbol) => {
    try {
      addToWatchlist(symbol); // optimistic
      await apiFetch('/api/v1/watchlist/add', { method: 'POST', body: { stockSymbol: symbol } });
    } catch (err) {
      console.error('add watchlist error', err);
    }
  };

  const watchlistItems = useMemo(() => watchlist || [], [watchlist]);

  return (
    <>
      <header className="bg-violet-600 text-white text-center py-4">
        <h1 className="text-2xl font-bold">Stock Market</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 p-4">
        {/* LEFT - Search + Watchlist */}
        <aside className="w-full lg:w-1/3 space-y-4">
          <div className="bg-white p-3 rounded shadow">
            <Searchbar setResults={(r) => { setResults(r); setSearchOpen(Boolean(r?.length)); }} />
            {searchOpen && results.length > 0 && (
              <div className="mt-2">
                <Serchs results={results} setsybl={(s) => setSymbolFromSearch(s)} />
              </div>
            )}
          </div>

          <div className="bg-white p-3 rounded shadow">
            <h2 className="font-semibold mb-2">Watchlist</h2>
            {watchlistItems.length === 0 && <div className="text-gray-500">No watchlist yet — search and add symbols</div>}

            <div className="divide-y">
              {watchlistItems.map((stock) => {
                const p = getPriceFor(stock);
                const priceDisplay = p ? (p.current ?? p.price ?? '—') : (pricesLoading ? 'Loading...' : '—');

                return (
                  <div key={stock} className="p-2 flex items-center justify-between">
                    <div className="flex-1 cursor-pointer" onClick={() => loadChart(stock)}>
                      <div className="font-medium">{stock}</div>
                      <div className="text-sm text-gray-600">Price: {priceDisplay}$</div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="px-2 py-1 rounded bg-green-500 text-white text-sm" onClick={() => openModal(stock, 'buy')}>Buy</button>
                      <button className="px-2 py-1 rounded bg-red-500 text-white text-sm" onClick={() => openModal(stock, 'sell')}>Sell</button>
                      <button className="px-2 py-1 rounded border text-sm" onClick={() => removeSymbol(stock)}>X</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* RIGHT - Chart + Details */}
        <main className="w-full lg:w-2/3 space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{selectedStock ?? 'Select a stock'}</h3>
                <div className="text-sm text-gray-600">
                  Current: {selectedStock ? (getPriceFor(selectedStock)?.current ?? 'Loading...') : '-'}$
                </div>
              </div>
              <div>
                <button className="px-3 py-1 rounded border" onClick={() => selectedStock && refresh()}>Refresh</button>
              </div>
            </div>

            <div className="mt-4">
              <ChartComp candles={chart} selectedStock={selectedStock} />
            </div>
          </div>


        </main>
      </div>

      <Modal show={modalInfo.show} onClose={closeModal} title={modalInfo.type === 'buy' ? 'Buy Stock' : 'Sell Stock'} onSubmit={submitTrade}>
        {modalInfo.type === 'buy' && (
          <div className="mt-2">
            <label className="block">Price</label>
            <input type="number" className="mt-1 w-full border rounded-md" value={modalInput.price} onChange={(e) => setModalInput(prev => ({ ...prev, price: e.target.value }))} placeholder={getPriceFor(modalInfo.stock)?.current ?? ''} />
          </div>
        )}
        <div className="mt-2">
          <label className="block">Quantity</label>
          <input type="number" className="mt-1 w-full border rounded-md" value={modalInput.quantity} onChange={(e) => setModalInput(prev => ({ ...prev, quantity: e.target.value }))} />
        </div>
      </Modal>
    </>
  );
};

export default Market;
