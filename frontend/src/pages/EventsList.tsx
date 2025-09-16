import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { EventDto } from "../lib/api";
import { Link } from "react-router-dom";

export default function EventsList() {
  const [q, setQ] = useState("");
  const [data, setData] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setLoading(true);
    api.listEvents(q, 1, 20)
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="text-2xl font-bold mb-4">Darwin Events</h1>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" className="border rounded px-3 py-2 w-full mb-4" />
      {loading && <div>Loading…</div>}
      <div className="grid gap-4 md:grid-cols-2">
        {data.map(e => (
          <Link key={e.id} to={`/events/${e.id}`} className="border rounded-xl p-4 hover:shadow">
            <h3 className="font-semibold">{e.title}</h3>
            <div className="text-sm opacity-70">{new Date(e.startTime).toLocaleString()} · {e.suburb}</div>
            {e.description && <p className="text-sm mt-2 line-clamp-3">{e.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
