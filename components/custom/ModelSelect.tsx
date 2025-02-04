import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Label } from '../ui/label';

interface ModelSelectProps {
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  models: { apiIdentifier: string; label: string }[];
}

export function ModelSelect({ selectedModel, setSelectedModel, models }: ModelSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="model">Model</Label>
      <Select
        value={selectedModel}
        onValueChange={(value) => setSelectedModel(value)}
      >
        <SelectTrigger id="model">
          <SelectValue placeholder="Select Model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model, i) => (
            <SelectItem key={i} value={model.apiIdentifier}>
              {model.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}