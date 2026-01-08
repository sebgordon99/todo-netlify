import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Music, LogOut, Plus } from "lucide-react";
import { CreateAdvertisement } from "./CreateAdvertisement";

export function TutorDashboard({ onLogout, onCreateAdvertisement }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreateAd = async (newTutor) => {
    try {
      setSaving(true);
      await onCreateAdvertisement(newTutor); // IMPORTANT: allow async
      setShowCreateForm(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-primary">Tutor Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Create and manage your advertisement
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!showCreateForm && (
                <Button onClick={() => setShowCreateForm(true)} disabled={saving}>
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showCreateForm ? (
          <Card>
            <CardContent className="p-10 text-center">
              <Music className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">Ready to post your ad?</h3>
              <p className="text-muted-foreground">
                Click “Create Advertisement” to publish your listing and add bookable times.
              </p>
            </CardContent>
          </Card>
        ) : (
          <CreateAdvertisement
            onSubmit={handleCreateAd}
            onCancel={() => setShowCreateForm(false)}
          />
        )}
      </main>
    </div>
  );
}
