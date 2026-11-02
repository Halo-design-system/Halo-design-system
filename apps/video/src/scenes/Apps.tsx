// The example apps: a tilted wall of real screens from the Figma playground, scrolling up.
import { Img, useCurrentFrame } from 'remotion';
import banking from '../../../site/public/screens/banking-home-overview-desktop.webp';
import creators from '../../../site/public/screens/creators-home-overview-desktop.webp';
import healthcare from '../../../site/public/screens/healthcare-home-overview-desktop.webp';
import payroll from '../../../site/public/screens/payroll-home-overview-desktop.webp';
import saas from '../../../site/public/screens/saas-project-board-desktop.webp';
import sales from '../../../site/public/screens/sales-crm-home-overview-desktop.webp';
import tax from '../../../site/public/screens/tax-home-overview-desktop.webp';
import billing from '../../../site/public/screens/saas-billing-desktop.webp';
import payslip from '../../../site/public/screens/payroll-payslip-desktop.webp';
import record from '../../../site/public/screens/healthcare-patient-record-desktop.webp';
import deal from '../../../site/public/screens/sales-crm-deal-detail-desktop.webp';
import send from '../../../site/public/screens/banking-send-money-desktop.webp';
import { Count, Scene, Title, progress } from '../ui';

const columns = [
  [banking, sales, payslip, saas],
  [creators, billing, tax, record],
  [healthcare, deal, payroll, send],
];

function Screen({ src }: { src: string }) {
  return (
    <div style={{ width: 640, height: 455, borderRadius: 20, overflow: 'hidden', border: '1px solid var(--halo-border-secondary)', background: 'var(--halo-surface-primary)', flexShrink: 0 }}>
      <Img src={src} style={{ width: '100%', display: 'block' }} />
    </div>
  );
}

export function Apps() {
  const frame = useCurrentFrame();
  const p = progress(frame, 0, 24);
  return (
    <Scene>
      <div style={{ position: 'absolute', inset: 0, perspective: 2400, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', display: 'flex', gap: 40, transform: `translate(-30%, -50%) rotateX(24deg) rotateZ(-14deg) scale(${0.9 + p * 0.1})`, opacity: p }}>
          {columns.map((col, c) => (
            <div key={c} style={{ display: 'flex', flexDirection: 'column', gap: 40, transform: `translateY(${(c % 2 ? 1 : -1) * frame * 2.4 + (c % 2 ? -700 : 0)}px)` }}>
              {[...col, ...col].map((src, i) => (
                <Screen key={i} src={src} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 160, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
        <div className="band" style={{ display: 'flex', alignItems: 'center', gap: 56, padding: '40px 56px', borderRadius: 32 }}>
          <Title value={<Count to={7} start={6} frames={20} />} label="example apps" />
          <Title value={<Count to={29} start={12} frames={20} />} label="screens" />
        </div>
      </div>
    </Scene>
  );
}
