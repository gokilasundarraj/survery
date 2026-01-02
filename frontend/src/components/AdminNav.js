import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../img/logo.png';


const AdminNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    

    navigate('/admin/login');
    alert("Logout success..")
  };

  return (
    <nav className="admin-nav">
      <div className="admin-nav__container">
        <Link to="/admin/home" className="admin-nav__logo">
          <img src={Logo} alt="logo" />
        </Link>
        <div className="admin-nav__menu">
          <button 
            onClick={handleLogout} 
            className={`admin-nav__link ${location.pathname === '/' ? 'user-nav__link--active' : ''}`}
          >
            LOGOUT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
