import Header from "../components/Header"
import SideBar from "../components/SideBar"
import MainDashboard from "../components/MainDashboard"
import Footer from "../components/Footer"
import BackToTop from "../components/BackToTop"

export default function PrivateLayout() {

  return (
    <>
      <Header />
      <SideBar />
      <MainDashboard />
      <Footer />
      <BackToTop />
    </>
  )
}