// src/modules/auth/services/authService.ts
import { authApi, logApi } from "../../../shared/api/api";
import type { LoginDTO, RegisterDTO, UserVM, User } from "../types";
import { toUser } from "../types";

export async function authRegister(dto: RegisterDTO) {
  const { data } = await authApi.post("/register", dto);
  // si necesitas “User” en vez de “UserVM”:
  // return { ...data, data: toUser(data.data as UserVM) };
  return data as { message: string; data: UserVM };
}

export async function authLogin(
  dto: LoginDTO
): Promise<{ token: string; user: User }> {
  const { data } = await authApi.post("/login", dto);
  const token = (data?.accessToken ?? data?.token) as string;
  return { token, user: toUser(data.user) };
}

export async function authValidate() {
  const { data } = await logApi.get("/validate");
  return data as { valid: boolean; payload: unknown };
}
