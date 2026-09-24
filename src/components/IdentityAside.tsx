import { identity } from "@/content/identity";
import { IdentityNav } from "./IdentityNav";

type IdentityAsideProps = {
  showHint?: boolean;
};

export function IdentityAside({ showHint = false }: IdentityAsideProps) {
  return (
    <aside className="identity identity--desktop identity--sticky">
      <div className="identity__location">{identity.location}</div>
      <h1 className="identity__name">{identity.name}</h1>
      <p className="identity__role">
        {identity.role}{" "}
        <span className="identity__company">{identity.company}</span>.
      </p>
      <p className="identity__summary">{identity.summary}</p>
      <IdentityNav />
      {showHint && (
        <p className="identity__hint identity__hint--desktop">
          {identity.hintDesktop}
        </p>
      )}
    </aside>
  );
}
