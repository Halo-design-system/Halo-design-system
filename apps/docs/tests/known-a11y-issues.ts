// Accessibility problems axe found when the checks were first switched on, by story title and axe rule.
// They are allowed for now so the checks can run on every change; anything not listed here still fails.
// Fix them one by one and delete the line: the list should only ever get shorter.
export const knownIssues: Record<string, string[]> = {
  'Components/Calendar/Event calendar': ['color-contrast', 'label-content-name-mismatch', 'aria-required-children'],
  'Components/File upload': ['color-contrast'],
  'Components/List': ['list'],
  'Components/QR code': ['nested-interactive'],
  'Components/Radio': ['aria-allowed-attr'],
  'Components/Result': ['color-contrast'],
  'Components/Rich text editor': ['aria-input-field-name'],
  'Components/Segmented control': ['color-contrast'],
  'Components/Switch': ['color-contrast'],
  'Components/Table': ['color-contrast', 'scrollable-region-focusable'],
  'Components/Tag': ['color-contrast', 'aria-allowed-attr'],
  'Components/Tree select': ['label-content-name-mismatch'],
};
