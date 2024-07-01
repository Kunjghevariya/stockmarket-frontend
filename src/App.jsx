import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Market from './components/Market';
import News from './components/News';
import Portfolio from './components/Portfolio';
import Transaction from './components/Transaction';
import Nav from './components/Nav';
import Signin from './components/Signin';
import Signup from './components/Signup';

const App = () => {
  const [run, setRun] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<Signin />} />
      <Route path="/dashboard" element={<><Nav run={run} setRun={setRun}/><Dashboard run={run} setRun={setRun}/></>} />
      <Route path="/market" element={<><Nav run={run} setRun={setRun} /><Market run={run} setRun={setRun} /></>} />
      <Route path="/news" element={<><Nav run={run} setRun={setRun}/><News /></>} />
      <Route path="/portfolio" element={<><Nav run={run} setRun={setRun}/><Portfolio /></>} />
      <Route path="/transaction" element={<><Nav run={run} setRun={setRun} /><Transaction/></>} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default App;
