import { LoginResponse } from "../Response/LoginResponse";

export class AppStorageService {
  constructor() {}

  static set login(data: LoginResponse) {
    this.user(data);
    this.lastActivity(Date.now());
  }

  static user(v?: LoginResponse): LoginResponse | undefined {
    return AppStorageService.getSetItem("user", v) || undefined;
  }

  static lastActivity(v?: number): number | undefined {
    return AppStorageService.getSetItem("lastActivity", v) || undefined;
  }

  static getSetItem(k: string, v: any): any {
    if (v) {
      AppStorageService.set(k, v);
    }
    return AppStorageService.get(k);
  }

 static set<T>(key: string, value: T): void {
  try {
    const serialized = typeof value === "object" && value !== null
      ? JSON.stringify(value)
      : String(value);
    
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
}

  static get<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  
  if (value === null) return null;

  // Si ya es un objeto stringificado incorrectamente
  if (value === "[object Object]") {
    console.warn(`Corrupted data in localStorage key "${key}", removing it`);
    localStorage.removeItem(key);
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn(`Error parsing storage key "${key}":`, error);
    localStorage.removeItem(key); 
    return null;
  }
}

  static clearAll() {
    localStorage.clear();
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }
}
