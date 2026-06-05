import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Store } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import Navbar from '../../components/Navbar';

export default function UserStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [ratingInputs, setRatingInputs] = useState<Record<number, string>>({});

  const load = () => {
    const params = new URLSearchParams();
    if (filters.name) params.set('name', filters.name);
    if (filters.address) params.set('address', filters.address);
    api.get(`/stores?${params}`).then(r => setStores(r.data));
  };

  useEffect(() => { load(); }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilters(f => ({ ...f, [k]: e.target.value }));

  const handleRate = async (store: Store) => {
    const value = parseInt(ratingInputs[store.id] || '');
    if (!value || value < 1 || value > 5) {
      toast.error('Rating must be 1-5');
      return;
    }
    try {
      if (store.userRating) {
        await api.patch(`/ratings/${store.userRating.id}`, { value });
        toast.success('Rating updated');
      } else {
        await api.post('/ratings', { storeId: store.id, value });
        toast.success('Rating submitted');
      }
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">All Stores</h1>
        <div className="flex gap-2 mb-6">
          <Input placeholder="Search by name" value={filters.name} onChange={set('name')} />
          <Input placeholder="Search by address" value={filters.address} onChange={set('address')} />
          <Button onClick={load}>Search</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.map(store => (
            <Card key={store.id}>
              <CardHeader>
                <CardTitle className="text-lg">{store.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">{store.address}</p>
                <p className="text-sm text-gray-600">{store.email}</p>
                <p className="font-semibold">Avg: {store.averageRating.toFixed(2)} &#9733;</p>
                {store.userRating && (
                  <Badge variant="outline">Your rating: {store.userRating.value} &#9733;</Badge>
                )}
                <div className="flex gap-2 pt-2">
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    placeholder="1-5"
                    className="w-20"
                    value={ratingInputs[store.id] || ''}
                    onChange={e => setRatingInputs(r => ({ ...r, [store.id]: e.target.value }))}
                  />
                  <Button size="sm" onClick={() => handleRate(store)}>
                    {store.userRating ? 'Update Rating' : 'Rate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
