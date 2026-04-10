import React from 'react';
import './sideBar.css';
import { NavLink } from 'react-router-dom'
import navList from '../data/navItem';
import NavItem from './NavItem';
import useUserStore from '../store/userStore'; // Importamos el store

function SideBar() {

    const user = useUserStore(state => state.user);
    const userRole = user?.user?.profile;
    //console.log("USER ROLE: ", userRole)
    // --- LÓGICA DE FILTRADO DEL MENÚ PRINCIPAL ---
    const filteredNavList = navList.filter(nav => {
        
        // Si el rol es EMPRESA, definimos qué rutas NO puede ver
        if (userRole === 'EMPRESA') {
            const forbiddenPaths = ['/companies','/joboffers']; 
            return !forbiddenPaths.includes(nav.path);
        }

        // Si el rol es ALUMNO, definimos qué rutas NO puede ver
        if (userRole === 'ALUMNO') {
            const forbiddenPaths = ['/students'];
            return !forbiddenPaths.includes(nav.path);
        }

        // El ADMINISTRADOR y PROFESOR ven todo por defecto (true)
        return true;
    });

return (
    <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
            {/*<li className="nav-item">
                <a className="nav-link" href="/">
                    <i className="bi bi-grid"></i>
                    <span>Panel de Control</span>
                </a>
            </li>*/}

            <li className='nav-heading'>F.E. Manager</li>

                {/* Renderizamos solo lo permitido */}
                {filteredNavList.map(nav => (
                <NavItem key={nav._id} nav={nav}/>
                ))}

                {/*navList.map(nav=>(
                    <NavItem key={nav._id} nav={nav}/>
                ))*/}

            {/* 🛡️ SECCIÓN RESTRINGIDA: Solo ADMINISTRADOR */}
            {userRole === 'ADMINISTRADOR' && (
            <>

            <li className='nav-heading'>Administración</li>
            <li className="nav-item">
                <a
                    className="nav-link collapsed"
                    data-bs-target="#components-nav"
                    data-bs-toggle="collapse"
                    href="#"
                >
                    <i className="bi bi-menu-button-wide"></i>
                    <span>Sincronización con SAO</span>
                    <i className="bi bi-chevron-down ms-auto"></i>
                </a>

                <ul
                    id="components-nav"
                    className="nav-content collapse"
                    data-bs-parent="#sidebar-nav"
                >
                    <li>                       
                        <NavLink
                                to="/sinc/profesores">
                                
                            <i className="bi bi-circle"></i>
                            <span>Admin/Profesorado</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/sinc/alumnos">
                            <i className="bi bi-circle"></i>
                            <span>Alumnado</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/sinc/empresas">
                            <i className="bi bi-circle"></i>
                            <span>Empresas</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/sinc/fcts">
                            <i className="bi bi-circle"></i>
                            <span>FCTs</span>
                        </NavLink>
                    </li>
                </ul>
            </li>
            <li className="nav-item">
                <a
                    className="nav-link collapsed"
                    data-bs-target="#components-nav-validations"
                    data-bs-toggle="collapse"
                    href="#"
                >
                    <i className="bi bi-menu-button-wide"></i>
                    <span>Validaciones</span>
                    <i className="bi bi-chevron-down ms-auto"></i>
                </a>

                <ul
                    id="components-nav-validations"
                    className="nav-content collapse"
                    data-bs-parent="#sidebar-nav"
                >
                    <li>                       
                        <NavLink
                                to="/administrators/validate/reviews">
                                
                            <i className="bi bi-circle"></i>
                            <span>Reseñas</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/administrators/validate/skills">
                            <i className="bi bi-circle"></i>
                            <span>Aptitudes</span>
                        </NavLink>
                    </li>
                </ul>
            </li>

           </>)}

           
        </ul>
    </aside>
)
}

export default SideBar