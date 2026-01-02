import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/admin/AdminLogin';
import AdminHome from './pages/admin/AdminHome';
import AddSurvey from './pages/admin/AddSurvey';
import AddQuestion from './pages/admin/AddQuestion';
import ViewResults from './pages/admin/ViewResults';
import UserLogin from './pages/user/UserLogin';
import UserRegister from './pages/user/UserRegister';
import UserHome from './pages/user/UserHome';
import TakeSurvey from './pages/user/TakeSurvey';
import Result from './pages/user/Result';
import Loader from './components/Loader';
import './App.css';

function App() {
  const [loading,setloading] = useState(true)

  useEffect(()=>{
      const timer = setTimeout(()=>{
        setloading(false)
      },1500)
      return()=>clearTimeout(timer)
  },[])
  if (loading) {
    return <Loader />;
  }
  
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app">

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin/add-survey" element={<AddSurvey />} />
            <Route path="/admin/add-questions/:surveyId" element={<AddQuestion />} />
            <Route path="/admin/results/:surveyId" element={<ViewResults />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/user/home" element={<UserHome />} />
            <Route path="/user/survey/:surveyId" element={<TakeSurvey />} />
            <Route path="/user/thank-you" element={<Result />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;