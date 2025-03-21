import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface GameFilterProps {
  value: number;
  onChange: (value: number) => void;
}

export default function GameFilter({ value, onChange }: GameFilterProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (newValue: number[]) => {
    setLocalValue(newValue[0]);
    onChange(newValue[0]);
  };

  return (
    <Card className="bg-[#131825] border border-gray-800/20 col-span-2">
      <CardHeader>
        <CardTitle>Choose Top N Games</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="games-slider">Number of Games: {localValue}</Label>
          </div>
          <Slider
            id="games-slider"
            min={3}
            max={10}
            step={1}
            value={[localValue]}
            onValueChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>3</span>
            <span>10</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
