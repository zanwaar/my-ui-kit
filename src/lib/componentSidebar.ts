export function componentSidebar(activeComponent?: string) {
  return [
    { title: 'Getting Started', links: [{ href: '/', label: 'Introduction' }] },
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
            { href: '/components/forms/', label: 'Form', active: activeComponent === 'form' },
            { href: '/components/dropdowns/', label: 'Dropdown', active: activeComponent === 'dropdown' }
          ]
        },
        { href: '/blocks/', label: 'Blocks' },
        { href: '/templates/', label: 'Templates' }
      ]
    }
  ];
}
