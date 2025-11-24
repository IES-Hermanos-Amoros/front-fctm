// src/routes/AppRouter.jsx
import { Routes, Route } from 'react-router-dom'

import Home from '../components/Dashboard'
import ListDocuments from '../views/Documents/ListDocuments'
import ListJobOffers from "../views/JobOffers/ListJobOffers"
import NotFound from '../views/NotFound'
import ShowDocument from '../views/Documents/ShowDocument'
import ListCompaniesSAO from '../views/SAOSinc/Companies/ListCompaniesSAO'
import ListStudentsSAO from '../views/SAOSinc/Students/ListStudentsSAO'
import ListTeachersSAO from '../views/SAOSinc/Teachers/ListTeachersSAO'
import ListFctsSAO from '../views/SAOSinc/Fcts/ListFctsSAO'

// Importa más vistas...

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/documents" element={<ListDocuments />} />
      <Route path="/documents/:id" element={<ShowDocument />} />
      <Route path="/joboffers" element={<ListJobOffers />} />
      <Route path="/sinc/empresas" element={<ListCompaniesSAO />} />
      <Route path="/sinc/alumnos" element={<ListStudentsSAO />} />
      <Route path="/sinc/profesores" element={<ListTeachersSAO />} />      
      <Route path="/sinc/fcts" element={<ListFctsSAO />} />      

      {/* Más rutas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
