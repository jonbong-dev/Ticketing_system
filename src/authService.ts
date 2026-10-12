import { User, AuthState } from './authTypes';
import { hashPassword, verifyPassword } from './passwordUtils';

const USERS_KEY = 'jeb_users';
const AUTH_KEY = 'jeb_auth';

// Pre-hashed passwords for default users
// Admin password: admin123 -> SHA-256 hash
const DEFAULT_ADMIN_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

// Initialize with default admin and sample customers
async function initializeUsers(): Promise<User[]> {
  // Hash the default customer password
  const customerPasswordHash = await hashPassword('customer123');
  
  const defaultUsers: User[] = [
    {
      id: 'admin-1',
      email: 'admin@jebinnovations.sg',
      password: DEFAULT_ADMIN_HASH,
      name: 'JEB Admin',
      role: 'admin',
    },
    {
      id: 'customer-1',
      email: 'customer@example.com',
      password: customerPasswordHash,
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
    // Initialize with defaults (async, but we'll handle it)
    initializeUsers().then(users => {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    });
    return [];
  }
  return JSON.parse(data);
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function login(email: string, password: string): Promise<User | null> {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return null;
  }
  
  // Verify password
  const isValid = await verifyPassword(password, user.password);
  
  if (isValid) {
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

export async function registerCustomer(userData: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  company?: string;
}): Promise<User | null> {
  const users = getUsers();
  
  // Check if email already exists
  if (users.find(u => u.email === userData.email)) {
    return null;
  }
  
  // Hash the password
  const hashedPassword = await hashPassword(userData.password);
  
  const newUser: User = {
    id: `customer-${Date.now()}`,
    email: userData.email,
    password: hashedPassword,
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
