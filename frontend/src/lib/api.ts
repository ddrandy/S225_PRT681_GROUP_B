const base = import.meta.env.VITE_API_BASE;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("jwt");
  const headers = new Headers(init?.headers);
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${base}${path}`, { ...init, headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export type EventDto = {
  id: string; title: string; description?: string;
  category: number; startTime: string; endTime: string;
  venueName: string; suburb: string; address: string; heroImageUrl?: string;
};
export type Paged<T> = { total: number; page: number; pageSize: number; data: T[] };

export const api = {
  listEvents: (q = "", page = 1, pageSize = 10) =>
    http<Paged<EventDto>>(`/api/events?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`),
  getEvent: (id: string) => http<EventDto>(`/api/events/${id}`),
  register: (eventId: string, body: { name: string; email: string; phone?: string }) =>
    http<{ id: string }>(`/api/events/${eventId}/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  // auth
  login: async (email: string, password: string) => {
    const r = await http<{ token: string; roles?: string[] }>(
      `/api/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      { method: "POST" }
    );
    localStorage.setItem("jwt", r.token);
    return r;
  },
  me: () => http<{ id: string; email: string; userName: string; roles: string[] }>(`/api/auth/me`),

  // admin
  createEvent: (e: Partial<EventDto>) =>
    http<EventDto>("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(e),
    }),
  listUsers: () => http<{ total: number; page: number; pageSize: number; data: { id: string; email: string; userName: string }[] }>(`/api/admin/users`),
};
