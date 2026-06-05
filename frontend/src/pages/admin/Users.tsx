import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { User } from '../../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import Navbar from '../../components/Navbar';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  const load = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    api.get(`/admin/users?${params}`).then(r => setUsers(r.data));
  };

  useEffect(() => { load(); }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilters(f => ({ ...f, [k]: e.target.value }));

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  useEffect(() => { load(); }, [sortBy, sortOrder]);

  const sortIcon = (field: string) => {
    if (sortBy !== field) return ' ↕';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
          <Button onClick={() => navigate('/admin/users/new')}>Add User</Button>
        </div>
        <div className="flex gap-2 mb-4">
          <Input placeholder="Name" value={filters.name} onChange={set('name')} />
          <Input placeholder="Email" value={filters.email} onChange={set('email')} />
          <Input placeholder="Address" value={filters.address} onChange={set('address')} />
          <Input placeholder="Role" value={filters.role} onChange={set('role')} />
          <Button onClick={load}>Search</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('name')}>Name{sortIcon('name')}</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('email')}>Email{sortIcon('email')}</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('address')}>Address{sortIcon('address')}</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.address}</TableCell>
                <TableCell><Badge>{u.role}</Badge></TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/admin/users/${u.id}`)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
