// core/js/dropdown.js
// Internal piceUI dropdown runtime.

(function () {
  const PiceUI = (window.PiceUI = window.PiceUI || {});
  const instances = new WeakMap();
  const activeInstances = new Set();

  function qsa(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  function emit(element, name, detail) {
    const event = new CustomEvent(name, {
      detail: detail || {},
      bubbles: true,
      cancelable: true
    });

    element.dispatchEvent(event);
    return event;
  }

  function isElementVisible(element) {
    return !!element && !element.classList.contains('hidden');
  }

  function isDisabled(element) {
    return !!element && (element.disabled || element.getAttribute('aria-disabled') === 'true');
  }

  function isFocusableItem(element) {
    return !!element && !element.hidden && !isDisabled(element);
  }

  function getTriggerMode(element) {
    const trigger = window.getComputedStyle(element).getPropertyValue('--trigger').trim();
    if (trigger === 'contextmenu') return 'contextmenu';
    return trigger === 'hover' ? 'hover' : 'click';
  }

  class PuiDropdown {
    constructor(element, options) {
      this.el = element || null;
      this.root = this.el;
      this.options = options || {};
      this.cleanups = [];
      this.toggleEl = null;
      this.menuEl = null;
      this.triggerMode = 'click';
      this.isOpenState = false;
      this.initialized = false;

      if (!this.root || instances.has(this.root)) return;

      this.toggleEl = this.findToggle();
      this.menuEl = this.findMenu();

      if (!this.toggleEl || !this.menuEl || isDisabled(this.toggleEl)) return;

      this.triggerMode = getTriggerMode(this.root);
      this.ensureInitialState();
      this.syncFocusableItems();
      this.bindLocalEvents();
      this.initialized = true;
      instances.set(this.root, this);
      this.emit('pui:dropdown:init', this.getDetail());
    }

    findToggle() {
      return this.root.querySelector(':scope > .dropdown-toggle') || this.root.querySelector(':scope > [data-dropdown-toggle]');
    }

    findMenu() {
      return this.root.querySelector(':scope > .dropdown-menu') || this.root.querySelector(':scope > [data-dropdown-menu]');
    }

    ensureInitialState() {
      if (!this.toggleEl.hasAttribute('aria-expanded')) {
        this.toggleEl.setAttribute('aria-expanded', 'false');
      }

      this.isOpenState = isElementVisible(this.menuEl);

      if (this.isOpenState) {
        this.root.classList.add('open');
        this.toggleEl.setAttribute('aria-expanded', 'true');
      } else {
        this.root.classList.remove('open');
        this.menuEl.classList.add('hidden');
        this.toggleEl.setAttribute('aria-expanded', 'false');
      }
    }

    on(element, eventName, handler, options) {
      if (!element) return;
      element.addEventListener(eventName, handler, options);
      this.cleanups.push(function () {
        element.removeEventListener(eventName, handler, options);
      });
    }

    emit(name, detail) {
      if (!this.root) return null;
      return emit(this.root, name, detail);
    }

    bindLocalEvents() {
      if (this.triggerMode === 'contextmenu') {
        this.on(this.toggleEl, 'contextmenu', event => {
          if (isDisabled(this.toggleEl)) return;
          event.preventDefault();
          this.open({ focusFirstItem: true });
        });

        this.on(this.toggleEl, 'click', event => {
          if (isDisabled(this.toggleEl)) return;
          event.preventDefault();
          this.toggle();
        });
      } else if (this.triggerMode === 'hover') {
        this.on(this.root, 'mouseenter', () => {
          if (isDisabled(this.toggleEl)) return;
          this.open();
        });

        this.on(this.root, 'mouseleave', () => {
          this.close();
        });

        this.on(this.toggleEl, 'click', event => {
          event.preventDefault();
          this.toggle();
        });
      } else {
        this.on(this.toggleEl, 'click', event => {
          if (isDisabled(this.toggleEl)) return;
          event.preventDefault();
          this.toggle();
        });
      }

      this.on(this.toggleEl, 'keydown', event => {
        this.handleToggleKeydown(event);
      });

      const closers = qsa('.dropdown-close', this.root);
      closers.forEach(closer => {
        this.on(closer, 'click', () => {
          if (isDisabled(closer)) return;
          this.close({ focusToggle: false });
        });
      });

      const checkableItems = qsa('[role="menuitemcheckbox"], [role="menuitemradio"]', this.root);
      checkableItems.forEach(item => {
        this.on(item, 'click', () => {
          if (isDisabled(item)) return;
          this.toggleCheckableItem(item);
        });
      });

      this.on(this.menuEl, 'keydown', event => {
        this.handleMenuKeydown(event);
      });

      this.on(this.menuEl, 'focusin', event => {
        if (this.isMenuItem(event.target)) this.syncFocusableItems(event.target);
      });
    }

    getFocusableItems() {
      return qsa('a[href], button, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], .dropdown-item', this.menuEl).filter(isFocusableItem);
    }

    isMenuItem(element) {
      return this.getFocusableItems().includes(element);
    }

    syncFocusableItems(activeItem) {
      const items = this.getFocusableItems();
      if (!items.length) return;

      const currentItem = activeItem || items.find(item => item.getAttribute('tabindex') === '0') || items[0];
      items.forEach(item => {
        item.setAttribute('tabindex', item === currentItem ? '0' : '-1');
      });
    }

    focusItem(index) {
      const items = this.getFocusableItems();
      if (!items.length) return;

      const safeIndex = (index + items.length) % items.length;
      this.syncFocusableItems(items[safeIndex]);
      items[safeIndex].focus();
    }

    focusNextItem(direction) {
      const items = this.getFocusableItems();
      if (!items.length) return;

      const currentIndex = items.indexOf(document.activeElement);
      const fallbackIndex = direction > 0 ? -1 : 0;
      this.focusItem((currentIndex === -1 ? fallbackIndex : currentIndex) + direction);
    }

    focusItemByFirstLetter(letter) {
      const items = this.getFocusableItems();
      if (!items.length) return;

      const currentIndex = items.indexOf(document.activeElement);
      const normalizedLetter = String(letter || '').trim().toLowerCase();
      if (!normalizedLetter) return;

      for (let offset = 1; offset <= items.length; offset += 1) {
        const index = (currentIndex + offset + items.length) % items.length;
        const text = (items[index].textContent || '').trim().toLowerCase();
        if (text.startsWith(normalizedLetter)) {
          items[index].focus();
          return;
        }
      }
    }

    handleMenuKeydown(event) {
      if (!this.isOpenState) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.focusNextItem(1);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.focusNextItem(-1);
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        this.focusItem(0);
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        this.focusItem(this.getFocusableItems().length - 1);
        return;
      }

      if (event.key === 'Tab') {
        this.close();
        return;
      }

      if (event.key.length === 1 && /[a-z0-9]/i.test(event.key) && !event.metaKey && !event.ctrlKey && !event.altKey) {
        this.focusItemByFirstLetter(event.key);
      }
    }

    handleToggleKeydown(event) {
      if (isDisabled(this.toggleEl)) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.toggle({ focusFirstItem: !this.isOpenState });
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.open({ focusFirstItem: true });
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.open({ focusLastItem: true });
      }
    }

    toggleCheckableItem(item) {
      const role = item.getAttribute('role');

      if (role === 'menuitemcheckbox') {
        item.setAttribute('aria-checked', item.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
        this.emit('pui:dropdown:item-change', Object.assign(this.getDetail(), { item: item }));
        return;
      }

      if (role === 'menuitemradio') {
        if (item.getAttribute('aria-checked') === 'true') return;

        const groupName = item.getAttribute('data-dropdown-radio-name');
        const groupRoot = groupName ? this.root : item.parentElement || this.root;

        qsa('[role="menuitemradio"]', groupRoot).forEach(groupItem => {
          if (groupName && groupItem.getAttribute('data-dropdown-radio-name') !== groupName) return;
          groupItem.setAttribute('aria-checked', groupItem === item ? 'true' : 'false');
        });

        this.emit('pui:dropdown:item-change', Object.assign(this.getDetail(), { item: item }));
      }
    }

    open(options) {
      const settings = Object.assign({ focusFirstItem: false, focusLastItem: false }, options);

      if (this.isOpenState || !this.menuEl || isDisabled(this.toggleEl)) return;

      PuiDropdown.closeAll(this);

      this.menuEl.classList.remove('hidden');
      this.root.classList.add('open');
      this.toggleEl.setAttribute('aria-expanded', 'true');
      this.isOpenState = true;
      activeInstances.add(this);

      this.emit('pui:dropdown:open', this.getDetail());
      this.emit('pui:dropdown:toggle', this.getDetail());

      if (settings.focusFirstItem) this.focusItem(0);
      if (settings.focusLastItem) this.focusItem(this.getFocusableItems().length - 1);
    }

    close(options) {
      const settings = Object.assign({ focusToggle: false }, options);

      if (!this.menuEl || !this.isOpenState) {
        if (settings.focusToggle && this.toggleEl) this.toggleEl.focus();
        return;
      }

      this.menuEl.classList.add('hidden');
      this.root.classList.remove('open');
      this.toggleEl.setAttribute('aria-expanded', 'false');
      this.isOpenState = false;
      activeInstances.delete(this);

      this.emit('pui:dropdown:close', this.getDetail());
      this.emit('pui:dropdown:toggle', this.getDetail());

      if (settings.focusToggle && this.toggleEl) {
        this.toggleEl.focus();
      }
    }

    toggle(options) {
      if (this.isOpenState) this.close();
      else this.open(options);
    }

    isOpen() {
      return this.isOpenState;
    }

    getDetail() {
      return {
        instance: this,
        root: this.root,
        toggle: this.toggleEl,
        menu: this.menuEl,
        trigger: this.triggerMode
      };
    }

    destroy() {
      this.close();
      activeInstances.delete(this);
      instances.delete(this.root);
      this.cleanups.forEach(cleanup => cleanup());
      this.cleanups = [];
      this.initialized = false;
      this.emit('pui:dropdown:destroy', this.getDetail());
    }

    static getInstance(element) {
      return element ? instances.get(element) || null : null;
    }

    static closeAll(except) {
      Array.from(activeInstances).forEach(instance => {
        if (except && instance === except) return;
        instance.close();
      });
    }

    static autoInit(scope) {
      const root = scope || document;
      qsa('.dropdown', root).forEach(element => {
        if (!instances.has(element)) new PuiDropdown(element);
      });
    }
  }

  function handleDocumentClick(event) {
    if (!activeInstances.size) return;

    const target = event.target;
    Array.from(activeInstances).forEach(instance => {
      if (!instance.root || instance.root.contains(target)) return;
      instance.close();
    });
  }

  function handleDocumentKeydown(event) {
    if (event.key !== 'Escape' || !activeInstances.size) return;

    const latest = Array.from(activeInstances).pop();
    if (!latest) return;

    latest.close({ focusToggle: true });
  }

  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keydown', handleDocumentKeydown);

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      function () {
        PuiDropdown.autoInit();
      },
      { once: true }
    );
  } else {
    PuiDropdown.autoInit();
  }

  PiceUI.Dropdown = PuiDropdown;
  window.PuiDropdown = PuiDropdown;
  window.HSDropdown = PuiDropdown;
})();
