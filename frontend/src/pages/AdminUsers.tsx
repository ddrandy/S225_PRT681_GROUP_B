import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useIsAdmin } from "../auth";

type Row = { id: string; email: string; userName: string };

export default function AdminUsers() {
  const isAdmin = useIsAdmin();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => { if (!isAdmin) return;
    api.listUsers().then(r => setRows(r.data));
  }, [isAdmin]);

  if (!isAdmin) return <div className="p-4">Forbidden (Admin only)</div>;

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="text-xl font-bold mb-4">Users</h1>
      <table className="w-full text-sm">
        <thead><tr className="text-left"><th>Email</th><th>Username</th></tr></thead>
        <tbody>
          {rows.map(u => (
            <tr key={u.id} className="border-t">
              <td>{u.email}</td><td>{u.userName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
