// core/js/dropdown.js
// Internal piceUI dropdown runtime with FlyonUI features.

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

  function getComputedOption(element, option, defaultValue) {
    const style = window.getComputedStyle(element);
    const value = style.getPropertyValue(option).trim();
    return value || defaultValue;
  }

  function stringToBoolean(value) {
    return value === 'true' || value === '1' || value === '';
  }

  function getViewportRect() {
    return {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  function getOppositePlacement(placement) {
    const parts = String(placement || 'bottom-start').split('-');
    const base = parts[0];
    const align = parts[1] ? '-' + parts[1] : '';
    const opposites = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

    return (opposites[base] || 'bottom') + align;
  }

  function getFloatingCoordinates(referenceRect, floatingRect, placement, offsetValue) {
    const parts = String(placement || 'bottom-start').split('-');
    const base = parts[0];
    const align = parts[1] || 'start';
    let x = referenceRect.left;
    let y = referenceRect.bottom + offsetValue;

    if (base === 'top') y = referenceRect.top - floatingRect.height - offsetValue;
    if (base === 'bottom') y = referenceRect.bottom + offsetValue;
    if (base === 'left') x = referenceRect.left - floatingRect.width - offsetValue;
    if (base === 'right') x = referenceRect.right + offsetValue;

    if (base === 'top' || base === 'bottom') {
      if (align === 'end') x = referenceRect.right - floatingRect.width;
      else if (align !== 'start') x = referenceRect.left + (referenceRect.width - floatingRect.width) / 2;
    } else {
      if (align === 'end') y = referenceRect.bottom - floatingRect.height;
      else if (align === 'start') y = referenceRect.top;
      else y = referenceRect.top + (referenceRect.height - floatingRect.height) / 2;
    }

    return { x: x, y: y };
  }

  function shouldFlip(referenceRect, floatingRect, placement, offsetValue) {
    const viewport = getViewportRect();
    const base = String(placement || 'bottom-start').split('-')[0];

    if (base === 'top') return referenceRect.top - floatingRect.height - offsetValue < viewport.top;
    if (base === 'bottom') return referenceRect.bottom + floatingRect.height + offsetValue > viewport.bottom;
    if (base === 'left') return referenceRect.left - floatingRect.width - offsetValue < viewport.left;
    if (base === 'right') return referenceRect.right + floatingRect.width + offsetValue > viewport.right;

    return false;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function afterTransition(element, callback) {
    const computedStyle = window.getComputedStyle(element);
    const transitionDuration = computedStyle.getPropertyValue('transition-duration');
    const duration = parseFloat(transitionDuration) * 1000 || 150;
    
    setTimeout(callback, duration + 50);
  }

  class PuiDropdown {
    constructor(element, options) {
      this.el = element || null;
      this.root = this.el;
      this.options = options || {};
      this.cleanups = [];
      this.toggleEl = null;
      this.menuEl = null;
      this.closers = [];
      this.triggerMode = 'click';
      this.autoClose = 'true';
      this.scope = 'parent';
      this.strategy = 'fixed';
      this.offset = 6;
      this.flip = true;
      this.placement = 'bottom-start';
      this.hasAutofocus = true;
      this.autofocusOnKeyboardOnly = true;
      this.isOpenState = false;
      this.initialized = false;
      this.animationInProcess = false;
      this.longPressTimer = null;
      this.openedViaKeyboard = false;
      this.contextPoint = null;
      this.positioningCleanup = null;

      if (!this.root || instances.has(this.root)) return;

      this.toggleEl = this.findToggle();
      this.menuEl = this.findMenu();
      this.closers = this.findClosers();

      if (!this.toggleEl || !this.menuEl || isDisabled(this.toggleEl)) return;

      this.readOptions();
      this.ensureInitialState();
      this.syncFocusableItems();
      this.bindLocalEvents();
      this.initialized = true;
      instances.set(this.root, this);
      this.emit('pui:dropdown:init', this.getDetail());
    }

    findToggle() {
      return this.root.querySelector(':scope > .dropdown-toggle') || 
             this.root.querySelector(':scope > .dropdown-toggle-wrapper > .dropdown-toggle') ||
             this.root.querySelector(':scope > [data-dropdown-toggle]');
    }

    findMenu() {
      return this.root.querySelector(':scope > .dropdown-menu') || 
             this.root.querySelector(':scope > [data-dropdown-menu]');
    }

    findClosers() {
      return Array.from(this.root.querySelectorAll(':scope .dropdown-close')) || [];
    }

    readOptions() {
      this.triggerMode = getComputedOption(this.root, '--trigger', 'click');
      this.autoClose = getComputedOption(this.root, '--auto-close', 'true');
      this.scope = getComputedOption(this.root, '--scope', 'parent');
      this.strategy = getComputedOption(this.root, '--strategy', 'fixed');
      this.offset = parseInt(getComputedOption(this.root, '--offset', '6'), 10);
      this.flip = getComputedOption(this.root, '--flip', 'true') !== 'false';
      this.placement = getComputedOption(this.root, '--placement', 'bottom-start');
      this.hasAutofocus = stringToBoolean(getComputedOption(this.root, '--has-autofocus', 'true'));
      this.autofocusOnKeyboardOnly = stringToBoolean(getComputedOption(this.root, '--autofocus-on-keyboard-only', 'true'));

      // Keep CSS placement fallback in sync with the FlyonUI-style --placement API.
      this.root.setAttribute('data-dropdown-placement', this.placement);
    }

    ensureInitialState() {
      if (!this.toggleEl.hasAttribute('aria-expanded')) {
        this.toggleEl.setAttribute('aria-expanded', 'false');
      }

      this.isOpenState = isElementVisible(this.menuEl);

      if (this.isOpenState) {
        this.root.classList.add('open');
        this.menuEl.classList.add('block');
        this.menuEl.classList.remove('hidden');
        this.toggleEl.setAttribute('aria-expanded', 'true');
      } else {
        this.root.classList.remove('open');
        this.menuEl.classList.remove('block');
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
      // Bind closers
      this.closers.forEach(closer => {
        this.on(closer, 'click', () => {
          if (isDisabled(closer)) return;
          this.close({ focusToggle: false });
        });
      });

      // Bind checkable items
      const checkableItems = qsa('[role="menuitemcheckbox"], [role="menuitemradio"]', this.root);
      checkableItems.forEach(item => {
        this.on(item, 'click', () => {
          if (isDisabled(item)) return;
          this.toggleCheckableItem(item);
        });
      });

      // Bind menu keydown
      this.on(this.menuEl, 'keydown', event => {
        this.handleMenuKeydown(event);
      });

      // Bind menu focusin
      this.on(this.menuEl, 'focusin', event => {
        if (this.isMenuItem(event.target)) this.syncFocusableItems(event.target);
      });

      // Bind toggle events based on trigger mode
      if (this.triggerMode === 'contextmenu') {
        this.on(this.toggleEl, 'contextmenu', event => {
          if (isDisabled(this.toggleEl)) return;
          event.preventDefault();
          this.openContextMenu(event);
        });

        this.on(this.toggleEl, 'click', event => {
          if (isDisabled(this.toggleEl)) return;
          event.preventDefault();
          event.stopPropagation();
          this.toggle();
        });

        // Touch support for context menu
        this.on(this.toggleEl, 'touchstart', event => {
          this.handleTouchStart(event);
        }, { passive: false });

        this.on(this.toggleEl, 'touchend', () => {
          this.handleTouchEnd();
        });

        this.on(this.toggleEl, 'touchmove', () => {
          this.handleTouchEnd();
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
          event.stopPropagation();
          this.toggle();
        });
      } else {
        this.on(this.toggleEl, 'click', event => {
          if (isDisabled(this.toggleEl)) return;
          event.preventDefault();
          event.stopPropagation();
          this.toggle();
        });
      }

      // Bind toggle keydown
      this.on(this.toggleEl, 'keydown', event => {
        this.handleToggleKeydown(event);
      });
    }

    handleTouchStart(event) {
      this.longPressTimer = window.setTimeout(() => {
        event.preventDefault();
        
        const touch = event.touches[0];
        const contextMenuEvent = new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: touch.clientX,
          clientY: touch.clientY
        });

        if (this.toggleEl) this.toggleEl.dispatchEvent(contextMenuEvent);
      }, 400);
    }

    handleTouchEnd() {
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
    }

    openContextMenu(event) {
      // Position menu at cursor
      const x = event.clientX;
      const y = event.clientY;
      this.contextPoint = { x: x, y: y };
      
      this.open();
    }

    getReferenceRect() {
      if (this.contextPoint) {
        return {
          left: this.contextPoint.x,
          top: this.contextPoint.y,
          right: this.contextPoint.x,
          bottom: this.contextPoint.y,
          width: 0,
          height: 0
        };
      }

      return this.toggleEl.getBoundingClientRect();
    }

    getReferenceElement() {
      if (!this.contextPoint) return this.toggleEl;

      return {
        getBoundingClientRect: () => ({
          left: this.contextPoint.x,
          top: this.contextPoint.y,
          right: this.contextPoint.x,
          bottom: this.contextPoint.y,
          width: 0,
          height: 0,
          x: this.contextPoint.x,
          y: this.contextPoint.y
        })
      };
    }

    canUseFloatingUI() {
      return !!(
        window.FloatingUIDOM &&
        typeof window.FloatingUIDOM.computePosition === 'function' &&
        typeof window.FloatingUIDOM.offset === 'function' &&
        typeof window.FloatingUIDOM.flip === 'function'
      );
    }

    destroyPositioning() {
      if (typeof this.positioningCleanup === 'function') {
        this.positioningCleanup();
      }

      this.positioningCleanup = null;
    }

    updateFloatingUIPosition() {
      const FloatingUIDOM = window.FloatingUIDOM;
      const middleware = [FloatingUIDOM.offset(this.offset)];

      if (this.flip) middleware.unshift(FloatingUIDOM.flip());

      return FloatingUIDOM.computePosition(this.getReferenceElement(), this.menuEl, {
        placement: this.placement || 'bottom-start',
        strategy: this.strategy === 'absolute' ? 'absolute' : 'fixed',
        middleware: middleware
      }).then(({ x, y, placement }) => {
        Object.assign(this.menuEl.style, {
          position: this.strategy === 'absolute' ? 'absolute' : 'fixed',
          left: x + 'px',
          top: y + 'px',
          right: 'auto',
          bottom: 'auto',
          margin: '0'
        });

        this.menuEl.setAttribute('data-placement', placement);
      });
    }

    setupPositioning() {
      this.destroyPositioning();

      if (this.strategy === 'static') return;

      if (!this.canUseFloatingUI()) {
        this.updatePosition();
        return;
      }

      this.updateFloatingUIPosition();

      if (typeof window.FloatingUIDOM.autoUpdate === 'function') {
        this.positioningCleanup = window.FloatingUIDOM.autoUpdate(this.getReferenceElement(), this.menuEl, () => {
          this.updateFloatingUIPosition();
        });
      }
    }

    updatePosition() {
      if (!this.menuEl || this.strategy === 'static') return;

      const referenceRect = this.getReferenceRect();
      const floatingRect = this.menuEl.getBoundingClientRect();
      let placement = this.placement || 'bottom-start';

      if (this.flip && shouldFlip(referenceRect, floatingRect, placement, this.offset)) {
        placement = getOppositePlacement(placement);
      }

      const viewport = getViewportRect();
      const coords = getFloatingCoordinates(referenceRect, floatingRect, placement, this.offset);
      const x = clamp(coords.x, viewport.left, Math.max(viewport.left, viewport.right - floatingRect.width));
      const y = clamp(coords.y, viewport.top, Math.max(viewport.top, viewport.bottom - floatingRect.height));

      let left = x;
      let top = y;

      if (this.strategy === 'absolute') {
        const offsetParent = this.menuEl.offsetParent || document.documentElement;
        const parentRect = offsetParent.getBoundingClientRect();
        left = x - parentRect.left + offsetParent.scrollLeft;
        top = y - parentRect.top + offsetParent.scrollTop;
      }

      this.menuEl.style.position = this.strategy === 'absolute' ? 'absolute' : 'fixed';
      this.menuEl.style.left = left + 'px';
      this.menuEl.style.top = top + 'px';
      this.menuEl.style.right = 'auto';
      this.menuEl.style.bottom = 'auto';
      this.menuEl.style.margin = '0';
      this.menuEl.setAttribute('data-placement', placement);
    }

    requestPositionUpdate() {
      if (this.canUseFloatingUI()) {
        this.updateFloatingUIPosition();
        return;
      }

      this.updatePosition();
    }

    getTransitionElement() {
      return this.root.querySelector('[data-dropdown-transition]') || this.menuEl;
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

      if (event.key === 'Escape') {
        event.preventDefault();
        this.close({ focusToggle: true });
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

    handleAutoClose(target) {
      if (this.autoClose === 'false') return;

      const isInside = this.root.contains(target) || this.menuEl.contains(target);

      if (this.autoClose === 'inside') {
        // Only close if click is outside dropdown
        if (!isInside) {
          this.close();
        }
      } else if (this.autoClose === 'outside') {
        // Only close if click is inside dropdown
        if (isInside) {
          this.close();
        }
      } else {
        // true - close on any click
        this.close();
      }
    }

    open(options) {
      const settings = Object.assign({ focusFirstItem: false, focusLastItem: false }, options);

      if (this.isOpenState || !this.menuEl || isDisabled(this.toggleEl) || this.animationInProcess) return;

      PuiDropdown.closeAll(this);

      // Handle window scope
      if (this.scope === 'window') {
        document.body.appendChild(this.menuEl);
        this.menuEl.classList.add('open');
      }

      this.menuEl.classList.remove('hidden');
      this.menuEl.classList.add('block');
      this.setupPositioning();
      this.root.classList.add('open');
      this.toggleEl.setAttribute('aria-expanded', 'true');
      this.isOpenState = true;
      this.animationInProcess = true;
      activeInstances.add(this);

      // Handle animation
      if (this.triggerMode !== 'contextmenu') {
        const computedStyle = window.getComputedStyle(this.menuEl);
        const transitionDuration = computedStyle.getPropertyValue('transition-duration');
        const duration = parseFloat(transitionDuration) * 1000 || 200;
        
        setTimeout(() => {
          this.animationInProcess = false;
        }, duration);
      } else {
        this.animationInProcess = false;
      }

      this.emit('pui:dropdown:open', this.getDetail());
      this.emit('open', this.getDetail());
      this.emit('open.dropdown', this.getDetail());
      this.emit('pui:dropdown:toggle', this.getDetail());

      if (settings.focusFirstItem && this.hasAutofocus && (!this.autofocusOnKeyboardOnly || this.openedViaKeyboard)) {
        this.focusElement();
      }
      if (settings.focusLastItem) this.focusItem(this.getFocusableItems().length - 1);
    }

    close(options) {
      const settings = Object.assign({ focusToggle: false, animated: true }, options);

      if (!this.menuEl || !this.isOpenState || this.animationInProcess) {
        if (settings.focusToggle && this.toggleEl) this.toggleEl.focus();
        return;
      }

      this.animationInProcess = true;

      const clearAfterClose = () => {
        this.menuEl.classList.add('hidden');
        this.menuEl.classList.remove('block');
        this.root.classList.remove('open');
        this.toggleEl.setAttribute('aria-expanded', 'false');
        this.isOpenState = false;
        this.openedViaKeyboard = false;
        activeInstances.delete(this);

        // Handle window scope
        if (this.scope === 'window') {
          this.menuEl.classList.remove('open');
          this.root.appendChild(this.menuEl);
        }

        // Reset context menu positioning
        if (this.triggerMode === 'contextmenu') {
          this.contextPoint = null;
        }

        this.menuEl.style.position = '';
        this.menuEl.style.left = '';
        this.menuEl.style.top = '';
        this.menuEl.style.right = '';
        this.menuEl.style.bottom = '';
        this.menuEl.style.margin = '';
        this.destroyPositioning();

        this.animationInProcess = false;

        this.emit('pui:dropdown:close', this.getDetail());
        this.emit('close', this.getDetail());
        this.emit('close.dropdown', this.getDetail());
        this.emit('pui:dropdown:toggle', this.getDetail());

        if (settings.focusToggle && this.toggleEl) {
          this.toggleEl.focus();
        }
      };

      if (!settings.animated) {
        clearAfterClose();
        return;
      }

      // Handle animation
      const el = this.getTransitionElement();
      const computedStyle = window.getComputedStyle(el);
      const transitionDuration = computedStyle.getPropertyValue('transition-duration');
      const duration = parseFloat(transitionDuration) * 1000 || 200;

      setTimeout(clearAfterClose, duration);
    }

    toggle(options) {
      if (this.isOpenState) this.close();
      else this.open(options);
    }

    isOpen() {
      return this.isOpenState;
    }

    isOpened() {
      return this.isOpen();
    }

    containsElement(element) {
      return this.root.contains(element) || this.menuEl.contains(element);
    }

    focusElement() {
      const input = this.menuEl.querySelector('[autofocus]');
      if (input) {
        input.focus();
        return true;
      }

      const menuItems = this.getFocusableItems();
      if (menuItems.length > 0) {
        menuItems[0].focus();
        return true;
      }

      return false;
    }

    getDetail() {
      return {
        instance: this,
        root: this.root,
        toggle: this.toggleEl,
        menu: this.menuEl,
        trigger: this.triggerMode,
        autoClose: this.autoClose,
        scope: this.scope,
        strategy: this.strategy,
        placement: this.placement
      };
    }

    destroy() {
      this.close();
      activeInstances.delete(this);
      instances.delete(this.root);
      this.cleanups.forEach(cleanup => cleanup());
      this.cleanups = [];
      this.initialized = false;
      this.emit('destroy', this.getDetail());
      this.emit('pui:dropdown:destroy', this.getDetail());
    }

    forceClearState() {
      this.menuEl.classList.add('hidden');
      this.menuEl.classList.remove('block');
      this.root.classList.remove('open');
      this.toggleEl.setAttribute('aria-expanded', 'false');
      this.isOpenState = false;
      this.animationInProcess = false;
      this.openedViaKeyboard = false;
      this.contextPoint = null;
      this.destroyPositioning();
      this.menuEl.style.position = '';
      this.menuEl.style.left = '';
      this.menuEl.style.top = '';
      this.menuEl.style.right = '';
      this.menuEl.style.bottom = '';
      this.menuEl.style.margin = '';
      
      // Handle window scope
      if (this.scope === 'window') {
        this.menuEl.classList.remove('open');
        this.root.appendChild(this.menuEl);
      }
      
      activeInstances.delete(this);
    }

    static resolveElement(target) {
      if (!target) return null;
      if (target instanceof PuiDropdown) return target.root;
      if (typeof target === 'string') return document.querySelector(target);
      return target;
    }

    static getInstance(target) {
      const element = PuiDropdown.resolveElement(target);
      return element ? instances.get(element) || null : null;
    }

    static getOrCreateInstance(target) {
      const element = PuiDropdown.resolveElement(target);
      if (!element) return null;

      return PuiDropdown.getInstance(element) || new PuiDropdown(element);
    }

    static open(target, openedViaKeyboard = false) {
      const instance = PuiDropdown.getOrCreateInstance(target);
      if (instance) {
        instance.openedViaKeyboard = openedViaKeyboard;
        instance.open({ focusFirstItem: openedViaKeyboard });
      }
    }

    static close(target) {
      const instance = PuiDropdown.getInstance(target);
      if (instance) instance.close();
    }

    static toggle(target) {
      const instance = PuiDropdown.getOrCreateInstance(target);
      if (instance) instance.toggle();
    }

    static on(eventName, target, callback) {
      const element = PuiDropdown.resolveElement(target);
      if (!element || typeof callback !== 'function') return;

      element.addEventListener(eventName, callback);
    }

    static closeAll(except) {
      Array.from(activeInstances).forEach(instance => {
        if (except && instance === except) return;
        instance.close();
      });
    }

    static updateAllPositions() {
      Array.from(activeInstances).forEach(instance => {
        instance.requestPositionUpdate();
      });
    }

    static closeCurrentlyOpened(evtTarget, isAnimated = true) {
      Array.from(activeInstances).forEach(instance => {
        if (instance.autoClose === 'false') return;

        if (!evtTarget) {
          instance.close({ animated: isAnimated });
          return;
        }

        const isInside = instance.containsElement(evtTarget);

        if (instance.autoClose === 'inside' && isInside) return;
        if (instance.autoClose === 'outside' && !isInside) return;

        instance.close({ animated: isAnimated });
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

    PuiDropdown.closeCurrentlyOpened(event.target);
  }

  function handleDocumentKeydown(event) {
    if (event.key !== 'Escape' || !activeInstances.size) return;

    const latest = Array.from(activeInstances).pop();
    if (!latest) return;

    latest.close({ focusToggle: true });
  }

  function handleWindowResize() {
    if (!activeInstances.size) return;

    PuiDropdown.updateAllPositions();
  }

  function handleDocumentScroll() {
    if (!activeInstances.size) return;

    PuiDropdown.updateAllPositions();
  }

  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keydown', handleDocumentKeydown);
  document.addEventListener('scroll', handleDocumentScroll, { capture: true, passive: true });
  window.addEventListener('resize', handleWindowResize);

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
