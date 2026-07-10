(function () {
  const activeClasses = ['border-primary-600', 'font-medium', 'text-primary-700', 'dark:text-primary-300'];
  const inactiveClasses = ['border-transparent', 'text-neutral-500', 'dark:text-neutral-400'];

  const links = Array.from(document.querySelectorAll('[data-docs-toc-link]'));
  if (!links.length) return;

  const sections = links
    .map((link) => {
      const hash = link.getAttribute('href');
      if (!hash || !hash.startsWith('#')) return null;
      const section = document.querySelector(hash);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (activeLink) => {
    links.forEach((link) => {
      const active = link === activeLink;
      link.classList.toggle('border-primary-600', active);
      link.classList.toggle('font-medium', active);
      link.classList.toggle('text-primary-700', active);
      link.classList.toggle('dark:text-primary-300', active);
      link.classList.toggle('border-transparent', !active);
      link.classList.toggle('text-neutral-500', !active);
      link.classList.toggle('dark:text-neutral-400', !active);
    });
  };

  const updateActive = () => {
    const offset = 120;
    let current = sections[0];

    sections.forEach((item) => {
      if (item.section.getBoundingClientRect().top <= offset) {
        current = item;
      }
    });

    setActive(current.link);
  };

  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive();
})();
