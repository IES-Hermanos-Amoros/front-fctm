import React, { useEffect } from 'react'

// import Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import './App.css';
import Header from './components/Header';
import SideBar from './components/SideBar';
import MainDashboard from './components/MainDashboard';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import useEnumStore from './store/enumStore';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateLayout from './layouts/PrivateLayout';


function App() {

  const cargarEnums = useEnumStore((state) => state.cargarEnums);

  useEffect(() => {
    // Se ejecuta una sola vez al arrancar la app
    cargarEnums();
  }, [cargarEnums]);

  return (
  <>
    <Header />
    <SideBar />
    <MainDashboard />
    <Footer />
    <BackToTop />
  </>
  );
}

export default App;
