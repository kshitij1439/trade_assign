import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import Navbar from '../../components/Navbar';

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/admin/users/${id}`).then(r => setUser(r.data));
  }, [id]);

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <Button variant="outline" className="mb-4" onClick={() => navigate('/admin/users')}>&#8592; Back</Button>
        <Card>
          <CardHeader><CardTitle>User Detail</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p><span className="font-semibold">Name:</span> {user.name}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Address:</span> {user.address}</p>
            <p><span className="font-semibold">Role:</span> <Badge>{user.role}</Badge></p>
            {user.storeRating !== null && user.storeRating !== undefined && (
              <p><span className="font-semibold">Store Rating:</span> {user.storeRating.toFixed(2)} &#9733;</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
