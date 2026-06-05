import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { Store } from '../../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import Navbar from '../../components/Navbar';

export default function AdminStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  const load = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    api.get(`/admin/stores?${params}`).then(r => setStores(r.data));
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
          <h1 className="text-2xl font-bold">Stores</h1>
          <Button onClick={() => navigate('/admin/stores/new')}>Add Store</Button>
        </div>
        <div className="flex gap-2 mb-4">
          <Input placeholder="Name" value={filters.name} onChange={set('name')} />
          <Input placeholder="Email" value={filters.email} onChange={set('email')} />
          <Input placeholder="Address" value={filters.address} onChange={set('address')} />
          <Button onClick={load}>Search</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('name')}>Name{sortIcon('name')}</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('email')}>Email{sortIcon('email')}</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('address')}>Address{sortIcon('address')}</TableHead>
              <TableHead>Avg Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map(s => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.address}</TableCell>
                <TableCell>{s.averageRating ? s.averageRating.toFixed(2) + ' ★' : 'No ratings'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
