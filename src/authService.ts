import { User, AuthState } from './authTypes';
import { hashPassword, verifyPassword } from './passwordUtils';

const USERS_KEY = 'jeb_users';
const AUTH_KEY = 'jeb_auth';

export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    // Return empty array - setup page will create users
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

export async function resetPassword(email: string, newPassword: string): Promise<boolean> {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    return false;
  }
  
  // Hash the new password
  const hashedPassword = await hashPassword(newPassword);
  users[userIndex].password = hashedPassword;
  
  saveUsers(users);
  return true;
}

export function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export function findUserByEmail(email: string): User | null {
  const users = getUsers();
  return users.find(u => u.email === email) || null;
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

export function isCustomer(): boolean {
  const user = getCurrentUser();
  return user?.role === 'customer';
}
