export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  avatar?: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {}
