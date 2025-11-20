// src/routes/AppRouter.jsx
import { Routes, Route } from 'react-router-dom'

import Home from '../components/Dashboard'
import ListDocuments from '../views/Documents/ListDocuments'
import ListJobOffers from "../views/JobOffers/ListJobOffers"
import NotFound from '../views/NotFound'
import ShowDocument from '../views/Documents/ShowDocument'
import ListCompaniesSAO from '../views/SAOSinc/Companies/ListCompaniesSAO'
// Importa más vistas...

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/documents" element={<ListDocuments />} />
      <Route path="/documents/:id" element={<ShowDocument />} />
      <Route path="/joboffers" element={<ListJobOffers />} />
      <Route path="/sinc/empresas" element={<ListCompaniesSAO />} />

      {/* Más rutas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
