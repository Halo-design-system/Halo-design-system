import { TreeSelect } from '@halo-ds/react';

const teams = [
  { id: 'product', label: 'Product', children: [{ id: 'design', label: 'Design' }, { id: 'research', label: 'Research' }] },
  { id: 'operations', label: 'Operations', children: [{ id: 'finance', label: 'Finance' }, { id: 'people', label: 'People' }] },
];

export default function Example() {
  return (
    <div style={{ display: 'grid', alignContent: 'start', gap: 20, width: 320, minHeight: 280 }}>
      <TreeSelect nodes={teams} placeholder="Choose a team" aria-label="Team" />
      <TreeSelect nodes={teams} multiple search placeholder="Choose teams" aria-label="Teams" />
    </div>
  );
}
