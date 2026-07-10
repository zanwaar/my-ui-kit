export function componentSidebar(activeComponent?: string) {
  return [
    {
      title: 'Getting Started',
      links: [
        { href: '/', label: 'Introduction', icon: 'home', active: activeComponent === 'introduction' },
        { href: '/quick-start/', label: 'Quick Start', icon: 'code', active: activeComponent === 'quick-start' }
      ]
    },
    {
      title: 'Foundations',
      links: [
        {
          href: '/layout-system/',
          label: 'Layout System',
          icon: 'layout',
          active: ['layout-foundations', 'breakpoints', 'containers', 'grid', 'colors-foundation', 'typography-foundation', 'themes-foundation'].includes(activeComponent ?? ''),
          children: [
            { href: '/layout-system/', label: 'Overview', icon: 'layout', active: activeComponent === 'layout-foundations' },
            { href: '/foundations/breakpoints/', label: 'Breakpoints', icon: 'code', active: activeComponent === 'breakpoints' },
            { href: '/foundations/containers/', label: 'Containers', icon: 'square', active: activeComponent === 'containers' },
            { href: '/foundations/grid/', label: 'Grid', icon: 'grid', active: activeComponent === 'grid' },
            { href: '/foundations/colors/', label: 'Colors', icon: 'palette', active: activeComponent === 'colors-foundation' },
            { href: '/foundations/typography/', label: 'Typography', icon: 'form', active: activeComponent === 'typography-foundation' },
            { href: '/foundations/themes/', label: 'Themes', icon: 'moon', active: activeComponent === 'themes-foundation' }
          ]
        },
        {
          href: '/customization/',
          label: 'Customization',
          icon: 'sliders',
          active: activeComponent === 'customization',
          children: [
            { href: '/customization/components/', label: 'Customize Components', icon: 'sliders' },
            { href: '/customization/config/', label: 'Config', icon: 'settings' },
            { href: '/customization/base-style/', label: 'Base Style', icon: 'paint' },
            { href: '/customization/colors/', label: 'Colors', icon: 'palette' },
            { href: '/customization/icons/', label: 'Icons', icon: 'sparkle', active: activeComponent === 'icons' },
            { href: '/customization/themes/', label: 'Themes', icon: 'moon' },
            { href: '/customization/utilities-and-variables/', label: 'Utilities And Variables', icon: 'code' },
            { href: '/customization/rtl/', label: 'RTL', icon: 'align-right' },
            { href: '/customization/theme-generator/', label: 'Theme Generator', icon: 'wand', badge: 'WIP' }
          ]
        }
      ]
    },
    {
      title: 'Library',
      links: [
        {
          href: '/components/',
          label: 'Components',
          icon: 'layers',
          active: !activeComponent,
          children: [
            {
              href: '/components/buttons/',
              label: 'Button',
              icon: 'pointer',
              active: activeComponent === 'button',
              children: [
                { href: '/components/buttons/#solid-buttons', label: 'Solid buttons' },
                { href: '/components/buttons/#soft-buttons', label: 'Soft buttons' },
                { href: '/components/buttons/#outline-buttons', label: 'Outline buttons' },
                { href: '/components/buttons/#text-buttons', label: 'Text buttons' },
                { href: '/components/buttons/#gradient-buttons', label: 'Gradient buttons' },
                { href: '/components/buttons/#pilled-buttons', label: 'Pilled buttons' },
                { href: '/components/buttons/#rounded-buttons', label: 'Rounded buttons' },
                { href: '/components/buttons/#state-variants', label: 'States variants' },
                { href: '/components/buttons/#size-variants', label: 'Size variants' },
                { href: '/components/buttons/#icon-start-end', label: 'Icon at start/end' },
                { href: '/components/buttons/#icon-only', label: 'Icon only' },
                { href: '/components/buttons/#buttons-with-input-tags', label: 'Buttons with input tags' }
              ]
            },
            { href: '/components/badges/', label: 'Badge', icon: 'tag', active: activeComponent === 'badge' },
            { href: '/components/alerts/', label: 'Alert', icon: 'alert', active: activeComponent === 'alert' },
            { href: '/components/cards/', label: 'Card', icon: 'square', active: activeComponent === 'card' },
            { href: '/components/dropdowns/', label: 'Dropdown', icon: 'chevrons', active: activeComponent === 'dropdown' }
          ]
        },
        {
          href: '/components/forms/',
          label: 'Forms',
          icon: 'form',
          active: activeComponent === 'form',
          children: [
            { href: '/components/forms/#checkbox', label: 'Checkbox' },
            { href: '/components/forms/#file-input', label: 'File Input' },
            { href: '/components/forms/#filter', label: 'Filter' },
            { href: '/components/forms/#input', label: 'Input' },
            { href: '/components/forms/#join', label: 'Join (Group Items)' },
            { href: '/components/forms/#radio', label: 'Radio' },
            { href: '/components/forms/#range', label: 'Range' },
            { href: '/components/forms/#select', label: 'Select' },
            { href: '/components/forms/#switch', label: 'Switch' },
            { href: '/components/forms/#textarea', label: 'Textarea' }
          ]
        },
        {
          href: '/components/advanced-select/',
          label: 'Advanced Forms',
          icon: 'form',
          active: [
            'advanced-select',
            'combo-box',
            'copy-markup',
            'form-wizard',
            'input-number',
            'pin-input',
            'strong-password',
            'toggle-count',
            'toggle-password'
          ].includes(activeComponent ?? ''),
          children: [
            { href: '/components/advanced-select/', label: 'Advanced Select', active: activeComponent === 'advanced-select' },
            { href: '/components/combo-box/', label: 'Combo Box', active: activeComponent === 'combo-box' },
            { href: '/components/copy-markup/', label: 'Copy Markup', active: activeComponent === 'copy-markup' },
            { href: '/components/form-wizard/', label: 'Form Wizard', active: activeComponent === 'form-wizard' },
            { href: '/components/input-number/', label: 'Input Number', active: activeComponent === 'input-number' },
            { href: '/components/pin-input/', label: 'Pin Input', active: activeComponent === 'pin-input' },
            { href: '/components/strong-password/', label: 'Strong Password', active: activeComponent === 'strong-password' },
            { href: '/components/toggle-count/', label: 'Toggle Count', active: activeComponent === 'toggle-count' },
            { href: '/components/toggle-password/', label: 'Toggle Password', active: activeComponent === 'toggle-password' }
          ]
        },
        {
          href: '/components/table/',
          label: 'Tables',
          icon: 'grid',
          active: activeComponent === 'table',
          children: [
            { href: '/components/table/', label: 'Table', active: activeComponent === 'table' }
          ]
        },
        {
          href: '/components/sidebar/',
          label: 'Navigations',
          icon: 'layout',
          active: ['sidebar'].includes(activeComponent ?? ''),
          children: [
            { href: '/components/breadcrumb/', label: 'Breadcrumb', active: activeComponent === 'breadcrumb' },
            { href: '/components/footer/', label: 'Footer', active: activeComponent === 'footer' },
            { href: '/components/menu/', label: 'Menu', active: activeComponent === 'menu' },
            { href: '/components/navbar/', label: 'Navbar', active: activeComponent === 'navbar' },
            { href: '/components/pagination/', label: 'Pagination', active: activeComponent === 'pagination' },
            { href: '/components/scrollspy/', label: 'Scrollspy', active: activeComponent === 'scrollspy' },
            { href: '/components/sidebar/', label: 'Sidebar', active: activeComponent === 'sidebar' },
            { href: '/components/stepper/', label: 'Stepper', active: activeComponent === 'stepper' },
            { href: '/components/tabs-pills/', label: 'Tabs & Pills', active: activeComponent === 'tabs-pills' }
          ]
        },
        {
          href: '/components/context-menu/',
          label: 'Overlays',
          icon: 'window',
          active: ['context-menu', 'drawer', 'dropdown', 'modal', 'popover', 'tooltip'].includes(activeComponent ?? ''),
          children: [
            { href: '/components/context-menu/', label: 'Context Menu', active: activeComponent === 'context-menu' },
            { href: '/components/drawer/', label: 'Drawer (Offcanvas)', active: activeComponent === 'drawer' },
            { href: '/components/dropdowns/', label: 'Dropdown', active: activeComponent === 'dropdown' },
            { href: '/components/modal/', label: 'Modal', active: activeComponent === 'modal' },
            { href: '/components/popover/', label: 'Popover', active: activeComponent === 'popover' },
            { href: '/components/tooltip/', label: 'Tooltip', active: activeComponent === 'tooltip' }
          ]
        },
        { href: '/blocks/', label: 'Blocks', icon: 'grid' },
        { href: '/templates/', label: 'Templates', icon: 'window' }
      ]
    }
  ];
}
