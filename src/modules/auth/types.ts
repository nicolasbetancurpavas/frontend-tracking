export type Role = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export type UserVM = {
  id: number;
  name: string;
  email: string;
  rol: Role;
};

export const toUser = (vm: UserVM): User => ({
  id: String(vm.id), // normaliza a string
  name: vm.name,
  email: vm.email,
  role: vm.rol,
});

export type RegisterDTO = { name: string; email: string; password: string };
export type LoginDTO = { email: string; password: string };
