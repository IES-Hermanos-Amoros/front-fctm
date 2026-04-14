import React, { useEffect } from 'react'

// import Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';


//import './App.css';
import './styles/app.css'

import useEnumStore from './store/enumStore';
import useCategoryStore from './store/categoryStore';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./views/Auth/Login"
import VerifyEmailPage from "./views/Auth/VerifyEmailPage"
import PasswordSetup from "./views/Auth/PasswordSetup"
import CheckEmailPassRecovery from "./views/Auth/CheckEmailPassRecovery"
import PasswordChange from "./views/Auth/PasswordChange"
import PrivateLayout from './layouts/PrivateLayout';


function App() {

  const cargarEnums = useEnumStore((state) => state.cargarEnums);
  const cargarCategorias = useCategoryStore((state) => state.cargarCategorias);

  useEffect(() => {
    // Se ejecuta una sola vez al arrancar la app
    cargarEnums();
    cargarCategorias();
  }, [cargarEnums, cargarCategorias]);

  return (
      <Routes>

        {/* RUTAS PUBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/auth/password-setup" element={<PasswordSetup />} />
        <Route path="/verify-email-info" element={<VerifyEmailPage mensajeInformativo={true} />}/>
        <Route path="/verify-email/:emailToken" element={<VerifyEmailPage />} />
        <Route path="/auth/check-email-recovery" element={<CheckEmailPassRecovery />} />
        <Route path="/auth/change-password/:token" element={<PasswordChange />} />


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
