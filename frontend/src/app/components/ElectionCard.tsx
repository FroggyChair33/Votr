import { Calendar, Clock } from 'lucide-react';

export function ElectionCard({
  title,
  date,
  daysUntil,
  type,
}: {
  title: string;
  date: string;
  daysUntil: number;
  type: string;
}) {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base mb-1" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
            {title}
          </h3>
          <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
            {type}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{daysUntil} days</span>
        </div>
      </div>
    </div>
  );
}
