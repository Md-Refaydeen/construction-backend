import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BaseLayout from './layouts/BaseLayout';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import SiteList from './pages/SiteList';
import SiteAdd from './pages/SiteAdd';
import SiteDetail from './pages/SiteDetail';
import MaterialList from './pages/MaterialList';
import MaterialAdd from './pages/MaterialAdd';
import Dashboard from './pages/Dashboard';
import RoleGuard from './components/RoleGuard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<BaseLayout />}>
              <Route index element={<Dashboard />} />

              <Route path="sites" element={<SiteList />} />
              <Route
                path="sites/new"
                element={
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <SiteAdd />
                  </RoleGuard>
                }
              />
              <Route path="sites/:id" element={<SiteDetail />} />

              <Route path="materials" element={<MaterialList />} />
              <Route
                path="materials/new"
                element={
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <MaterialAdd />
                  </RoleGuard>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
