import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';

// Lazy loaded pages
const Signin = lazy(() => import('./pages/Signin'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Market = lazy(() => import('./pages/Market'));
const News = lazy(() => import('./pages/News'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Transaction = lazy(() => import('./pages/Transaction'));

const App = () => {
  const [run, setRun] = useState(false);

  // A wrapper layout for authenticated pages
  const WithNav = (Component) => (
    <>
      <Nav run={run} setRun={setRun} />
      <Component run={run} setRun={setRun} />
    </>
  );

  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />

        {/* Auth Pages */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Pages (Nav + Page) */}
        <Route path="/dashboard" element={WithNav(Dashboard)} />
        <Route path="/market" element={WithNav(Market)} />
        <Route path="/news" element={WithNav(News)} />
        <Route path="/portfolio" element={WithNav(Portfolio)} />
        <Route path="/transaction" element={WithNav(Transaction)} />
      </Routes>
    </Suspense>
  );
};

export default App;
