import { User, AuthState } from './authTypes';
import { encodePassword, verifyPassword } from './passwordUtils';

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

export function login(email: string, password: string): User | null {
  const users = getUsers();
  
  console.log('Available users:', users);
  console.log('Looking for email:', email);
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.log('User not found');
    return null;
  }
  
  console.log('User found:', user);
  console.log('Stored password hash:', user.password);
  
  // Verify password
  const isValid = verifyPassword(password, user.password);
  
  console.log('Password verification result:', isValid);
  
  if (isValid) {
    const authState: AuthState = {
      isAuthenticated: true,
      user: user,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
    return user;
  }
  
  console.log('Password verification failed');
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
  
  // Encode the password
  const hashedPassword = encodePassword(userData.password);
  
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

export function resetPassword(email: string, newPassword: string): boolean {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    return false;
  }
  
  // Encode the new password
  const hashedPassword = encodePassword(newPassword);
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
