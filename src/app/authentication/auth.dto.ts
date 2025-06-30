export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoggedInDTO {
  id: string;
  email: string;
  name: string;
  token: string;
  expiresIn: number;
}
