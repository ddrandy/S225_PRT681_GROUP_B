import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "./lib/api";

type AuthState = { token: string | null; roles: string[]; email?: string };
type Ctx = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("jwt"));
  const [roles, setRoles] = useState<string[]>([]);
  const [email, setEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!token) return;
    api.me().then(u => {
      setEmail(u.email);
      setRoles(u.roles ? Array.from(u.roles) : []);
    }).catch(() => { /* token maybe invalid */ });
  }, [token]);

  async function login(email: string, password: string) {
    const r = await api.login(email, password);
    setToken(r.token);
    setRoles(r.roles ?? []);
    const me = await api.meWithToken(r.token);
    setEmail(me.email);
  }
  function logout() {
    localStorage.removeItem("jwt");
    setToken(null);
    setRoles([]);
    setEmail(undefined);
  }

  return <AuthCtx.Provider value={{ token, roles, email, login, logout }}>{children}</AuthCtx.Provider>;
}
export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx
};
export const useIsAdmin = () => useAuth().roles.includes("Admin");
