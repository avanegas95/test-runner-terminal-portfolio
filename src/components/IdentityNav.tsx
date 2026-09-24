import { identity } from "@/content/identity";
import { Button } from "./Button";

type IdentityNavProps = {
  mobile?: boolean;
};

export function IdentityNav({ mobile }: IdentityNavProps) {
  return (
    <nav aria-label="Main" className="identity__nav">
      {identity.nav.map((item) => (
        <Button
          key={item.label}
          href={item.href}
          primary={item.primary}
          sidebar={!mobile}
          mobile={mobile}
        >
          {mobile ? (
            item.label
          ) : (
            <>
              {item.label}
              <span aria-hidden="true">→</span>
            </>
          )}
        </Button>
      ))}
    </nav>
  );
}
