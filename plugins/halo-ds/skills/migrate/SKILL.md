---
name: migrate
description: Move a React app or screen from shadcn/ui, Ant Design or Material UI to the Halo design system (@halo-ds/react). Use when the user asks to migrate, switch, convert or replace their UI library with Halo.
---

# Migrate to Halo

Work one screen or feature at a time, so the app keeps working in between.

## 1. Prepare

- Run `npx halo-ds init` if Halo isn't installed. Both libraries can live side by side while you migrate.
- If the old library had a brand colour, apply it with `npx halo-ds theme "<hex>"`.
- Call the Halo MCP tool `get_setup_and_rules` once.

## 2. Map each component

Find the Halo equivalent, then check its props with `get_component` before rewriting. Never carry props across by name; many differ.

| shadcn/ui | Ant Design | Material UI | Halo |
| --- | --- | --- | --- |
| Button | Button | Button | Button (`variant`: primary, secondary, ghost, destructive) |
| Button size="icon" | Button icon only | IconButton | CompactButton, or Button `iconOnly` |
| Input + Label | Input in Form.Item | TextField | InputField (label, hint and error built in) |
| Textarea | Input.TextArea | TextField multiline | TextareaField |
| Select | Select | Select | SelectField; Combobox to search or pick several |
| Checkbox, RadioGroup, Switch | Checkbox, Radio, Switch | Checkbox, Radio, Switch | Checkbox, RadioGroup + Radio, Switch |
| Slider | Slider | Slider | Slider, RangeSlider |
| Calendar, date picker | DatePicker, RangePicker | DatePicker (MUI X) | DatePickerField, DateRangePickerField, Calendar |
| Form (react-hook-form) | Form | (none) | Form, FormSection, FormRow, FormActions |
| Dialog, AlertDialog | Modal | Dialog | Modal |
| Sheet, Drawer | Drawer | Drawer | Drawer |
| Popover | Popover | Popover | Popover |
| DropdownMenu | Dropdown | Menu | Menu |
| Tooltip | Tooltip | Tooltip | Tooltip |
| Toast, Sonner | message, notification | Snackbar | Toast via `useToast` (ToastProvider at the root) |
| Alert | Alert | Alert | Alert |
| Tabs | Tabs | Tabs | Tabs, TabList, Tab, TabPanel |
| Table (+ TanStack) | Table | Table, DataGrid | DataTable; Table parts for hand-built tables |
| Card | Card | Card | Card |
| Badge | Tag (status) | Chip, Badge | Badge for a status, Tag for something removable |
| Avatar | Avatar | Avatar | Avatar, AvatarGroup |
| Progress | Progress | LinearProgress | ProgressBar, ProgressCircle |
| Skeleton | Skeleton | Skeleton | Skeleton |
| Breadcrumb | Breadcrumb | Breadcrumbs | Breadcrumbs, BreadcrumbItem |
| Pagination | Pagination | Pagination | Pagination |
| Accordion | Collapse | Accordion | Accordion, AccordionItem |
| Separator | Divider | Divider | Divider |
| Sidebar | Layout.Sider + Menu | Drawer + List | Sidebar, NavItem, NavGroup, TopBar |
| Steps | Steps | Stepper | Stepper |
| Empty | Empty | (none) | EmptyState |
| Result | Result | (none) | Result |

If something isn't in the table, use `find_component` with what it does.

## 3. Rewrite

- Replace imports and JSX, then the props, from `get_component`.
- Replace the old library's colours and spacing with Halo tokens (`get_tokens`); remove leftover Tailwind colour classes or theme overrides that styled the old components.
- Remove the old library's CSS imports and providers once nothing uses them.

## 4. Check

- The screen works with the keyboard and in light and dark mode.
- Run the review-ui skill on the migrated files.
- When no file imports the old library, remove it from package.json.
