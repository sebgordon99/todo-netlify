import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Music, LogOut, Plus, Pencil, Trash2, Calendar } from "lucide-react";
import { CreateAdvertisement } from "./CreateAdvertisement";

async function fetchJson(url, options = {}) {
  const res = await fetch(url, { credentials: "include", ...options });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.error || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// For showing availability nicely
function formatSlot(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function TutorDashboard({ onLogout }) {
  const [me, setMe] = useState(null);

  const [ads, setAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null); // store an ad object

  // availability view-only
  const [openAvailabilityFor, setOpenAvailabilityFor] = useState(null); // ad_id
  const [availabilityMap, setAvailabilityMap] = useState({}); // { [adId]: slots[] }
  const [loadingAvailFor, setLoadingAvailFor] = useState(null);

  // ---------- load session + ads ----------
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        // 1. who is logged in?
        const tutor = await fetchJson("/api/auth/me");
        if (cancelled) return;
        setMe(tutor);

        // 2. load ads for this tutor
        await loadMyAds(tutor.tutor_id, cancelled);
      } catch (e) {
        // If /me fails, user is not logged in
        if (!cancelled) {
          setMe(null);
          setAds([]);
        }
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  async function loadMyAds(tutor_id, cancelledFlag = false) {
    setLoadingAds(true);
    try {
      let mine = null;
      try {
        mine = await fetchJson("/api/ads/mine");
      } catch {
        const all = await fetchJson("/api/ads");
        mine = (Array.isArray(all) ? all : []).filter(
          (a) => String(a.tutor_id) === String(tutor_id)
        );
      }

      if (!cancelledFlag) setAds(Array.isArray(mine) ? mine : []);
    } catch (e) {
      console.error("Failed to load tutor ads:", e);
      if (!cancelledFlag) setAds([]);
    } finally {
      if (!cancelledFlag) setLoadingAds(false);
    }
  }

  // ---------- helpers for instrument/location resolution ----------
  async function resolveInstrumentId(instrumentName) {
    // safest: find by name from DB list
    const instruments = await fetchJson("/api/instruments");
    const list = Array.isArray(instruments) ? instruments : [];
    if (list.length === 0) return 1;

    const match = list.find(
      (i) =>
        String(i.instrument_name || "")
          .toLowerCase()
          .trim() ===
        String(instrumentName || "")
          .toLowerCase()
          .trim()
    );
    return match?.instrument_id ?? list[0].instrument_id;
  }

  async function resolveLocationId(locationName) {
    const locations = await fetchJson("/api/locations");
    const list = Array.isArray(locations) ? locations : [];
    if (list.length === 0) return 1;

    const match = list.find(
      (l) =>
        String(l.location_name || "")
          .toLowerCase()
          .trim() ===
        String(locationName || "")
          .toLowerCase()
          .trim()
    );
    return match?.location_id ?? list[0].location_id;
  }

  // ---------- CREATE ----------
  async function handleCreateAd(formData) {
    setSaving(true);
    try {
      if (!me?.tutor_id) throw new Error("Not logged in");

      const chosenInstrumentName = (formData.instruments || [])[0] || "Piano";
      const chosenLocationName = formData.suburb || "Sydney CBD";

      const instrument_id = await resolveInstrumentId(chosenInstrumentName);
      const location_id = await resolveLocationId(chosenLocationName);

      // Create ad
      await fetchJson("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location_id,
          instrument_id,
          ad_description: formData.bio || "New tutor ad",
          years_experience: Number(formData.experience || 0),
          hourly_rate: Number(formData.hourlyRate || 0),
          img_url: formData.image || null,
          destroy_at: null,
        }),
      });

      // Refresh list
      await loadMyAds(me.tutor_id);
      setShowCreateForm(false);
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to create ad");
    } finally {
      setSaving(false);
    }
  }

  // ---------- EDIT ----------
  async function handleSaveEdit(formData) {
    setSaving(true);
    try {
      if (!editingAd?.ad_id) throw new Error("Missing ad_id");

      const chosenInstrumentName = (formData.instruments || [])[0] || "Piano";
      const chosenLocationName = formData.suburb || "Sydney CBD";

      const instrument_id = await resolveInstrumentId(chosenInstrumentName);
      const location_id = await resolveLocationId(chosenLocationName);

      // edit ONLY the ad fields (availability stays as-is)
      await fetchJson(`/api/ads/${editingAd.ad_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location_id,
          instrument_id,
          ad_description: formData.bio || "",
          years_experience: Number(formData.experience || 0),
          hourly_rate: Number(formData.hourlyRate || 0),
          img_url: formData.image || null,
          destroy_at: null,
        }),
      });

      await loadMyAds(me.tutor_id);
      setEditingAd(null);
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to update ad");
    } finally {
      setSaving(false);
    }
  }

  // ---------- DELETE ----------
  async function handleDeleteAd(ad) {
    const ok = confirm("Delete this ad? This cannot be undone.");
    if (!ok) return;

    setSaving(true);
    try {
      await fetchJson(`/api/ads/${ad.ad_id}`, { method: "DELETE" });
      await loadMyAds(me.tutor_id);

      // close availability panel if it was open
      if (openAvailabilityFor === ad.ad_id) setOpenAvailabilityFor(null);
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to delete ad");
    } finally {
      setSaving(false);
    }
  }

  // ---------- VIEW AVAILABILITY (READ ONLY) ----------
  async function toggleAvailability(ad) {
    const adId = ad.ad_id;

    if (openAvailabilityFor === adId) {
      setOpenAvailabilityFor(null);
      return;
    }

    setOpenAvailabilityFor(adId);

    if (availabilityMap[adId]) return;

    setLoadingAvailFor(adId);
    try {
      const slots = await fetchJson(`/api/ads/${adId}/availability`);
      setAvailabilityMap((prev) => ({
        ...prev,
        [adId]: Array.isArray(slots) ? slots : [],
      }));
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to load availability");
    } finally {
      setLoadingAvailFor(null);
    }
  }

  // ---------- map DB ad -> CreateAdvertisement initialData ----------
  function adToFormInitial(ad) {
    return {
      name: me?.name ?? "",
      suburb: ad.Location?.location_name ?? "Sydney CBD",
      hourlyRate: ad.hourly_rate ?? "",
      experience: ad.years_experience ?? "",
      bio: ad.ad_description ?? "",
      image: ad.img_url ?? "",
      instruments: [ad.Instrument?.instrument_name].filter(Boolean),
      // view-only availability, so not editing it
      availability: [],
      rating: 5.0,
      totalReviews: 0,
    };
  }

  const hasAds = ads.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Music className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-primary">Tutor Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {me
                    ? `Logged in as ${me.name} (${me.email})`
                    : "Loading session..."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!showCreateForm && !editingAd && (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  disabled={saving}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Advertisement
                </Button>
              )}

              <Button variant="outline" onClick={onLogout} disabled={saving}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Create / Edit form */}
        {showCreateForm && (
          <CreateAdvertisement
            mode="create"
            onSubmit={handleCreateAd}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {editingAd && (
          <CreateAdvertisement
            mode="edit"
            initialData={adToFormInitial(editingAd)}
            onSubmit={handleSaveEdit}
            onCancel={() => setEditingAd(null)}
          />
        )}

        {/* Ads list */}
        {!showCreateForm && !editingAd && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Your Ads {loadingAds ? "(loading…)" : `(${ads.length})`}
              </h2>
            </div>

            {!hasAds ? (
              <Card>
                <CardContent className="p-10 text-center">
                  <Music className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
                  <h3 className="mb-2">No ads yet</h3>
                  <p className="text-muted-foreground">
                    Click “Create Advertisement” to publish your first listing.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {ads.map((ad) => {
                  const isOpen = openAvailabilityFor === ad.ad_id;
                  const slots = availabilityMap[ad.ad_id] || [];
                  const isAvailLoading = loadingAvailFor === ad.ad_id;

                  return (
                    <Card key={ad.ad_id}>
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex gap-4">
                            <img
                              src={
                                ad.img_url ||
                                "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop"
                              }
                              alt="Ad"
                              className="w-24 h-24 rounded-lg object-cover border"
                            />
                            <div>
                              <div className="font-semibold text-base">
                                {ad.Instrument?.instrument_name || "Instrument"}{" "}
                                lessons
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {ad.Location?.location_name ||
                                  "Unknown location"}{" "}
                                • ${ad.hourly_rate}/hr • {ad.years_experience}{" "}
                                yrs
                              </div>
                              <p className="mt-2 text-sm">
                                {ad.ad_description || "No description"}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 md:justify-end">
                            <Button
                              variant="outline"
                              onClick={() => setEditingAd(ad)}
                              disabled={saving}
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </Button>

                            <Button
                              variant="outline"
                              onClick={() => toggleAvailability(ad)}
                              disabled={saving}
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Times
                            </Button>

                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteAd(ad)}
                              disabled={saving}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>

                        {/* Availability panel (view-only) */}
                        {isOpen && (
                          <div className="mt-4 border-t pt-4">
                            <div className="font-medium mb-2">
                              Availability (view only)
                            </div>

                            {isAvailLoading ? (
                              <div className="text-sm text-muted-foreground">
                                Loading times…
                              </div>
                            ) : slots.length === 0 ? (
                              <div className="text-sm text-muted-foreground">
                                No availability found for this ad.
                              </div>
                            ) : (
                              <ul className="space-y-2 text-sm">
                                {slots.map((s) => (
                                  <li
                                    key={
                                      s.availability_id ||
                                      `${s.start_time}-${s.end_time}`
                                    }
                                    className="flex items-center justify-between rounded-md border p-2"
                                  >
                                    <span>
                                      {formatSlot(s.start_time)} →{" "}
                                      {formatSlot(s.end_time)}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {s.is_booked ? "Booked" : "Open"}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
