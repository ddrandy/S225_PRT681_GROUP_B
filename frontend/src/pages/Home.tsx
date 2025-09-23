import { Link } from "react-router-dom";

export function Home() {
  return (
    <main className="mx-auto max-w-6xl p-6 grid gap-8">
      <section className="rounded-2xl border p-8 bg-gradient-to-br from-orange-50 to-amber-100">
        <h1 className="text-3xl font-bold mb-2">Discover Darwin & NT Events</h1>
        <p className="opacity-80 mb-6">Markets, festivals, community days and more.</p>
        <Link to="/events" className="inline-block bg-black text-white rounded px-5 py-2">Browse events</Link>
      </section>


      <section className="grid md:grid-cols-3 gap-4">
        <Card title="Search" text="Find events by keyword, suburb, dates" to="/events" />
        <Card title="Propose event" text="Suggest a new local event" to="/propose" />
        <Card title="Admin" text="Manage events & users" to="/admin" />
      </section>
    </main>
  );
}

function Card({ title, text, to }: { title: string; text: string; to: string }) {
  return (
    <Link to={to} className="border rounded-xl p-5 hover:shadow transition bg-white">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm opacity-80">{text}</p>
    </Link>
  );
}