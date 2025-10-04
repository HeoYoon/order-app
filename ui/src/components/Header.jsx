import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ currentPage }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-title">Coffee ORDER</h1>
        <nav className="navigation">
          <button 
            className={`nav-button ${currentPage === 'order' ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            주문하기
          </button>
          <button 
            className={`nav-button ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => navigate('/admin')}
          >
            관리자
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
