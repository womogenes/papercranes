// Manipulating elements
const domElements = {};

function getEl(id) {
  if (!domElements[id]) {
    domElements[id] = document.getElementById(id);
  }
  return domElements[id];
}

function fade(element, targetOpacity) {
  let fadeCounter = -1;

  const handle = window.setInterval(function () {
    toggleVisibility(element);
  }, 30);

  function toggleVisibility(element) {
    if (fadeCounter > targetOpacity * 10) {
      element.style.opacity = null;
      clearInterval(handle);
      return;
    }
    element.style.opacity = fadeCounter / 10;
    fadeCounter++;
  }
}

function unhide(id) {
  const el = getEl(id);
  el.style.opacity = 0;
  el.hidden = false;
  fade(el, 1.0);
}

function createRipple(e) {
  const circle = document.createElement('div');
  this.appendChild(circle);
  const d = Math.max(this.clientWidth, this.clientHeight);
  circle.style.width = circle.style.height = d + 'px';

  const rect = this.getBoundingClientRect();
  circle.style.left = e.clientX - rect.left - d / 2 + 'px';
  circle.style.top = e.clientY - rect.top - d / 2 + 'px';

  circle.classList.add('ripple');
  circle.addEventListener('animationend', function (el) {
    this.parentNode.removeChild(this);
  });
}


// Themes
const themes = {
  'Light': {
    '--bg-color': '#ffffff',
    '--outline-color': '#000000',
    '--text-color': '#000000',
    '--fill-color': '#cccccc',
    '--slider-focus-bg-color': '#e0e0e0',
    '--slider-thumb-color': '#909090',

    '--btn-bg-on': '#eeeeee',
    '--btn-bg-hover': '#f9f9f9',
    '--btn-bg-active': '#cccccc',
    '--btn-outline-hover': '#222222',
    '--btn-outline-active': '#222222',
    '--btn-outline-disabled': '#555555',
  },
  'Dark': {
    '--bg-color': '#181818',
    '--outline-color': '#dddddd',
    '--text-color': '#eeeeee',
    '--fill-color': '#555555',
    '--slider-focus-bg-color': '#707070',
    '--slider-thumb-color': '#909090',

    '--btn-bg-on': '#111111',
    '--btn-bg-hover': '#222222',
    '--btn-bg-active': '#1e1e1e',
    '--btn-outline-hover': '#cccccc',
    '--btn-outline-active': '#aaaaaa',
    '--btn-outline-disabled': '#555555',
  },
};

function loadTheme() {
  theme = JSON.parse(localStorage.getItem('theme'));
  if (!theme) {
    theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'Dark' : 'Light';
    localStorage.setItem('theme', JSON.stringify(theme));
  }
  applyTheme(theme);
}

function applyTheme(theme) {
  // Sets theme colors.
  for (const i in themes[theme]) {
    document.documentElement.style.setProperty(i, themes[theme][i]);
  }
}


// Only focuses when using keyboard, not mouse
// from https://github.com/WICG/focus-visible
function applyFocusVisiblePolyfill(scope) {
  let hadKeyboardEvent = true;
  let hadFocusVisibleRecently = false;
  let hadFocusVisibleRecentlyTimeout = null;

  const inputTypesWhitelist = {
    'text': true,
    'search': true,
    'url': true,
    'tel': true,
    'email': true,
    'password': true,
    'number': true,
    'date': true,
    'month': true,
    'week': true,
    'time': true,
    'datetime': true,
    'datetime-local': true,
  };

  /**
   * Helper function for legacy browsers and iframes which sometimes focus
   * elements like document, body, and non-interactive SVG.
   * @param {Element} el
   */
  function isValidFocusTarget(el) {
    if (
      el &&
      el !== document &&
      el.nodeName !== 'HTML' &&
      el.nodeName !== 'BODY' &&
      'classList' in el &&
      'contains' in el.classList
    ) {
      return true;
    }
    return false;
  }

  /**
   * Computes whether the given element should automatically trigger the
   * `focus-visible` class being added, i.e. whether it should always match
   * `:focus-visible` when focused.
   * @param {Element} el
   * @return {boolean}
   */
  function focusTriggersKeyboardModality(el) {
    const type = el.type;
    const tagName = el.tagName;

    if (tagName === 'INPUT' && inputTypesWhitelist[type] && !el.readOnly) {
      return true;
    }

    if (tagName === 'TEXTAREA' && !el.readOnly) {
      return true;
    }

    if (el.isContentEditable) {
      return true;
    }

    return false;
  }

  /**
   * Add the `focus-visible` class to the given element if it was not added by
   * the author.
   * @param {Element} el
   */
  function addFocusVisibleClass(el) {
    if (el.classList.contains('focus-visible')) {
      return;
    }
    el.classList.add('focus-visible');
    el.setAttribute('data-focus-visible-added', '');
  }

  /**
   * Remove the `focus-visible` class from the given element if it was not
   * originally added by the author.
   * @param {Element} el
   */
  function removeFocusVisibleClass(el) {
    if (!el.hasAttribute('data-focus-visible-added')) {
      return;
    }
    el.classList.remove('focus-visible');
    el.removeAttribute('data-focus-visible-added');
  }

  /**
   * If the most recent user interaction was via the keyboard;
   * and the key press did not include a meta, alt/option, or control key;
   * then the modality is keyboard. Otherwise, the modality is not keyboard.
   * Apply `focus-visible` to any current active element and keep track
   * of our keyboard modality state with `hadKeyboardEvent`.
   * @param {KeyboardEvent} e
   */
  function onKeyDown(e) {
    if (e.metaKey || e.altKey || e.ctrlKey) {
      return;
    }

    if (isValidFocusTarget(scope.activeElement)) {
      addFocusVisibleClass(scope.activeElement);
    }

    hadKeyboardEvent = true;
  }

  function onPointerDown(e) {
    hadKeyboardEvent = false;
  }

  function onFocus(e) {
    // Prevent IE from focusing the document or HTML element.
    if (!isValidFocusTarget(e.target)) {
      return;
    }

    if (hadKeyboardEvent || focusTriggersKeyboardModality(e.target)) {
      addFocusVisibleClass(e.target);
    }
  }

  function onBlur(e) {
    if (!isValidFocusTarget(e.target)) {
      return;
    }

    if (
      e.target.classList.contains('focus-visible') ||
      e.target.hasAttribute('data-focus-visible-added')
    ) {
      // To detect a tab/window switch, we look for a blur event followed
      // rapidly by a visibility change.
      // If we don't see a visibility change within 100ms, it's probably a
      // regular focus change.
      hadFocusVisibleRecently = true;
      window.clearTimeout(hadFocusVisibleRecentlyTimeout);
      hadFocusVisibleRecentlyTimeout = window.setTimeout(function () {
        hadFocusVisibleRecently = false;
      }, 100);
      removeFocusVisibleClass(e.target);
    }
  }

  function onVisibilityChange(e) {
    if (document.visibilityState === 'hidden') {
      if (hadFocusVisibleRecently) {
        hadKeyboardEvent = true;
      }
      addInitialPointerMoveListeners();
    }
  }

  function addInitialPointerMoveListeners() {
    document.addEventListener('mousemove', onInitialPointerMove);
    document.addEventListener('mousedown', onInitialPointerMove);
    document.addEventListener('mouseup', onInitialPointerMove);
    document.addEventListener('pointermove', onInitialPointerMove);
    document.addEventListener('pointerdown', onInitialPointerMove);
    document.addEventListener('pointerup', onInitialPointerMove);
    document.addEventListener('touchmove', onInitialPointerMove);
    document.addEventListener('touchstart', onInitialPointerMove);
    document.addEventListener('touchend', onInitialPointerMove);
  }

  function removeInitialPointerMoveListeners() {
    document.removeEventListener('mousemove', onInitialPointerMove);
    document.removeEventListener('mousedown', onInitialPointerMove);
    document.removeEventListener('mouseup', onInitialPointerMove);
    document.removeEventListener('pointermove', onInitialPointerMove);
    document.removeEventListener('pointerdown', onInitialPointerMove);
    document.removeEventListener('pointerup', onInitialPointerMove);
    document.removeEventListener('touchmove', onInitialPointerMove);
    document.removeEventListener('touchstart', onInitialPointerMove);
    document.removeEventListener('touchend', onInitialPointerMove);
  }

  function onInitialPointerMove(e) {
    // Work around a Safari quirk that fires a mousemove on <html> whenever the
    // window blurs, even if you're tabbing out of the page. ¯\_(ツ)_/¯
    if (e.target.nodeName && e.target.nodeName.toLowerCase() === 'html') {
      return;
    }

    hadKeyboardEvent = false;
    removeInitialPointerMoveListeners();
  }

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('mousedown', onPointerDown, true);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('touchstart', onPointerDown, true);
  document.addEventListener('visibilitychange', onVisibilityChange, true);

  addInitialPointerMoveListeners();

  scope.addEventListener('focus', onFocus, true);
  scope.addEventListener('blur', onBlur, true);

  if (scope.nodeType === Node.DOCUMENT_FRAGMENT_NODE && scope.host) {
    scope.host.setAttribute('data-js-focus-visible', '');
  } else if (scope.nodeType === Node.DOCUMENT_NODE) {
    document.documentElement.classList.add('js-focus-visible');
    document.documentElement.setAttribute('data-js-focus-visible', '');
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.applyFocusVisiblePolyfill = applyFocusVisiblePolyfill;

  let event;
  try {
    event = new CustomEvent('focus-visible-polyfill-ready');
  } catch (error) {
    // IE11 does not support using CustomEvent as a constructor directly:
    event = document.createEvent('CustomEvent');
    event.initCustomEvent('focus-visible-polyfill-ready', false, false, {});
  }

  window.dispatchEvent(event);
}

if (typeof document !== 'undefined') {
  applyFocusVisiblePolyfill(document);
}