import { useAuth } from "../auth";

export function UserDashboard() {
  const { email } = useAuth();
  return (
    <main className="mx-auto max-w-4xl p-6 grid gap-4">
      <h1 className="text-2xl font-bold">My Dashboard</h1>
      <p className="opacity-80">Signed in as {email}</p>
      <div className="border rounded-xl p-4 bg-white">(Future) My registrations, favourites…</div>
    </main>
  );
}