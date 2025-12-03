// src/routes/PublicOnlyRoute.tsx
import { Navigate } from "react-router-dom";
import { AppStorageService } from "../lib/AppStorageService";
import type { ReactNode } from "react";

export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const user = AppStorageService.get("user"); 
  if (user) return <Navigate to="/home" replace />;
  return children;
}