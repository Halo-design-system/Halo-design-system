import type { ReactNode } from 'react';
import { Link } from './router';

/**
 * The one card for components, foundations and blocks, on the home page and the Components page:
 * a preview on top and the name under it, nothing else. The name is the link and stretches over the whole card,
 * so previews that hold links of their own (blocks) still work.
 */
export function Tile({ to, name, children, className }: { to: string; name: string; children: ReactNode; className?: string }) {
  return (
    <div className={className ? `tile ${className}` : 'tile'}>
      <div className="tile-preview" inert>
        {children}
      </div>
      <Link to={to} className="tile-name">
        {name}
      </Link>
    </div>
  );
}
