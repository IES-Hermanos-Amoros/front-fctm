// src/routes/AppRouter.jsx
import { Routes, Route } from 'react-router-dom'

import Home from '../components/Dashboard'
import ListDummy from '../views/Dummy/ListDummy'
import ListDocuments from '../views/Documents/ListDocuments'
import ListJobOffers from "../views/JobOffers/ListJobOffers"
import NotFound from '../views/NotFound'
import ShowDocument from '../views/Documents/ShowDocument'
import ShowDummy from "../views/Dummy/ShowDummy"
import ShowStudent from "../views/Students/ShowStudent"
import ShowCompany from "../views/Companies/ShowCompany"
import ShowJobOffer from "../views/JobOffers/ShowJobOffer"
import NewDummy from '../views/Dummy/NewDummy'
import ListCompaniesSAO from '../views/SAOSinc/Companies/ListCompaniesSAO'
import ListStudentsSAO from '../views/SAOSinc/Students/ListStudentsSAO'
import ListTeachersSAO from '../views/SAOSinc/Teachers/ListTeachersSAO'
import ListFctsSAO from '../views/SAOSinc/Fcts/ListFctsSAO'
import NewJobOffer from '../views/JobOffers/NewJobOffer'
import ListStudents from '../views/Students/ListStudents'
import ListCompanies from '../views/Companies/ListCompanies'
import ListFcts from '../views/Fcts/ListFcts'
import VerifyEmailPage from '../views/Auth/VerifyEmailPage'
import ShowAdmin from '../views/Administrators/ShowAdmin'
import ShowTeacher from '../views/Teachers/ShowTeacher'


import ValidateReviews from '../views/Administrators/ValidateReviews'
import ValidateSkills from '../views/Administrators/ValidateSkills'

// Importa más vistas...

export default function AppRouter() {
  return (
    <Routes>

      <Route path="/dashboard" element={<Home />} />

      {/* Rutas de autenticación */}
      {/*<Route path="/" element={<Login />} />
      <Route path="/auth/password-setup" element={<PasswordSetup />} />*/}


      <Route path="/documents" element={<ListDocuments />} />
      <Route path="/documents/:id" element={<ShowDocument />} />
      <Route path="/joboffers" element={<ListJobOffers />} />
      <Route path="/joboffers/new" element={<NewJobOffer />} />
      <Route path="/joboffers/:id" element={<ShowJobOffer />} />
      <Route path="/companies" element={<ListCompanies />} />
      <Route path="/companies/:id" element={<ShowCompany />} />
      <Route path="/administrators/:id" element={<ShowAdmin />} />
      <Route path="/administrators/validate/reviews" element={<ValidateReviews />} />
      <Route path="/administrators/validate/skills" element={<ValidateSkills />} />

      <Route path="/students" element={<ListStudents />} />
      <Route path="/students/:id" element={<ShowStudent />} />
      <Route path="/fcts" element={<ListFcts />} />

      <Route path="/teachers/:id" element={<ShowTeacher />} />
  

      <Route path="/sinc/empresas" element={<ListCompaniesSAO />} />
      <Route path="/sinc/alumnos" element={<ListStudentsSAO />} />
      <Route path="/sinc/profesores" element={<ListTeachersSAO />} />
      <Route path="/sinc/fcts" element={<ListFctsSAO />} />

      <Route path="/dummy" element={<ListDummy />} />
      <Route path="/dummy/new" element={<NewDummy />} />
      <Route path="/dummy/:id" element={<ShowDummy />} />

      {/* Más rutas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
