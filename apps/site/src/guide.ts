// Usage guidance from the documentation pages in the Figma file: when to use each component,
// one example in context, do's and don'ts, and how it compares with similar components.
// Example images live in public/usage.

export interface Guide {
  callout: string;
  about: string[];
  example: { width: number; height: number; caption: string } | null;
  dos: string[];
  donts: string[];
  compare: { title: string; intro: string; options: { title: string; points: string[] }[] }[];
}

/** Keyed by the component slug. Components that share a Figma page point at the same guide. */
export const guides: Record<string, Guide> = {
  "accordion": {
    "callout": "Stacked sections that open and close, so people can scan titles and expand only what they need.",
    "about": [
      "Use an accordion to organise long content into sections: FAQs, settings groups, filters, or details that most people can skip. Each item is an Accordion item: a header with a title and a plus or minus button, and a content slot that opens below it, where you can put anything.",
      "Accordion items have two states (collapsed and expanded) and four interactions. Stack as many as you need."
    ],
    "example": {
      "width": 518,
      "height": 520,
      "caption": "A help page stacks items on the page background. One item is open; the rest stay collapsed so people can scan the titles."
    },
    "dos": [
      "Keep titles short and specific so people can scan them.",
      "Use accordions for content most people can skip.",
      "Open the first item when one section is most important.",
      "Turn off the last divider inside cards."
    ],
    "donts": [
      "Hide information everyone needs; show it on the page instead.",
      "Nest accordions inside accordions.",
      "Put the main action of a page inside a collapsed item.",
      "Use an accordion for just one or two short sections."
    ],
    "compare": []
  },
  "alert": {
    "callout": "A message inside the page that tells people something important, and stays until it is dealt with.",
    "about": [
      "Use an alert for information people need while they are on a page: a problem to fix, a change to know about, or a success worth confirming. Pick the type for its meaning, the style for how loud it should be, and the layout for where it sits. For short confirmations that disappear, use a Toast; for questions that must be answered, use a Modal."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "A Soft Warning banner across the top of a page, with the fix as its action."
    },
    "dos": [
      "Put the alert next to what it is about.",
      "Say what happened, then what to do next.",
      "Give an action when there is a fix, like \"Update card\".",
      "Show one alert per message; don't stack many."
    ],
    "donts": [
      "Use an alert for a quick confirmation; use a Toast.",
      "Rely on colour alone; the icon and words carry the meaning.",
      "Show several Filled alerts on one page.",
      "Let people dismiss an error they still have to fix."
    ],
    "compare": [
      {
        "title": "Alert, Toast or Modal?",
        "intro": "All three show messages. Pick by how long it should stay, and whether people must answer.",
        "options": [
          {
            "title": "Alert",
            "points": [
              "Stays in the page until it is fixed or dismissed.",
              "Doesn't block anything.",
              "For problems, warnings and important updates."
            ]
          },
          {
            "title": "Toast or Modal",
            "points": [
              "Toast: a short confirmation that disappears by itself, like \"Changes saved\".",
              "Modal: a question that must be answered before carrying on.",
              "If people can carry on without acting, don't use a Modal."
            ]
          }
        ]
      }
    ]
  },
  "avatar": {
    "callout": "A small picture that stands for a person, team or account.",
    "about": [
      "Avatars help people recognise who is who: in comments, member lists, profiles and shared files. They show a photo or illustration when there is one, and initials or an icon when there is not.",
      "The Avatar family has four parts: Avatar (the picture), Avatar image (90 ready-made faces), Avatar status (presence dots and badges) and Avatar group (several avatars overlapping)."
    ],
    "example": {
      "width": 518,
      "height": 560,
      "caption": "A profile card: XL avatar with Verified on top and Online at the bottom, Text for the name and role, and Buttons for the actions."
    },
    "dos": [
      "Show the person's name next to the avatar, or in a Tooltip when space is tight.",
      "Use a real photo when one exists; fall back to Initials, then Icon.",
      "Keep the same colour for the same person everywhere.",
      "Put identity badges on top and presence at the bottom."
    ],
    "donts": [
      "Rely on the status colour alone; say \"Online\" or \"Busy\" somewhere too.",
      "Use more than two badges on one avatar.",
      "Mix sizes in the same list or group.",
      "Use the Avatar image faces for real people in production; replace them with the person's own photo."
    ],
    "compare": []
  },
  "badge": {
    "callout": "A small label that shows the status, category or count of something.",
    "about": [
      "Use a badge to tag an item with a short status like Active or Beta, or to show a count like 3 unread. Badges are read-only: to filter or remove something, use a Tag instead. Pick the colour for its meaning, the style for how much it should stand out, and the size to match the text around it."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "A team list: Soft badges show each role and status, quiet enough to repeat on every row."
    },
    "dos": [
      "Keep labels to one or two words, in sentence case.",
      "Use the same colour for the same status everywhere in your product.",
      "Use Soft in lists and tables; save Solid for the one thing that must stand out.",
      "Cap big counts, for example 99+."
    ],
    "donts": [
      "Rely on colour alone; the label must say what it means.",
      "Make badges clickable; use a Tag or a Button instead.",
      "Put sentences in a badge; use helper text instead.",
      "Line up several Solid badges side by side."
    ],
    "compare": [
      {
        "title": "Badge or Tag?",
        "intro": "They look alike, but a badge only shows information. A tag is something people can act on.",
        "options": [
          {
            "title": "Badge",
            "points": [
              "Shows a status, category or count.",
              "Read-only: nothing to click, nothing to remove.",
              "Sits next to the thing it describes."
            ]
          },
          {
            "title": "Tag",
            "points": [
              "Something people chose or can act on, like a filter or a label they added.",
              "Can be clicked, selected or removed with an ×.",
              "Lives in inputs, filter bars and lists of choices."
            ]
          }
        ]
      }
    ]
  },
  "breadcrumbs": {
    "callout": "A trail of links that shows where a page sits, and takes people back up a level in one click.",
    "about": [
      "Use breadcrumbs on pages that sit two or more levels deep, like settings, files or product categories. Each level is a link except the last, which is the page you are on. On long paths the middle levels collapse into a \"…\" button so the trail stays on one line."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "A settings page: the trail sits above the title and leads back to Settings and Home."
    },
    "dos": [
      "Place breadcrumbs at the top of the page, above the title.",
      "Match each label to the title of the page it links to.",
      "End with the current page, as plain text.",
      "Collapse the middle levels when the trail gets long."
    ],
    "donts": [
      "Use breadcrumbs for steps in a process; use a Stepper instead.",
      "Show them on top-level pages with nothing above.",
      "Mix slash and caret separators in one product.",
      "Let the trail wrap onto two lines."
    ],
    "compare": []
  },
  "button": {
    "callout": "Buttons let people take an action with a single click or tap.",
    "about": [
      "Use a button for actions: saving, submitting, opening a dialog or starting a flow. For moving to another page, use a link instead.",
      "Halo buttons come in four types, four sizes and five states, with optional icons on either side or an icon on its own. Every colour, space and corner comes from Halo tokens, so buttons work in light and dark mode automatically."
    ],
    "example": {
      "width": 518,
      "height": 460,
      "caption": "A form ends with one Primary button for the main action and a Secondary button for the alternative, grouped on the right."
    },
    "dos": [
      "Use one primary button per view, for the most important action.",
      "Pair a primary with a secondary for the alternative (Save and Cancel).",
      "Write short, specific labels that start with a verb.",
      "Use Destructive for actions that delete data, and confirm them first.",
      "Use Premium for upgrades and paid features, at most once per screen."
    ],
    "donts": [
      "Put several primary buttons side by side; people won't know which matters.",
      "Use a button to go to another page; use a link.",
      "Mix sizes in the same group of buttons.",
      "Use Destructive styling for actions that are easy to undo.",
      "Put Premium next to a Primary button, or use it for everyday actions like Save."
    ],
    "compare": []
  },
  "compact-button": {
    "callout": "A small icon button for actions that sit beside other content: close, copy, more, edit.",
    "about": [
      "Use a compact button where a full button would be too heavy, like the close icon on a dialog, actions in a table row or tools in a toolbar. It holds a single icon, with no label.",
      "Compact buttons come in three styles, two sizes and six states, with square or round corners. They can also stay switched on (Selected), like Bold in a text editor."
    ],
    "example": {
      "width": 518,
      "height": 460,
      "caption": "Ghost compact buttons close the card and open more options. In the toolbar, Bold is Selected because it is switched on."
    },
    "dos": [
      "Use icons people already know: close, copy, edit, delete, more.",
      "Keep one style in a group, for example all Ghost in a toolbar.",
      "Show a tooltip with the action name on hover.",
      "Use Selected only for buttons that switch something on and off."
    ],
    "donts": [
      "Use a compact button for the main action on a page; use a Button.",
      "Mix styles and corner shapes side by side.",
      "Rely on an unfamiliar icon alone with no tooltip.",
      "Use Medium on touch screens."
    ],
    "compare": [
      {
        "title": "Compact button or Button?",
        "intro": "Both can show a single icon. Choose by how much attention the action needs.",
        "options": [
          {
            "title": "Compact button",
            "points": [
              "Secondary actions next to content: close, copy, edit, more.",
              "Toolbars and table rows, where space is tight.",
              "Toggles that stay on (Selected)."
            ]
          },
          {
            "title": "Button (icon only)",
            "points": [
              "Main actions that need to be easy to see and tap.",
              "Places where it sits next to other Buttons, so sizes and colours match.",
              "Actions on touch screens, where a bigger target helps."
            ]
          }
        ]
      }
    ]
  },
  "social-button": {
    "callout": "Lets people sign in or connect an account with a service they already use.",
    "about": [
      "Use social buttons on sign-in, sign-up and account-linking screens. Each one shows the provider's logo and name, so people recognise it at a glance.",
      "Social buttons come for six providers (Apple, Google, X, LinkedIn, Dropbox and GitHub), in two styles, with or without a label, and in three states. Filled buttons use each provider's brand colour."
    ],
    "example": {
      "width": 518,
      "height": 580,
      "caption": "A sign-in screen stacks full-width Filled buttons, one per provider, above the email option. Each label names the provider."
    },
    "dos": [
      "Name the provider in the label: \"Continue with Google\".",
      "Use the same style and width for every social button on a screen.",
      "Keep logos as they are: same colours, shape and proportions.",
      "Offer email or another option alongside social sign-in."
    ],
    "donts": [
      "Recolour a logo or put it on a colour the provider does not allow.",
      "Mix Filled and Outline buttons in one group.",
      "Use vague labels like \"Login with brand\" or just \"Continue\".",
      "Make social sign-in the only way in."
    ],
    "compare": []
  },
  "link-button": {
    "callout": "A text-only button for low-emphasis actions and for going somewhere.",
    "about": [
      "Use a link button for secondary actions and navigation that should not compete with buttons: \"Forgot password?\", \"View all\", \"Learn more\". It is just text, with an optional icon on either side, and it underlines when you point at it or reach it with the keyboard.",
      "Link buttons come in two types and two sizes, with four states."
    ],
    "example": {
      "width": 518,
      "height": 460,
      "caption": "A Primary link sits under a password field for a secondary path, without competing with the main button."
    },
    "dos": [
      "Write labels that say where it goes: \"View all projects\", not \"Click here\".",
      "Use a trailing arrow for links that take you somewhere.",
      "Keep link buttons for secondary actions; use a Button for the main one.",
      "Use Destructive only for actions that remove something."
    ],
    "donts": [
      "Use a link button for the main action on a screen.",
      "Put several link buttons side by side as a menu; use navigation instead.",
      "Remove the underline on hover or focus.",
      "Use vague labels like \"Here\" or \"More\"."
    ],
    "compare": [
      {
        "title": "Link button or Button?",
        "intro": "Choose by how much attention the action needs.",
        "options": [
          {
            "title": "View all",
            "points": [
              "Link button",
              "Navigation: going to another page or section.",
              "Low-emphasis actions next to content: \"View all\", \"Edit\".",
              "Places where a button would be too heavy."
            ]
          },
          {
            "title": "Save changes",
            "points": [
              "Button",
              "The main action on a screen: \"Save\", \"Continue\".",
              "Actions inside forms and dialogs.",
              "Anything that needs to stand out."
            ]
          }
        ]
      }
    ]
  },
  "button-group": {
    "callout": "A row of joined buttons for related actions, shown as one control.",
    "about": [
      "Use a button group for a few actions that belong together, like Copy, Share and Download, a split button with a dropdown, or zoom controls. Items are joined into one pill with thin dividers. In Figma, add or remove items in the Items slot without detaching."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "File actions: three related actions joined into one control, each with an icon and a label."
    },
    "dos": [
      "Group two to five related actions.",
      "Keep every item the same size.",
      "Give icon-only items an accessible name and a Tooltip.",
      "Put the most common action first."
    ],
    "donts": [
      "Use a button group to pick one option; use a Segmented control.",
      "Mix unrelated actions in one group.",
      "Put a Primary or Destructive button inside a group.",
      "Let a group wrap onto two lines."
    ],
    "compare": [
      {
        "title": "Button group or Segmented control?",
        "intro": "They look alike. A button group runs actions; a segmented control picks one option.",
        "options": [
          {
            "title": "Button group",
            "points": [
              "Each item runs an action, like Copy or Share.",
              "Nothing stays selected after a click.",
              "For toolbars, split buttons and zoom controls."
            ]
          },
          {
            "title": "Segmented control",
            "points": [
              "Picks one option from a set, like Day, Week or Month.",
              "One option is always selected.",
              "For switching views, modes or filters."
            ]
          }
        ]
      }
    ]
  },
  "calendar": {
    "callout": "Month grids for picking dates, and a full calendar for plans.",
    "about": [
      "Calendar is the small month grid for picking one day, a range or several days. It sits inside the Date pickers or on its own, with arrows or month and year menus. Event calendar fills a page to show plans by day, week, month or year, with events in the days. Both live here; the boxes that open a Calendar are on the Date picker page."
    ],
    "example": {
      "width": 641,
      "height": 677,
      "caption": "Give each kind of event one colour, and keep to a few. The title says what it is."
    },
    "dos": [
      "Start on today, or on the month people last looked at.",
      "Use a few colours, each with one meaning, and say what they mean.",
      "Open the event, or a short list of the day, when people pick it.",
      "Use Menus when people jump far ahead or back, like bookings or history."
    ],
    "donts": [
      "Use colour as the only way to tell events apart; the title says what it is.",
      "Squeeze more than three events into a day; let \"+2 more\" list the rest.",
      "Use it to pick a single date in a form; use a Date picker.",
      "Show both a month and a year menu on very small screens without testing them."
    ],
    "compare": [
      {
        "title": "Event calendar or Calendar?",
        "intro": "Calendar is for picking a date. Event calendar is for seeing and planning what happens on each date.",
        "options": [
          {
            "title": "Calendar",
            "points": [
              "Picks a day or a range, in a date picker or on its own. Small, with month and year menus for dates far away."
            ]
          },
          {
            "title": "Event calendar",
            "points": [
              "Fills a page. Shows events on each day, opens a day or an event, and switches between month and year."
            ]
          }
        ]
      }
    ]
  },
  "card": {
    "callout": "A container that groups an image and content about one thing, like a file, a project or an article.",
    "about": [
      "A card has two slots. Media holds an image, video thumbnail or illustration, and can be hidden. Content holds anything you need below it: a title and description, an icon and an avatar, badges, or buttons. Add, remove or rearrange what is inside without detaching."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "A grid of files: each card opens the file, so the whole card is clickable."
    },
    "dos": [
      "Keep cards in a set the same width and layout.",
      "Use images with a consistent shape, so a grid lines up.",
      "Put the most important text first: the title, then details.",
      "Make the whole card clickable when it opens one thing."
    ],
    "donts": [
      "Put buttons inside a card that is also clickable.",
      "Cram long text into a card; link to a full page instead.",
      "Mix cards with and without media in one row.",
      "Use a card to wrap a single line of text."
    ],
    "compare": [
      {
        "title": "Clickable or not?",
        "intro": "A card is either one big link, or a container with its own buttons. Never both.",
        "options": [
          {
            "title": "Clickable card",
            "points": [
              "The whole card opens one thing, like a file or a project.",
              "Use the Hover and Focused states.",
              "Don't put buttons or links inside it."
            ]
          },
          {
            "title": "Card with actions",
            "points": [
              "The card holds content, and its own buttons do things.",
              "Keep it in the Default state; the buttons have their own hover and focus.",
              "Use this when there is more than one action."
            ]
          }
        ]
      }
    ]
  },
  "carousel": {
    "callout": "A row of slides people step through, one or a few at a time.",
    "about": [
      "Carousel shows slides in a row with Previous and Next buttons on the sides and dots below. People swipe, scroll, click or use the arrow keys. It never moves on its own, so nobody loses their place. A slide can hold an image, a Card or any content."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "A home screen: one promotion at a time, with arrows and dots."
    },
    "dos": [
      "Keep it to a few slides, about 3 to 7.",
      "Show part of what each slide is about, so people know if it's worth a look.",
      "Give it a name for screen readers, like Featured courses.",
      "Show the arrows on larger screens; not everyone can swipe."
    ],
    "donts": [
      "Move the slides on their own; people lose their place.",
      "Put the only copy of important information on slide 3.",
      "Use dots alone for 10 or more slides.",
      "Nest a carousel inside another one."
    ],
    "compare": []
  },
  "charts": {
    "callout": "Line, area, bar, pie and sparkline charts that share one set of colours.",
    "about": [
      "Charts turn numbers into a shape people can read at a glance. Every chart uses the chart/series tokens, a light grid and the same axis labels, so a dashboard full of them still feels calm. Pick the chart by the question it answers: change over time, comparing amounts, or parts of a whole."
    ],
    "example": null,
    "dos": [
      "Give every chart a title that says what it shows, like Revenue this week.",
      "Show the key number above the chart; the chart explains it.",
      "Start bar charts at zero so bars compare fairly.",
      "Use series 1 for the main data and series 6 for Other or last period."
    ],
    "donts": [
      "Use more than six colours; group the rest as Other.",
      "Use purple for chart data; it belongs to the main button.",
      "Use pie charts to compare similar amounts; use bars.",
      "Rely on colour alone; label lines and show values in the tooltip."
    ],
    "compare": []
  },
  "checkbox": {
    "callout": "A box people tick to choose any number of options, or to agree to something.",
    "about": [
      "Use checkboxes when people can pick none, one or several options from a list, or for a single yes or no that takes effect when a form is sent. Checkbox is the box on its own; Checkbox field adds a label and description; Checkbox group holds a labelled list of fields in a slot."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "Settings: a Checkbox group, where people can turn on any mix of options."
    },
    "dos": [
      "Write labels as positive statements, like \"Send me updates\".",
      "Keep lists short, about 10 options at most.",
      "Put options in a logical order, like most common first.",
      "Show an error message next to a box in the Error state."
    ],
    "donts": [
      "Use a checkbox for a setting that changes straight away; use a Switch.",
      "Pre-tick boxes for marketing or legal consent.",
      "Leave a checkbox without a label.",
      "Put a link inside a label; link to the terms next to it instead."
    ],
    "compare": [
      {
        "title": "Checkbox, Radio or Switch?",
        "intro": "All three make choices. Pick by how many options there are, and when the choice takes effect.",
        "options": [
          {
            "title": "Checkbox",
            "points": [
              "Pick none, one or several options from a list.",
              "The choice takes effect when the form is sent.",
              "Also for a single \"I agree\" before continuing."
            ]
          },
          {
            "title": "Radio or Switch",
            "points": [
              "Radio: pick exactly one option from a short list.",
              "Switch: turns one setting on or off straight away.",
              "Don't use a checkbox for something that changes immediately."
            ]
          }
        ]
      }
    ]
  },
  "color-picker": {
    "callout": "Lets people choose any colour, or pick one from a set of swatches.",
    "about": [
      "A colour picker has three parts. Color field shows the current colour and opens the picker. Color picker is the panel: a shade area, hue and opacity sliders, typed values and preset swatches. Color swatch is the small chip used in the picker and on its own."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "A Color field with its picker open below it, ready to drag, type or pick a swatch."
    },
    "dos": [
      "Show the value next to the colour, so colour is never the only clue.",
      "Offer brand colours as swatches to keep designs on brand.",
      "Keep recent colours in the swatch row.",
      "Remember the format people used last."
    ],
    "donts": [
      "Show the full picker when only a few colours are allowed.",
      "Offer opacity where see-through colours won't work, like for text.",
      "Show the eyedropper where the browser can't use it.",
      "Let a colour be the only way to tell things apart; add a label."
    ],
    "compare": [
      {
        "title": "Full picker or swatches?",
        "intro": "Give people the full picker only when any colour is allowed.",
        "options": [
          {
            "title": "Full picker",
            "points": [
              "Any colour is allowed, like a design or drawing tool.",
              "Keep swatches at the bottom for recent or brand colours.",
              "Show opacity only when see-through colours make sense."
            ]
          },
          {
            "title": "Swatches only",
            "points": [
              "People pick from a fixed set, like label or theme colours.",
              "Use a row of Color swatches, without the panel.",
              "Name each colour for screen readers, like \"Purple\"."
            ]
          }
        ]
      }
    ]
  },
  "date-picker": {
    "callout": "Boxes for choosing a date, a range, or several dates in a form.",
    "about": [
      "Date field opens a Calendar to pick one date, and people can type it too. Date range field picks a start and an end across two months, with presets like Last 7 days. Multiple date field picks several separate days, shown as tags in the box. The Calendar inside each one, and the full Event calendar, are on the Calendar page."
    ],
    "example": {
      "width": 518,
      "height": 362,
      "caption": "A due date: the calendar opens below its field, with today ringed and past dates struck through."
    },
    "dos": [
      "Always let people type the date as well as pick it.",
      "Show the date format, like DD / MM / YYYY, in the placeholder.",
      "Start the calendar on the chosen date, or on today.",
      "Strike through dates that cannot be picked, and say why nearby."
    ],
    "donts": [
      "Make people page back years for a birthday; let them type.",
      "Hide dates that cannot be picked; it breaks the grid.",
      "Use colour alone for today or the range.",
      "Squeeze two months onto a phone; show one, with presets above."
    ],
    "compare": [
      {
        "title": "Which picker?",
        "intro": "Pick by how far away the date is and whether people need one date or a range.",
        "options": [
          {
            "title": "Type it",
            "points": [
              "Dates far away that people know, like a birthday. Typing is faster than paging back years."
            ]
          },
          {
            "title": "Single",
            "points": [
              "One date nearby, like a due date or a booking."
            ]
          },
          {
            "title": "Range",
            "points": [
              "A start and an end, like a report period. Opens the range calendar with presets."
            ]
          }
        ]
      }
    ]
  },
  "divider": {
    "callout": "A thin line that splits content into groups.",
    "about": [
      "Use a divider to separate groups that belong apart: sections of a page, sets of options in a menu, or items in a long list. Add a short label to name what comes next, like \"Earlier\", or to offer a choice, like \"Or\". Use space instead when it already makes the groups clear; too many lines make a page feel busy."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "Signing in: \"Or\" sits between the two ways to continue."
    },
    "dos": [
      "Use a divider when groups would otherwise run together.",
      "Keep labels to one or two words.",
      "Use Subtle for most lines, and Strong only for big breaks.",
      "Let horizontal dividers fill their container."
    ],
    "donts": [
      "Put a line between every item when space would do.",
      "Place a divider right next to a border or another divider.",
      "Use a divider just for decoration.",
      "Write a sentence in the label."
    ],
    "compare": [
      {
        "title": "Divider or space?",
        "intro": "Space is often enough. Reach for a line only when it makes the page easier to scan.",
        "options": [
          {
            "title": "Use a divider",
            "points": [
              "Groups sit close together and could be read as one.",
              "Items in a list or menu need a clear edge between them.",
              "A short label helps, like \"Or\" or a date."
            ]
          },
          {
            "title": "Use space instead",
            "points": [
              "Headings or cards already show where each group starts.",
              "The line would sit right next to a border or another line.",
              "The page already feels busy."
            ]
          }
        ]
      }
    ]
  },
  "drawer": {
    "callout": "A panel that slides in from the edge of the screen, for filters, details, settings or navigation.",
    "about": [
      "A drawer opens over an Overlay without leaving the page, so people keep their place. It has a header, a Content slot that scrolls, and an optional footer with an Actions slot. Use Right for most things, Left for navigation, and Bottom for sheets on phones."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "Filters on the right: people tick options and see the results update when they apply."
    },
    "dos": [
      "Give every drawer a clear title.",
      "Put the main action last in the footer, like Apply or Save.",
      "Keep people's place in the page, so closing the drawer feels like going back.",
      "Use Bottom sheets on phones."
    ],
    "donts": [
      "Open a drawer from inside another drawer.",
      "Put a whole page of content in a drawer; use a page.",
      "Hide the way out: keep × or a Cancel button.",
      "Use a drawer for a single question; use a Modal."
    ],
    "compare": [
      {
        "title": "Drawer or Modal?",
        "intro": "All three open over an Overlay. Pick by how much there is, and whether the page should stay in view.",
        "options": [
          {
            "title": "Drawer",
            "points": [
              "Lots of content, or content people come back to, like filters.",
              "Part of the page stays in view.",
              "The content can scroll."
            ]
          },
          {
            "title": "Modal",
            "points": [
              "One short question, or a small focused task like editing a profile.",
              "Opens in the middle and blocks the page until it is answered.",
              "If people need the page in view while they work, use a drawer."
            ]
          }
        ]
      }
    ]
  },
  "empty-state": {
    "callout": "What people see when there is nothing to show yet.",
    "about": [
      "Use an empty state in place of a list, table or page that has no content: before anything is created, when a search finds nothing, when everything is done, or when content could not load. Say what is missing and, when there is one, the next step. A button is optional; often a short message is all it needs."
    ],
    "example": {
      "width": 518,
      "height": 419,
      "caption": "On a page: a Large empty state replaces the list, with a clear first step."
    },
    "dos": [
      "Say what is missing in the title, in a few words.",
      "Add a button only when there is a clear next step.",
      "Use Small inside cards, lists and panels.",
      "Put the empty state where the content would be."
    ],
    "donts": [
      "Show an empty state while content is still loading.",
      "Add more than two buttons.",
      "Blame people or joke about the problem.",
      "Use a picture that needs words to explain it."
    ],
    "compare": [
      {
        "title": "Empty state, Skeleton or Alert?",
        "intro": "Pick by what is happening: nothing to show, still loading, or something went wrong.",
        "options": [
          {
            "title": "Empty state",
            "points": [
              "There is nothing to show here, and that is expected.",
              "It sits where the content would be.",
              "It stays until content arrives."
            ]
          },
          {
            "title": "Skeleton or Alert",
            "points": [
              "Skeleton: content is still loading, so show its shape.",
              "Alert: something went wrong that affects the whole page.",
              "Never show an empty state while content is still loading."
            ]
          }
        ]
      }
    ]
  },
  "file-upload": {
    "callout": "A place to drop or choose files, and a row for each file that shows how its upload is going.",
    "about": [
      "Use the drop zone when uploading is a main task, like adding documents or images. People can drag files onto it or choose them with the Browse button. Each file then appears as a File item that shows progress, success or a problem, with a way to cancel, retry or remove it. In tight spaces like a form, use just a Button with File items below.",
      "Use Image upload for one picture in a circle, like a profile photo or a company logo."
    ],
    "example": {
      "width": 518,
      "height": 536,
      "caption": "In a modal: a drop zone, with each file listed below as it uploads."
    },
    "dos": [
      "Say which types and sizes are accepted before people choose.",
      "Keep the Browse button, even where dragging works.",
      "Show each file as soon as it is chosen.",
      "Let people cancel, retry and remove files."
    ],
    "donts": [
      "Rely on dragging alone.",
      "Start uploading a file you already know is too large.",
      "Clear the whole list because one file failed.",
      "Show upload errors only in a toast; keep them on the file."
    ],
    "compare": [
      {
        "title": "Drop zone or button?",
        "intro": "A drop zone when uploading is the main task. A button when space is tight.",
        "options": [
          {
            "title": "Drop zone",
            "points": [
              "For pages and modals where uploading is the main task. Fills the width of its container."
            ]
          },
          {
            "title": "Button",
            "points": [
              "For forms and tight spaces. A Secondary Button opens the file picker; chosen files show as File items below."
            ]
          }
        ]
      }
    ]
  },
  "form": {
    "callout": "Groups fields into sections, lays them out, and checks them.",
    "about": [
      "Use a Form for anything people fill in and submit. Group fields into sections with a title, put short pairs side by side, and end with the buttons. In code, Form checks required fields and your own rules, and shows the errors on the right fields."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "A section of a longer form, with a title and description."
    },
    "dos": [
      "Group related fields into sections with a short title.",
      "Put short pairs side by side, like first and last name.",
      "Show errors after submit, then clear them as people fix them.",
      "Put the main button last, and keep Cancel next to it."
    ],
    "donts": [
      "Disable the submit button; let people submit and see what to fix.",
      "Use placeholders as labels; they disappear as people type.",
      "Put more than two or three fields in a row.",
      "Split one question across several fields when one will do."
    ],
    "compare": []
  },
  "input": {
    "callout": "Fields where people type: names, emails, passwords, amounts, codes and more.",
    "about": [
      "One Input covers almost every kind of field. Icons, a Prefix and a Suffix (text or a picker) are built in: switch each one on in the right panel, and the code sets the type, like email or password, so phones show the right keyboard. Wrap it in an Input field to add a label and a hint. Two kinds work differently and have their own components: Number input, with minus and plus buttons, and Verification code, with one box per digit."
    ],
    "example": {
      "width": 518,
      "height": 430,
      "caption": "Sign-up: three labelled fields, with an info button and a show-password eye on Password."
    },
    "dos": [
      "Give every field a visible label.",
      "Size fields to the answer, like a short field for a postcode.",
      "Show errors next to the field, and say how to fix them.",
      "Set the type in code so phones show the right keyboard."
    ],
    "donts": [
      "Use the placeholder as the only label; it disappears when people type.",
      "Disable paste in password or code fields.",
      "Ask for things you do not need.",
      "Show an error before people have finished typing."
    ],
    "compare": []
  },
  "list": {
    "callout": "Rows of related items, shown right on the page.",
    "about": [
      "Use a list for items people scan, open or act on: contacts, files, settings or notifications. Each row is a List item with an optional picture at the start, a title, an optional description and an optional control at the end. List items are also the rows inside Menus, Selects and Comboboxes."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "People: an Avatar at the start and a \"⋯\" Compact button for more actions."
    },
    "dos": [
      "Keep the same parts in every row of a list.",
      "Put the most important words first in the title.",
      "Use Divided or Card for long lists on a page.",
      "Put more actions in a \"⋯\" Compact button."
    ],
    "donts": [
      "Put more than one button at the end of a row.",
      "Mix sizes in one list.",
      "Write more than two lines in the description.",
      "Make only part of a row clickable without showing which part."
    ],
    "compare": []
  },
  "menu": {
    "callout": "A short list of actions that opens from a button and closes once people pick one.",
    "about": [
      "Use a menu to tuck away actions that would crowd the page, like Edit, Duplicate and Delete on a file, or to offer a few choices, like how to sort a list. It opens from a Button, a Compact button such as \"⋯\", or an Avatar, and closes when people choose an item, press Esc or click elsewhere. Choosing an item does something straight away; to set a value in a form, use a Select."
    ],
    "example": {
      "width": 382,
      "height": 320,
      "caption": "A \"⋯\" Compact button opens the actions for one row. The menu lines up with its right edge."
    },
    "dos": [
      "Start labels with a verb, like Edit or Download.",
      "Keep menus short: about seven items at most.",
      "Put destructive items last, after a Divider.",
      "Open the menu next to the button that opened it."
    ],
    "donts": [
      "Put things people need often only in a menu.",
      "Nest submenus more than one level deep.",
      "Use a menu to fill in a form; use a Select.",
      "Mix icons and no icons in the same group."
    ],
    "compare": []
  },
  "modal": {
    "callout": "A small window, also called a dialog, that asks one question or confirms an action before people carry on.",
    "about": [
      "A modal opens on top of the page, over an Overlay, and waits for an answer. Use it for decisions that can't wait, like confirming a delete or saving changes before leaving. It can also hold a short form in its Content slot. For messages that don't need an answer, use an Alert."
    ],
    "example": {
      "width": 591,
      "height": 320,
      "caption": "Confirming a delete: a Destructive modal that says exactly what will be lost."
    },
    "dos": [
      "Write the title as a question, like \"Delete project?\".",
      "Name buttons after what they do: \"Delete\", not \"OK\".",
      "Put the main action last, or on top when stacked.",
      "Say what will happen, especially when it can't be undone."
    ],
    "donts": [
      "Open a modal nobody asked for, like a newsletter sign-up.",
      "Open a modal on top of another modal.",
      "Put a long form in a modal; give it its own page or a Drawer.",
      "Hide the way out: always offer Cancel or ×."
    ],
    "compare": [
      {
        "title": "Modal or Alert?",
        "intro": "Both show a message. Pick by whether people must answer before they carry on.",
        "options": [
          {
            "title": "Modal",
            "points": [
              "One question or confirmation, in a sentence or two.",
              "People must answer before they carry on.",
              "Two buttons, three at most."
            ]
          },
          {
            "title": "Alert",
            "points": [
              "A message in the page that does not block anything.",
              "Stays until the problem is fixed or it is dismissed.",
              "If people do not have to decide now, use an Alert, not a modal."
            ]
          }
        ]
      }
    ]
  },
  "navigation": {
    "callout": "Moves people between the main parts of a product.",
    "about": [
      "Navigation is the frame around every page. Nav item is one link; Sidebar stacks them down the left, Expanded or Collapsed; Top bar lines them up across the top, with search and the account. On phones, the Top bar menu button opens the Sidebar links in a Drawer."
    ],
    "example": {
      "width": 518,
      "height": 360,
      "caption": "A dashboard: the Sidebar on the left, the page on the right."
    },
    "dos": [
      "Keep it to about 5 to 8 main links.",
      "Use short labels with clear icons.",
      "Mark the current page with Selected.",
      "Put settings, help and the account at the bottom or top right."
    ],
    "donts": [
      "Mix Sidebar and Top bar links for the same level.",
      "Use icons with no labels on wide screens.",
      "Nest groups more than one level deep.",
      "Change the order of links from page to page."
    ],
    "compare": [
      {
        "title": "Navigation, Tabs or Breadcrumbs?",
        "intro": "All three help people move around. Each works at a different level.",
        "options": [
          {
            "title": "Navigation",
            "points": [
              "The main parts of the product, on every page.",
              "Each link goes to a different page.",
              "Shows where people are with a Selected item."
            ]
          },
          {
            "title": "Tabs or Breadcrumbs",
            "points": [
              "Tabs: views inside one page.",
              "Breadcrumbs: the path back up from a deep page.",
              "Use them together with Navigation, not instead of it."
            ]
          }
        ]
      }
    ]
  },
  "pagination": {
    "callout": "Moves people between pages of a long list or table.",
    "about": [
      "Use pagination when results are split into pages and people need to jump, compare or come back to a place. Page item is one page number; Pagination puts page items between Previous and Next buttons, or shows a compact \"Page 1 of 10\" for tight spaces."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "A table footer: Compact sits at the end, with the count on the left."
    },
    "dos": [
      "Show the current page clearly, with Selected.",
      "Disable Previous on the first page and Next on the last.",
      "Keep the same number of items in the row as people move.",
      "Scroll back to the top of the list when the page changes."
    ],
    "donts": [
      "Show every page of a long list; use \"…\" instead.",
      "Hide Previous and Next; disable them instead.",
      "Use pagination for a few items that fit on one page.",
      "Reset to page 1 when people only sort; keep their place."
    ],
    "compare": [
      {
        "title": "Pagination or Load more?",
        "intro": "Both split long lists. Pick by whether people need to find their place again.",
        "options": [
          {
            "title": "Pagination",
            "points": [
              "Tables, search results and admin lists.",
              "People can jump to a page, share it and come back to it.",
              "Shows how much there is in total."
            ]
          },
          {
            "title": "Load more",
            "points": [
              "Feeds and galleries that people browse from the top.",
              "A Button at the end adds the next batch to the list.",
              "Avoid endless scrolling where a footer needs to be reached."
            ]
          }
        ]
      }
    ]
  },
  "popover": {
    "callout": "A small panel that opens next to what people clicked.",
    "about": [
      "Use a popover for extra information or a quick task that belongs to one thing on the page, like sharing a link or changing a filter. It opens on click, points at its trigger with an arrow, and closes when people press Escape or click outside it."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "Share: a small task with one field and one action."
    },
    "dos": [
      "Open on click, not on hover.",
      "Keep the content short enough to fit without scrolling.",
      "Move focus into the popover when it opens.",
      "Pick the side with the most room, and flip near the edge of the screen."
    ],
    "donts": [
      "Put a popover inside another popover.",
      "Use it for errors or for a decision that blocks the page; use a Modal.",
      "Hide important actions in a popover people may not open.",
      "Cover the trigger with the popover."
    ],
    "compare": [
      {
        "title": "Popover, Tooltip or Modal?",
        "intro": "All three float above the page. Pick by what people need to do.",
        "options": [
          {
            "title": "Popover",
            "points": [
              "Opens on click and stays open until closed.",
              "Can hold links, forms and Buttons.",
              "The page behind stays usable."
            ]
          },
          {
            "title": "Tooltip or Modal",
            "points": [
              "Tooltip: a short label on hover or focus, with nothing to click.",
              "Modal: a bigger task or a decision that needs full attention.",
              "Modal blocks the page behind with an Overlay."
            ]
          }
        ]
      }
    ]
  },
  "progress": {
    "callout": "Shows how far along something is, like an upload or a setup.",
    "about": [
      "Use progress when you can measure how much is done. Progress bar is a track that fills from the left; Progress circle fills a ring; Progress field adds a label, the percentage and a hint. Use Indeterminate, or a Spinner, when you can't measure it."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "File upload: a Small bar inside each File item, with the size and percentage above it."
    },
    "dos": [
      "Show the number as well as the bar.",
      "Say what happened at the end: complete, or failed with a way to retry.",
      "Move smoothly; don't jump backwards.",
      "Switch from Indeterminate to Default as soon as you can measure it."
    ],
    "donts": [
      "Show progress for tasks that finish in under a second.",
      "Fake progress that isn't tied to the real task.",
      "Use colour alone for success or failure; say it in the hint.",
      "Stack many bars for one task; show one overall bar."
    ],
    "compare": [
      {
        "title": "Progress or Spinner?",
        "intro": "Both show that something is happening. Pick by whether you can measure it.",
        "options": [
          {
            "title": "Progress",
            "points": [
              "You know how much is done, like bytes uploaded.",
              "Longer tasks, where people want to know how long is left.",
              "Amounts, like storage used or a profile filled in."
            ]
          },
          {
            "title": "Spinner",
            "points": [
              "You can't measure it, like waiting for a server.",
              "Short waits of a few seconds.",
              "Or use Indeterminate when it sits where a bar will be."
            ]
          }
        ]
      }
    ]
  },
  "qr-code": {
    "callout": "A code people scan with their phone camera.",
    "about": [
      "QR code turns a link or short text into a code people scan with a phone camera. Use it to move someone from a computer or a printed page to their phone: to sign in, open an app, pay or check in with a ticket. In code it is drawn from its value, so it always scans."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "Sign in on another device: the code, plus a short code to type for people who cannot scan."
    },
    "dos": [
      "Say what scanning does, like Scan to sign in on your phone.",
      "Show the link or a short code as text too, for people who cannot scan.",
      "Keep the light border around the code; scanners need it.",
      "Keep printed codes at least 2cm across."
    ],
    "donts": [
      "Show a QR code to people who are already on their phone; give them a link.",
      "Invert the colours or place the code on a busy picture.",
      "Cover more than a fifth of the code with a logo.",
      "Encode long text; long links make dense codes that are harder to scan."
    ],
    "compare": []
  },
  "radio": {
    "callout": "A circle people choose when only one option from a short list can be picked.",
    "about": [
      "Use radios when people must pick exactly one option and it helps to see every option at once. Radio is the circle on its own; Radio field adds a label and description; Radio group holds a labelled set of fields in a slot, stacked or in a row, with a hint."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "Settings: a Radio group with a sensible default already chosen."
    },
    "dos": [
      "Choose a sensible default when one exists, like the most common option.",
      "Keep it to about 5 options; use a Select for longer lists.",
      "Put options in a logical order, like cheapest to fastest.",
      "Stack options, unless there are two or three short ones."
    ],
    "donts": [
      "Use a single radio on its own; it can't be unchosen. Use a Checkbox.",
      "Use radios for a setting that changes straight away; use a Switch.",
      "Leave a group without a label.",
      "Lay out long labels in a row; they wrap and are hard to scan."
    ],
    "compare": [
      {
        "title": "Radio, Select or Checkbox?",
        "intro": "All make choices. Pick by how many options there are, and how many people can choose.",
        "options": [
          {
            "title": "Radio",
            "points": [
              "Pick exactly one option from a short list, about 2 to 5.",
              "Every option stays visible, so people can compare them.",
              "Good when the options need descriptions, like delivery speeds."
            ]
          },
          {
            "title": "Select, Checkbox or Switch",
            "points": [
              "Select: one option from a long list, like a country.",
              "Checkbox: none, one or several options.",
              "Switch: one setting that turns on or off straight away."
            ]
          }
        ]
      }
    ]
  },
  "rating": {
    "callout": "Stars for giving a score, or showing one.",
    "about": [
      "Rating is a row of five stars. People give a score by clicking a star or using the arrow keys; read only, it shows an average next to the number and the count of reviews. Half stars show averages like 4.5, and can be turned on for picking too."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "A product: the average, read only, under the name."
    },
    "dos": [
      "Show the average as a number next to the stars.",
      "Show how many reviews the average comes from.",
      "Use read only for averages; people can't change them.",
      "Ask one clear question above stars people give, like How was your stay?"
    ],
    "donts": [
      "Use stars for a number of things, like 3 items; use a Badge or text.",
      "Change the number of stars between screens.",
      "Use colour alone; the number tells the score to everyone.",
      "Put two ratings people give close together without labels."
    ],
    "compare": []
  },
  "resizable": {
    "callout": "Panels people resize by dragging the line between them.",
    "about": [
      "Use Resizable when people need to balance two or three areas, like a file list beside a preview or an editor beside its output. In Figma, place a Resizable handle between two panel frames and stretch it to their height."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "A file list beside a preview. Give the list a minimum width so names stay readable."
    },
    "dos": [
      "Set a minimum size so panels never shrink to nothing.",
      "Turn on Grip when the line is hard to spot.",
      "Save the layout so it is the same next time.",
      "Give each handle a name for screen readers, like Resize file list."
    ],
    "donts": [
      "Use it on phones; stack the content or use tabs instead.",
      "Put more than three panels in one row.",
      "Resize panels that hold a single short item.",
      "Hide important actions in a panel that can shrink away."
    ],
    "compare": []
  },
  "result": {
    "callout": "The outcome of something people did, or why a page cannot show.",
    "about": [
      "Use Result after an action finishes, like a payment going through, or when a page cannot load, like a missing page or no access. Say what happened, what it means, and give the next step."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "After a payment: Success, with the next step as the main button."
    },
    "dos": [
      "Say what happened in the title, like Payment sent.",
      "Say what it means or what to do next in one or two sentences.",
      "Give one clear way forward as the main button.",
      "Put details like a receipt in Content."
    ],
    "donts": [
      "Use it for small confirmations; use a Toast.",
      "Blame the person; say what to do instead.",
      "Show error codes alone; explain them in words.",
      "Leave a page without a way out."
    ],
    "compare": []
  },
  "rich-text-editor": {
    "callout": "A text box with a toolbar, for writing that needs headings, lists and links.",
    "about": [
      "Use it when people write longer content that needs simple formatting, like a description, a comment or release notes. Editor toolbar holds the formatting buttons; Rich text editor puts it on top of a Content slot; Rich text editor field adds a label, a hint and a character count."
    ],
    "example": {
      "width": 518,
      "height": 380,
      "caption": "A comment box: a short toolbar with formatting only, and a Button to post."
    },
    "dos": [
      "Turn off groups people don't need, like Insert in a comment box.",
      "Support keyboard shortcuts, like Ctrl+B for bold.",
      "Show a count when there is a limit.",
      "Keep the toolbar visible while people scroll through long text."
    ],
    "donts": [
      "Use it where plain text is enough; use a Textarea.",
      "Add every tool by default; it crowds the toolbar.",
      "Hide errors in a toast; show them under the field.",
      "Lose people's writing on an error; keep the text."
    ],
    "compare": [
      {
        "title": "Rich text editor or Textarea?",
        "intro": "Both take long text. Pick by whether people need formatting.",
        "options": [
          {
            "title": "Rich text editor",
            "points": [
              "The text is shown with its formatting, like a post or a description.",
              "People need headings, lists or links.",
              "Longer writing, where structure helps readers."
            ]
          },
          {
            "title": "Textarea",
            "points": [
              "Plain text, like feedback, a bio or a short note.",
              "The text is shown as written, without styles.",
              "Simpler to use and to store."
            ]
          }
        ]
      }
    ]
  },
  "segmented-control": {
    "callout": "Picks one option from a small set, and applies it straight away.",
    "about": [
      "Use a segmented control to switch how something is shown, or to pick one setting from 2 to 5 options, like Day, Week or Month. Segment is one option, with text or an icon; Segmented control holds them on a grey track in a slot, Hug or Fill."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "A calendar: switch between day, week and month views."
    },
    "dos": [
      "Keep it to 2 to 5 options.",
      "Use short labels of one word where you can.",
      "Always have one option Selected.",
      "Apply the change straight away."
    ],
    "donts": [
      "Use it for actions; use Buttons.",
      "Use it in a form that is sent later; use Radio.",
      "Mix text and icon-only options.",
      "Wrap it onto two lines; use a Select instead."
    ],
    "compare": [
      {
        "title": "Segmented control, Tabs or Radio?",
        "intro": "All three pick one option. Pick by what changes, and when.",
        "options": [
          {
            "title": "Segmented control",
            "points": [
              "Changes how the same content is shown.",
              "Applies straight away.",
              "2 to 5 short options."
            ]
          },
          {
            "title": "Tabs or Radio",
            "points": [
              "Tabs: switch between different content sections.",
              "Radio: a choice in a form, sent with the form.",
              "Radio also fits longer labels and descriptions."
            ]
          }
        ]
      }
    ]
  },
  "select": {
    "callout": "A form field for choosing one option from a short list.",
    "about": [
      "Use a Select when people pick one value that is saved with a form, like their country or a time zone. It looks like an Input with an arrow; clicking it opens a list built from Menu and Menu items, with a check on the current choice. For actions that happen straight away, use a Menu. It works for long lists people know, like countries: typing a letter jumps to a match. When people need to search by part of a word, use a Combobox."
    ],
    "example": {
      "width": 518,
      "height": 430,
      "caption": "A form: labelled Selects, with a flag for the country. The optional field is marked."
    },
    "dos": [
      "Use a Select for one choice from a list people know, like countries or time zones. Typing a letter jumps to a match.",
      "Order options in a way people expect: alphabetical, by size or by date.",
      "Pick a sensible default when there is one.",
      "Give every Select a label, even in a row of filters."
    ],
    "donts": [
      "Use a Select for 2 or 3 options; show Radio buttons instead.",
      "Put actions in a Select; use a Menu.",
      "Use a Select when people pick more than one or search by part of a name; use a Combobox.",
      "Leave the placeholder as the only explanation."
    ],
    "compare": [
      {
        "title": "Choosing a value or doing an action?",
        "intro": "Both open the same Menu list. What differs is what happens when people pick an option.",
        "options": [
          {
            "title": "Choosing a value: Select",
            "points": [
              "The choice stays in the field and is saved with the form, like a country. The list shows a check mark on it."
            ]
          },
          {
            "title": "Doing an action: Button with a menu",
            "points": [
              "Picking an option does something straight away, like exporting a file. Nothing stays selected, and it opens from a Button, not a field."
            ]
          }
        ]
      }
    ]
  },
  "skeleton": {
    "callout": "Grey shapes that hold the place of content while it loads.",
    "about": [
      "Use skeletons when a page or section takes a moment to load, so people see the layout straight away and nothing jumps when the content arrives. Skeleton is one shape: a text line, a circle or a rectangle. Skeleton pattern combines them into common layouts like a list item, a card or a table row."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "A dashboard: Stat tile patterns while the numbers load."
    },
    "dos": [
      "Match the real layout, so nothing jumps when content arrives.",
      "Show about as many rows or cards as will load.",
      "Swap all skeletons for content at once, not one by one.",
      "Keep real headers and labels, and only skeleton the data."
    ],
    "donts": [
      "Show skeletons for very short waits; they flash.",
      "Use them for errors or empty results; use an Empty state.",
      "Leave them on forever; show an error after a timeout.",
      "Make the shapes darker than real text; keep them soft."
    ],
    "compare": [
      {
        "title": "Skeleton or Spinner?",
        "intro": "Both show loading. Pick by whether you know the layout.",
        "options": [
          {
            "title": "Skeleton",
            "points": [
              "Loading a page, a list, a table or a card.",
              "You know the shape of what is coming.",
              "Waits longer than about 300 milliseconds."
            ]
          },
          {
            "title": "Spinner",
            "points": [
              "A short action, like saving or sending.",
              "Inside a Button, or where the layout is unknown.",
              "A whole page that can't show its layout yet."
            ]
          }
        ]
      }
    ]
  },
  "slider": {
    "callout": "Picks a value, or a range, by dragging along a track.",
    "about": [
      "Use a slider when people choose a rough value and see the effect straight away, like volume, brightness or a price range. Slider is the track and handles, Single or Range; Slider field adds a label, the current value and the min and max."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "Settings: the value updates as people drag, and the sound plays at that volume."
    },
    "dos": [
      "Show the current value next to the label.",
      "Use steps that make sense, like 5% or whole numbers.",
      "Pair with a Number input when exact values matter.",
      "Label the ends when the scale isn't obvious."
    ],
    "donts": [
      "Use a slider for exact values, like a phone number or an age.",
      "Hide the value; people can't guess it from the handle.",
      "Make the handle smaller than the touch area.",
      "Use a slider with only two or three options; use a Segmented control."
    ],
    "compare": [
      {
        "title": "Slider or Number input?",
        "intro": "Both set a number. Pick by how exact it needs to be.",
        "options": [
          {
            "title": "Slider",
            "points": [
              "A rough value, where people watch the effect.",
              "A clear scale with a minimum and a maximum.",
              "Ranges in filters, like price."
            ]
          },
          {
            "title": "Number input",
            "points": [
              "An exact value, like a quantity or an age.",
              "Very large scales, where dragging is fiddly.",
              "Pair both when people need speed and precision."
            ]
          }
        ]
      }
    ]
  },
  "spinner": {
    "callout": "A spinning ring that shows something is happening.",
    "about": [
      "Use a spinner for short waits, like saving, sending or loading a small part of a page. Spinner is the ring on its own, in Brand, Neutral or On brand colours; Loading indicator adds a \"Loading…\" label next to it or under it."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "Buttons: the spinner replaces the icon and the label says what is happening."
    },
    "dos": [
      "Wait about 300 milliseconds before showing it, so quick actions don't flash.",
      "Keep a Button the same width while it shows a spinner.",
      "Change the label to say what is happening, like \"Saving…\".",
      "Show an error with a way to try again if it takes too long."
    ],
    "donts": [
      "Cover the whole page for a small action.",
      "Show several spinners at once; use one, or Skeletons.",
      "Use Brand on a purple surface; use On brand.",
      "Leave people waiting without a message for more than a few seconds."
    ],
    "compare": [
      {
        "title": "Spinner or Skeleton?",
        "intro": "Both show loading. Pick by whether you know the layout.",
        "options": [
          {
            "title": "Spinner",
            "points": [
              "A short action, like saving, sending or signing in.",
              "Inside a Button, or a small part of a page.",
              "When you don't know the shape of what is coming."
            ]
          },
          {
            "title": "Skeleton",
            "points": [
              "Loading a page, a list, a table or a card.",
              "You know the layout, so you can show it straight away.",
              "Waits longer than about a second."
            ]
          }
        ]
      }
    ]
  },
  "statistic": {
    "callout": "A key number with its label and how it changed, like the numbers across the top of a dashboard.",
    "about": [
      "Put a Statistic in a Card, or use it on its own in a row. Trend picks the arrow and the colour of the change badge. Up is green and down is red; for numbers where down is good, like churn, set the badge to Success."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "In a Card: the usual dashboard number, with how it changed."
    },
    "dos": [
      "Say what the number measures in a short label.",
      "Compare with a clear period, like vs last month.",
      "Round big numbers so they read at a glance, like 12.4K.",
      "Set the Badge to Success when down is good, like churn."
    ],
    "donts": [
      "Show more than four or five in one row.",
      "Rely on colour alone; keep the arrow and the plus or minus sign.",
      "Mix sizes in the same row.",
      "Use it for numbers people edit; use an Input."
    ],
    "compare": []
  },
  "stepper": {
    "callout": "Shows where people are in a task that has a few steps in order.",
    "about": [
      "Use a stepper for flows like sign-up, checkout or setup, where people go through steps one after another. Step is one step, Complete, Current, Upcoming or Error; Stepper lays steps out Horizontal or Vertical in a slot, or shows a Compact \"Step 2 of 4\" for small screens."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "Onboarding: a Vertical stepper down the side of a setup page."
    },
    "dos": [
      "Keep it to about 3 to 5 steps.",
      "Use short titles of one or two words.",
      "Let people go back to complete steps to make changes.",
      "Mark a step Error when it has something to fix."
    ],
    "donts": [
      "Use a stepper for a single form; use headings.",
      "Let people skip ahead to steps that need earlier answers.",
      "Change the steps in the middle of the flow.",
      "Rely on colour alone; keep the check, number or \"!\"."
    ],
    "compare": [
      {
        "title": "Stepper or Tabs?",
        "intro": "Both split content into parts. Pick by whether the order matters.",
        "options": [
          {
            "title": "Stepper",
            "points": [
              "Steps must be done in order, like checkout.",
              "Shows progress and what is left.",
              "People move on with Next and Back buttons."
            ]
          },
          {
            "title": "Tabs",
            "points": [
              "Views people can open in any order.",
              "Nothing to finish; no progress to show.",
              "People switch by clicking the tab itself."
            ]
          }
        ]
      }
    ]
  },
  "switch": {
    "callout": "A toggle that turns one setting on or off straight away.",
    "about": [
      "Use a switch for a setting that takes effect the moment it is flipped, with no Save button. Switch is the toggle on its own; Switch field adds a label and description, with the switch at the start or the end of the row."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "Settings: Switch fields with End, each saved the moment it is flipped."
    },
    "dos": [
      "Name the setting, like \"Email notifications\", not the action.",
      "Apply the change straight away, and show its effect.",
      "Say why a switch is disabled in its description.",
      "Use End in settings lists, so switches line up on the right."
    ],
    "donts": [
      "Use a switch in a form with a Save button; use a Checkbox.",
      "Change the label when the switch flips, like \"On\" and \"Off\".",
      "Use a switch to pick between two options; use a Radio or Segmented control.",
      "Leave a switch without a visible label."
    ],
    "compare": [
      {
        "title": "Switch or Checkbox?",
        "intro": "Both turn something on or off. Pick by when the change takes effect.",
        "options": [
          {
            "title": "Switch",
            "points": [
              "The change happens straight away, with no Save button.",
              "For settings, like notifications or reduced motion.",
              "The label names the setting, not an action."
            ]
          },
          {
            "title": "Checkbox or Radio",
            "points": [
              "Checkbox: the choice is sent with a form, or people agree to terms.",
              "Radio: one option from a short list of choices.",
              "If people must press Save, use a Checkbox, not a Switch."
            ]
          }
        ]
      }
    ]
  },
  "table": {
    "callout": "Shows data in rows and columns, so people can scan, compare, sort and act on it.",
    "about": [
      "Tables are built from cells. Table header cell names a column and can sort it; Table cell holds one value, like text, a number, a person, a status, a checkbox or actions. Lay cells out in rows, then add Pagination underneath for long data."
    ],
    "example": {
      "width": 518,
      "height": 430,
      "caption": "Small for dense data, with amounts right-aligned under a right-aligned header."
    },
    "dos": [
      "Right-align numbers and their headers, so digits line up.",
      "Keep the header row visible when the table scrolls.",
      "Use Medium when rows have avatars or descriptions.",
      "Put row actions in a \"more\" button at the end of the row."
    ],
    "donts": [
      "Use a table for a few items or for layout; use a List.",
      "Centre text in cells; it is hard to scan.",
      "Wrap long text onto many lines; cut it off and show the rest elsewhere.",
      "Show selection with colour alone; tick the checkbox too."
    ],
    "compare": [
      {
        "title": "Table or List?",
        "intro": "Both show many items. Pick by whether people compare values across columns.",
        "options": [
          {
            "title": "Table",
            "points": [
              "Many items with the same fields, like name, role and status.",
              "People sort, compare and select rows.",
              "Wide screens, where columns have room."
            ]
          },
          {
            "title": "List",
            "points": [
              "Items with one or two lines, like files or messages.",
              "Small screens, where columns would squeeze.",
              "On phones, show a table's rows as a List."
            ]
          }
        ]
      }
    ]
  },
  "tabs": {
    "callout": "Switches between views of the same thing, without leaving the page.",
    "about": [
      "Use tabs to split related content into sections that people move between, like Overview, Activity and Settings. Tab is one tab; Tabs holds a row or column of them in a slot, laid out Horizontal, Full width or Vertical, in a Line or Pill style."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "A card: Line tabs across the top switch what the card shows."
    },
    "dos": [
      "Write short labels of one or two words.",
      "Select the most useful tab by default, usually the first.",
      "Keep the tabs in the same place when the content changes.",
      "Use a Badge for counts, like new comments."
    ],
    "donts": [
      "Nest tabs inside tabs; it is hard to follow.",
      "Mix Line and Pill tabs on one page.",
      "Use tabs for steps people must do in order.",
      "Hide a tab that has no content; show an Empty state inside it."
    ],
    "compare": [
      {
        "title": "Tabs or Navigation?",
        "intro": "Both move people around. Pick by whether they stay on the same page.",
        "options": [
          {
            "title": "Tabs",
            "points": [
              "Switch between views of the same thing, like a project.",
              "The content swaps in place; the page and URL stay the same.",
              "Keep it to about 2 to 7 tabs."
            ]
          },
          {
            "title": "Navigation or Menu",
            "points": [
              "Navigation: go to a different page or part of the app.",
              "Menu or Select: act on the content or filter it.",
              "Don't use tabs as steps; use a Stepper."
            ]
          }
        ]
      }
    ]
  },
  "tag": {
    "callout": "Small labels for things people add, choose or filter by, which they can often remove.",
    "about": [
      "Use tags to show values people have added or picked: topics on a post, filters that are on, emails added to an invite, or choices in a multi-select Combobox. A tag can carry an icon or an Avatar, and a ✕ to remove it. For a status people only read, like \"New\" or a count, use a Badge."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "On a post: fixed tags with # show its topics. They cannot be removed here."
    },
    "dos": [
      "Keep labels short: one to three words.",
      "Let tags wrap onto new lines instead of cutting them off.",
      "Turn off Closable when people cannot change the tag.",
      "Offer \"Clear all\" when there are several removable tags."
    ],
    "donts": [
      "Use a tag for a status like Paid or New; use a Badge.",
      "Use colour alone to tell tags apart.",
      "Put long sentences in a tag.",
      "Hide the ✕ until hover; people on phones cannot hover."
    ],
    "compare": [
      {
        "title": "Tag or Badge?",
        "intro": "They look alike. A Tag is something people added or can remove; a Badge is a status they read.",
        "options": [
          {
            "title": "Tag",
            "points": [
              "Something people added, chose or filter by. It can often be removed, and it is usually one of several."
            ]
          },
          {
            "title": "Badge",
            "points": [
              "A status or count people only read, like New, Paid or 3. It cannot be removed."
            ]
          }
        ]
      }
    ]
  },
  "text": {
    "callout": "One component for any paragraph or line of body text.",
    "about": [
      "Use Text whenever you need body copy: paragraphs, descriptions, captions, and the default content of slots such as the Accordion. It is built on the Body text styles and colour tokens, so it stays consistent and works in dark mode.",
      "Pick a size, a weight and a colour, and edit the words with the Text property. For headings, use the Heading text styles instead."
    ],
    "example": {
      "width": 518,
      "height": 360,
      "caption": "A card: a heading style for the title, Text (Medium, Contrast) for the description and Text (Small, Secondary) for metadata."
    },
    "dos": [
      "Use Text for body copy and slot content.",
      "Keep lines between about 45 and 80 characters for reading.",
      "Use Secondary for supporting details only.",
      "Use the Heading text styles for titles."
    ],
    "donts": [
      "Set important information in Secondary; it is the quietest colour.",
      "Use Semibold for whole paragraphs.",
      "Mix several sizes in one paragraph.",
      "Detach Text to change its colour; switch the Colour property instead."
    ],
    "compare": []
  },
  "textarea": {
    "callout": "A field for longer text that runs over several lines.",
    "about": [
      "Use a Textarea for answers longer than a line: messages, comments, descriptions and feedback. It matches the Input in states, colours and tokens, and grows taller when people need more room. Wrap it in a Textarea field for a label, a hint and a character count. For a single line, like a name or an email, use an Input."
    ],
    "example": {
      "width": 518,
      "height": 360,
      "caption": "Feedback: a roomy Textarea with a clear prompt and a 500-character limit."
    },
    "dos": [
      "Size the box to the answer you expect: taller for feedback, shorter for a bio.",
      "Show a character count when there is a limit, from the start.",
      "Use the placeholder for an example, and the label for the question.",
      "Let people keep typing past the limit, then show the error."
    ],
    "donts": [
      "Use a Textarea for one-line answers; use an Input.",
      "Cut off what people type at the limit without telling them.",
      "Make the box so small that people cannot see what they wrote.",
      "Turn off the resize handle unless the box grows by itself."
    ],
    "compare": [
      {
        "title": "Textarea or Input?",
        "intro": "Pick by how long the answer is likely to be.",
        "options": [
          {
            "title": "Input",
            "points": [
              "One line: names, emails, titles, search."
            ]
          },
          {
            "title": "Textarea",
            "points": [
              "Several lines: messages, comments, descriptions and feedback."
            ]
          }
        ]
      }
    ]
  },
  "time-picker": {
    "callout": "A field for choosing a time of day from a list.",
    "about": [
      "Time input is a Select with a clock icon; its list shows times at a fixed step, like every 30 minutes. Time field adds a label and hint. Pair it with a Date field when people pick a day and a time, like a meeting or a delivery slot."
    ],
    "example": {
      "width": 628,
      "height": 320,
      "caption": "A meeting: a Date field and a Time field side by side for one moment."
    },
    "dos": [
      "Pick a step that fits the task, like 15 or 30 minutes.",
      "Use min and max to leave out times that can't be booked.",
      "Follow the region for 12 or 24 hours.",
      "Pair it with a Date field when the day matters too."
    ],
    "donts": [
      "List every minute of the day; the list gets too long to scan.",
      "Use it for a length of time, like 1 hour 30 minutes; use a Number input.",
      "Mix 12 and 24 hours on one screen.",
      "Hide the time zone when people are in different ones."
    ],
    "compare": []
  },
  "toast": {
    "callout": "A short message that pops up after people do something, then disappears by itself.",
    "about": [
      "Use a toast to confirm an action without interrupting people. Often a title is all it needs, like \"Link copied\" or \"Changes saved\". Add a line of detail or one quick action, like Undo, only when there is more to say or do. Toasts appear in a corner and go away after a few seconds. For messages people must act on, use an Alert."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "On desktop: toasts stack in the bottom-right corner, newest at the bottom, three at most."
    },
    "dos": [
      "Use just a title when it says enough, like \"Link copied\".",
      "Add a description or an action only when there is more to say or do, like Undo.",
      "Show one toast per action.",
      "Show toasts in the same place every time."
    ],
    "donts": [
      "Put errors people must fix in a toast; use an Alert.",
      "Show more than three toasts at once.",
      "Use a toast for something people need to read later.",
      "Put more than one action in a toast."
    ],
    "compare": [
      {
        "title": "Toast, Alert or Modal?",
        "intro": "All three show messages. Pick by how long it should stay, and whether people must answer.",
        "options": [
          {
            "title": "Toast",
            "points": [
              "Confirms something people just did.",
              "Disappears by itself.",
              "Never blocks the page."
            ]
          },
          {
            "title": "Alert or Modal",
            "points": [
              "Alert: stays in the page until the problem is fixed.",
              "Modal: a question that must be answered first.",
              "If missing the message would cause problems, don't use a toast."
            ]
          }
        ]
      }
    ]
  },
  "tooltip": {
    "callout": "A short label that appears when you point at or focus an element, to say what it is or does.",
    "about": [
      "Use a tooltip to name things that have no visible label, like Compact buttons and icon-only Buttons, or to show the full text of something that is cut off. It appears on hover or keyboard focus and disappears when you move away.",
      "Tooltips hold short text only. If you need anything people can click, use a Popover instead."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "A formatting toolbar: each Compact button names itself on hover, here \"Bold\"."
    },
    "dos": [
      "Use tooltips to name icon-only buttons.",
      "Keep them to a few words, in sentence case, with no full stop.",
      "Match the tooltip to the button's accessible name.",
      "Add a keyboard shortcut when there is one, for example \"Bold (Ctrl B)\"."
    ],
    "donts": [
      "Put links, buttons or anything clickable inside a tooltip.",
      "Hide information people need to finish a task.",
      "Repeat a label that is already visible.",
      "Add tooltips to disabled buttons; they can't be focused, so keyboard users never see them."
    ],
    "compare": [
      {
        "title": "Tooltip or Popover?",
        "intro": "Both float next to an element. Choose by what goes inside.",
        "options": [
          {
            "title": "Tooltip",
            "points": [
              "A few words of plain text.",
              "Appears on hover or focus; nothing inside to click.",
              "Names an icon, explains a control or shows truncated text."
            ]
          },
          {
            "title": "Popover",
            "points": [
              "Richer content: text, links, buttons, forms.",
              "Opens on click and stays open until closed.",
              "Menus, pickers, more details, quick settings."
            ]
          }
        ]
      }
    ]
  },
  "tour": {
    "callout": "Shows new people around a screen, one step at a time.",
    "about": [
      "A tour points at one part of the screen at a time, with a short title, a line of help and Back, Next and Skip. The rest of the page is dimmed so people know where to look. Use it once, for people who are new, and let them skip it."
    ],
    "example": {
      "width": 518,
      "height": 376,
      "caption": "Start with a welcome: what the tour covers and how long it takes."
    },
    "dos": [
      "Keep it to five steps or fewer.",
      "Point at one thing per step and say what it does.",
      "Let people skip, and never show it again once it is done or skipped.",
      "Offer a way to replay it, like Take the tour under Help."
    ],
    "donts": [
      "Show a tour every time someone signs in.",
      "Explain what the screen already makes obvious.",
      "Start a tour while people are in the middle of a task.",
      "Put forms, long text or several links in a step."
    ],
    "compare": [
      {
        "title": "Tour, Popover or Tooltip?",
        "intro": "They look alike. A tour is the only one that opens on its own, moves between places and dims the page.",
        "options": [
          {
            "title": "Tour",
            "points": [
              "Opens on its own for new people. Steps through several places, dims the rest, and has Back, Next and Skip."
            ]
          },
          {
            "title": "Popover",
            "points": [
              "Opens when people click something. One panel of content or a short form, next to what they clicked."
            ]
          },
          {
            "title": "Tooltip",
            "points": [
              "A short label that shows on hover or focus. No buttons, and it never takes focus."
            ]
          }
        ]
      }
    ]
  },
  "tree": {
    "callout": "Nested items people open and close, like folders, categories or permissions.",
    "about": [
      "Use a Tree on its own for browsing, like a file list, or for picking several with checkboxes, like permissions for a role. Use Tree select to pick from nested options in a form, like a team inside a department."
    ],
    "example": {
      "width": 518,
      "height": 320,
      "caption": "Browsing files: icons help people tell folders from files."
    },
    "dos": [
      "Open the branch that holds the current or chosen item.",
      "Use icons to tell folders from files.",
      "Use checkboxes when people pick several; let branches pick everything inside.",
      "Turn on search in Tree select when the tree is long."
    ],
    "donts": [
      "Nest deeper than four levels; split it into pages instead.",
      "Use a Tree for a flat list.",
      "Hide actions people need inside closed branches.",
      "Mix checkboxes and single picking in one tree."
    ],
    "compare": []
  }
};

/** The guide for a slug, and the slug its example image is named after. */
export function guideFor(slug: string): { guide: Guide; image: string } | null {
  const shared: Record<string, string> = { 'event-calendar': 'calendar', 'tree-select': 'tree' };
  const key = guides[slug] ? slug : shared[slug];
  return key ? { guide: guides[key]!, image: key } : null;
}
