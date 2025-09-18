import React from 'react'
import './mainDashboard.css'
import PageTitle from './PageTitle'
import Dashboard from './Dashboard'
import AppRouter from '../routes/AppRouter'
import { useLocation } from 'react-router-dom'


function MainDashboard() {

  const location = useLocation()
  const pageTitle = getPageTitle(location.pathname)

  function getPageTitle(pathname) {
    const routes = {
      '/': 'Inicio',
      '/users': 'Usuarios',
      '/students': 'Alumnos',
      '/joboffers': 'Ofertas de Trabajo',
      '/documents': 'Documentos',
      '/actions': 'Acciones',
      '/fcts': 'FCTs',
      '/reviews': 'Reseñas',
    }
    return routes[pathname] || 'Panel'
  }

  return (
    <main id='main' className='main'>
        <PageTitle page={pageTitle} />
        <AppRouter />
    </main>
  )
}

export default MainDashboard