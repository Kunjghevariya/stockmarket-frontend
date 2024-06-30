import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Searchbar from './searchbar';
import Serchs from './Serchs';
import Cookies from 'js-cookie';


const token = Cookies.get('accessToken');

const Nav = ({ run, setRun }) => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8001/api/v1/users/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      console.log(response.data);
      alert("Logout successful");
      Cookies.remove('accessToken');
      navigate('/signin');
    } catch (error) {
      console.error('Error logging out:', error);
      alert("Logout failed");
    }
  };


  const handleAdd = async (stock) => {
    try {
      const response = await fetch('http://localhost:8001/api/v1/watchlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        credentials: 'include',
        body: JSON.stringify({ stockSymbol: stock }),
      });
      if (!response.ok) {
        throw new Error('Failed to add to watchlist');
      }
      const data = await response.json();
      
      setRun(!run);
      console.log(run)
    } catch (error) {
      console.error('Error adding to watchlist:', error.message);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className=" flex items-center justify-between h-16">
          <div className=" inset-y-0 left-0  items-center sm:hidden">
            
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">Stock Market</h1>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/dashboard' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/market"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/market' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`}
                >
                  Market
                </Link>
                <Link
                  to="/portfolio"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/portfolio' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`}
                >
                  Portfolio
                </Link>
               
                <Link
                  to="/news"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/news' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`}
                >
                  *News
                </Link>
              </div>
            </div>
          </div>
          <div className=" inset-y-0 right-0 flex items-center pr-2  sm:inset-auto sm:ml-6 sm:pr-0 hidden sm:block">
            <div className="flex items-center space-x-4 ">
              <div className="">
                <Searchbar setresult={setResults} setshowmenu={setShowMenu} />
                {showMenu && (
                  <div className=" mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <Serchs results={results} setsybl={handleAdd} setShowMenu={setShowMenu} showMenu={showMenu} />
                  </div>
                )}
              </div>
              <Link onClick={handleLogout} className="bg-violet-500 text-white rounded-xl p-3 hidden sm:block ">
                Log out
              </Link>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/dashboard' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/market"
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/market' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`}
            >
              Market
            </Link>
            <Link
              to="/portfolio"
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/portfolio' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`}
            >
              Portfolio
            </Link>
            <Link
              to="/news"
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/news' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`}
            >
              *News
            </Link>
            <Link onClick={handleLogout} className="bg-violet-500 text-white rounded-xl p-3 hidden sm:block ">
                Log out
              </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
