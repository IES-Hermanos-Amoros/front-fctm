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

function App() {
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
