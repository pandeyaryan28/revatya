import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { VisionPage } from './pages/VisionPage';
import { CityPage } from './pages/CityPage';
import { CityAtlasPage } from './pages/CityAtlasPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { PartnersPage } from './pages/PartnersPage';
import { JoinPage } from './pages/JoinPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/vision" element={<VisionPage />} />
        <Route path="/city" element={<CityPage />} />
        <Route path="/city-atlas" element={<CityAtlasPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
