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

export function CreateAdvertisement({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    suburb: "",
    hourlyRate: "",
    experience: "",
    bio: "",
    image:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop",
    instruments: [],
    availability: [],
    rating: 5.0,
    totalReviews: 0,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleInstrument = (instrument) => {
    setFormData((prev) => ({
      ...prev,
      instruments: prev.instruments.includes(instrument)
        ? prev.instruments.filter((i) => i !== instrument)
        : [...prev.instruments, instrument],
    }));
  };

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter((d) => d !== day)
        : [...prev.availability, day],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.instruments.length === 0) {
      alert("Please select at least one instrument");
      return;
    }

    if (formData.availability.length === 0) {
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
          <CardTitle>Create New Advertisement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Sarah Mitchell"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="suburb">Suburb *</Label>
              <Input
                id="suburb"
                value={formData.suburb}
                onChange={(e) => handleChange("suburb", e.target.value)}
                placeholder="e.g., Carlton"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate ($) *</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="5"
                value={formData.hourlyRate}
                onChange={(e) => handleChange("hourlyRate", e.target.value)}
                placeholder="e.g., 65"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience *</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                placeholder="e.g., 10"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">About You *</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell students about your teaching style, experience, and what makes you unique..."
              rows={4}
              required
            />
          </div>

          {/* Instruments */}
          <div className="space-y-3">
            <Label>Instruments You Teach *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_INSTRUMENTS.map((instrument) => (
                <div key={instrument} className="flex items-center space-x-2">
                  <Checkbox
                    id={`instrument-${instrument}`}
                    checked={formData.instruments.includes(instrument)}
                    onCheckedChange={() => toggleInstrument(instrument)}
                  />
                  <Label
                    htmlFor={`instrument-${instrument}`}
                    className="cursor-pointer"
                  >
                    {instrument}
                  </Label>
                </div>
              ))}
            </div>
            {formData.instruments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.instruments.map((instrument) => (
                  <Badge key={instrument} variant="secondary">
                    {instrument}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer"
                      onClick={() => toggleInstrument(instrument)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <Label>Your Availability *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={formData.availability.includes(day)}
                    onCheckedChange={() => toggleDay(day)}
                  />
                  <Label htmlFor={`day-${day}`} className="cursor-pointer">
                    {day}
                  </Label>
                </div>
              ))}
            </div>
            {formData.availability.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.availability.map((day) => (
                  <Badge key={day} variant="secondary">
                    {day}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer"
                      onClick={() => toggleDay(day)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Create Advertisement
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
