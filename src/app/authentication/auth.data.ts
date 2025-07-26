export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserAuthenticatedData {
  user: UserData;
  personal_access_token: string;
  refresh_token: string;
}

export interface UserData {
  id: string;
  full_name: string;
  email: string;
}
