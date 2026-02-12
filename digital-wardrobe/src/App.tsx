import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import BottomNav from './components/BottomNav';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { PublicRoute } from './components/layout/PublicRoute';
import { AuthProvider } from './context/AuthContext';
import AddItemPage from './pages/AddItemPage';
import AddOutfitPage from './pages/AddOutfitPage';
import AssistantPage from './pages/AssistantPage';
import DataImportPage from './pages/DataImportPage';
import DayOutfitsPage from './pages/DayOutfitsPage';
import EditBodyStatsPage from './pages/EditBodyStatsPage';
import EditItemPage from './pages/EditItemPage';
import EditOutfitPage from './pages/EditOutfitPage';
import EditProfilePage from './pages/EditProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ItemDetailPage from './pages/ItemDetailPage';
import LoginPage from './pages/LoginPage';
import OutfitPlanPage from './pages/OutfitPlanPage';
import RelatedOutfitsPage from './pages/RelatedOutfitsPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SettingsPage from './pages/SettingsPage';
import StatsPage from './pages/StatsPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import WardrobePage from './pages/WardrobePage';

import type React from 'react';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  // Hide bottom nav on specific pages
  const hideNavRoutes = [
    '/add',
    '/import',
    '/item/',
    '/related/',
    '/add-outfit',
    '/outfit/edit/',
    '/item/edit/',
    '/plan/day/',
  ];
  const showNav = !hideNavRoutes.some((path) => location.pathname.startsWith(path));

  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-background-light dark:bg-background-dark shadow-2xl relative flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
      {showNav && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* 公开路由 */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

            {/* 受保护路由 */}
            <Route path="/" element={<ProtectedRoute><WardrobePage /></ProtectedRoute>} />
            <Route path="/add" element={<ProtectedRoute><AddItemPage /></ProtectedRoute>} />
            <Route path="/import" element={<ProtectedRoute><DataImportPage /></ProtectedRoute>} />
            <Route path="/assistant" element={<ProtectedRoute><AssistantPage /></ProtectedRoute>} />
            <Route path="/plan" element={<ProtectedRoute><OutfitPlanPage /></ProtectedRoute>} />
            <Route path="/plan/day/:date" element={<ProtectedRoute><DayOutfitsPage /></ProtectedRoute>} />
            <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/item/:id" element={<ProtectedRoute><ItemDetailPage /></ProtectedRoute>} />
            <Route path="/related/:id" element={<ProtectedRoute><RelatedOutfitsPage /></ProtectedRoute>} />
            <Route path="/add-outfit" element={<ProtectedRoute><AddOutfitPage /></ProtectedRoute>} />
            <Route path="/outfit/edit/:id" element={<ProtectedRoute><EditOutfitPage /></ProtectedRoute>} />
            <Route path="/item/edit/:id" element={<ProtectedRoute><EditItemPage /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
            <Route path="/profile/body-stats" element={<ProtectedRoute><EditBodyStatsPage /></ProtectedRoute>} />
            <Route path="/profile/password" element={<ProtectedRoute><UpdatePasswordPage /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;
