// Shared by the live example apps: moving between screens, and people's photos.
import { createContext, useContext } from 'react';
import { Button, EmptyState, Illustration } from '@halo-ds/react';

/** Opens another screen of the same app. Inside the Examples page this moves the preview; on its own it changes the page. */
export const NavContext = createContext<(screen: string) => void>(() => {});
export const useNav = () => useContext(NavContext);

/** A photo from public/avatars. */
export const photo = (file: string) => `${import.meta.env.BASE_URL}avatars/${file}`;

/** For links in the example that lead to pages it doesn't have. */
export function NotInExample({ name, home }: { name: string; home: string }) {
  const go = useNav();
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', padding: 24 }}>
      <EmptyState
        media={<Illustration name="no-data" size={160} />}
        title={`${name} isn't in this example`}
        description="This example has a few screens to click through. Go back to see them."
        actions={<Button variant="secondary" onClick={() => go(home)}>Back to overview</Button>}
      />
    </div>
  );
}
