import React from "react";
import Moon from './Moon.svg?react';
import Sun from './Sun.svg?react';
import "./DarkMode.css";

const DarkMode = () => {
    const setDarkMode = () => {
        document.querySelector("body").setAttribute("data-bs-theme", "dark");
    }

    const setLightMode = () => {
        document.querySelector("body").setAttribute("data-bs-theme", "light");
    }

    const toggleTheme = (e) => {
        if (e.target.checked) setDarkMode();
        else setLightMode();
    }

    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                onChange={toggleTheme}
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
    );
};

export default DarkMode;
