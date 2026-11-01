/**
 * Field with swatches
 * Saved colours under the picker, one click away.
 */
import { ColorField } from '@halo-ds/react';

export default function Demo() {
  return (
    <div style={{ width: 280 }}>
      <ColorField label="Brand colour" placeholder="#2F6BFF" hint="Used for buttons and links." swatches={['#CC1DD0', '#3D7BF7', '#1FA971', '#F2994A']} />
    </div>
  );
}
