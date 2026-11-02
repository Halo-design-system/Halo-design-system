// An AI assistant is asked for a sign-in page. It looks Halo up through the MCP server, then the page appears.
import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import { CheckCircle, Sparkle } from '@phosphor-icons/react';
import SignIn from '../../../site/src/blocks/01-sign-in';
import { Caption, Scene, progress, typed } from '../ui';



const ASK = 'Build a sign-in page for my app';

const calls = [
  { at: 104, tool: 'get_setup_and_rules', arg: '' },
  { at: 130, tool: 'list_blocks', arg: '' },
  { at: 156, tool: 'get_block', arg: 'sign-in' },
  { at: 182, tool: 'get_component', arg: 'PasswordInput' },
];

function Appear({ at, children }: { at: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  const p = progress(frame, at, at + 12);
  if (frame < at) return null;
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>{children}</div>;
}

function ToolCall({ at, tool, arg }: { at: number; tool: string; arg: string }) {
  const frame = useCurrentFrame();
  const done = frame >= at + 16;
  return (
    <Appear at={at}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 16px',
          borderRadius: 12,
          border: '1px solid var(--halo-border-secondary)',
          font: '400 20px/28px "Geist Mono", ui-monospace, monospace',
          color: 'var(--halo-text-primary)',
        }}
      >
        <CheckCircle size={22} weight="fill" color={done ? 'var(--halo-icon-positive)' : 'var(--halo-icon-disabled)'} />
        <span style={{ color: 'var(--halo-text-secondary)' }}>halo</span>
        <span>{tool}</span>
        {arg && <span style={{ color: 'var(--halo-text-secondary)' }}>{arg}</span>}
      </div>
    </Appear>
  );
}

export function Mcp() {
  const frame = useCurrentFrame();
  const page = progress(frame, 236, 262);
  const body = { font: '400 22px/32px var(--halo-font-family-body)', color: 'var(--halo-text-primary)', margin: 0 };
  return (
    <Scene>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 80, padding: '0 160px' }}>
        <div style={{ flex: '0 0 760px', display: 'flex', flexDirection: 'column', gap: 48 }}>
          <Caption kicker="MCP server" title="Your AI knows every component" />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              padding: 28,
              minHeight: 420,
              borderRadius: 24,
              border: '1px solid var(--halo-border-secondary)',
              background: 'var(--halo-surface-primary)',
            }}
          >
            <div style={{ alignSelf: 'flex-end', maxWidth: 520, padding: '12px 20px', borderRadius: 16, background: 'var(--halo-surface-minimal)' }}>
              <p style={body}>{typed(ASK, frame, 24, 2) || ' '}</p>
            </div>
            <Appear at={92}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--halo-text-secondary)', font: '500 20px/28px var(--halo-font-family-body)' }}>
                <Sparkle size={22} />
                Checking the design system
              </div>
            </Appear>
            {calls.map((c) => (
              <ToolCall key={c.tool} {...c} />
            ))}
            <Appear at={220}>
              <p style={body}>
                Added <b>src/pages/SignIn.tsx</b>
              </p>
            </Appear>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', opacity: page, transform: `translateY(${(1 - page) * 32}px)` }}>
          <div style={{ width: 700, borderRadius: 24, border: '1px solid var(--halo-border-secondary)', background: 'var(--halo-surface-primary)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 20px', borderBottom: '1px solid var(--halo-border-secondary)' }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--halo-surface-secondary)' }} />
              ))}
              <span style={{ marginLeft: 12, font: '400 18px/24px var(--halo-font-family-body)', color: 'var(--halo-text-secondary)' }}>localhost:5173/sign-in</span>
            </div>
            <div style={{ zoom: 1.1 }}>
              <SignIn />
            </div>
          </div>
        </div>
      </div>
    </Scene>
  );
}
