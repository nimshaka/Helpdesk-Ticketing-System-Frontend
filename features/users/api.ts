import { useMockDbStore } from '@/stores/mock-db-store';
import type { User } from '@/types';
import type { UserFormData } from './schemas';

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getUsersApi(): Promise<User[]> {
  await delay();
  return useMockDbStore.getState().users;
}

export async function getActiveAgentsApi(): Promise<User[]> {
  await delay();
  return useMockDbStore.getState().users.filter((u) => u.role === 'agent' && u.is_active);
}

export async function createUserApi(data: UserFormData): Promise<User> {
  await delay();
  return useMockDbStore.getState().createUser({
    name: data.name,
    email: data.email,
    role: data.role,
    is_active: data.is_active,
  });
}

export async function updateUserApi(
  userId: number,
  data: Partial<UserFormData>,
  currentAdminId: number
): Promise<{ success: boolean; message?: string }> {
  await delay();
  return useMockDbStore.getState().updateUser(userId, data, currentAdminId);
}
