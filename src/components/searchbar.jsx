import React, { useState, useCallback } from 'react';
import debounce from '../utils/debounce';

function Searchbar({ setResults, setShowMenu }) {
  const [input, setInput] = useState("");

  // Debounced API call
  const fetchData = useCallback(
    debounce(async (value) => {
      if (!value.trim()) {
        setResults([]);
        setShowMenu(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/v1/search?q=${value}`);

        const json = await response.json();

        // Your API returns an array directly
        setResults(json || []);
        setShowMenu(true);
      } catch (err) {
        console.error("Search API Error:", err);
        setResults([]);
      }
    }, 300),
    [setResults, setShowMenu]
  );

  const handleInput = (value) => {
    setInput(value);
    fetchData(value);
  };

  const clear = () => {
    setInput("");
    setResults([]);
    setShowMenu(false);
  };

  return (
    <div className="flex items-center">
      <input
        className="m-1 bg-neutral-100 p-2 rounded-md w-full"
        type="text"
        placeholder="Search"
        value={input}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => setShowMenu(true)}
      />

      <button onClick={clear} className="font-bold text-xl mr-5">
        X
      </button>
    </div>
  );
}

export default Searchbar;
