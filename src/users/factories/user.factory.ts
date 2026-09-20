export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export class UserFactory {
  static create(data: CreateUserData): CreateUserData {
    return {
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
    };
  }
}
