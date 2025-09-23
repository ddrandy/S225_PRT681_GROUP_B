import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, type EventDto } from "../lib/api";

export function EventsList() {
  const [sp, setSp] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<EventDto[]>([]);
  const q = sp.get("q") ?? "";

  useEffect(() => {
    setLoading(true);
    api.listEvents(q, 1, 24)
      .then(r => setRows(r.data))
      .finally(() => setLoading(false));
  }, [q]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    setSp({ q: (fd.get("q") as string) ?? "" });
  }

  return (
    <main className="mx-auto max-w-6xl p-6 grid gap-4">
      <h1 className="text-2xl font-bold">Events</h1>
      <form onSubmit={onSearch} className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search Darwin…" className="border rounded px-3 py-2 flex-1" />
        <button className="bg-black text-white rounded px-4 py-2">Search</button>
      </form>
      {loading && <div>Loading…</div>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(e => (
          <Link key={e.id} to={`/events/${e.id}`} className="border rounded-xl p-4 bg-white hover:shadow">
            <div className="text-xs opacity-60 mb-1">{new Date(e.startTime).toLocaleString()} · {e.suburb}</div>
            <h3 className="font-semibold line-clamp-1">{e.title}</h3>
            {e.description && <p className="text-sm opacity-80 mt-1 line-clamp-2">{e.description}</p>}
          </Link>
        ))}
      </div>
    </main>
  );
}
