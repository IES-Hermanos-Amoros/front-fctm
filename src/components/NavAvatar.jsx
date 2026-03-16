import React from 'react';
import profileImg from '../images/user.jpg'
import { useNavigate } from 'react-router-dom';

function NavAvatar() {
  const navigate = useNavigate();

  const goProfile = () => {
    navigate("/administrators/69aebd4c4c4a0e60d9d0d2d4")
  }

  const logout = () => {
    navigate("/")
  }

  return (
    <li className="nav-item dropdown pe-3">
        <a
            className="nav-link nav-profile d-flex align-items-center pe-0"
            href="#"
            data-bs-toggle="dropdown"
        >
            <img src={profileImg} alt="Profile" className="rounded-circle" />
            <span className="d-none d-lg-block dropdown-toggle ps-2">Username</span>
        </a>

        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
            <li className="dropdown-header">
                <h6>Username</h6>
                <span>Profile</span>
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
            {/*<li>
                <a
                    className="dropdown-item d-flex align-items-center"
                    href="users-profile.html"
                >
                    <i className="bi bi-gear"></i>
                    <span>Account Settings</span>
                </a>
            </li>
            <li>
                <hr className="dropdown-divider" />
            </li>

            <li>
                <a
                    className="dropdown-item d-flex align-items-center"
                    href="pages-faq.html"
                >
                    <i className="bi bi-question-circle"></i>
                    <span>Need Help?</span>
                </a>
            </li>
            <li>
                <hr className="dropdown-divider" />
            </li>*/}
            <li>
                <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={logout}
                >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Sign Out</span>
                </button>
            </li>
        </ul>
    </li>

  )
}

export default NavAvatar