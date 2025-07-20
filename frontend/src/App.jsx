import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CapLogin from './pages/CapLogin';
import CapSignup from './pages/CapSignup';
import Ride from './pages/Ride';
import CapHome from './pages/CapHome';
import Profile from './pages/Profile';
import Trip from './pages/Trip';

const App = () => {
  
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/ride' element={<Ride />} />
        <Route path='/trip' element={<Trip />} />
        <Route path='/captain-login' element={<CapLogin />} />
        <Route path='/captain-signup' element={<CapSignup />} />
        <Route path='/captain-home' element={<CapHome />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App