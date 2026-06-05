import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import UserDetail from './pages/admin/UserDetail';
import AddUser from './pages/admin/AddUser';
import AdminStores from './pages/admin/Stores';
import AddStore from './pages/admin/AddStore';

import OwnerDashboard from './pages/owner/Dashboard';
import UserStores from './pages/user/Stores';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/users/new" element={<ProtectedRoute role="ADMIN"><AddUser /></ProtectedRoute>} />
          <Route path="/admin/users/:id" element={<ProtectedRoute role="ADMIN"><UserDetail /></ProtectedRoute>} />
          <Route path="/admin/stores" element={<ProtectedRoute role="ADMIN"><AdminStores /></ProtectedRoute>} />
          <Route path="/admin/stores/new" element={<ProtectedRoute role="ADMIN"><AddStore /></ProtectedRoute>} />

          <Route path="/owner" element={<ProtectedRoute role="STORE_OWNER"><OwnerDashboard /></ProtectedRoute>} />

          <Route path="/stores" element={<ProtectedRoute role="NORMAL_USER"><UserStores /></ProtectedRoute>} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
