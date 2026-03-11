// src/layouts/PrivateLayout.jsx
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateLayout = () => {
  // Aquí va tu lógica de autenticación real
  const isAuthenticated = true //!!localStorage.getItem('token'); //TEMPORAL

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header />
      <SideBar />
      <main id="main" className="main">
        {/* El Outlet renderizará el componente de la ruta actual */}
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
};

export default PrivateLayout;