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
import Login from "./views/Auth/Login"
import VerifyEmailPage from "./views/Auth/VerifyEmailPage"
import PasswordSetup from "./views/Auth/PasswordSetup"
import PrivateLayout from './layouts/PrivateLayout';


function App() {

  const cargarEnums = useEnumStore((state) => state.cargarEnums);

  useEffect(() => {
    // Se ejecuta una sola vez al arrancar la app
    cargarEnums();
  }, [cargarEnums]);

  return (
      <Routes>

        {/* RUTAS PUBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/auth/password-setup" element={<PasswordSetup />} />
        <Route path="/verify-email-info" element={<VerifyEmailPage mensajeInformativo={true} />}/>
        <Route path="/verify-email/:emailToken" element={<VerifyEmailPage />} /> 


        {/* RUTAS PRIVADAS */}
        <Route path="/*" element={<PrivateLayout />} />

      </Routes>
  )

  /*return (
  <>
    <Header />
    <SideBar />
    <MainDashboard />
    <Footer />
    <BackToTop />
  </>
  );*/
}

export default App;
