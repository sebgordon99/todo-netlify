import { useState, useMemo } from "react";
import { mockTutors as initialMockTutors } from "./data/mockTutors";
import { FilterPanel } from "./components/FilterPanel";
import { TutorCard } from "./components/TutorCard";
import { ContactModal } from "./components/ContactModal";
import { LoginModal } from "./components/LoginModal";
import { TutorDashboard } from "./components/TutorDashboard";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Music, Search, LogIn } from "lucide-react";

export default function App() {
  const [tutors, setTutors] = useState(initialMockTutors);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedSuburbs, setSelectedSuburbs] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleCreateAdvertisement = (newTutor) => {
    const tutorWithId = {
      ...newTutor,
      id: String(Date.now()),
    };
    setTutors([...tutors, tutorWithId]);
  };

  // Get unique instruments and suburbs from all tutors
  const availableInstruments = useMemo(() => {
    const instruments = new Set();
    tutors.forEach((tutor) => {
      tutor.instruments.forEach((instrument) => instruments.add(instrument));
    });
    return Array.from(instruments).sort();
  }, [tutors]);

  const availableSuburbs = useMemo(() => {
    const suburbs = new Set();
    tutors.forEach((tutor) => suburbs.add(tutor.suburb));
    return Array.from(suburbs).sort();
  }, [tutors]);

  // Filter tutors based on selected criteria
  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = tutor.name.toLowerCase().includes(query);
        const matchesBio = tutor.bio.toLowerCase().includes(query);
        const matchesInstrument = tutor.instruments.some((inst) =>
          inst.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesBio && !matchesInstrument) return false;
      }

      // Filter by instruments
      if (selectedInstruments.length > 0) {
        const hasMatchingInstrument = tutor.instruments.some((instrument) =>
          selectedInstruments.includes(instrument)
        );
        if (!hasMatchingInstrument) return false;
      }

      // Filter by suburb
      if (selectedSuburbs.length > 0) {
        if (!selectedSuburbs.includes(tutor.suburb)) return false;
      }

      // Filter by availability
      if (selectedDays.length > 0) {
        const hasMatchingDay = tutor.availability.some((day) =>
          selectedDays.includes(day)
        );
        if (!hasMatchingDay) return false;
      }

      return true;
    });
  }, [selectedInstruments, selectedSuburbs, selectedDays, searchQuery, tutors]);

  // Sort tutors
  const sortedTutors = useMemo(() => {
    const tutorsCopy = [...filteredTutors];

    switch (sortBy) {
      case "rating":
        return tutorsCopy.sort((a, b) => b.rating - a.rating);
      case "price-low":
        return tutorsCopy.sort((a, b) => a.hourlyRate - b.hourlyRate);
      case "price-high":
        return tutorsCopy.sort((a, b) => b.hourlyRate - a.hourlyRate);
      case "experience":
        return tutorsCopy.sort((a, b) => b.experience - a.experience);
      default:
        return tutorsCopy;
    }
  }, [filteredTutors, sortBy]);

  if (isLoggedIn) {
    return (
      <TutorDashboard
        onLogout={handleLogout}
        onCreateAdvertisement={handleCreateAdvertisement}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Music className="w-8 h-8 text-primary" />
                <h1 className="text-primary">Music Tutor Marketplace</h1>
              </div>
              <p className="text-muted-foreground mt-2">
                Find the perfect music tutor for your instrument and schedule
              </p>
            </div>
            <Button onClick={() => setShowLoginModal(true)}>
              <LogIn className="w-5 h-5 mr-2" />
              Tutor Login
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <FilterPanel
                selectedInstruments={selectedInstruments}
                selectedSuburbs={selectedSuburbs}
                selectedDays={selectedDays}
                onInstrumentChange={setSelectedInstruments}
                onSuburbChange={setSelectedSuburbs}
                onDayChange={setSelectedDays}
                availableInstruments={availableInstruments}
                availableSuburbs={availableSuburbs}
              />
            </div>
          </aside>

          {/* Tutors Grid */}
          <div className="lg:col-span-3">
            {/* Search and Sort Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, instrument, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="sm:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-6">
              <h2>
                {sortedTutors.length}{" "}
                {sortedTutors.length === 1 ? "tutor" : "tutors"} found
              </h2>
            </div>

            {sortedTutors.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="mb-2">No tutors found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to see more results
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedTutors.map((tutor) => (
                  <TutorCard
                    key={tutor.id}
                    tutor={tutor}
                    onContact={setSelectedTutor}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Contact Modal */}
      {selectedTutor && (
        <ContactModal
          tutor={selectedTutor}
          onClose={() => setSelectedTutor(null)}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}
