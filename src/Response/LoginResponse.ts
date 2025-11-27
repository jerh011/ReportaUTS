import { RoleModel } from "../Model/RoleModel";
import { UserModel } from "../Model/UserModel";
export class LoginResponse {
  role?: RoleModel;
  user?: UserModel;
  accessToken?: string;
  refreshToken?: string;
}
