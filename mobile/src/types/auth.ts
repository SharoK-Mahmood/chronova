export type UserRole = "customer" | "admin";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};

export type AuthSession = {
  user: User;
  accessToken: string;
};
