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

  static set(key: string, value: any) {
    if (value !== null && typeof value === "object") {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }

  static get(key: string) {
    let valor = localStorage.getItem(key);
    try {
      valor = JSON.parse(valor!);
    } catch (e) {}
    return valor;
  }

  static clearAll() {
    localStorage.clear();
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }
}
