import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, type EventDto } from "../lib/api";

export function EventDetail() {
  const { id } = useParams();
  const [ev, setEv] = useState<EventDto | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!id) return;
    api.getEvent(id).then(setEv);
  }, [id]);

  async function submit() {
    if (!id) return;
    await api.register(id, { name, email, phone });
    alert("Registered!");
    setName("");
    setEmail("");
    setPhone("");
  }

  if (!ev) return <div className="p-5">Loading…</div>;

  return (
    <main className="mx-auto max-w-4xl p-6 grid gap-4">
      <h1 className="text-2xl font-bold">{ev.title}</h1>
      <div className="opacity-70">{new Date(ev.startTime).toLocaleString()} – {new Date(ev.endTime).toLocaleString()}</div>
      <div>{ev.venueName}, {ev.suburb}</div>
      <a className="text-blue-600 underline" target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.address)}`}>Open in Maps</a>


      <section className="border rounded-xl p-4 bg-white">
        <h2 className="font-semibold mb-2">Register interest</h2>
        <div className="grid gap-2">
          <input className="border rounded px-3 py-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} />
          <button onClick={submit} className="bg-black text-white rounded px-4 py-2 w-fit">Submit</button>
        </div>
      </section>
    </main>
  );
}
