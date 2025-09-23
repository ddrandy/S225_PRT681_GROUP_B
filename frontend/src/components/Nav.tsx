import { Link, NavLink } from "react-router-dom";
import { useAuth, useIsAdmin } from "../auth";

export default function Nav() {
  const { email, logout } = useAuth();
  const isAdmin = useIsAdmin();
  return (
    <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-6xl p-3 flex items-center gap-5">
        <Link to="/" className="font-bold">NT Events</Link>
        <nav className="flex gap-4 text-sm">
          <NavLink to="/" className={({ isActive }) => isActive ? "font-semibold" : ""}>Home</NavLink>
          <NavLink to="/events" className={({ isActive }) => isActive ? "font-semibold" : ""}>Events</NavLink>
          {isAdmin && <NavLink to="/admin" className={({ isActive }) => isActive ? "font-semibold" : ""}>Admin</NavLink>}
          {email && <NavLink to="/me" className={({ isActive }) => isActive ? "font-semibold" : ""}>My Dashboard</NavLink>}
        </nav>
        <div className="ml-auto text-sm flex items-center gap-3">
          {email ? (<>
            <span className="opacity-70">{email}</span>
            <button onClick={logout} className="underline">Logout</button>
          </>) : (
            <Link className="underline" to="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
