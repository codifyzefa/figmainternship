import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './landingpage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* You can add more routes here, like /login */}
        <Route path="/login" element={<div>Login Page (Placeholder)</div>} />
      </Routes>
    </Router>
  );
}

export default App;

