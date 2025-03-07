import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AddVideoPage from './pages/AddVideoPage';
import WatchVideoPage from './pages/WatchVideoPage';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AddVideoPage />} />
            <Route path="/watch/:id" element={<WatchVideoPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;