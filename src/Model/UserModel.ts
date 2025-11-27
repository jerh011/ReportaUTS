import { RoleModel } from "./RoleModel";

export class UserModel {
  username: string = "";
  contrasena: string = "";
  accessToken?: string | null = null; // opcional
  idUsuario: number = 0;
  nombres?: string | null = null; // opcional
  apellidos?: string | null = null; // opcional
  noCel?: string | null = null; // opcional
  createdAt: string = "";
  rol?: RoleModel | null = null; // opcional
  refreshToken?: string | null = null; // opcional
}
