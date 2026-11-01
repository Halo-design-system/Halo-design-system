/**
 * Empty projects
 * Application
 * The first visit to a list page: a title, then an illustration that says what goes here and how to start.
 */
import { Button, EmptyState, Illustration, Text } from '@halo-ds/react';
import { Plus, UploadSimple } from '@phosphor-icons/react';

// Headings are plain h1, styled with Halo's type tokens. Text is for body copy.
const pageTitle = {
  margin: 0,
  font: 'var(--halo-font-weight-semibold) var(--halo-font-size-3xl)/var(--halo-line-height-3xl) var(--halo-font-family-heading)',
};

export default function EmptyProjects() {
  return (
    <main style={{ display: 'grid', gap: 'var(--halo-spacing-8)', padding: 'var(--halo-spacing-10) var(--halo-spacing-7)' }}>
      <header style={{ display: 'grid', gap: 'var(--halo-spacing-2)' }}>
        <h1 style={pageTitle}>Projects</h1>
        <Text color="secondary">Everything your team is working on.</Text>
      </header>

      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          padding: 'var(--halo-spacing-12) var(--halo-spacing-7)',
          borderRadius: 'var(--halo-radius-6)',
          boxShadow: 'inset 0 0 0 1px var(--halo-border-secondary)',
        }}
      >
        <EmptyState
          size="lg"
          media={<Illustration name="no-projects" size={200} />}
          title="No projects yet"
          description="Projects keep your files, tasks and people in one place. Create one to get started, or bring one in from another tool."
          actions={
            <>
              <Button iconLeft={<Plus />}>Create project</Button>
              <Button variant="secondary" iconLeft={<UploadSimple />}>Import</Button>
            </>
          }
        />
      </div>
    </main>
  );
}
