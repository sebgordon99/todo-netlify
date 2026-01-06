import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Music, LogOut, Plus } from "lucide-react";
import { CreateAdvertisement } from "./CreateAdvertisement";

export function TutorDashboard({ onLogout, onCreateAdvertisement }) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateAd = (newTutor) => {
    onCreateAdvertisement(newTutor);
    setShowCreateForm(false);
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
                  Manage your tutor profile and advertisements
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showCreateForm ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2>Your Advertisements</h2>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Advertisement
              </Button>
            </div>

            <Card>
              <CardContent className="p-12 text-center">
                <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2">No advertisements yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first advertisement to start connecting with
                  students
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Advertisement
                </Button>
              </CardContent>
            </Card>
          </div>
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
