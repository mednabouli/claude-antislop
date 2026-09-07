export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'user' | 'admin' | 'moderator';

export interface CreateUserInput {
  name: string;
  email: string;
  role?: UserRole;
}

export interface UpdateUserInput extends Partial<Omit<CreateUserInput, 'role'>> {
  role?: UserRole;
  active?: boolean;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
}
