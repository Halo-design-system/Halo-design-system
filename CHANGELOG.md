# Changelog

Changes to `@halo-ds/react` and `@halo-ds/tokens`. Both packages share one version number.

New work collects under **Unreleased** and goes live in Storybook straight away. It only reaches npm when we choose to release a batch: then the Unreleased heading becomes the new version number (see Releasing in [CONTRIBUTING.md](CONTRIBUTING.md)).

## Unreleased

### New components

- **Nav group**: `NavGroup` holds NavItems under a parent, like Reports with Sales and Traffic inside. In a Sidebar they show indented below and open with the parent; the group opens by itself when one of its pages is selected, and a closed group holding the current page reads as active. In a collapsed Sidebar the icon opens them in a panel, and in a TopBar they open as a dropdown.
- **Form**: `Form`, `FormSection`, `FormRow` and `FormActions`. A form that checks itself: fields with a `name` show the form's errors, `required` fields are checked for you, and `validate` adds your own rules. Errors show after the first submit, focus moves to the first problem, and errors update as people fix them. `errors` shows messages from the server. `layout="horizontal"` puts labels beside fields, and they move above on phones.
- **Tree**: nested items people open and close, like folders, categories or permissions. Pick one row, or turn on `checkable` for checkboxes that cascade: checking a branch checks everything inside it, and a branch shows a dash when partly checked. Full keyboard support (arrow keys, Home, End, Enter, Space), icons per row, two sizes.
- **Tree select**: `TreeSelect` and `TreeSelectField`. A Select-style box that opens a Tree, for picking from nested options. Single, or `multiple` with checkboxes and tags in the box, with optional `search`.
- **Resizable**: `ResizablePanelGroup`, `ResizablePanel` and `ResizableHandle`. Panels people resize by dragging the line between them, side by side or stacked, and nested. Sizes are in percent with a minimum and maximum. Handles work with the arrow keys, Home and End, can show a grip, and `onLayout` reports the sizes so you can save them.
- **Result**: the outcome of something people did, like a payment going through, or why a page can't show. Success, error, warning and information show an icon in a circle; not found, no access, server error, offline and maintenance show an illustration. Takes a title, description, actions and details like a receipt, in two sizes.
- **Statistic**: a key number with its label, an optional prefix or suffix, and how it changed (a trend badge and "vs last month"). Small, Medium and Large, with a loading state. `sentiment` sets whether the change is good or bad, for numbers like churn where down is good.

### Changes

- **No setup**: install `@halo-ds/react` and import components. The styles, the design tokens and the Geist font now load by themselves, so there are no CSS or font imports to add. The tokens sit in a CSS layer, so your own brand variables win whatever order files load in. `@halo-ds/react/styles.css` and `@halo-ds/tokens` still exist for anyone who wants to load styles by hand.
- **Card**: anything in `media` now fills the 4:3 box, not only images, videos and SVGs. Before, a gradient or your own block left an empty band under it.
- **Badge**: solid Information, Success and Warning badges now have dark text, and solid Error sits on a deeper red, so their labels are readable. White text on those bright fills was too faint.
- **Link button**: now reads `text/link` and `text/link-destructive`, which turn lighter in dark mode. Before, purple and red links were hard to read on dark backgrounds.
- **Calendar and DatePicker**: the month and year picker is now on by default. Click the month name to jump to any month, or the year to jump to any year, as well as using the arrows. Set `header="arrows"` (or `calendarHeader="arrows"` on DatePicker) to keep the old plain title. Calendars showing two months side by side still use arrows.
- **Next.js**: the React package now starts with `'use client'`, so Halo components work in Next.js App Router pages without errors.
- **Fields in forms**: Combobox, the date pickers and the colour input take a `name` and submit their values with the form, like the other fields. Date pickers send YYYY-MM-DD.
- **Table extras**: `stickyHeader` with `maxHeight` keeps the header in view while rows scroll, and `stickyFirstColumn` keeps the first column in view on wide tables. `TableHeaderCell` takes a `filter` that opens from a funnel button. New `TableExpandToggle` and `TableExpandedRow` for rows that open to show details. `DataTable` wires these up: column `filters` (with an optional `onFilter`) and `expandable` with `rowExpandable`.
- **Stepper on small screens**: a horizontal Stepper now switches to the compact version by itself when it has less than 600px, like on a phone. Change the width with `compactBelow`, or pass `false` to keep it horizontal.
- **Premium button**: `variant="premium"` is a violet, purple and rose gradient for upgrades and paid features, like Upgrade to Pro or Start free trial. Use at most one per screen and never next to a Primary button. It comes in every size, with icons, icon-only and loading. In Figma it's Type=Premium.

### Tokens

- New `text/link` and `text/link-destructive` (`--halo-text-link*`) for Link buttons: the bright purple and red in light mode, lighter versions in dark mode.
- New `fill/brand`, `fill/brand-hover` and `fill/disabled` (`--halo-fill-*`) for solid fills that aren't buttons: checkboxes, radios, switches, sliders, progress, spinners, the stepper, the active tab line and brand badges. These components no longer read the `button/*` tokens, so restyling buttons leaves them alone; to rebrand both, set `--halo-fill-brand` too (see Theming). Hover backgrounds in menus, lists, calendars and trees now read `surface/secondary`, and the Accordion's hover text reads `text/brand`.
- `button/premium-start`, `button/premium-middle` and `button/premium-end` set the Premium gradient (`--halo-button-premium-*`).

## 0.2.0

**Breaking:** the date range picker's `placeholder` prop is now `startPlaceholder` and `endPlaceholder`. Everything else is new or backwards compatible.

### New components

- **Time picker**: `TimePicker` and `TimePickerField`. A list of times at a set step, in 12 or 24 hours, with `min` and `max`.
- **Rating**: stars for giving a score or showing an average, with half stars and a read-only mode.
- **Carousel**: `Carousel` and `CarouselSlide`, with arrows, dots and several slides per view. It never moves on its own.
- **Charts**: `LineChart`, `AreaChart`, `BarChart` (vertical or horizontal, grouped or stacked), `PieChart` (pie or donut) and `Sparkline`. Drawn with SVG and no chart library. They fill their container, show fewer labels on small screens, have hover, tap and keyboard tooltips, and give screen readers a table of the numbers.
- **QR code**: `QRCode` draws a scannable code from any text or link, with an encoder built in (no extra package). Three sizes, all four error correction levels, an optional logo in the middle, and loading and expired states with a Refresh button. It stays dark on light in dark mode so every phone can read it. A `scanned` status shows when a phone has read the code. `color` and `bgColor` set custom colours, and `labels` changes the cover text for other languages.
- **Tour**: shows new people around a screen one step at a time. Each step points at part of the page like a Popover, with Back, Next and Skip, a "2 of 5" counter or dots, an optional image, and a spotlight that dims the rest of the page. Steps without a target sit in the middle for a welcome or wrap-up. Arrow keys move between steps, Escape skips, and `onFinish` and `onSkip` let the app remember it was seen.
- **Event calendar**: `EventCalendar` is a full-size calendar for planning. Click the title to open a calendar and jump to any date (its month name jumps to other months and years), and a switch changes the view; events over several days run as one bar, busy days show "+2 more", and `renderDay` adds your own content to each day. Under 600px wide it shows dots and lists the chosen day's events. Event colours use the Tag colours. Day and Week views show hours with timed events placed by their start and end, overlapping events side by side, an all-day row and a line at the current time; `onSlotClick` gives the time of an empty slot people click. Events can show an `avatar` before the title and a `detail` line, like the reason for an appointment, instead of the time.

### Changes

- **Top bar on phones**: with a menu button, the logo now leaves the bar too, so it only holds the menu button and the actions. Open a Drawer from the menu button with the logo at the top and the links below; the Top bar story shows how.
- **Style the parts inside any component**: every component takes `classNames` and `styles` keyed by part name, like `<Modal classNames={{ header: 'my-header' }} />` or `<Table styles={{ cell: { padding: 8 } }} />`. Your classes are added after Halo's and your styles are merged on top. Outer elements get `data-halo` with the component's name and parts get `data-part`, so you can also style them from your own CSS: `[data-halo='modal'] [data-part='header']`. Each component exports its part names as a type (like `ModalPart`). Fields with a label take `fieldClassNames` and `fieldStyles` for the label, hint and count. A new **Customising** docs page explains it all.
- **Find the code from Figma**: every component set in Figma links to its Storybook page and shows its React import in Dev Mode. Code Connect files in `packages/react/figma` are ready to publish for teams on a Figma plan that supports it (see CONTRIBUTING).

- **Button**: new `loading` prop shows a Spinner and ignores clicks while an action runs.
- **Select**: new `icon` prop for an icon at the start of the box.
- **Toast**: a soft shadow under it, so it reads as floating over the page.
- **Event calendar**: the back and forward arrows now sit either side of the title they change (‹ 12 – 18 Oct 2026 ›), and the title keeps a steady width so the arrows stay put. There is no Today button; the calendar that opens from the title marks today.
- **Calendar and DatePicker**: new month and year picker (`header="picker"` on Calendar, `calendarHeader="picker"` on DatePicker). Click the month name (plain text, no dropdown arrow) to swap the days for the twelve months, or the year for a grid of years, to jump straight to a date years away.
- **Several dates**: new `MultiDatePicker` and `MultiDatePickerField` pick separate days, like days off, and show each as a Tag in the box. Calendar has a matching `mode="multiple"`, with `maxCount` to set a limit.
- **Popovers and menus**: a menu opened inside another panel, like a Select in a date picker, no longer closes the panel when you pick from it, and Escape closes only the top one.
- **Rich text editor**: new `size="sm"` for phones and narrow panels: tighter padding and a toolbar that scrolls sideways in one row.
- **Popover**: stays on screen when it opens to the left or right of something near the top or bottom edge.
- **Tag**: new `color` prop. Pick one of seven preset colours (`blue`, `green`, `yellow`, `orange`, `red`, `pink`, `purple`) or pass any CSS colour, like `"#7C3AED"`, for colours people choose themselves. Neutral stays the default.
- **Field states**: every text, select, combobox, date, time, colour, textarea and rich text field shows a red warning icon inside the box when it has an error, next to the red border and the message. **Input** also takes a new `valid` prop that shows a green check, with no green border and no message. The error message under a field no longer has its own icon, since the box shows it.
- **Date range picker**: the box now reads "Start date – End date". **Breaking:** `placeholder` is replaced by `startPlaceholder` and `endPlaceholder`.

### Tokens

- New `icon/rating` and `icon/rating-empty` colours.
- New `chart/series-1` to `chart/series-6` and `chart/grid` colours, with dark mode values.
- New `tag/<colour>/surface` and `tag/<colour>/text` colours for blue, green, yellow, orange, red, pink and purple tags, with dark mode values.
- New `shadow/soft` colour for shadows under things that float over the page, with a darker dark mode value.

## 0.1.0

First public release.
