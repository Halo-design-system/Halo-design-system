import figma from '@figma/code-connect';
import { Checkbox, TableCell, TableExpandedRow, TableExpandToggle, TableHeaderCell } from '@halo-ds/react';

figma.connect(TableHeaderCell, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10160-46', {
  props: {
    label: figma.string('Label'),
    align: figma.enum('Align', { Left: 'left', Right: 'right' }),
    sort: figma.enum('Sort', { Unsorted: 'none', Ascending: 'ascending', Descending: 'descending' }),
    filter: figma.boolean('Filter', { true: <Checkbox size="sm" label="Active" />, false: undefined }),
  },
  example: ({ label, ...props }) => <TableHeaderCell {...props}>{label}</TableHeaderCell>,
});

figma.connect(TableCell, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10160-477', {
  variant: { Type: 'Expand' },
  example: () => (
    <TableCell checkbox>
      <TableExpandToggle expanded={false} onToggle={() => {}} />
    </TableCell>
  ),
});

figma.connect(TableCell, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10160-477', {
  example: () => <TableCell />,
});

figma.connect(TableExpandedRow, 'https://www.figma.com/design/QBFNqnfjSu9QfmN5w6VdD5/Halo-Design-System?node-id=10612-90411', {
  example: () => <TableExpandedRow colSpan={5}>Details</TableExpandedRow>,
});
