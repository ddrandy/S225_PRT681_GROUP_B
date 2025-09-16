import { useState } from "react";
import { api } from "../lib/api";
import { useIsAdmin } from "../auth";

export default function AdminEvents() {
  const isAdmin = useIsAdmin();
  const [title, setTitle] = useState(""); const [suburb, setSuburb] = useState("");
  const [address, setAddress] = useState(""); const [venueName, setVenue] = useState("");
  const [start, setStart] = useState(""); const [end, setEnd] = useState("");

  if (!isAdmin) return <div className="p-4">Forbidden (Admin only)</div>;

  async function create() {
    try {
      await api.createEvent({
        title, suburb, address, venueName,
        startTime: new Date(start).toISOString(),
        endTime: new Date(end).toISOString(),
        category: 0 // Market
      });
      alert("Created");
      setTitle(""); setSuburb(""); setAddress(""); setVenue(""); setStart(""); setEnd("");
    } catch { alert("Create failed"); }
  }

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-3">
      <h1 className="text-xl font-bold">Admin · Create Event</h1>
      <div className="grid gap-2">
        <input className="border rounded px-3 py-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Suburb" value={suburb} onChange={e=>setSuburb(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Venue" value={venueName} onChange={e=>setVenue(e.target.value)} />
        <input className="border rounded px-3 py-2" type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} />
        <input className="border rounded px-3 py-2" type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} />
        <button onClick={create} className="bg-black text-white rounded px-4 py-2 w-fit">Create</button>
      </div>
    </div>
  );
}
