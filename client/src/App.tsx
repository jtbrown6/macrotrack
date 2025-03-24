import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DailyLogPage from './pages/DailyLogPage';
import FoodDatabasePage from './pages/FoodDatabasePage';
import SettingsPage from './pages/SettingsPage';
import './styles/Layout.css';
import './styles/responsiveTable.css';
import './styles/nutritionTable.css';
import './styles/dailyEntry.css';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/daily/:date" element={<DailyLogPage />} />
          <Route path="/daily" element={<Navigate to={`/daily/${new Date().toISOString().split('T')[0]}`} />} />
          <Route path="/foods" element={<FoodDatabasePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
