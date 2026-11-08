import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileItem, FileUpload } from './FileUpload';
import { ImageUpload } from './ImageUpload';

const meta = {
  title: 'Components/File upload',
  component: FileUpload,
  subcomponents: { FileItem, ImageUpload },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A drop area for files, with a button to browse so it works from the keyboard. `onFiles` gets the files that pass `accept` and `maxSize`; `onReject` gets the rest with a reason. Show each file with a `FileItem`, which covers uploading, done and failed.',
      },
    },
  },
  args: { onFiles: () => {}, description: 'PNG, JPG or PDF, up to 10 MB', accept: 'image/png,image/jpeg,.pdf', maxSize: 10 * 1024 * 1024 },
  decorators: [(Story) => <div style={{ maxWidth: 400 }}><Story /></div>],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Error and disabled. */
export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <FileUpload {...args} error="That file is over 10 MB." />
      <FileUpload {...args} disabled />
    </div>
  ),
};

/** Upload, done and failed items. */
export const Items: Story = {
  render: function Render() {
    const [progress, setProgress] = useState(20);
    useEffect(() => {
      const t = setInterval(() => setProgress((p) => (p >= 100 ? 20 : p + 5)), 400);
      return () => clearInterval(t);
    }, []);
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <FileItem name="Quarterly report.pdf" size={2_400_000} status="uploading" progress={progress} onCancel={() => {}} />
        <FileItem name="Cover image.png" size={840_000} status="complete" onRemove={() => {}} />
        <FileItem name="Intro video.mov" size={48_000_000} status="error" onRetry={() => {}} onRemove={() => {}} />
      </div>
    );
  },
};

/** Drop or browse; files show below with fake progress. */
export const Live: Story = {
  render: function Render(args) {
    const [files, setFiles] = useState<{ file: File; progress: number }[]>([]);
    useEffect(() => {
      const t = setInterval(() => setFiles((list) => list.map((f) => ({ ...f, progress: Math.min(100, f.progress + 10) }))), 300);
      return () => clearInterval(t);
    }, []);
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <FileUpload {...args} onFiles={(added) => setFiles((list) => [...list, ...added.map((file) => ({ file, progress: 0 }))])} />
        {files.map(({ file, progress }, i) => (
          <FileItem
            key={file.name + i}
            name={file.name}
            size={file.size}
            status={progress < 100 ? 'uploading' : 'complete'}
            progress={progress}
            onCancel={() => setFiles((list) => list.filter((_, j) => j !== i))}
            onRemove={() => setFiles((list) => list.filter((_, j) => j !== i))}
          />
        ))}
      </div>
    );
  },
};

/** One picture in a circle: a person or a business, empty or uploaded, with or without the title. */
export const Images: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 40 }}>
      <ImageUpload onFile={() => {}} />
      <ImageUpload kind="business" onFile={() => {}} />
      <ImageUpload layout="compact" onFile={() => {}} />
      <ImageUpload kind="business" layout="compact" onFile={() => {}} />
    </div>
  ),
};
