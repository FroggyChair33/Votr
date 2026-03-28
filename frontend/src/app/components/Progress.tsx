export function Progress({ value, color }: { value: number; color?: string }) {
  return (
    <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${value}%`,
          backgroundColor: color || 'var(--primary)',
        }}
      />
    </div>
  );
}
