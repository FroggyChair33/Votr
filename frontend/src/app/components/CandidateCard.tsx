import { ImageWithFallback } from './figma/ImageWithFallback';

export function CandidateCard({
  name,
  position,
  party,
  imageUrl,
}: {
  name: string;
  position: string;
  party: string;
  imageUrl: string;
}) {
  const partyColor = party === 'Democrat' ? 'var(--democrat)' : 'var(--republican)';

  return (
    <div className="p-4 rounded-2xl bg-card border border-border hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-16 h-16 rounded-full object-cover border-2"
          style={{ borderColor: partyColor }}
        />
        <div className="flex-1">
          <h3 className="text-base mb-1" style={{ fontFamily: 'var(--font-header)', fontWeight: 600 }}>
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{position}</p>
          <span
            className="inline-block px-2 py-1 rounded-full text-xs text-white"
            style={{ backgroundColor: partyColor }}
          >
            {party}
          </span>
        </div>
      </div>
    </div>
  );
}
