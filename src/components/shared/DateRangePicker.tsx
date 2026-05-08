import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DateRangePickerProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Input
        type="date"
        value={from}
        onChange={(e) => onChange(e.target.value, to)}
        className="w-36"
      />
      <span className="text-muted-foreground">—</span>
      <Input
        type="date"
        value={to}
        onChange={(e) => onChange(from, e.target.value)}
        className="w-36"
      />
    </div>
  );
}
