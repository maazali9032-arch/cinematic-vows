export function BrandRibbon({ name }: { name: string | null }) {
  if (!name) return null;
  return (
    <aside className="brand-ribbon" aria-label={name}>
      <div className="brand-track" aria-hidden="true">
        {[0, 1].map((i) => (
          <span key={i}>
            {Array.from({ length: 8 }, (_, j) => (
              <span key={j}>
                {name}
                <span className="mx-10">◇</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </aside>
  );
}
