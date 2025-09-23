import { useState } from "react";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";

export function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try { await login(email, password); nav("/"); }
    catch { alert("Login failed"); }
  }

  return (
    <main className="mx-auto max-w-sm p-6 grid gap-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-black text-white rounded px-4 py-2">Login</button>
      </form>
    </main>
  );
}
