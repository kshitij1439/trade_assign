import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../api/client';
import { addUserSchema, type AddUserInput } from '../../lib/schemas';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import Navbar from '../../components/Navbar';

export default function AddUser() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors } } = useForm<AddUserInput>({
    resolver: zodResolver(addUserSchema),
    defaultValues: { role: 'NORMAL_USER' },
  });

  const onSubmit = async (data: AddUserInput) => {
    setLoading(true);
    try {
      await api.post('/admin/users', data);
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name (20-60 chars)</Label>
                <Input {...register('name')} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" {...register('email')} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" {...register('password')} />
                <p className="text-xs text-gray-500">8-16 chars, 1 uppercase, 1 special character</p>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Address (max 400 chars)</Label>
                <Input {...register('address')} />
                {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NORMAL_USER">Normal User</SelectItem>
                        <SelectItem value="STORE_OWNER">Store Owner</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create User'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
