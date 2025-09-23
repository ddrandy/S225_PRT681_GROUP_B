import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useIsAdmin } from "../auth";

export function AdminDashboard() {
  const isAdmin = useIsAdmin();
  const [title, setTitle] = useState("");
  const [suburb, setSuburb] = useState("");
  const [address, setAddress] = useState("");
  const [venueName, setVenue] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => { }, []);
  if (!isAdmin) return <main className="p-6">Forbidden (Admin only)</main>;

  async function create() {
    try {
      await api.createEvent({
        title, suburb, address, venueName,
        startTime: new Date(start).toISOString(),
        endTime: new Date(end).toISOString(),
        category: 0,
      });
      alert("Created");
      setTitle(""); setSuburb(""); setAddress(""); setVenue(""); setStart(""); setEnd("");
    } catch { alert("Create failed"); }
  }

  return (
    <main className="mx-auto max-w-4xl p-6 grid gap-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <section className="border rounded-xl p-4 bg-white">
        <h2 className="font-semibold mb-2">Create Event</h2>
        <div className="grid gap-2">
          <input className="border rounded px-3 py-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <div className="grid sm:grid-cols-2 gap-2">
            <input className="border rounded px-3 py-2" placeholder="Suburb" value={suburb} onChange={e => setSuburb(e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Venue" value={venueName} onChange={e => setVenue(e.target.value)} />
          </div>
          <input className="border rounded px-3 py-2" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
          <div className="grid sm:grid-cols-2 gap-2">
            <input className="border rounded px-3 py-2" type="datetime-local" value={start} onChange={e => setStart(e.target.value)} />
            <input className="border rounded px-3 py-2" type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} />
          </div>
          <button onClick={create} className="bg-black text-white rounded px-4 py-2 w-fit">Create</button>
        </div>
      </section>
    </main>
  );
}