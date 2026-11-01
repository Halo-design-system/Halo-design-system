import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/geist-mono/400.css';
import './site.css';
import { ToastProvider } from '@halo-ds/react';
import { Layout } from './Layout';
import { BlockFrame } from './pages/Blocks';
import { Components } from './pages/Components';
import { Examples } from './pages/Examples';
import { Figma } from './pages/Figma';
import { Home } from './pages/Home';
import { Docs } from './pages/Docs';
import { Router, useRoute } from './router';

function Pages() {
  const { path } = useRoute();
  if (path.startsWith('/components') || path.startsWith('/blocks')) return <Components />;
  if (path.startsWith('/examples')) return <Examples />;
  if (path.startsWith('/figma')) return <Figma />;
  if (path.startsWith('/docs') || path === '/installation') return <Docs />;
  return <Home />;
}

function App() {
  const { path } = useRoute();
  // The Blocks page previews each block in an iframe of this page, without the site around it
  if (path.startsWith('/block-frame/')) return <BlockFrame slug={path.slice('/block-frame/'.length)} />;
  return (
    <Layout>
      <Pages />
    </Layout>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Router>
  </StrictMode>,
);
