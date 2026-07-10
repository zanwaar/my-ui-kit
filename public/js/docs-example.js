(function () {
  const copyText = async (text, trigger) => {
    if (!text) return;

    const original = trigger.textContent;

    try {
      await navigator.clipboard.writeText(text);
      trigger.textContent = 'Copied';
      setTimeout(() => {
        trigger.textContent = original;
      }, 1600);
    } catch (error) {
      console.error('Copy failed', error);
      trigger.textContent = 'Failed';
      setTimeout(() => {
        trigger.textContent = original;
      }, 1600);
    }
  };

  document.addEventListener('click', (event) => {
    const promptButton = event.target.closest('[data-copy-prompt]');
    if (promptButton) {
      copyText(promptButton.getAttribute('data-copy-prompt'), promptButton);
      return;
    }

    const codeButton = event.target.closest('[data-copy-code]');
    if (codeButton) {
      copyText(codeButton.getAttribute('data-copy-code'), codeButton);
      return;
    }

    const rtlButton = event.target.closest('[data-docs-rtl]');
    if (rtlButton) {
      const example = rtlButton.closest('[data-docs-example]');
      const preview = example && example.querySelector('[data-docs-preview]');
      if (!preview) return;

      const isRtl = preview.getAttribute('dir') === 'rtl';
      preview.setAttribute('dir', isRtl ? 'ltr' : 'rtl');
      rtlButton.textContent = isRtl ? 'RTL' : 'LTR';
    }
  });
})();
