# Choosing a component by job

Find the job, then check the component's props with `get_component` (or `npx halo-ds docs <name>`) before using it.

## Doing things

| Job | Component |
| --- | --- |
| The main action, or its alternative | `Button` (`variant`: primary, secondary, ghost, destructive, premium) |
| A quiet action, or going somewhere | `LinkButton` |
| An icon-only action in a toolbar, table row or card | `CompactButton` |
| A few related actions joined together | `ButtonGroup` |
| Sign in with Google, Apple, GitHub and others | `SocialButton` |
| A short list of actions behind a button | `Menu` |

## Collecting input

| Job | Component |
| --- | --- |
| A form with sections, rows and checks | `Form`, `FormSection`, `FormRow`, `FormActions` |
| A line of text: name, email, password | `InputField` |
| A number with minus and plus | `NumberInput` |
| A sign-in code, one box per digit | `VerificationCode` |
| Several lines of text | `TextareaField` |
| Text with headings, lists and links | `RichTextEditorField` |
| One option from a long list | `SelectField` |
| Search a list, or pick several | `Combobox` |
| One option from 2 to 5, all visible | `RadioGroup` with `Radio` |
| Any number of options, or agreeing to terms | `Checkbox` |
| A setting that applies straight away | `Switch` |
| A rough value or range by dragging | `Slider`, `RangeSlider` |
| A date, a range, or several dates | `DatePickerField`, `DateRangePickerField`, `MultiDatePickerField` |
| A time of day | `TimePickerField` |
| A colour | `ColorField` |
| Files | `FileUpload` with a `FileItem` per file |
| A score | `Rating` |
| One option from nested groups | `TreeSelectField` |
| Switch how the same content is shown | `SegmentedControl` |

## Moving around

| Job | Component |
| --- | --- |
| The app's main navigation | `Sidebar` with `NavItem` and `NavGroup`, or `TopBar` |
| Sections of the same page | `Tabs`, `TabList`, `Tab`, `TabPanel` |
| The way back up from a deep page | `Breadcrumbs`, `BreadcrumbItem` |
| Pages of a long list | `Pagination` |
| Steps that must be done in order | `Stepper` |

## Telling people something

| Job | Component |
| --- | --- |
| A message that stays in the page | `Alert` |
| A short confirmation that disappears | `Toast`, through `useToast()` (wrap the app in `ToastProvider`) |
| Progress you can measure | `ProgressBar`, `ProgressCircle` |
| A short wait | `Spinner`, `LoadingIndicator` |
| Content still loading, with a known layout | `Skeleton` |
| Nothing to show yet | `EmptyState` |
| The outcome of an action, or a page that can't show | `Result` |
| A label on hover or focus | `Tooltip` |
| A first-time walkthrough | `Tour` |

## Over the page

| Job | Component |
| --- | --- |
| A decision that must be answered | `Modal` |
| A panel from the edge: filters, details, a form | `Drawer` |
| A small panel next to what was clicked | `Popover` |

## Showing data

| Job | Component |
| --- | --- |
| Rows and columns, sorting and selecting | `DataTable`; `Table` parts for a hand-built table |
| A key number and how it changed | `Statistic` |
| Change over time, comparisons, parts of a whole | `LineChart`, `AreaChart`, `BarChart`, `PieChart`, `Sparkline` |
| A box of related content | `Card` |
| Rows of items with actions | `List`, `ListItem` |
| A person or team | `Avatar`, `AvatarGroup` |
| A status, category or count | `Badge` |
| Something people added or can remove | `Tag` |
| A month to pick from, on the page | `Calendar` |
| Plans by day, week, month or year | `EventCalendar` |
| Nested items that open and close | `Tree` |
| Sections that open and close | `Accordion`, `AccordionItem` |
| Slides | `Carousel`, `CarouselSlide` |
| A code to scan with a phone | `QRCode` |
| Panels people resize | `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle` |
| A line between groups | `Divider` |
| Body text | `Text` (headings are plain `h1` and `h2`; see design.md) |
| A picture for an empty state | `Illustration` |
