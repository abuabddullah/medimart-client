export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  status: "active" | "inactive";
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  status: "active" | "inactive";
}

export interface AuthState {
  user: UserType | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
