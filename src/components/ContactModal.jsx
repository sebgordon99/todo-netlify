import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function formatRange(start, end) {
  try {
    const s = new Date(start);
    const e = new Date(end);
    return `${s.toLocaleString()} – ${e.toLocaleString()}`;
  } catch {
    return `${start} – ${end}`;
  }
}

export function ContactModal({ tutor, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    instrument: "",
    message: "",
  });

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we don't have an adId yet (older mock data etc), don't fetch.
    if (!tutor?.adId) {
      setSlots([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchAvailability() {
      setLoading(true);
      try {
        const res = await fetch(`/api/ads/${tutor.adId}/availability`);
        const data = await res.json();
        if (!cancelled) setSlots(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch availability", e);
        if (!cancelled) setSlots([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAvailability();

    return () => {
      cancelled = true;
    };
  }, [tutor?.adId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Message sent to ${tutor.name}!\n\nYour details:\nName: ${formData.name}\nEmail: ${formData.email}\nInstrument: ${formData.instrument}`
    );
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {tutor.name}</DialogTitle>
          <DialogDescription>
            Send a message to inquire about music lessons. They'll get back to
            you soon!
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Availability section */}
        <div className="space-y-2 rounded-md border p-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Available times</h4>
            {!tutor?.adId ? (
              <span className="text-xs text-muted-foreground">No ad id</span>
            ) : null}
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No availability posted yet.
            </p>
          ) : (
            <ul className="space-y-2">
  {slots.map((s) => (
    <li
      key={s.availability_id}
      className="rounded-md border px-3 py-2 text-sm"
    >
      <div>{formatRange(s.start_time, s.end_time)}</div>

      <div className="text-xs text-muted-foreground mt-1">
        {s.is_booked ? "Booked" : "Open"}
        {typeof s.user_capacity === "number" ? ` · Capacity: ${s.user_capacity}` : ""}
      </div>

      {/* ✅ Book button belongs INSIDE the map so "s" exists */}
      {!s.is_booked && (
        <Button
          type="button"
          className="mt-2"
          onClick={async () => {
            const res = await fetch(
              `/api/availability/${s.availability_id}/book`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: 1 }), // demo user
              }
            );

            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              alert(err.error || "Failed to book");
              return;
            }

            const updated = await res.json();

            setSlots((prev) =>
              prev.map((x) =>
                x.availability_id === updated.availability_id ? updated : x
              )
            );
          }}
        >
          Book this time
        </Button>
      )}
    </li>
  ))}
</ul>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="0412 345 678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instrument">Instrument of Interest *</Label>
            <Select
              value={formData.instrument}
              onValueChange={(value) => handleChange("instrument", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an instrument" />
              </SelectTrigger>
              <SelectContent>
                {(tutor.instruments || []).map((instrument) => (
                  <SelectItem key={instrument} value={instrument}>
                    {instrument}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Tell the tutor about your experience level and what you'd like to learn..."
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Send Message</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
