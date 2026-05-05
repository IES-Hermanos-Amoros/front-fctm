import React from 'react';
import { Link } from "react-router-dom";
//import './logo.css';
const curso = import.meta.env.VITE_CURSO;


function Logo () {
    const handleToggleSideBar = () => {
        document.body.classList.toggle('toggle-sidebar');
    };

    return (
        <div className="d-flex align-items-center justify-content-between">
            {/*<a href="/" className="logo d-flex align-items-center">
                <img src="" alt="" />
                <span className="d-none d-lg-block">F.E. Manager {curso}</span>
            </a>*/}
            <div className="logo d-flex align-items-center">
                <span className="logo-text">
                    <span className="logo-accent">F.E.</span>
                    <span className="logo-accent">Manager</span>
                    <span className="logo-badge">{curso}</span>
                </span>
            </div>
            <i
                className="bi bi-list toggle-sidebar-btn"
                onClick={handleToggleSideBar}
            ></i>
        </div>
    );
}

export default Logo;