// A deal on a stage board: company, value, the team on it and when it closes.
import { Avatar, AvatarGroup, Badge } from '@halo-ds/react';
import type { Deal } from './data';
import { dollars } from './data';

export function DealCard({ deal, onOpen, showContact }: { deal: Deal; onOpen: () => void; showContact?: boolean }) {
  return (
    <button type="button" className="v-deal" onClick={onOpen}>
      <strong>{deal.company}</strong>
      <span className="t-muted">{dollars(deal.value)}</span>
      {showContact ? (
        <span className="t-person t-muted">
          <Avatar src={deal.contact.src} name={deal.contact.name} size="xs" />
          {deal.contact.name}
        </span>
      ) : (
        <span className="t-task-foot">
          <AvatarGroup size="xs">
            {deal.team.map((p) => (
              <Avatar key={p.name} src={p.src} name={p.name} />
            ))}
          </AvatarGroup>
          <Badge size="sm" color={deal.stage === 'Won' ? 'success' : deal.closes.includes('Oct') ? 'warning' : 'neutral'}>
            {deal.closes}
          </Badge>
        </span>
      )}
    </button>
  );
}
