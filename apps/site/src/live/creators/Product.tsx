// A new digital product. The preview on the right shows how it looks on your page as you type.
import { useState } from 'react';
import { Badge, Button, FileItem, FileUpload, InputField, SelectField, Switch, TextareaField, useToast } from '@halo-ds/react';
import { Eye } from '@phosphor-icons/react';
import { useNav } from '../kit';
import { naira } from './data';
import { Shell } from './Shell';

const types = ['E-book', 'Template', 'Course', 'Spreadsheet'];

export default function Product() {
  const go = useNav();
  const { toast } = useToast();
  const [name, setName] = useState('Portfolio playbook');
  const [type, setType] = useState('E-book');
  const [price, setPrice] = useState(12000);
  const [about, setAbout] = useState('A step-by-step guide to building a design portfolio that gets interviews. 64 pages, with real before and after examples.');
  const [file, setFile] = useState<{ name: string; size: number } | null>({ name: 'Portfolio-playbook-v2.pdf', size: 2_400_000 });
  const [options, setOptions] = useState({ tip: true, limit: false, email: true });
  const [tried, setTried] = useState(false);
  const missing = !name.trim() ? 'Give your product a name.' : !file ? 'Add the file customers get.' : '';

  return (
    <Shell current="product">
      <div className="t-page">
        <header className="t-head">
          <div>
            <h1>New digital product</h1>
            <p className="t-sub">Customers download it straight after they pay.</p>
          </div>
          <div className="t-actions">
            <Button variant="ghost" iconLeft={<Eye />} onClick={() => toast({ title: 'Preview opened', description: 'This is how buyers see it.' })}>
              Preview
            </Button>
            <Button variant="secondary" onClick={() => toast({ type: 'success', title: 'Draft saved' })}>
              Save draft
            </Button>
            <Button
              onClick={() => {
                setTried(true);
                if (missing) return;
                toast({ type: 'success', title: `${name} is live`, description: 'It is on your page now.' });
                go('home');
              }}
            >
              Publish
            </Button>
          </div>
        </header>

        <div className="k-send">
          <div className="t-detail">
            <section className="t-panel" aria-labelledby="s-details">
              <h2 id="s-details">Details</h2>
              <InputField label="Product name" placeholder="Portfolio playbook" value={name} onChange={(e) => setName(e.target.value)} error={tried && !name.trim() ? 'Give your product a name.' : undefined} />
              <div className="k-pair">
                <SelectField label="Type" value={type} onValueChange={setType} options={types.map((t) => ({ value: t, label: t }))} />
                <InputField
                  label="Price"
                  placeholder="₦12,000"
                  inputMode="numeric"
                  value={price ? naira(price) : ''}
                  onChange={(e) => setPrice(Number(e.target.value.replace(/\D/g, '')) || 0)}
                  hint={`You get ${naira(Math.round(price * 0.94))} after fees`}
                />
              </div>
              <TextareaField label="Description" placeholder="What buyers get, in a sentence or two" rows={3} maxLength={280} showCount value={about} onChange={(e) => setAbout(e.target.value)} hint="Shown on your page and in the receipt email." />
            </section>

            <section className="t-panel" aria-labelledby="s-file">
              <div>
                <h2 id="s-file">File</h2>
                <p className="t-muted">Upload what customers get. One file up to 2 GB, or a ZIP with several.</p>
              </div>
              {file ? (
                <FileItem name={file.name} size={file.size} status="complete" onRemove={() => setFile(null)} />
              ) : (
                <FileUpload title="Drag your file here" description="PDF, ZIP, Figma or video, up to 2 GB" buttonLabel="Browse files" maxSize={2_000_000_000} onFiles={(f) => setFile({ name: f[0]!.name, size: f[0]!.size })} error={tried && !file ? 'Add the file customers get.' : undefined} />
              )}
            </section>

            <section className="t-panel" aria-labelledby="s-options">
              <h2 id="s-options">Options</h2>
              <Switch label="Let buyers pay more" description="They see your price as the minimum and can tip on top." controlPosition="end" checked={options.tip} onCheckedChange={(tip) => setOptions({ ...options, tip })} />
              <Switch label="Limit how many you sell" description="Good for early-bird offers. Off means no limit." controlPosition="end" checked={options.limit} onCheckedChange={(limit) => setOptions({ ...options, limit })} />
              <Switch label="Ask for an email before download" description="Adds the buyer to your customer list." controlPosition="end" checked={options.email} onCheckedChange={(email) => setOptions({ ...options, email })} />
            </section>
          </div>

          <aside className="s-sticky" aria-label="Preview">
            <span className="t-muted">How it looks on your page</span>
            <div className="s-preview">
              <div className="s-cover" aria-hidden="true" />
              <div className="s-preview-body">
                <span className="t-actions" style={{ gap: 'var(--halo-spacing-4)' }}>
                  <Badge size="sm" color="neutral">
                    {type}
                  </Badge>
                  {file && (
                    <Badge size="sm" color="neutral">
                      {file.name.split('.').pop()?.toUpperCase()}
                    </Badge>
                  )}
                </span>
                <h3>{name || 'Product name'}</h3>
                <p className="t-muted" style={{ margin: 0 }}>
                  {about.length > 90 ? `${about.slice(0, 90).trim()}...` : about || 'Your description shows here.'}
                </p>
                <div className="k-row">
                  <strong style={{ fontSize: 'var(--halo-font-size-xl)' }}>{options.tip ? `${naira(price)}+` : naira(price)}</strong>
                  <Button size="sm" variant="secondary">
                    Buy now
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Shell>
  );
}
