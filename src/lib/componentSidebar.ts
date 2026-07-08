export function componentSidebar(activeComponent?: string) {
  return [
    { title: 'Getting Started', links: [{ href: '/', label: 'Introduction' }] },
    {
      title: 'Foundations',
      links: [
        { href: '/layout-system/', label: 'Layout System', active: activeComponent === 'layout-system' }
      ]
    },
    {
      title: 'Library',
      links: [
        {
          href: '/components/',
          label: 'Components',
          active: !activeComponent,
          children: [
            { href: '/components/buttons/', label: 'Button', active: activeComponent === 'button' },
            { href: '/components/badges/', label: 'Badge', active: activeComponent === 'badge' },
            { href: '/components/alerts/', label: 'Alert', active: activeComponent === 'alert' },
            { href: '/components/cards/', label: 'Card', active: activeComponent === 'card' },
            { href: '/components/dropdowns/', label: 'Dropdown', active: activeComponent === 'dropdown' }
          ]
        },
        {
          href: '/components/forms/',
          label: 'Forms',
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
        { href: '/blocks/', label: 'Blocks' },
        { href: '/templates/', label: 'Templates' }
      ]
    }
  ];
}
