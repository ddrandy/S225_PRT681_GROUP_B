import { useState } from "react";

export function ProposeEvent() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [contact, setContact] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    alert("Thanks! We'll review your proposal.");
    setTitle("");
    setDesc("");
    setContact("");
  }

  return (
    <main className="mx-auto max-w-3xl p-6 grid gap-4">
      <h1 className="text-2xl font-bold">Propose an Event</h1>
      <form onSubmit={submit} className="grid gap-3 border rounded-xl p-4 bg-white">
        <input className="border rounded px-3 py-2" placeholder="Event title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className="border rounded px-3 py-2" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Your email" value={contact} onChange={e => setContact(e.target.value)} />
        <button className="bg-black text-white rounded px-4 py-2 w-fit">Submit</button>
      </form>
    </main>
  );
}