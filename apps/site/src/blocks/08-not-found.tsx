/**
 * Page not found
 * Status
 * A 404 page that says what went wrong in plain words and offers a way back.
 */
import { Button, Result } from '@halo-ds/react';
import { ArrowLeft } from '@phosphor-icons/react';

export default function NotFound() {
  return (
    <main style={{ display: 'grid', placeItems: 'center', padding: 'var(--halo-spacing-13) var(--halo-spacing-7)' }}>
      <Result
        status="not-found"
        title="We can't find that page"
        description="It may have moved, or the link has a typo. Check the address, or head back to where you were."
        actions={
          <>
            <Button iconLeft={<ArrowLeft />} onClick={() => window.history.back()}>Go back</Button>
            <Button variant="secondary">Contact support</Button>
          </>
        }
      />
    </main>
  );
}
