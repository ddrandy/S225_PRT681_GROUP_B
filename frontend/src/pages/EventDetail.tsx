import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, type EventDto } from "../lib/api";
import { Button } from "@progress/kendo-react-buttons";
import { Input } from "@progress/kendo-react-inputs";
import { Card, CardBody, CardTitle, CardSubtitle, CardActions } from "@progress/kendo-react-layout";
import { Notification } from "@progress/kendo-react-notification";

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ev, setEv] = useState<EventDto | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getEvent(id).then(setEv).catch(() => setShowError(true));
  }, [id]);

  async function submit() {
    if (!id) return;
    setLoading(true);
    try {
      await api.register(id, { name, email, phone });
      setShowSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
    setLoading(false);
  }

  const getCategoryBadge = (category: number) => {
    const categories = ["Market", "Festival", "Music", "Sports", "Community", "Other"];
    const colors = ["bg-green-100 text-green-800", "bg-purple-100 text-purple-800", 
                   "bg-blue-100 text-blue-800", "bg-orange-100 text-orange-800",
                   "bg-pink-100 text-pink-800", "bg-gray-100 text-gray-800"];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[category] || colors[5]}`}>
        {categories[category] || "Other"}
      </span>
    );
  };

  if (!ev) return <div className="p-5">Loading…</div>;

  return (
    <main className="mx-auto max-w-4xl p-6 grid gap-6">
      {showSuccess && (
        <Notification 
          type={{ style: "success", icon: true }}
          closable={true}
          onClose={() => setShowSuccess(false)}
        >
          <span>Successfully registered for the event!</span>
        </Notification>
      )}
      
      {showError && (
        <Notification 
          type={{ style: "error", icon: true }}
          closable={true}
          onClose={() => setShowError(false)}
        >
          <span>Failed to register. Please try again.</span>
        </Notification>
      )}

      <Card className="shadow-lg">
        <CardBody>
          {ev.heroImageUrl && (
            <img 
              src={ev.heroImageUrl} 
              alt={ev.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}
          <div className="mb-2">{getCategoryBadge(ev.category)}</div>
          <CardTitle>{ev.title}</CardTitle>
          {ev.description && (
            <CardSubtitle className="mt-2 text-gray-600">
              {ev.description}
            </CardSubtitle>
          )}
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="k-icon k-i-calendar text-gray-500"></span>
              <span className="font-medium">When:</span>
              <span>{new Date(ev.startTime).toLocaleString()} — {new Date(ev.endTime).toLocaleString()}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="k-icon k-i-marker-pin text-gray-500"></span>
              <span className="font-medium">Where:</span>
              <span>{ev.venueName}, {ev.suburb}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="k-icon k-i-map-marker-target text-gray-500"></span>
              <span className="font-medium">Address:</span>
              <span>{ev.address}</span>
            </div>
          </div>
        </CardBody>
        
        <CardActions>
          <Button 
            themeColor="primary"
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.address)}`, '_blank')}
          >
            <span className="k-icon k-i-hyperlink-globe mr-2"></span>
            Open in Maps
          </Button>
          <Button onClick={() => navigate('/events')}>
            Back to Events
          </Button>
        </CardActions>
      </Card>

      <Card className="shadow-lg">
        <CardBody>
          <CardTitle>Register Interest</CardTitle>
          <CardSubtitle>Get notified about updates for this event</CardSubtitle>
          
          <div className="mt-4 space-y-3">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.value || "")}
              required
              placeholder="Enter your name"
            />
            
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.value || "")}
              required
              placeholder="your@email.com"
            />
            
            <Input
              label="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.value || "")}
              placeholder="04XX XXX XXX"
            />
          </div>
        </CardBody>
        
        <CardActions>
          <Button 
            themeColor="primary"
            onClick={submit}
            disabled={loading || !name || !email}
          >
            {loading ? "Submitting..." : "Register"}
          </Button>
          <Button 
            onClick={() => {
              setName("");
              setEmail("");
              setPhone("");
            }}
          >
            Clear
          </Button>
        </CardActions>
      </Card>
    </main>
  );
}