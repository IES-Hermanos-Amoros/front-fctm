// src/routes/AppRouter.jsx
import { Routes, Route } from 'react-router-dom'

import Home from '../components/Dashboard'
import ListDummy from '../views/Dummy/ListDummy'
import ListDocuments from '../views/Documents/ListDocuments'
import ListJobOffers from "../views/JobOffers/ListJobOffers"
import NotFound from '../views/NotFound'
import ShowDocument from '../views/Documents/ShowDocument'
import ShowDummy from "../views/Dummy/ShowDummy"
import NewDummy from '../views/Dummy/NewDummy'
import ListCompaniesSAO from '../views/SAOSinc/Companies/ListCompaniesSAO'
import ListStudentsSAO from '../views/SAOSinc/Students/ListStudentsSAO'
import ListTeachersSAO from '../views/SAOSinc/Teachers/ListTeachersSAO'
import ListFctsSAO from '../views/SAOSinc/Fcts/ListFctsSAO'
// quitar estas
import ListCompanies from '../views/Companies/ListCompanies'
import ShowCompany from "../views/Companies/ShowCompany"



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

      <Route path="/dummy" element={<ListDummy />} />
      <Route path="/dummy/new" element={<NewDummy />} />
      <Route path="/dummy/:id" element={<ShowDummy />} />

      // quitar estas
      <Route path="/companies" element={<ListCompanies />} />
      <Route path="/companies/:id" element={<ShowCompany />} />

      {/* Más rutas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
