import { User, AuthState } from './authTypes';

const USERS_KEY = 'jeb_users';
const AUTH_KEY = 'jeb_auth';

// Initialize with default admin and sample customers
function initializeUsers(): User[] {
  const defaultUsers: User[] = [
    {
      id: 'admin-1',
      email: 'admin@jebinnovations.sg',
      password: 'admin123',
      name: 'JEB Admin',
      role: 'admin',
    },
    {
      id: 'customer-1',
      email: 'customer@example.com',
      password: 'customer123',
      name: 'John Doe',
      role: 'customer',
      phone: '+65 9123 4567',
      company: 'ABC Corporation',
    },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    return initializeUsers();
  }
  return JSON.parse(data);
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function login(email: string, password: string): User | null {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const authState: AuthState = {
      isAuthenticated: true,
      user: user,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
    return user;
  }
  
  return null;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(AUTH_KEY);
  if (!data) return null;
  
  const authState: AuthState = JSON.parse(data);
  return authState.isAuthenticated ? authState.user : null;
}

export function registerCustomer(userData: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  company?: string;
}): User | null {
  const users = getUsers();
  
  // Check if email already exists
  if (users.find(u => u.email === userData.email)) {
    return null;
  }
  
  const newUser: User = {
    id: `customer-${Date.now()}`,
    email: userData.email,
    password: userData.password,
    name: userData.name,
    role: 'customer',
    phone: userData.phone,
    company: userData.company,
  };
  
  users.push(newUser);
  saveUsers(users);
  
  return newUser;
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

export function isCustomer(): boolean {
  const user = getCurrentUser();
  return user?.role === 'customer';
}
