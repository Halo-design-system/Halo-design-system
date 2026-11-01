// Where each catalog entry lives in the Halo Figma library (file LVZSmXHpIl0qR5fKYzzLrK).
// Keyed by the catalog slug. The first part is what a click places; the rest show as chips.
// `page` is the Figma page the part sits on, used to find it in a copy of the file.
// `set` is false for a plain component, true for a component set with variants.

export interface Part {
  name: string;
  key: string;
  page: string;
  set: boolean;
}

const s = (page: string, name: string, key: string): Part => ({ name, key, page, set: true });
const c = (page: string, name: string, key: string): Part => ({ name, key, page, set: false });

export const parts: Record<string, Part[]> = {
  // Actions
  button: [s('Button', 'Button', '5e628020de6a81b2759a93c375e057c7c4802283')],
  'compact-button': [s('Button', 'Compact button', '4079b4ca3ff9107bf24022b0698f292c1860af7a')],
  'link-button': [s('Button', 'Link button', 'f51bea3a82ac525b01c8fd65ffd7c530d02b1008')],
  'social-button': [s('Button', 'Social button', 'c3c2e806010a44e2b905edc75563e667682db0e9')],
  'button-group': [
    s('Button group', 'Button group', '094a021ff414e2e9a5a1c2dec1600edf76e01771'),
    s('Button group', 'Button group item', '6dc2d9f9fab8710ada08434266596b89d63dbc4d'),
  ],

  // Forms
  form: [
    c('Form', 'Form section', '2ec1a24e340e01129e63adb55f0923615666ab7e'),
    s('Form', 'Form actions', 'd61e5d0c4d1463b5cc265b285d9cdf3b4cb963bd'),
    c('Form', 'Horizontal field', '8ad515d9fcc1716a86f9d980d91e26f62559c581'),
  ],
  input: [
    s('Input field', 'Input field', '9515fa2da67191bdd817cb32eac2c9a34096874d'),
    s('Input field', 'Input', '2012fb7ed70fb10fed35f240193cf7ded8e86b8c'),
    s('Input field', 'Number input', '21be8dec497895457f0eea0bb0567a00aa56286b'),
    s('Input field', 'Verification code', 'e45d196f397ede3161570117b9bc21ce8e4d591e'),
    s('Input field', 'Field label', '65e30652352ae95f52bc12175f1bc06a974b4368'),
    s('Input field', 'Input affix', '05ec8b3dc14c200dab07cc89158a65e9179afeb4'),
    s('Input field', 'Code digit', 'f3aca4b6acdbca7ddd351a81663a368764c97aca'),
  ],
  textarea: [
    s('Textarea', 'Textarea field', 'bc2f448e6746ab7105a4776c03b0b5f3efc31e11'),
    s('Textarea', 'Textarea', 'bfe8ddac788990c133a16d750f97ef59f26e0ea5'),
  ],
  select: [
    s('Select field', 'Select field', 'ba3ce3b9552cdcedf592d20dba96e8c423996e78'),
    s('Select field', 'Select', 'f3221e704d4776f2eeb47c41ca3677b739d72329'),
    s('Select field', 'Combobox', 'e4b26c44779653a7ae7c88d2cb25c6d3f474a2b0'),
  ],
  checkbox: [
    s('Checkbox', 'Checkbox field', '4b5379a35615bfca4748e9859a1e373cca85c73f'),
    s('Checkbox', 'Checkbox', '6ab5b1d6b456ab803feeb2dbb2cbf7303177effd'),
    s('Checkbox', 'Checkbox group', 'fa2a3a34a7cc51097251c8a34cc08c2fe023d393'),
  ],
  radio: [
    s('Radio', 'Radio group', 'c8aa1d481910e94d3c3e9606f73ff88860757e0f'),
    s('Radio', 'Radio field', '71a494c78fd1da4124eb123b34c670f5a3fbd603'),
    s('Radio', 'Radio', '68865ce69b44a4402a6b273be0f683d6782c1296'),
  ],
  switch: [
    s('Switch', 'Switch field', '142c87380440ee00796563102708c46a7a67dbe8'),
    s('Switch', 'Switch', '95eaa23430718a971aed56cb159aad75cf748037'),
  ],
  slider: [
    s('Slider', 'Slider field', '2ebe262429bdac4321ce9c48b878a7f59ad1c97d'),
    s('Slider', 'Slider', '42158eb266a6bf41b6724547059fa622ebe2ea2d'),
  ],
  'date-picker': [
    s('Date picker', 'Date field', '91ac7b0c26f66ed4ba175a9b95dd1091a37f2168'),
    s('Date picker', 'Date range field', '83ac848dca201bd9bdb33d4cfef9122f57ee8efe'),
    s('Date picker', 'Multiple date field', '4aabe5f1b4a5e21f3014b740dafa6e4a7bd0e7b2'),
    s('Date picker', 'Date input', 'f6ca473a1ae2efea32aa87408719aefeff55d61b'),
    s('Date picker', 'Date range input', '961f8ae42e4dd2c08b92457a341e8d3daeba7172'),
    s('Date picker', 'Multiple date input', '14f43c6418e77dcd01b5a644648226fe1ab12cdd'),
  ],
  'time-picker': [
    s('Time picker', 'Time field', '57973775cceb5947806275f34e9ccc8e2c5b337c'),
    s('Time picker', 'Time input', '2434471d395994a93825263cdf8cc6d3c2b214ef'),
  ],
  'color-picker': [
    s('Color picker', 'Color field', '3b064c54abaadfc8fa77e5a44aa6023ad077bf6b'),
    s('Color picker', 'Color picker', 'd053bdb4432ee0c72c87b582d30c79e0a9e36f45'),
    s('Color picker', 'Color swatch', '1c88d5438a3e1594859ea874d545d8c50ca0ed2a'),
  ],
  'file-upload': [
    s('File upload', 'File upload', '20baf3fee3a1fa5f279a7b5030784ab09e4c3a35'),
    s('File upload', 'File item', 'd9b3a802674ec4d5f1fe9c6410fbcb04e61ce1b5'),
  ],
  rating: [
    s('Rating', 'Rating', '49450b6d421953c5b8752abecf5c3ec266182710'),
    s('Rating', 'Rating star', '97922f390957125f8672efd7366fa4068453c960'),
  ],
  'segmented-control': [
    s('Segmented control', 'Segmented control', '726a3aff16213fe9c6ae0f1206970321fb4ceab5'),
    s('Segmented control', 'Segment', '8f3d1989dc1f23344bb01ee2753d38854f26b8b2'),
  ],
  'tree-select': [s('Tree', 'Tree select', '4ebb070be4a41434412a6ea8199f06a7de71f0d2')],
  'rich-text-editor': [
    s('Rich text editor', 'Rich text editor field', 'b09d156eb42e55328418a8a9bbb8cf5b3c9c65aa'),
    s('Rich text editor', 'Rich text editor', '78af40cfb77d598c9a2087247f4bffe08a634de3'),
    s('Rich text editor', 'Editor toolbar', '3ffc1ad8e839b4b3a049c7bd8213f458056170c2'),
  ],

  // Navigation
  navigation: [
    s('Navigation', 'Sidebar', '28ec4b700f7b3e70c023bf01f183eeb53db92330'),
    s('Navigation', 'Top bar', 'cda63fb2b9ac4b95e7ca121107f75e4ec5cc3901'),
    s('Navigation', 'Bottom nav', 'd1f4e6e0a8c7d9b8dc170ffe0cedaae064aaa46a'),
    s('Navigation', 'Nav item', 'dbf250ecaf6f04322b85647d4b24276295d936ed'),
    s('Navigation', 'Nav group', '294c35b1c27c33d6539ee016256097ecb94f05bf'),
    s('Navigation', 'Bottom nav item', '085bfd376e4344b05d56b483ac90fcfadf56db70'),
  ],
  tabs: [
    s('Tabs', 'Tabs', 'bcdbc5757efd4a514633a865b7ada05738faf8e2'),
    s('Tabs', 'Tab', 'fb58b35a08b5b4b2077d11ac480bb90c657fd76c'),
  ],
  breadcrumbs: [
    s('Breadcrumbs', 'Breadcrumbs', '841a60e7d37577ad34d5ea2820fd11de4fc3e435'),
    s('Breadcrumbs', 'Breadcrumb item', '01feb4e44a202ee56d80364431f0639f618df587'),
    s('Breadcrumbs', 'Breadcrumb separator', 'c0aa7cf55fdf4c90160d120721c21c753e44fc36'),
  ],
  pagination: [
    s('Pagination', 'Pagination', 'f7214ab2a5d4755e9d89d49e0e443cd40bec4c39'),
    s('Pagination', 'Page item', 'c9485b69dafdd628725335fa7abeaafd2a9bf873'),
  ],
  stepper: [
    s('Stepper', 'Stepper', '1ca97e869e4bc68b761cd4bf4c4486b73dd2e021'),
    s('Stepper', 'Step', 'fcb53744e12014f4a25da3060b425b30887eb8d1'),
  ],
  menu: [
    c('Menu', 'Menu', '0c0590216fac80de6221aeb02f9465e0976eb4b0'),
    s('Menu', 'Menu item', '37c1b1ec8044db8d7736c2995a908053edfb02d6'),
  ],

  // Feedback
  alert: [s('Alert', 'Alert', '7ecb46dcd8e5a8a8191b656181ef506bd589a834')],
  toast: [s('Toast', 'Toast', '5ca5aacebb1d94f15c4dfa48dea4222efc6503d2')],
  progress: [
    s('Progress', 'Progress bar', '7f4d9b717e71fb609da2afcd6558448ae5ab8453'),
    s('Progress', 'Progress field', 'ab7f7e505911249454cc2160b3335dd77a81cbf1'),
    s('Progress', 'Progress circle', '17693cf9e859d9a02680c695b0e181d94490dec7'),
  ],
  spinner: [
    s('Spinner', 'Spinner', '93339db818f7dc46a72f15eaa411d48bb1be893d'),
    s('Spinner', 'Loading indicator', 'ae447b929d5a51d045d767356fc500f2b6978f24'),
  ],
  skeleton: [
    s('Skeleton', 'Skeleton', '0a8a8e73a8b03dbd80f7d70d783be1c42507f630'),
    s('Skeleton', 'Skeleton pattern', 'd23b0fc5bfd1e7b4bfce712761b08edf2527f2e2'),
  ],
  'empty-state': [s('Empty state', 'Empty state', 'e0fd16af8a7ff16b9ab00a57b3343249a59a8362')],
  result: [s('Result', 'Result', '8f3a025f1af846fe38ef0ada1bd248485a4788c2')],
  tooltip: [s('Tooltip', 'Tooltip', 'f61e56f5a371229563d1cad460dfda38eb07a430')],
  tour: [s('Tour', 'Tour step', 'd81036ae680718a8f41710ba1e59d1c88966bf16')],

  // Overlays
  modal: [
    s('Modal', 'Modal', '11e714fe0e6e5f9e4ad82eaf02efc3fa21b8139e'),
    s('Overlay', 'Overlay', 'a31e6cfe864109d6468742598d072e72cf6e6764'),
  ],
  drawer: [
    s('Drawer', 'Drawer', '850c674fcdbba1a9d56825c613a81e55e929277f'),
    s('Overlay', 'Overlay', 'a31e6cfe864109d6468742598d072e72cf6e6764'),
  ],
  popover: [s('Popover', 'Popover', '5020d0343d525530a64981eeb5eceaf7dcf81b39')],

  // Data display
  table: [
    s('Table', 'Table header cell', 'eb4a0b6c9903ab5dc6ca01b70a01f37e54cf2825'),
    s('Table', 'Table cell', '68bd460ae667834d8d2e036b1bd897e808cf5cf0'),
    s('Table', 'Table toolbar', '0d94ee55ea88b023f010245905e531dd5bfaeb11'),
    s('Table', 'Table footer', 'f0b997cb4128e973b84a49daeb760bc6d9b2d70d'),
    c('Table', 'Table expanded row', 'd4d8e6651bb6d118bfe9f4c2eb0c3f6341808e16'),
  ],
  statistic: [s('Statistic', 'Statistic', '8a7c9a50e0f0b76c5747ff15033c3d3435b35435')],
  charts: [
    s('Charts', 'Bar chart', 'e70ca6fe0c52b44918f82043ffb7f0409a7e021c'),
    s('Charts', 'Line chart', '76ff858a1a109f7d382ba52f2e9f6d18e1784cbf'),
    s('Charts', 'Pie chart', '13e3492dadc56b86b4188e7e23377be67e78f7bd'),
    s('Charts', 'Sparkline', '4f392ae9a6ee3eb9c76ad8866d0aea60deadfc3f'),
    s('Charts', 'Chart legend item', 'a079fe2bf8a3ba9ca4ef995b36cc3a548c228885'),
    s('Charts', 'Chart tooltip', '6d84b476e5340e10203d9b09f66289ece646f19c'),
  ],
  card: [s('Cards', 'Card', 'fc9f379c40fdb0e647d3e2b6e9872095e42d3a27')],
  list: [
    s('List', 'List', 'd5d73b780f9d5804e128e82fdc88e0a0cebe5f7d'),
    s('List', 'List item', '4779aa3d45a75a1e83eb6f195c3d5dde2f5eb0fd'),
  ],
  avatar: [
    s('Avatar', 'Avatar', 'cac938a5247cbba4adb9605abfbea2ddcc6aaadc'),
    s('Avatar', 'Avatar group', '3263ac80f51b26edc4574d196f3d1cbd8ca4286c'),
    s('Avatar', 'Avatar image', '1ec648072f1cdb92102e4963fe994c028f742df1'),
    s('Avatar', 'Avatar status', 'f9a792d063571e763aa54da0c3bae9b10d3c26a6'),
  ],
  badge: [s('Badge', 'Badge', 'ef74b84339e491fdca81d70ed2a8aafd2dcda79a')],
  tag: [s('Tags', 'Tag', '344d298efd67f402a87d99aaadc932fef9024448')],
  calendar: [
    s('Calendar', 'Calendar', 'c5482ad306b9dd93f157e7a7ae3ef2f3e482f553'),
    s('Calendar', 'Calendar day', '8346b7c1851ec20863bf13f40f36f77bd1312b11'),
    s('Calendar', 'Month and year picker', '81e811f22f8168e7e67ee0b4078a47db815d9f64'),
  ],
  'event-calendar': [
    s('Calendar', 'Event calendar', '250c578ccc1f1da5ec534ce60631533b71004f61'),
    s('Calendar', 'Calendar event', '87b8acf82dae4f59f8942ee3ac8132a81c9d2844'),
  ],
  tree: [s('Tree', 'Tree item', 'e416cdac566c386d3a75cdb4614b1140aee2c9db')],
  accordion: [s('Accordion', 'Accordion item', '5aef0fc635990de220ba6de4c4ed6176bd4d1235')],
  carousel: [
    s('Carousel', 'Carousel', '29c42a11d377dce1063e7d0f9ef76e3d5ab9d7c9'),
    c('Carousel', 'Carousel slide', '7110b29fbc2940be5a229802e65d506632b73889'),
    s('Carousel', 'Carousel dot', '1a75e556c5dd15143972c794782a91d1dc523e81'),
  ],
  'qr-code': [
    s('QR code', 'QR code', '46a23fb44233fbfe0821aced524c0b7e6571e845'),
    c('QR code', 'QR code logo', '0c1f112871d93ca079f6b95eb0d5b1bd73402b5b'),
  ],
  resizable: [s('Resizable', 'Resizable handle', 'f1de85a9c3d5b84a7fdec3991d6b2e8ca857f278')],
  divider: [s('Divider', 'Divider', '9e6b071f1ce7d6520c8b99dc25d537d6977b932f')],
  text: [s('Text', 'Text', 'ed296dd59e702502b47fa5c68c6c8e9037a76ab1')],
};
