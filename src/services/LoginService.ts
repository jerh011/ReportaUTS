import { LoginDto } from "../Dtos/LoginDtos";
import { AppStorageService } from "../lib/AppStorageService";
import { RegisterUserDto } from "../Dtos/RegisterUserDto ";
import { env } from "../../env";
const API_URL = env.VITE_API_URL;

export const LoginService = {
  async login(data: LoginDto) {
    try {
      const response = await fetch(`${API_URL}/Login`, {
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

  async RegistrarUsuario(data: RegisterUserDto): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/Login/RegistrarUsuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del backend:", errorText);
        return false;
      }

      // El backend devuelve texto ("registro exitoso"), no JSON
      const text = await response.text();
      // console.log("Respuesta del servidor:", text);

      // Si contiene la palabra 'exitoso', asumimos éxito
      return text.toLowerCase().includes("exitoso");
    } catch (error) {
      console.error("Error en RegistrarUsuario:", error);
      return false;
    }
  },
};
