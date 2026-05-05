import React from 'react'
import './header.css'
import Logo from './Logo'
import SearchBar from './SearchBar'
import Nav from './Nav'
import DarkMode from './DarkMode/DarkMode'
import AccessibilityControl from "./AccesibilityControl";

function Header() {
  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      {/* {logo} */}
      <Logo />
      {/* {search bar) */}
      {/*<SearchBar />*/}
      {/* {nav} */}
      <Nav />
      {/* {dark mode} */}
      <DarkMode />
      <AccessibilityControl /> {/* <--- Metido aquí y ya funciona en toda la web */}
    </header>
  )
}

export default Header