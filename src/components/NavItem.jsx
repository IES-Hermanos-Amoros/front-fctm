import React from 'react'
import { NavLink } from 'react-router-dom'


function NavItem({nav}) {
  return (
    <li className='nav-item'>
      <NavLink
        to={nav.path}
        className={({ isActive }) =>
          isActive ? 'nav-link' : 'nav-link collapsed'
        }
      >
        <i className={nav.icon}></i>
        <span>{nav.name}</span>
      </NavLink>
    </li>
  )
}

export default NavItem