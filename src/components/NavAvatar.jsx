import React, {useState} from 'react';
//import profileImg from '../images/user.jpg'
//import profileImg from '../avatar.png'
import profileImg from "../assets/avatar.png"
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import useUserStore from "../store/userStore"
import { sendRequest, getProfilePath, externLogout, getBackendHost } from '../utils/functions';

function NavAvatar() {

  const host = getBackendHost();

  const navigate = useNavigate();

  const user = useUserStore(state => state.user);
  const clearUser = useUserStore(state => state.clearUser);
  const finalAvatarSrc = user?.user?.avatar 
    ? `${host}${user.user.avatar}` 
    : profileImg;
 

  const goProfile = () => {

    if (!user) return;   

    navigate(getProfilePath(user.user.profile,user.user.id))
    
  }

  const logout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Se cerrará tu sesión actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true
    });

    if (!result.isConfirmed) return;

    /*const res = await sendRequest("POST", null, "/auth/logout");

    if (res?.success) {
      clearUser();
      navigate('/');
    }*/
    await externLogout(clearUser, navigate);


  }

  return (
    <li className="nav-item dropdown pe-3">

      <a
        className="nav-link nav-profile d-flex align-items-center pe-0"
        href="#"
        data-bs-toggle="dropdown"
      >
        <img src={finalAvatarSrc} alt="Profile" className="rounded-circle" />

        <span className="d-none d-lg-block dropdown-toggle ps-2">
          {user?.user?.username || "Usuario"}
        </span>

      </a>

      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">

        <li className="dropdown-header">
          <h6>{user?.user?.username || "Usuario"} </h6>
          <span>{user?.user?.profile}</span>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li>
          <button
            className="dropdown-item d-flex align-items-center"
            onClick={goProfile}
          >
            <i className="bi bi-person"></i>
            <span>Perfil</span>
          </button>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li>
          <button
            className="dropdown-item d-flex align-items-center logout-item"
            onClick={logout}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Cerrar Sesión</span>
          </button>
        </li>

      </ul>

    </li>
  )
}

export default NavAvatar