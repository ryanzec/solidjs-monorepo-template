export interface AuthenticationToken {
  authenticationToken: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Database {
  authenticationTokens: AuthenticationToken[];
  users: User[];
}
