export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  status: "active" | "inactive";
}

export interface Address {
  city: string;
  postalCode: string;
  country: string;
  address?: string;
}

export interface UserType {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  address: Address;
  phoneNumber?: string;
}
export interface IUserType {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  password?: string;
  role?: "customer" | "admin";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  dateOfBirth?: Date;
  status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthState {
  user: UserType | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
export interface IAuthState {
  user: IUserType | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
