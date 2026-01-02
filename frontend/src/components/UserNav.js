import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../img/logo.png';


const UserNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
   

    navigate('/user/login');
    alert("Logout success..")
  };

  return (
    <nav className="user-nav">
      <div className="user-nav__container">
        <Link to="/user/home" className="user-nav__logo">
          <img src={Logo} alt="logo" />
        </Link>
        <div className="user-nav__menu">
          <button 
            onClick={handleLogout} 
            className={`user-nav__link ${location.pathname === '/' ? 'user-nav__link--active' : ''}`}
          >
            LOGOUT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default UserNav;
