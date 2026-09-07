import { User, CreateUserInput, UpdateUserInput, toUserResponse } from '../models/user.js';

const users: Map<string, User> = new Map();

let idCounter = 1;

function generateId(): string {
  return `user_${idCounter++}`;
}

export async function findAllUsers(): Promise<User[]> {
  return Array.from(users.values());
}

export async function findUserById(id: string): Promise<User | undefined> {
  return users.get(id);
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const allUsers = await findAllUsers();
  return allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const existingUser = await findUserByEmail(input.email);
  
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const now = new Date();
  const user: User = {
    id: generateId(),
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password,
    role: input.role ?? 'user',
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  users.set(user.id, user);
  return user;
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<User> {
  const user = await findUserById(id);
  
  if (!user) {
    throw new Error('User not found');
  }

  if (input.email) {
    const existingUser = await findUserByEmail(input.email);
    if (existingUser && existingUser.id !== id) {
      throw new Error('User with this email already exists');
    }
  }

  const updatedUser: User = {
    ...user,
    name: input.name ?? user.name,
    email: input.email ? input.email.toLowerCase() : user.email,
    role: input.role ?? user.role,
    active: input.active ?? user.active,
    updatedAt: new Date(),
  };

  users.set(id, updatedUser);
  return updatedUser;
}

export async function deleteUser(id: string): Promise<void> {
  const user = await findUserById(id);
  
  if (!user) {
    throw new Error('User not found');
  }

  users.delete(id);
}

export async function getAllUserResponses() {
  const allUsers = await findAllUsers();
  return allUsers.map(toUserResponse);
}

export async function getUserResponseById(id: string) {
  const user = await findUserById(id);
  return user ? toUserResponse(user) : undefined;
}
