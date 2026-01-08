import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Plus, X } from "lucide-react";

const AVAILABLE_INSTRUMENTS = [
  "Piano",
  "Guitar",
  "Violin",
  "Drums",
  "Voice",
  "Bass Guitar",
  "Saxophone",
  "Cello",
  "Flute",
  "Clarinet",
  "Trumpet",
  "Keyboard",
];

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function CreateAdvertisement({
  onSubmit,
  onCancel,
  mode = "create",
  initialData = null,
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name ?? "",
    suburb: initialData?.suburb ?? "",
    hourlyRate: initialData?.hourlyRate ?? "",
    experience: initialData?.experience ?? "",
    bio: initialData?.bio ?? "",
    image:
      initialData?.image ??
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop",
    instruments: initialData?.instruments ?? [],
    availability: initialData?.availability ?? [],
    rating: initialData?.rating ?? 5.0,
    totalReviews: initialData?.totalReviews ?? 0,
  });

  // ... keep the rest the same

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.instruments.length === 0) {
      alert("Please select at least one instrument");
      return;
    }

    // ✅ For EDIT mode, you can skip forcing availability if you want
    if (mode === "create" && formData.availability.length === 0) {
      alert("Please select at least one day of availability");
      return;
    }

    onSubmit({
      ...formData,
      hourlyRate: parseFloat(formData.hourlyRate),
      experience: parseInt(formData.experience),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "edit" ? "Edit Advertisement" : "Create New Advertisement"}
          </CardTitle>
        </CardHeader>

        {/* ... same form */}

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            {mode === "edit" ? "Save Changes" : "Create Advertisement"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
