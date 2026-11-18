import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CaretRight, FileText, Image as ImageIcon, MusicNote } from '@phosphor-icons/react';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { Switch } from '../Switch';
import { List, ListItem } from './List';

const meta = {
  title: 'Components/List',
  component: List,
  subcomponents: { ListItem },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A vertical list of rows, like files, settings or people. Rows have no side padding, so icons and text line up with the content around the list. Give a ListItem `href` or `onClick` to make the whole row clickable, and set `inset` on lists people hover or select so the highlight has room. Use `leading` and `trailing` for an Avatar, Badge, Switch or value.',
      },
    },
  },
  args: { variant: 'plain', size: 'md', inset: true },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [chosen, setChosen] = useState('report');
    const files = [
      { id: 'report', title: 'Quarterly report.pdf', description: '2.4 MB', icon: <FileText /> },
      { id: 'cover', title: 'Cover image.png', description: '840 KB', icon: <ImageIcon /> },
      { id: 'intro', title: 'Intro music.mp3', description: '5.1 MB', icon: <MusicNote /> },
    ];
    return (
      <List {...args}>
        {files.map((f) => (
          <ListItem key={f.id} title={f.title} description={f.description} icon={f.icon} trailingIcon={<CaretRight />} selected={chosen === f.id} onClick={() => setChosen(f.id)} />
        ))}
        <ListItem title="Archived notes.txt" description="Read only" icon={<FileText />} disabled onClick={() => {}} />
      </List>
    );
  },
};

/** `inset` gives rows people hover or select 8px at the sides, so the highlight doesn't touch the avatar. */
export const Inset: Story = {
  render: function Render() {
    const [chosen, setChosen] = useState('ada');
    const people = [
      { id: 'ada', name: 'Ada Obi', note: 'See you at 3' },
      { id: 'kofi', name: 'Kofi Mensah', note: 'Sent the slides' },
      { id: 'lena', name: 'Lena Park', note: 'Thanks!' },
    ];
    return (
      <List inset>
        {people.map((p) => (
          <ListItem key={p.id} title={p.name} description={p.note} leading={<Avatar size="sm" name={p.name} />} selected={chosen === p.id} onClick={() => setChosen(p.id)} />
        ))}
      </List>
    );
  },
};

/** Lines between rows. */
export const Divided: Story = {
  render: () => (
    <List variant="divided">
      <ListItem title="Ada Obi" description="ada@example.com" leading={<Avatar size="sm" name="Ada Obi" color="purple" />} trailing={<Badge color="success">Active</Badge>} />
      <ListItem title="Kofi Mensah" description="kofi@example.com" leading={<Avatar size="sm" name="Kofi Mensah" />} trailing={<Badge>Invited</Badge>} />
      <ListItem title="Lena Park" description="lena@example.com" leading={<Avatar size="sm" name="Lena Park" color="purple" />} trailing={<Badge color="success">Active</Badge>} />
    </List>
  ),
};

/** A bordered box, here for settings in small size. */
export const Card: Story = {
  render: () => (
    <List variant="card" size="sm">
      <ListItem title="Email updates" description="A weekly summary" trailing={<Switch aria-label="Email updates" defaultChecked />} />
      <ListItem title="Push notifications" description="Mentions and replies" trailing={<Switch aria-label="Push notifications" />} />
    </List>
  ),
};
