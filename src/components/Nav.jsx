import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import Searchbar from './Searchbar';
import Serchs from './Serchs';

const Nav = ({ run, setRun }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const [results, setResults] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/users/logout',
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      alert("Logout successful");
      localStorage.removeItem('accessToken');
      navigate('/signin');
    } catch (error) {
      console.error('Error logging out:', error);
      alert("Logout failed");
    }
  };

  const handleAdd = async (symbol) => {
    try {
      const response = await fetch(
        'http://localhost:4000/api/v1/watchlist/add',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ stockSymbol: symbol }),
        }
      );

      if (!response.ok) throw new Error('Failed to add to watchlist');

      setRun(!run);
      setShowMenu(false);
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">

        {/* NAV BAR */}
        <div className="flex items-center justify-between h-16">
          
          {/* MOBILE MENU BUTTON */}
          <div className="sm:hidden">
            <button
              className="p-2 rounded-md"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? "✖" : "☰"}
            </button>
          </div>

          {/* WEBSITE NAME + LINKS */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold mr-6">Stock Market</h1>

            <div className="hidden sm:flex space-x-4">
              <Link
                to="/dashboard"
                className={`${location.pathname === '/dashboard'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-700 hover:text-white'
                  } px-3 py-2 rounded-md`}
              >
                Dashboard
              </Link>

              <Link
                to="/market"
                className={`${location.pathname === '/market'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-700 hover:text-white'
                  } px-3 py-2 rounded-md`}
              >
                Market
              </Link>

              <Link
                to="/portfolio"
                className={`${location.pathname === '/portfolio'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-700 hover:text-white'
                  } px-3 py-2 rounded-md`}
              >
                Portfolio
              </Link>

              <Link
                to="/news"
                className={`${location.pathname === '/news'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-700 hover:text-white'
                  } px-3 py-2 rounded-md`}
              >
                News
              </Link>
            </div>
          </div>

          {/* SEARCH + LOGOUT */}
          <div className="hidden sm:flex items-center space-x-4">

            {/* SEARCHBAR */}
            <div className="relative w-64">
              <Searchbar
                setResults={setResults}
                setShowMenu={setShowMenu}
              />

              {showMenu && results.length > 0 && (
                <div className="absolute w-full mt-1 z-50">
                  <Serchs results={results} setsybl={handleAdd} />
                </div>
              )}
            </div>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="bg-violet-500 text-white rounded-xl p-3"
            >
              Log out
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="sm:hidden px-2 pb-3 space-y-1">
          <Link to="/dashboard" className="block p-2">Dashboard</Link>
          <Link to="/market" className="block p-2">Market</Link>
          <Link to="/portfolio" className="block p-2">Portfolio</Link>
          <Link to="/news" className="block p-2">News</Link>
        </div>
      )}
    </nav>
  );
};

export default Nav;
