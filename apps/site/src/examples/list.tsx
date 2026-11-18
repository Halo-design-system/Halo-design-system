import { List, ListItem } from '@halo-ds/react';
import { FileImage, FilePdf, FileText } from '@phosphor-icons/react';

export default function Example() {
  return (
    <div style={{ width: 360 }}>
      <List variant="divided" inset>
        <ListItem icon={<FilePdf />} title="Quarterly report.pdf" description="2.4 MB" onClick={() => {}} />
        <ListItem icon={<FileImage />} title="Cover image.png" description="840 KB" onClick={() => {}} />
        <ListItem icon={<FileText />} title="Notes.txt" description="12 KB" onClick={() => {}} />
      </List>
    </div>
  );
}
