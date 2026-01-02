import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Navbar'
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="page-container fade-in">
      <Nav/>
      <div className="home-hero">
        <h1 className="hero-title">Welcome to Survey Website..</h1>
        <p className="hero-subtitle">Create and take surveys with ease</p>
        <div className="hero-buttons">
          <Link to="/admin/login" className="btn btn-primary">
            Admin Portal
          </Link>
          <Link to="/user/register" className="btn btn-secondary">
            Get Started
          </Link>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;