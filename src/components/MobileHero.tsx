import { identity } from "@/content/identity";
import { Button } from "./Button";
import { IdentityNav } from "./IdentityNav";

type MobileHeroProps = {
  compact?: boolean;
  onBack?: () => void;
};

export function MobileHero({ compact, onBack }: MobileHeroProps) {
  if (compact) {
    return (
      <header className="mobile-hero mobile-hero--compact">
        <h1 className="identity__name">{identity.name}</h1>
        {onBack && (
          <Button small mobile onClick={onBack}>
            <span aria-hidden="true">←</span> All results
          </Button>
        )}
      </header>
    );
  }

  return (
    <header className="mobile-hero">
      <div className="identity__location">{identity.location}</div>
      <h1 className="identity__name">{identity.name}</h1>
      <p className="identity__role">
        {identity.role}{" "}
        <span className="identity__company">{identity.company}</span>.
      </p>
      <p className="identity__summary">{identity.summary}</p>
      <IdentityNav mobile />
    </header>
  );
}
