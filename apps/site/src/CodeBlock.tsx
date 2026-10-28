import { useMemo, useState } from 'react';
import { highlight } from 'sugar-high';
import { CompactButton, Tooltip } from '@halo-ds/react';
import { Check, Copy } from '@phosphor-icons/react';

const escape = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Colour-coded HTML for the code. Install commands get their own simple colouring: the tool, then the rest. */
function colour(code: string) {
  const cmd = code.match(/^(npm|npx|pnpm|yarn|bun)(\s.*)?$/s);
  if (cmd) return `<span style="color:var(--sh-keyword)">${cmd[1]}</span><span style="color:var(--sh-string)">${escape(cmd[2] ?? '')}</span>`;
  return highlight(code);
}

/** Code with a copy button, colour-coded like an editor. */
/** `plain` shows text without colours, for things to copy that aren't code, like a prompt. */
export function CodeBlock({ code, label = 'Copy code', compact = false, plain = false }: { code: string; label?: string; compact?: boolean; plain?: boolean }) {
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => (plain ? escape(code) : colour(code)), [code, plain]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the code is still there to select by hand
    }
  };
  return (
    <div className={compact ? 'code code-compact' : 'code'}>
      <pre>
        {/* sugar-high escapes the code, so the HTML only holds its colour spans */}
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      <div className="code-copy">
        <Tooltip content={copied ? 'Copied' : label}>
          <CompactButton variant="ghost" size="md" aria-label={copied ? 'Copied' : label} onClick={copy}>
            {copied ? <Check /> : <Copy />}
          </CompactButton>
        </Tooltip>
      </div>
    </div>
  );
}
