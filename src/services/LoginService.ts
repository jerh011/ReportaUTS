import { LoginDto } from "../Dtos/LoginDtos";
import { AppStorageService } from "../lib/AppStorageService";
import { RegisterUserDto } from "../Dtos/RegisterUserDto ";

const API_URL = import.meta.env.VITE_API_URL;
export const LoginService = {
  async login(data: LoginDto) {
    console.log(data);
    alert(`${API_URL}/api/Login`);
    try {
      const response = await fetch(`${API_URL}/api/Login`, {
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
    console.log(data);
    alert(`${API_URL}/api/Login/RegistrarUsuario`);
    try {
      const response = await fetch(`${API_URL}/api/Login/RegistrarUsuario`, {
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
