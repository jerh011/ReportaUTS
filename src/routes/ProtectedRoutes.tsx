// src/routes/ProtectedRoutes.tsx
import { Navigate } from "react-router-dom";
import { AppStorageService } from "../lib/AppStorageService";
import type { ReactNode } from "react";

export default function ProtectedRoutes({ children }: { children: ReactNode }) {
  const user = AppStorageService.get("user"); // Ya viene parseado ✅
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
