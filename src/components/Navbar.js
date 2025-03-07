import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          YouTube Video Collector
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">ホーム</Link>
          <Link to="/add" className="nav-link add-btn">+ 動画追加</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;