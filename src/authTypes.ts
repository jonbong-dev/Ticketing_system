export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'admin';
  phone?: string;
  company?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
