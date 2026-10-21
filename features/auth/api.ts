import { useMockDbStore } from '@/stores/mock-db-store';
import { useSessionStore } from '@/stores/session-store';
import type { User } from '@/types';
import type { LoginFormData, RegisterFormData } from './schemas';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginApi(data: LoginFormData): Promise<{ success: boolean; user?: User; error?: string }> {
  await delay();
  const users = useMockDbStore.getState().users;
  const user = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());

  if (!user) {
    return { success: false, error: 'Invalid email or password.' };
  }

  // Password check: in mock data all passwords are 'password' (or any non-empty input for test users)
  if (data.password !== 'password' && data.password.length < 4) {
    return { success: false, error: 'Invalid email or password.' };
  }

  if (!user.is_active) {
    return { success: false, error: 'This account has been deactivated. Please contact support.' };
  }

  useSessionStore.getState().login(user);
  return { success: true, user };
}

export async function registerApi(data: RegisterFormData): Promise<{ success: boolean; user?: User; error?: string }> {
  await delay();
  const existing = useMockDbStore.getState().users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
  if (existing) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const newUser = useMockDbStore.getState().createUser({
    name: data.name,
    email: data.email,
    role: 'customer',
    is_active: true,
  });

  useSessionStore.getState().login(newUser);
  return { success: true, user: newUser };
}

export async function logoutApi(): Promise<void> {
  await delay(50);
  useSessionStore.getState().logout();
}
