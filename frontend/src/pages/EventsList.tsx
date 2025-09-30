// src/pages/EventsList.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api, type EventDto } from "../lib/api";

import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { process, type State } from "@progress/kendo-data-query";

// Minimal props shape for cell components
type GridCellProps = {
  dataItem: any;
  field?: string;
};

export function EventsList() {
  const [sp, setSp] = useSearchParams();
  const [rows, setRows] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(false);
  const q = sp.get("q") ?? "";

  const [state, setState] = useState<State>({ skip: 0, take: 10, sort: [] });
  const dataResult = useMemo(() => process(rows, state), [rows, state]);

  useEffect(() => {
    setLoading(true);
    api
      .listEvents(q, 1, 100)
      .then((r) => setRows(r.data))
      .finally(() => setLoading(false));
  }, [q]);

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSp({ q: (fd.get("q") as string) ?? "" });
  }

  // --- Custom cells ---
  const TitleCell = (props: GridCellProps) => {
    const item = props.dataItem as EventDto;
    return (
      <td>
        <Link className="text-blue-600 underline" to={`/events/${item.id}`}>
          {item.title}
        </Link>
      </td>
    );
  };

  const VenueCell = (props: GridCellProps) => {
    const item = props.dataItem as EventDto;
    return <td>{item.venueName}</td>;
  };

  const DateCell = (props: GridCellProps) => {
    const field = (props.field || "") as keyof EventDto;
    const raw = (props.dataItem as EventDto)[field] as string | undefined;
    return <td>{raw ? new Date(raw).toLocaleString() : ""}</td>;
  };

  return (
    <main className="mx-auto max-w-6xl p-6 grid gap-4">
      <h1 className="text-2xl font-bold">Events</h1>
      <form onSubmit={onSearch} className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search Darwin…"
          className="border rounded px-3 py-2 flex-1"
        />
        <button className="bg-black text-white rounded px-4 py-2">Search</button>
      </form>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <Grid
          data={dataResult}
          skip={state.skip}
          take={state.take}
          sort={state.sort}
          pageable
          sortable
          onDataStateChange={(e: any) => setState(e.dataState as State)}
          style={{ background: "white" }}
        >
          <Column field="title" title="Title" cells={{ data: TitleCell }} />
          <Column field="suburb" title="Suburb" />
          <Column field="venueName" title="Venue" cells={{ data: VenueCell }} />
          <Column field="startTime" title="Start" cells={{ data: DateCell }} />
          <Column field="endTime" title="End" cells={{ data: DateCell }} />
        </Grid>
      )}
    </main>
  );
}
