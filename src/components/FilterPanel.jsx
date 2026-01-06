import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function FilterPanel({
  selectedInstruments,
  selectedSuburbs,
  selectedDays,
  onInstrumentChange,
  onSuburbChange,
  onDayChange,
  availableInstruments,
  availableSuburbs,
}) {
  const handleInstrumentToggle = (instrument) => {
    if (selectedInstruments.includes(instrument)) {
      onInstrumentChange(selectedInstruments.filter((i) => i !== instrument));
    } else {
      onInstrumentChange([...selectedInstruments, instrument]);
    }
  };

  const handleSuburbToggle = (suburb) => {
    if (selectedSuburbs.includes(suburb)) {
      onSuburbChange(selectedSuburbs.filter((s) => s !== suburb));
    } else {
      onSuburbChange([...selectedSuburbs, suburb]);
    }
  };

  const handleDayToggle = (day) => {
    if (selectedDays.includes(day)) {
      onDayChange(selectedDays.filter((d) => d !== day));
    } else {
      onDayChange([...selectedDays, day]);
    }
  };

  const clearAllFilters = () => {
    onInstrumentChange([]);
    onSuburbChange([]);
    onDayChange([]);
  };

  const hasActiveFilters =
    selectedInstruments.length > 0 ||
    selectedSuburbs.length > 0 ||
    selectedDays.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instruments Filter */}
        <div>
          <h3 className="mb-3">Instruments</h3>
          <div className="space-y-2">
            {availableInstruments.map((instrument) => (
              <div key={instrument} className="flex items-center space-x-2">
                <Checkbox
                  id={`instrument-${instrument}`}
                  checked={selectedInstruments.includes(instrument)}
                  onCheckedChange={() => handleInstrumentToggle(instrument)}
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
        </div>

        <Separator />

        {/* Suburbs Filter */}
        <div>
          <h3 className="mb-3">Location</h3>
          <div className="space-y-2">
            {availableSuburbs.map((suburb) => (
              <div key={suburb} className="flex items-center space-x-2">
                <Checkbox
                  id={`suburb-${suburb}`}
                  checked={selectedSuburbs.includes(suburb)}
                  onCheckedChange={() => handleSuburbToggle(suburb)}
                />
                <Label htmlFor={`suburb-${suburb}`} className="cursor-pointer">
                  {suburb}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Availability Filter */}
        <div>
          <h3 className="mb-3">Availability</h3>
          <div className="space-y-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day}`}
                  checked={selectedDays.includes(day)}
                  onCheckedChange={() => handleDayToggle(day)}
                />
                <Label htmlFor={`day-${day}`} className="cursor-pointer">
                  {day}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
