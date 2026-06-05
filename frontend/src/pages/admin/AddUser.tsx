import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import Navbar from '../../components/Navbar';

export default function AddUser() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (form.name.length < 20 || form.name.length > 60) errs.name = 'Name must be 20-60 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(form.password)) errs.password = 'Password must be 8-16 chars, 1 uppercase, 1 special character';
    if (form.address.length > 400) errs.address = 'Address must be max 400 characters';
    if (!form.address) errs.address = 'Address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/admin/users', form);
      toast.success('User created');
      navigate('/admin/users');
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
        <Button variant="outline" className="mb-4" onClick={() => navigate('/admin/users')}>&#8592; Back</Button>
        <Card>
          <CardHeader><CardTitle>Add User</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name (20-60 chars)</Label>
                <Input value={form.name} onChange={set('name')} required />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={set('email')} required />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={form.password} onChange={set('password')} required />
                <p className="text-xs text-gray-500">8-16 chars, 1 uppercase, 1 special character</p>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label>Address (max 400 chars)</Label>
                <Input value={form.address} onChange={set('address')} required />
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL_USER">Normal User</SelectItem>
                    <SelectItem value="STORE_OWNER">Store Owner</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create User'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
