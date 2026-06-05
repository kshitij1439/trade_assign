import { useEffect, useState } from 'react';
import api from '../../api/client';
import { StoreDashboard } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import Navbar from '../../components/Navbar';

export default function OwnerDashboard() {
  const [data, setData] = useState<StoreDashboard | null>(null);

  useEffect(() => {
    api.get('/store-owner/dashboard').then(r => setData(r.data));
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">{data.storeName}</h1>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card><CardHeader><CardTitle>Average Rating</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{data.averageRating.toFixed(2)} &#9733;</p></CardContent></Card>
          <Card><CardHeader><CardTitle>Total Ratings</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold">{data.totalRatings}</p></CardContent></Card>
        </div>
        <Card>
          <CardHeader><CardTitle>Ratings by Users</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.raters.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.user.name}</TableCell>
                    <TableCell>{r.user.email}</TableCell>
                    <TableCell>{r.rating} &#9733;</TableCell>
                    <TableCell>{new Date(r.submittedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
