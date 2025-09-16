import { Link } from "react-router-dom";
import { useAuth, useIsAdmin } from "../auth";

export default function Nav() {
  const { email, logout } = useAuth();
  const isAdmin = useIsAdmin();
  return (
    <header className="border-b">
      <div className="mx-auto max-w-5xl p-3 flex items-center gap-4">
        <Link to="/" className="font-bold">NT Events</Link>
        <nav className="flex gap-3 text-sm">
          <Link to="/">Browse</Link>
          {isAdmin && <Link to="/admin/events">Admin Events</Link>}
          {isAdmin && <Link to="/admin/users">Users</Link>}
        </nav>
        <div className="ml-auto text-sm flex items-center gap-3">
          {email ? (<><span>{email}</span><button onClick={logout} className="underline">Logout</button></>)
                 : (<Link className="underline" to="/login">Login</Link>)}
        </div>
      </div>
    </header>
  );
}
