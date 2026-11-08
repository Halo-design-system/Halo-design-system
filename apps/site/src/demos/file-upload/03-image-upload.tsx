/**
 * Image upload
 * One picture in a circle, like a profile photo or a company logo. Compact leaves out the title.
 */
import { useState } from 'react';
import { ImageUpload } from '@halo-ds/react';

export default function Demo() {
  const [src, setSrc] = useState<string>();
  return (
    <div className="demo-stack" style={{ width: 400 }}>
      <ImageUpload src={src} name="Your photo" onFile={(file) => setSrc(URL.createObjectURL(file))} onRemove={() => setSrc(undefined)} />
      <ImageUpload kind="business" layout="compact" onFile={() => {}} />
    </div>
  );
}
