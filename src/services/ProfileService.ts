import { AppStorageService } from "../lib/AppStorageService";
import type { UserModel } from "../Model/UserModel";
export const ProfileService = {
  async getProfile(): Promise<UserModel | null> {
    const raw = AppStorageService.get("user");

    if (!raw) return null;

    try {
      const user: UserModel = typeof raw === "string" ? JSON.parse(raw) : raw;

      return user;
    } catch {
      return null;
    }
  },

  async logout() {
  
    AppStorageService.clearAll();
  },
};
