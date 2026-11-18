import figma from '@figma/code-connect';
import { Tree, TreeSelect } from '@halo-ds/react';

const nodes = [
  { id: 'product', label: 'Product', children: [{ id: 'design', label: 'Design' }, { id: 'research', label: 'Research' }] },
  { id: 'operations', label: 'Operations', children: [{ id: 'finance', label: 'Finance' }] },
];

figma.connect(Tree, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10610-334', {
  props: {
    size: figma.enum('Size', { Medium: 'md', Small: 'sm' }),
    checkable: figma.boolean('Checkbox'),
  },
  example: (props) => <Tree nodes={nodes} defaultExpanded={['product']} aria-label="Teams" {...props} />,
});

figma.connect(TreeSelect, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10610-90177', {
  variant: { Type: 'Single' },
  example: () => <TreeSelect nodes={nodes} placeholder="Choose a team" aria-label="Team" />,
});

figma.connect(TreeSelect, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10610-90177', {
  variant: { Type: 'Multiple' },
  example: () => <TreeSelect nodes={nodes} multiple search placeholder="Choose teams" aria-label="Teams" />,
});
