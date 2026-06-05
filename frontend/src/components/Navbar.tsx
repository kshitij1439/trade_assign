import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goHome = () => {
    if (user?.role === 'ADMIN') navigate('/admin');
    else if (user?.role === 'STORE_OWNER') navigate('/owner');
    else navigate('/stores');
  };

  return (
    <nav className="bg-white border-b px-6 py-3 flex justify-between items-center">
      <span className="font-semibold text-lg cursor-pointer" onClick={goHome}>RateMyStore</span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.name} ({user?.role})</span>
        <Button variant="outline" size="sm" onClick={() => navigate('/change-password')}>Change Password</Button>
        <Button variant="destructive" size="sm" onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  );
}
