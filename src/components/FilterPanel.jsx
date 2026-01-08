import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

export function FilterPanel({
  selectedInstruments,
  selectedSuburbs,
  onInstrumentChange,
  onSuburbChange,
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

  const clearAllFilters = () => {
    onInstrumentChange([]);
    onSuburbChange([]);
  };

  const hasActiveFilters =
    selectedInstruments.length > 0 || selectedSuburbs.length > 0;

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
      </CardContent>
    </Card>
  );
}
