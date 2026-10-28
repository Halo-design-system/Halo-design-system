// The component list: names, imports and descriptions. Shared by the website and the halo-ds CLI,
// so it holds plain data only (no React, no Vite).

export interface Entry {
  slug: string;
  name: string;
  /** Named exports to import, shown in the usage line. */
  exports: string[];
  description: string;
  /** Storybook docs id, for the full props table. */
  storybook: string;
}

export const groups: { name: string; items: Entry[] }[] = [
  {
    name: 'Actions',
    items: [
      { slug: 'button', name: 'Button', exports: ['Button'], description: 'Starts an action, like saving or sending. One primary button per screen; Premium is for upgrades.', storybook: 'components-button--docs' },
      { slug: 'compact-button', name: 'Compact button', exports: ['CompactButton'], description: 'A small icon button for toolbars, tables and cards.', storybook: 'components-compact-button--docs' },
      { slug: 'link-button', name: 'Link button', exports: ['LinkButton'], description: 'An action or link that looks like text, for quieter actions.', storybook: 'components-link-button--docs' },
      { slug: 'social-button', name: 'Social button', exports: ['SocialButton'], description: 'Sign in with Google, Apple, GitHub and other providers.', storybook: 'components-social-button--docs' },
      { slug: 'button-group', name: 'Button group', exports: ['ButtonGroup'], description: 'Joins related buttons into one control.', storybook: 'components-button-group--docs' },
    ],
  },
  {
    name: 'Forms',
    items: [
      { slug: 'form', name: 'Form', exports: ['Form', 'FormSection', 'FormRow', 'FormActions'], description: 'Groups fields into sections and checks them, with errors on the right fields.', storybook: 'components-form--docs' },
      { slug: 'input', name: 'Input', exports: ['InputField'], description: 'A text box with a label, a hint and an error state.', storybook: 'components-input--docs' },
      { slug: 'textarea', name: 'Textarea', exports: ['TextareaField'], description: 'A text box for longer writing, with an optional count.', storybook: 'components-textarea--docs' },
      { slug: 'select', name: 'Select', exports: ['SelectField', 'Combobox'], description: 'Pick one option from a list, or search and pick several with Combobox.', storybook: 'components-select--docs' },
      { slug: 'checkbox', name: 'Checkbox', exports: ['Checkbox'], description: 'Turns one option on or off, or picks several from a list.', storybook: 'components-checkbox--docs' },
      { slug: 'radio', name: 'Radio', exports: ['RadioGroup', 'Radio'], description: 'Picks one option from a short list, with every choice in view.', storybook: 'components-radio--docs' },
      { slug: 'switch', name: 'Switch', exports: ['Switch'], description: 'Turns a setting on or off straight away.', storybook: 'components-switch--docs' },
      { slug: 'slider', name: 'Slider', exports: ['Slider', 'RangeSlider'], description: 'Picks a rough value or a range by dragging.', storybook: 'components-slider--docs' },
      { slug: 'date-picker', name: 'Date picker', exports: ['DatePickerField', 'DateRangePickerField'], description: 'Picks a date, a range or several dates from a calendar.', storybook: 'components-date-picker--docs' },
      { slug: 'time-picker', name: 'Time picker', exports: ['TimePickerField'], description: 'Picks a time of day from a list.', storybook: 'components-time-picker--docs' },
      { slug: 'color-picker', name: 'Color picker', exports: ['ColorField'], description: 'Picks a colour with a picker or by typing a hex.', storybook: 'components-color-picker--docs' },
      { slug: 'file-upload', name: 'File upload', exports: ['FileUpload', 'FileItem'], description: 'Drag files in or browse, and show each upload.', storybook: 'components-file-upload--docs' },
      { slug: 'rating', name: 'Rating', exports: ['Rating'], description: 'Stars for giving a score or showing an average.', storybook: 'components-rating--docs' },
      { slug: 'segmented-control', name: 'Segmented control', exports: ['SegmentedControl'], description: 'Switches between a few views or options.', storybook: 'components-segmented-control--docs' },
      { slug: 'tree-select', name: 'Tree select', exports: ['TreeSelect'], description: 'Picks from nested options, like a team inside a department.', storybook: 'components-tree-select--docs' },
      { slug: 'rich-text-editor', name: 'Rich text editor', exports: ['RichTextEditor'], description: 'Writing with bold, lists, links and more.', storybook: 'components-rich-text-editor--docs' },
    ],
  },
  {
    name: 'Navigation',
    items: [
      { slug: 'navigation', name: 'Navigation', exports: ['Sidebar', 'NavItem', 'NavGroup', 'TopBar'], description: 'A sidebar or top bar for moving around an app, with groups that open.', storybook: 'components-navigation--docs' },
      { slug: 'tabs', name: 'Tabs', exports: ['Tabs', 'TabList', 'Tab', 'TabPanel'], description: 'Switches between views of the same thing.', storybook: 'components-tabs--docs' },
      { slug: 'breadcrumbs', name: 'Breadcrumbs', exports: ['Breadcrumbs', 'BreadcrumbItem'], description: 'Shows where a page sits and links back up.', storybook: 'components-breadcrumbs--docs' },
      { slug: 'pagination', name: 'Pagination', exports: ['Pagination'], description: 'Moves between pages of results.', storybook: 'components-pagination--docs' },
      { slug: 'stepper', name: 'Stepper', exports: ['Stepper'], description: 'Shows progress through steps, like checkout. Turns compact on phones.', storybook: 'components-stepper--docs' },
      { slug: 'menu', name: 'Menu', exports: ['Menu'], description: 'A list of actions that opens from a button.', storybook: 'components-menu--docs' },
    ],
  },
  {
    name: 'Feedback',
    items: [
      { slug: 'alert', name: 'Alert', exports: ['Alert'], description: 'A message on the page about something that needs attention.', storybook: 'components-alert--docs' },
      { slug: 'toast', name: 'Toast', exports: ['ToastProvider', 'useToast'], description: 'A short message that confirms an action, then goes away.', storybook: 'components-toast--docs' },
      { slug: 'progress', name: 'Progress', exports: ['ProgressBar', 'ProgressCircle'], description: 'Shows how far along something is.', storybook: 'components-progress--docs' },
      { slug: 'spinner', name: 'Spinner', exports: ['Spinner', 'LoadingIndicator'], description: 'Shows that something is loading.', storybook: 'components-spinner--docs' },
      { slug: 'skeleton', name: 'Skeleton', exports: ['Skeleton'], description: 'Placeholders in the shape of content that is loading.', storybook: 'components-skeleton--docs' },
      { slug: 'empty-state', name: 'Empty state', exports: ['EmptyState'], description: 'Fills a space with nothing in it yet, and gives the next step.', storybook: 'components-empty-state--docs' },
      { slug: 'result', name: 'Result', exports: ['Result'], description: 'The outcome of an action, or why a page can’t show.', storybook: 'components-result--docs' },
      { slug: 'tooltip', name: 'Tooltip', exports: ['Tooltip'], description: 'A short label that shows on hover or focus.', storybook: 'components-tooltip--docs' },
      { slug: 'tour', name: 'Tour', exports: ['Tour'], description: 'Shows new people around a screen, one step at a time.', storybook: 'components-tour--docs' },
    ],
  },
  {
    name: 'Overlays',
    items: [
      { slug: 'modal', name: 'Modal', exports: ['Modal'], description: 'A focused task or decision over the page.', storybook: 'components-modal--docs' },
      { slug: 'drawer', name: 'Drawer', exports: ['Drawer'], description: 'A panel that slides in from the edge for details or a form.', storybook: 'components-drawer--docs' },
      { slug: 'popover', name: 'Popover', exports: ['Popover'], description: 'Extra content or a small form next to the thing that opened it.', storybook: 'components-popover--docs' },
    ],
  },
  {
    name: 'Data display',
    items: [
      { slug: 'table', name: 'Table', exports: ['DataTable', 'Table'], description: 'Rows of data with sorting, selection, filters and paging.', storybook: 'components-table--docs' },
      { slug: 'statistic', name: 'Statistic', exports: ['Statistic'], description: 'A key number with its label and how it changed.', storybook: 'components-statistic--docs' },
      { slug: 'charts', name: 'Charts', exports: ['BarChart', 'LineChart', 'AreaChart', 'PieChart'], description: 'Bar, line, area and pie charts with tooltips.', storybook: 'components-charts--docs' },
      { slug: 'card', name: 'Card', exports: ['Card'], description: 'Groups related content in a box.', storybook: 'components-card--docs' },
      { slug: 'list', name: 'List', exports: ['List', 'ListItem'], description: 'Rows of items with icons, descriptions and actions.', storybook: 'components-list--docs' },
      { slug: 'avatar', name: 'Avatar', exports: ['Avatar', 'AvatarGroup'], description: 'A person or team, as a photo or initials.', storybook: 'components-avatar--docs' },
      { slug: 'badge', name: 'Badge', exports: ['Badge'], description: 'A small label for a status, a category or a count.', storybook: 'components-badge--docs' },
      { slug: 'tag', name: 'Tag', exports: ['Tag'], description: 'A label people can remove, in eight colours.', storybook: 'components-tag--docs' },
      { slug: 'calendar', name: 'Calendar', exports: ['Calendar'], description: 'A month to pick a date or a range from.', storybook: 'components-calendar-calendar--docs' },
      { slug: 'event-calendar', name: 'Event calendar', exports: ['EventCalendar'], description: 'A full calendar of events by day, week, month or year.', storybook: 'components-calendar-event-calendar--docs' },
      { slug: 'tree', name: 'Tree', exports: ['Tree'], description: 'Nested items people open and close, like folders.', storybook: 'components-tree--docs' },
      { slug: 'accordion', name: 'Accordion', exports: ['Accordion', 'AccordionItem'], description: 'Sections that open and close to save space.', storybook: 'components-accordion--docs' },
      { slug: 'carousel', name: 'Carousel', exports: ['Carousel', 'CarouselSlide'], description: 'Slides people move through with arrows or dots.', storybook: 'components-carousel--docs' },
      { slug: 'qr-code', name: 'QR code', exports: ['QRCode'], description: 'A code people scan with a phone camera.', storybook: 'components-qr-code--docs' },
      { slug: 'resizable', name: 'Resizable', exports: ['ResizablePanelGroup', 'ResizablePanel', 'ResizableHandle'], description: 'Panels people resize by dragging the line between them.', storybook: 'components-resizable--docs' },
      { slug: 'divider', name: 'Divider', exports: ['Divider'], description: 'A line that separates content, with an optional label.', storybook: 'components-divider--docs' },
      { slug: 'text', name: 'Text', exports: ['Text'], description: 'Body text in Halo’s sizes, weights and colours.', storybook: 'components-text--docs' },
    ],
  },
];

export const all = groups.flatMap((g) => g.items);
