export function componentSidebar(activeComponent?: string) {
  return [
    { title: 'Getting Started', links: [{ href: '/', label: 'Introduction', icon: 'home' }] },
    {
      title: 'Foundations',
      links: [
        { href: '/layout-system/', label: 'Layout System', icon: 'layout', active: activeComponent === 'layout-system' },
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
            { href: '/components/buttons/', label: 'Button', icon: 'pointer', active: activeComponent === 'button' },
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
        { href: '/blocks/', label: 'Blocks', icon: 'grid' },
        { href: '/templates/', label: 'Templates', icon: 'window' }
      ]
    }
  ];
}
