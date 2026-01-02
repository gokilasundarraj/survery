import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../img/logo.png'


const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
           <img src={Logo} alt='logo'/>
        </Link>
        <div className="nav-menu">
          <Link 
            to="/admin/login" 
            className={`nav-link ${location.pathname === '/admin/login' ? 'active' : ''}`}
          >
            Admin Login
          </Link>
          <Link 
            to="/user/login" 
            className={`nav-link ${location.pathname === '/user/login' ? 'active' : ''}`}
          >
            User Login
          </Link>
          <Link 
            to="/user/register" 
            className={`nav-link ${location.pathname === '/user/register' ? 'active' : ''}`}
          >
            Register
          </Link>
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;