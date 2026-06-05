import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import Navbar from '../../components/Navbar';

export default function AddStore() {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/users?role=STORE_OWNER').then(r => setOwners(r.data));
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (form.name.length < 20 || form.name.length > 60) errs.name = 'Store name must be 20-60 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.address) errs.address = 'Address is required';
    if (form.address.length > 400) errs.address = 'Address must be max 400 characters';
    if (!form.ownerId) errs.ownerId = 'Please select an owner';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/admin/stores', form);
      toast.success('Store created');
      navigate('/admin/stores');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto p-6">
        <Button variant="outline" className="mb-4" onClick={() => navigate('/admin/stores')}>&#8592; Back</Button>
        <Card>
          <CardHeader><CardTitle>Add Store</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Store Name (20-60 chars)</Label>
                <Input value={form.name} onChange={set('name')} required />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={set('email')} required />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label>Address (max 400 chars)</Label>
                <Input value={form.address} onChange={set('address')} required />
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
              </div>
              <div className="space-y-2">
                <Label>Owner</Label>
                <Select value={form.ownerId} onValueChange={v => setForm(f => ({ ...f, ownerId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select owner" /></SelectTrigger>
                  <SelectContent>
                    {owners.map(o => <SelectItem key={o.id} value={String(o.id)}>{o.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.ownerId && <p className="text-xs text-red-500">{errors.ownerId}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Store'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
