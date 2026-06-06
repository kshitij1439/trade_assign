import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../api/client';
import { addStoreSchema, type AddStoreInput } from '../../lib/schemas';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import Navbar from '../../components/Navbar';

export default function AddStore() {
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors } } = useForm<AddStoreInput>({
    resolver: zodResolver(addStoreSchema),
  });

  useEffect(() => {
    api.get('/admin/users?role=STORE_OWNER').then(r => setOwners(r.data));
  }, []);

  const onSubmit = async (data: AddStoreInput) => {
    setLoading(true);
    try {
      await api.post('/admin/stores', data);
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Store Name (20-60 chars)</Label>
                <Input {...register('name')} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" {...register('email')} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Address (max 400 chars)</Label>
                <Input {...register('address')} />
                {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Owner</Label>
                <Controller
                  name="ownerId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Select owner" /></SelectTrigger>
                      <SelectContent>
                        {owners.map(o => <SelectItem key={o.id} value={String(o.id)}>{o.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.ownerId && <p className="text-xs text-red-500">{errors.ownerId.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Store'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
