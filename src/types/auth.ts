export interface RegisterData {
  email: string;
  password: string;
  optIn?: boolean;
}

export interface LoginData {
  id?: string;
  email: string;
  token?: string;
  role?: string;
  password?: string;
}

export interface LoginResponse {
  data: LoginData;
  message: string;
}
