// src/pages/EventsList.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api, type EventDto } from "../lib/api";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { process, type State } from "@progress/kendo-data-query";

export function EventsList() {
  const [sp, setSp] = useSearchParams();
  const [rows, setRows] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(false);
  const q = sp.get("q") ?? "";

  // Kendo state
  const [state, setState] = useState<State>({ skip: 0, take: 10, sort: [] });
  const data = useMemo(() => process(rows, state), [rows, state]);

  useEffect(() => {
    setLoading(true);
    api.listEvents(q, 1, 100)
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

      {loading ? <div>Loading…</div> :
        <Grid
          data={data}
          {...state}
          pageable
          sortable
          onDataStateChange={e => setState(e.dataState)}
          style={{ background: "white" }}
        >
          <Column field="title" title="Title" cell={(td) => (
            <td>
              <Link className="text-blue-600 underline" to={`/events/${(td.dataItem as EventDto).id}`}>
                {(td.dataItem as EventDto).title}
              </Link>
            </td>
          )} />
          <Column field="suburb" title="Suburb" />
          <Column field="venueName" title="Venue" />
          <Column field="startTime" title="Start"
            cell={td => <td>{new Date((td.dataItem as EventDto).startTime).toLocaleString()}</td>} />
          <Column field="endTime" title="End"
            cell={td => <td>{new Date((td.dataItem as EventDto).endTime).toLocaleString()}</td>} />
        </Grid>
      }
    </main>
  );
}
