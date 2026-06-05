import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { AdminStats } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Navbar from '../../components/Navbar';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats && (
            <>
              <Card><CardHeader><CardTitle>Total Users</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{stats.users}</p></CardContent></Card>
              <Card><CardHeader><CardTitle>Total Stores</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{stats.stores}</p></CardContent></Card>
              <Card><CardHeader><CardTitle>Total Ratings</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{stats.ratings}</p></CardContent></Card>
            </>
          )}
        </div>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/admin/users')}>Manage Users</Button>
          <Button onClick={() => navigate('/admin/stores')}>Manage Stores</Button>
          <Button onClick={() => navigate('/admin/users/new')}>Add User</Button>
          <Button onClick={() => navigate('/admin/stores/new')}>Add Store</Button>
        </div>
      </div>
    </div>
  );
}
