export type Role = 'ADMIN' | 'STORE_OWNER' | 'NORMAL_USER';

export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  role: Role;
  createdAt?: string;
  storeRating?: number | null;
}

export interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  userRating?: { id: number; value: number } | null;
}

export interface AdminStats {
  users: number;
  stores: number;
  ratings: number;
}

export interface StoreDashboard {
  storeId: number;
  storeName: string;
  averageRating: number;
  totalRatings: number;
  raters: { user: { id: number; name: string; email: string }; rating: number; submittedAt: string }[];
}
