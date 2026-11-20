# Changelog

Changes to `@halo-ds/react`, `@halo-ds/tokens` and the `halo-ds` CLI. They share one version number.

New work collects under **Unreleased** and goes live in Storybook straight away. It only reaches npm when we choose to release a batch: then the Unreleased heading becomes the new version number (see Releasing in [CONTRIBUTING.md](CONTRIBUTING.md)).

Each entry starts with its type: `[New]`, `[Update]`, `[Bug fix]` or `[Deprecated]`. The same list, with dates, is on the [Changelog page](https://halodesignsystem.dev/docs/changelog).

## Unreleased

## 1.0.0

The first stable release, launched with the website at halodesignsystem.dev and the Figma file on the Figma Community.

- [Bug fix] **Tooltip:** no longer opens from a tap on touch screens, where nothing would close it, and closes when the page scrolls instead of following along.
- [Update] **Round buttons inside fields:** the compact buttons inside Input (show password), Number input, Rich text editor, Color picker and the field info button are fully round, to match the round fields. Figma matches.
- [Update] **Number input:** the number rolls up or down when you press plus or minus. At the limit, the button shakes "no" and the number nudges. The button keeps the disabled look and is marked `aria-disabled`. Off with reduced motion.
- [Update] **Switch:** springier motion. The thumb stretches toward where it is going, lands with a small bounce and rounds back up, and the track fills with the brand colour as it travels. Off with reduced motion.
- [Update] **Overlay:** softly blurs the page by default and uses the new `surface-overlay` colour: black at 40% in light mode and 60% in dark mode, as in Figma. Modal and Drawer use the blur by default too; pass `overlay="dim"` for no blur.
- [Bug fix] **Menu: a destructive item's icon is red too.** Before, the word turned red but its icon stayed black. Figma already had both in red.
- [Update] **List rows have no side padding**, in Figma and code, so their icons and text line up with the content around the list; the container gives the inset. The `card` list is 12px at the sides and 8px at the top and bottom, and rows sit flush (gap 0).
- [New] **New `inset` on `List` and `ListItem`** for lists whose rows can be hovered or selected, like conversations and pickers: each row gets 8px side padding (`spacing-4`) so the highlight doesn't touch the avatar or icon. In Figma, highlighted rows get the same 8px override.
- [New] **Storybook: Calendar and Event calendar playgrounds.** Each has a Playground with controls: mode, months, header, first day of the week and language for Calendar; starting view, header, first day of the week, events per day, first hour, hour height and language for Event calendar.
- [Update] **Event calendar header is simpler.** In the month view, clicking the title opens the twelve months straight away (its year opens the years), instead of a small day calendar. The year view opens the years. In the week and day views the title is plain text and the arrows move it.
- [Update] **Figma: Calendar month and year picker works in prototypes.** The Picker calendar has a new View property (Days, Months, Years). Clicking the month name opens the months, a month goes back to the days, and the year opens the years, like the React Calendar. Existing calendars default to Days.
- [Bug fix] **Tooltip re-centres when its text changes.** A tooltip that changes while open, like "Copy" becoming "Copied", stays centred over its trigger instead of sliding to one side.
- [New] **Figma file on the Community.** The Halo Design System file is published at figma.com/community/file/1704622047377905631, and the website's Figma links open it.
- [Bug fix] **Figma: Link button icons.** Icons now use the same colour as the link text (`text/link`, `text/link-destructive`), so they match in dark mode. They used the button colour, which stayed bright purple while the text turned light pink. The React component already matched.
- [Update] **Website: footer.** Just the licence, where to ask for help (on X) and the copyright. The links it repeated from the top bar are gone.
- [Update] **Website: plainer words.** Shorter page intros that say what is on the page, and switching example apps no longer flashes white in dark mode.
- [Update] **Website: icon.** Adds ICO, PNG and iPhone versions of the site icon, so Google Search, Safari and link previews show the Halo mark instead of a globe.
- [Update] **Website: component cards.** One card everywhere, on the home page and the Components page: a single component in one variant, scaled to fit and centred, with just its name.
- [Bug fix] **Website on phones:** no zoom when tapping a field on iPhone, pages open at the top, tabs and chips scroll sideways with faded ends, and code fades out under the copy button.
- [New] **Website: search and AI assistants.** Every page is a real HTML page with its own title, description, link preview image and structured data, so search engines, link previews and AI assistants that don't run JavaScript can read it. Adds `sitemap.xml` and `robots.txt`, and pages for each address answer with success instead of "not found".
- [Update] **New address:** the website, docs and Storybook live at [halodesignsystem.dev](https://halodesignsystem.dev). Links to the old github.io address redirect there. The CLI, the MCP server, the Figma plugin and the package pages point to the new address.
- [Bug fix] **Settings block** brings its own `ToastProvider`, so it works as soon as it is added. Before, it crashed in an app that had no provider.
- [New] **Figma plugin, Halo UI** has a Light and Dark switch: the window, the previews and the components it places all follow it, whatever theme Figma uses. Inserting is quieter: only the component you click gets every variant in the background, with no spinner, and unfinished work carries on when the plugin opens again.
## 0.6.0

- [Update] **`npx halo-ds init`** makes the page follow Halo: it writes the page's background, text colour and font to `halo-theme.css`, and offers to clear a Vite starter template's own styles. Before, the page kept the template's colours, so light and dark mode only changed the components.
- [Bug fix] **`npx halo-ds docs`** and the MCP server find a component by anything it exports, so `combobox` and `image-upload` work.
- [Update] **Combobox, Date picker and Tree select with several values:** fully round like the other fields while the tags fit on one row. The corners ease only once the tags wrap to a second row.
- [New] **Combobox:** options can have an `avatar`, shown in the list and on the option's tag.
- [Update] **Tag:** an avatar now sits 2px from the top, bottom and left, so the circle fits the tag's round end. Small tags use a 20px avatar.
- [Bug fix] **Sign in and Sign up blocks** use `Form`, so an empty submit shows Halo's error messages under each field. Before, the browser's own "Please fill in this field" bubble appeared.
- [Update] **Table:** selected rows and the selected toolbar use the lighter `surface/minimal` grey. The filter menu in a column header no longer has an empty header row with a close button.
- [Update] **Compact button:** more room around the icon: Large is 28px and Medium is 24px, with the same icon sizes. On press the button stays still and only the icon dips, in place of the shrink and bounce, which was less than a pixel of movement at this size.
- [Update] **Menu, Select, Combobox and Tree select:** long lists still scroll, without a scrollbar beside the items.
- [Update] **Error text** under fields, in Progress and Stepper, and on destructive menu items (Delete) now uses the same red as its icon, `state/error/primary`. Banners and badges on a red tint keep the dark red.
- [Update] **Figma plugin, Halo UI** now works in any file, with no library needed. It carries Halo's components and builds what you click on a "Halo components" page, with Halo's variables and styles. It stays linked when a published Halo library is available.

## 0.5.0

- [New] **Image upload:** a new `ImageUpload` for one picture in a circle, like a profile photo or a company logo. A person or a business, with a title and hint or compact. Upload, change and remove. In Figma on the File upload page.
- [Update] **Input, Select, Combobox, Number input, Date picker, Tree select and Color picker:** icons, avatars, flags and tags now sit snugly inside the round box. The box padding is 6, 8 or 12px for small, medium and large. Text keeps its position through a 4px inset of its own, so a field with only text looks the same.
- [Deprecated] **Claude Code plugin** now holds Halo's four skills only, so it can be listed in Claude's plugin directory. The MCP server is a separate one-line setup: `claude mcp add halo -- npx -y halo-ds mcp`. The skills use it when it is connected, and read the installed package's types and tokens when it isn't.

## 0.4.1

- [New] **Figma plugin, Halo UI** in `packages/figma-plugin`: every Halo component as a card, A to Z, with search. Click one to place it on the canvas, or inside the selected frame. Built with Halo's own components, in light and dark. Works in the Halo file, in a copy from the Community, and in any file that uses a published copy (open the plugin in the copy once). Not on the Figma Community yet.
- [Deprecated] **Claude Code plugin** is now called `halo-ds` and lives in its own repository, so it can be listed in Claude's plugin directory. Install it with `/plugin marketplace add Halo-design-system/halo-claude-plugin`, then `/plugin install halo-ds@halo-design-system`. It is copied there from `plugins/halo-ds` in this repository on every release.
- [Update] **Claude Code plugin** ships a `package-lock.json` that pins `halo-ds` by version and hash, as Claude's plugin directory asks of plugins that run `npx`.
- [Bug fix] **EventCalendar** week and day views always open on the first hour. Before, the grid could sit a pixel off when the fonts finished loading.
- [Bug fix] **EventCalendar:** the month, week and day grids have a white surface of their own, so they stay white on a grey page and days from other months stand out. Before, the page colour showed through.
- [Update] **Table:** selected rows and the toolbar's selected state are light grey (`surface/secondary`) instead of brand pink, so the brand colour stays on the checkboxes. Matches the Figma file.
- [Bug fix] **Table:** the outline is a real border, so its top edge shows on tables without a toolbar. Before, the grey header row covered it.
- [Bug fix] **Tokens:** a dark section inside a light page (an element with `data-theme="dark"`) now gets dark secondary buttons. Five button colours that point at other theme colours are now repeated in the dark theme, so they follow it.

## 0.4.0

### New

- [New] **Blocks**: eight ready-made page sections built from Halo components: Sign in, Sign up, Dashboard, Customers table, Settings, Empty projects, Pricing and Page not found. Each has a live preview at desktop, tablet and phone widths at the end of the Components page, and copyable code.
- [New] **`npx halo-ds add <block>`** adds a block to your app as a file in `src/blocks`, and installs what it needs. In Next.js it marks the file as a client component.
- [New] **MCP server**: two new tools, `list_blocks` and `get_block`, so AI assistants can start a screen from a block. Blocks are also in `llms.txt` and as Markdown at `/components/blocks/<name>.md`.

### Fixed

- [Bug fix] **PasswordInput** shows dots as its placeholder by default, so an empty password field never looks blank. Pass `placeholder` to change it.
- [Bug fix] **ColorInput** and **ColorField** take a `placeholder`, shown while the hex box is empty.
- [Bug fix] Every text field in the examples, blocks and Storybook now has a placeholder with an example answer.
- [Bug fix] **Accessibility**: automatic checks now open every Storybook story in light and dark mode and run axe on it. They found, and these fixes cover:
  - **Segmented control**, **Table** headers and the **Event calendar**'s days from other months use `text/contrast` instead of `text/secondary`, which was too faint on grey.
  - **Radio group** is announced as a required radio group; **Rich text editor** takes its field label as its name; **Tree select** is read as its label and value, like "Team, Design".
  - **QR code**: the code is the image, so a Refresh button over it can be reached. **List** (divided) draws its lines with borders, so it holds only list items; spacing is unchanged.
  - **Color swatches** in a group say only "selected", not also "pressed". A **Table** that scrolls can be focused and scrolled with the keyboard.
  - **Event calendar** events and day headers are read starting with what they show, and each week's events sit in their own grid cell.
  - Disabled **Switch**, **Checkbox**, **Tag** and **File upload** carry `data-disabled`, for styling and for tools that check contrast.
- [Bug fix] **Table**: the rows-per-page picker no longer shows up empty when the table uses a page size other than 10, 25 or 50.

## 0.3.1

- [Update] Halo moved to the Halo-design-system organization on GitHub. The docs are now at https://halo-design-system.github.io/Halo-design-system/, and the CLI, MCP server, plugin and package pages link there. Old GitHub links redirect.

## 0.3.0

### New

- [New] **CLI** (`halo-ds`): `npx halo-ds init` installs Halo in a Vite or Next.js app, sets light, dark or system mode and can apply a brand colour. `npx halo-ds theme "#2F6BFF"` makes Halo your brand colour in light and dark. `npx halo-ds docs badge` shows when to use a component, how to import it and its do's and don'ts.
- [New] **MCP server**: `npx halo-ds mcp` lets AI assistants (Claude Code, Cursor, VS Code, Windsurf, Claude Desktop) look up Halo while they code: every component's props, working examples, when to use it, do's and don'ts, and the design tokens.
- [New] **Claude Code plugin**: `/plugin marketplace add Halo-design-system/Halo-design-system`, then `/plugin install halo@halo-design-system`. It adds the MCP server and four skills: build-ui, review-ui, brand-theme and migrate (from shadcn/ui, Ant Design or Material UI).
- [New] **Skills for any AI tool**: `npx halo-ds skills` adds Halo's skills to a project (`.claude/skills`) and Halo's rules to `AGENTS.md`, which Cursor, Copilot, Codex and others read. The build-ui skill now has topic guides (choosing components, design, layout, words on screen, accessibility, a review checklist) and two worked examples checked against Halo's types. The MCP server can hand out any of these files with `get_skill`.
- [New] **Plain-text docs**: the website now serves `llms.txt`, `llms-full.txt` and a Markdown page for every component (add `.md` to its address), so AI tools can read Halo from a link.

### New components

- [New] **Nav group**: `NavGroup` holds NavItems under a parent, like Reports with Sales and Traffic inside. In a Sidebar they show indented below and open with the parent; the group opens by itself when one of its pages is selected, and a closed group holding the current page reads as active. In a collapsed Sidebar the icon opens them in a panel, and in a TopBar they open as a dropdown.
- [New] **Form**: `Form`, `FormSection`, `FormRow` and `FormActions`. A form that checks itself: fields with a `name` show the form's errors, `required` fields are checked for you, and `validate` adds your own rules. Errors show after the first submit, focus moves to the first problem, and errors update as people fix them. `errors` shows messages from the server. `layout="horizontal"` puts labels beside fields, and they move above on phones.
- [New] **Tree**: nested items people open and close, like folders, categories or permissions. Pick one row, or turn on `checkable` for checkboxes that cascade: checking a branch checks everything inside it, and a branch shows a dash when partly checked. Full keyboard support (arrow keys, Home, End, Enter, Space), icons per row, two sizes.
- [New] **Tree select**: `TreeSelect` and `TreeSelectField`. A Select-style box that opens a Tree, for picking from nested options. Single, or `multiple` with checkboxes and tags in the box, with optional `search`.
- [New] **Resizable**: `ResizablePanelGroup`, `ResizablePanel` and `ResizableHandle`. Panels people resize by dragging the line between them, side by side or stacked, and nested. Sizes are in percent with a minimum and maximum. Handles work with the arrow keys, Home and End, can show a grip, and `onLayout` reports the sizes so you can save them.
- [New] **Result**: the outcome of something people did, like a payment going through, or why a page can't show. Success, error, warning and information show an icon in a circle; not found, no access, server error, offline and maintenance show an illustration. Takes a title, description, actions and details like a receipt, in two sizes.
- [New] **Statistic**: a key number with its label, an optional prefix or suffix, and how it changed (a trend badge and "vs last month"). Small, Medium and Large, with a loading state. `sentiment` sets whether the change is good or bad, for numbers like churn where down is good.

### Changes

- [Bug fix] **Server rendering (Next.js)**: ToastProvider, menus and other pop-ups, the colour picker's eyedropper button and the rich text character count now render the same on the server and in the browser, so Next.js no longer reports hydration errors. Tested in a new Next.js 16 app, in development and production.
- [Update] **No setup**: install `@halo-ds/react` and import components. The styles, the design tokens and the Geist font now load by themselves, so there are no CSS or font imports to add. The tokens sit in a CSS layer, so your own brand variables win whatever order files load in. `@halo-ds/react/styles.css` and `@halo-ds/tokens` still exist for anyone who wants to load styles by hand.
- [Bug fix] **Card**: anything in `media` now fills the 4:3 box, not only images, videos and SVGs. Before, a gradient or your own block left an empty band under it.
- [Bug fix] **Badge**: solid Information, Success and Warning badges now have dark text, and solid Error sits on a deeper red, so their labels are readable. White text on those bright fills was too faint.
- [Update] **Link button**: now reads `text/link` and `text/link-destructive`, which turn lighter in dark mode. Before, purple and red links were hard to read on dark backgrounds.
- [Update] **Calendar and DatePicker**: the month and year picker is now on by default. Click the month name to jump to any month, or the year to jump to any year, as well as using the arrows. Set `header="arrows"` (or `calendarHeader="arrows"` on DatePicker) to keep the old plain title. Calendars showing two months side by side still use arrows.
- [Update] **Next.js**: the React package now starts with `'use client'`, so Halo components work in Next.js App Router pages without errors.
- [Update] **Fields in forms**: Combobox, the date pickers and the colour input take a `name` and submit their values with the form, like the other fields. Date pickers send YYYY-MM-DD.
- [New] **Table extras**: `stickyHeader` with `maxHeight` keeps the header in view while rows scroll, and `stickyFirstColumn` keeps the first column in view on wide tables. `TableHeaderCell` takes a `filter` that opens from a funnel button. New `TableExpandToggle` and `TableExpandedRow` for rows that open to show details. `DataTable` wires these up: column `filters` (with an optional `onFilter`) and `expandable` with `rowExpandable`.
- [Update] **Stepper on small screens**: a horizontal Stepper now switches to the compact version by itself when it has less than 600px, like on a phone. Change the width with `compactBelow`, or pass `false` to keep it horizontal.
- [New] **Premium button**: `variant="premium"` is a violet, purple and rose gradient for upgrades and paid features, like Upgrade to Pro or Start free trial. Use at most one per screen and never next to a Primary button. It comes in every size, with icons, icon-only and loading. In Figma it's Type=Premium.

### Tokens

- [New] New `text/link` and `text/link-destructive` (`--halo-text-link*`) for Link buttons: the bright purple and red in light mode, lighter versions in dark mode.
- [New] New `fill/brand`, `fill/brand-hover` and `fill/disabled` (`--halo-fill-*`) for solid fills that aren't buttons: checkboxes, radios, switches, sliders, progress, spinners, the stepper, the active tab line and brand badges. These components no longer read the `button/*` tokens, so restyling buttons leaves them alone; to rebrand both, set `--halo-fill-brand` too (see Theming). Hover backgrounds in menus, lists, calendars and trees now read `surface/secondary`, and the Accordion's hover text reads `text/brand`.
- [New] `button/premium-start`, `button/premium-middle` and `button/premium-end` set the Premium gradient (`--halo-button-premium-*`).

## 0.2.0

**Breaking:** the date range picker's `placeholder` prop is now `startPlaceholder` and `endPlaceholder`. Everything else is new or backwards compatible.

### New components

- [New] **Time picker**: `TimePicker` and `TimePickerField`. A list of times at a set step, in 12 or 24 hours, with `min` and `max`.
- [New] **Rating**: stars for giving a score or showing an average, with half stars and a read-only mode.
- [New] **Carousel**: `Carousel` and `CarouselSlide`, with arrows, dots and several slides per view. It never moves on its own.
- [New] **Charts**: `LineChart`, `AreaChart`, `BarChart` (vertical or horizontal, grouped or stacked), `PieChart` (pie or donut) and `Sparkline`. Drawn with SVG and no chart library. They fill their container, show fewer labels on small screens, have hover, tap and keyboard tooltips, and give screen readers a table of the numbers.
- [New] **QR code**: `QRCode` draws a scannable code from any text or link, with an encoder built in (no extra package). Three sizes, all four error correction levels, an optional logo in the middle, and loading and expired states with a Refresh button. It stays dark on light in dark mode so every phone can read it. A `scanned` status shows when a phone has read the code. `color` and `bgColor` set custom colours, and `labels` changes the cover text for other languages.
- [New] **Tour**: shows new people around a screen one step at a time. Each step points at part of the page like a Popover, with Back, Next and Skip, a "2 of 5" counter or dots, an optional image, and a spotlight that dims the rest of the page. Steps without a target sit in the middle for a welcome or wrap-up. Arrow keys move between steps, Escape skips, and `onFinish` and `onSkip` let the app remember it was seen.
- [New] **Event calendar**: `EventCalendar` is a full-size calendar for planning. Click the title to open a calendar and jump to any date (its month name jumps to other months and years), and a switch changes the view; events over several days run as one bar, busy days show "+2 more", and `renderDay` adds your own content to each day. Under 600px wide it shows dots and lists the chosen day's events. Event colours use the Tag colours. Day and Week views show hours with timed events placed by their start and end, overlapping events side by side, an all-day row and a line at the current time; `onSlotClick` gives the time of an empty slot people click. Events can show an `avatar` before the title and a `detail` line, like the reason for an appointment, instead of the time.

### Changes

- [Update] **Top bar on phones**: with a menu button, the logo now leaves the bar too, so it only holds the menu button and the actions. Open a Drawer from the menu button with the logo at the top and the links below; the Top bar story shows how.
- [New] **Style the parts inside any component**: every component takes `classNames` and `styles` keyed by part name, like `<Modal classNames={{ header: 'my-header' }} />` or `<Table styles={{ cell: { padding: 8 } }} />`. Your classes are added after Halo's and your styles are merged on top. Outer elements get `data-halo` with the component's name and parts get `data-part`, so you can also style them from your own CSS: `[data-halo='modal'] [data-part='header']`. Each component exports its part names as a type (like `ModalPart`). Fields with a label take `fieldClassNames` and `fieldStyles` for the label, hint and count. A new **Customising** docs page explains it all.
- [New] **Find the code from Figma**: every component set in Figma links to its Storybook page and shows its React import in Dev Mode. Code Connect files in `packages/react/figma` are ready to publish for teams on a Figma plan that supports it (see CONTRIBUTING).

- [New] **Button**: new `loading` prop shows a Spinner and ignores clicks while an action runs.
- [New] **Select**: new `icon` prop for an icon at the start of the box.
- [Update] **Toast**: a soft shadow under it, so it reads as floating over the page.
- [Update] **Event calendar**: the back and forward arrows now sit either side of the title they change (‹ 12 – 18 Oct 2026 ›), and the title keeps a steady width so the arrows stay put. There is no Today button; the calendar that opens from the title marks today.
- [New] **Calendar and DatePicker**: new month and year picker (`header="picker"` on Calendar, `calendarHeader="picker"` on DatePicker). Click the month name (plain text, no dropdown arrow) to swap the days for the twelve months, or the year for a grid of years, to jump straight to a date years away.
- [New] **Several dates**: new `MultiDatePicker` and `MultiDatePickerField` pick separate days, like days off, and show each as a Tag in the box. Calendar has a matching `mode="multiple"`, with `maxCount` to set a limit.
- [Bug fix] **Popovers and menus**: a menu opened inside another panel, like a Select in a date picker, no longer closes the panel when you pick from it, and Escape closes only the top one.
- [New] **Rich text editor**: new `size="sm"` for phones and narrow panels: tighter padding and a toolbar that scrolls sideways in one row.
- [Bug fix] **Popover**: stays on screen when it opens to the left or right of something near the top or bottom edge.
- [New] **Tag**: new `color` prop. Pick one of seven preset colours (`blue`, `green`, `yellow`, `orange`, `red`, `pink`, `purple`) or pass any CSS colour, like `"#7C3AED"`, for colours people choose themselves. Neutral stays the default.
- [Update] **Field states**: every text, select, combobox, date, time, colour, textarea and rich text field shows a red warning icon inside the box when it has an error, next to the red border and the message. **Input** also takes a new `valid` prop that shows a green check, with no green border and no message. The error message under a field no longer has its own icon, since the box shows it.
- [Deprecated] **Date range picker**: the box now reads "Start date – End date". **Breaking:** `placeholder` is replaced by `startPlaceholder` and `endPlaceholder`.

### Tokens

- [New] New `icon/rating` and `icon/rating-empty` colours.
- [New] New `chart/series-1` to `chart/series-6` and `chart/grid` colours, with dark mode values.
- [New] New `tag/<colour>/surface` and `tag/<colour>/text` colours for blue, green, yellow, orange, red, pink and purple tags, with dark mode values.
- [New] New `shadow/soft` colour for shadows under things that float over the page, with a darker dark mode value.

## 0.1.0

First public release.
