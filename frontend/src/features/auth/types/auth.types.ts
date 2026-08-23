export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type AuthSession = {
  user: User;
  accessToken: string;
};
