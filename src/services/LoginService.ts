import { LoginDto } from "../Dtos/LoginDtos";
import { AppStorageService } from "../lib/AppStorageService";

const API_URL = "http://localhost:5276/api/Login";

export const LoginService = {
  async login(data: LoginDto) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del backend:", errorText);
        throw new Error(`Error al iniciar sesión: ${response.status}`);
      }

      const json = await response.json();

      // Guardamos directamente en AppStorageService
      AppStorageService.set("user", json.user);
      AppStorageService.set("role", json.role);
      AppStorageService.set("accessToken", json.accessToken);
      AppStorageService.set("refreshToken", json.refreshToken);
      AppStorageService.set("lastActivity", Date.now());
    } catch (error) {
      throw error;
    }
  },

  // Leer sesión completa
  getSession() {
    const user = AppStorageService.get("user");
    const role = AppStorageService.get("role");
    const accessToken = AppStorageService.get("accessToken");
    const refreshToken = AppStorageService.get("refreshToken");

    if (!user || !role || !accessToken || !refreshToken) return null;

    return { user, role, accessToken, refreshToken };
  },

  // Cerrar sesión

};
