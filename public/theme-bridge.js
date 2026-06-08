(function () {
  'use strict';

  var scriptEl = document.querySelector('script[data-studio-origin]');
  var studioOrigin = scriptEl
    ? scriptEl.getAttribute('data-studio-origin')
    : null;

  if (
    !studioOrigin ||
    studioOrigin === 'null' ||
    studioOrigin === 'undefined' ||
    studioOrigin.trim() === ''
  ) {
    return;
  }

  function getCurrentTokens() {
    var style = getComputedStyle(document.documentElement);
    var tokens = {};
    var props = [
      '--color-primary',
      '--color-primary-light',
      '--color-primary-dark',
      '--color-secondary',
      '--color-surface',
      '--color-background',
      '--color-text-primary',
      '--color-text-secondary',
      '--color-text-accent',
      '--color-border',
      '--color-error',
      '--color-success',
      '--color-warning',
      '--color-focus-ring',
      '--color-overlay',
      '--font-family-base',
      '--font-size-xs',
      '--font-size-sm',
      '--font-size-base',
      '--font-size-lg',
      '--font-size-xl',
      '--font-size-2xl',
      '--font-weight-normal',
      '--font-weight-medium',
      '--font-weight-bold',
      '--radius-sm',
      '--radius-md',
      '--radius-lg',
      '--radius-full',
      '--shadow-sm',
      '--shadow-md',
      '--shadow-lg',
      '--spacing-xs',
      '--spacing-sm',
      '--spacing-md',
      '--spacing-lg',
      '--spacing-xl',
    ];

    for (var i = 0; i < props.length; i++) {
      tokens[props[i]] = style.getPropertyValue(props[i]).trim();
    }

    return tokens;
  }

  function applyTokens(tokens) {
    var root = document.documentElement;
    var keys = Object.keys(tokens);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf('--') === 0) {
        root.style.setProperty(keys[i], tokens[keys[i]]);
      }
    }
  }

  window.addEventListener('message', function (event) {
    if (event.origin !== studioOrigin) {
      return;
    }

    var data = event.data;
    if (!data || typeof data !== 'object') {
      return;
    }

    if (data.type === 'theme-studio:ping' || data.type === 'ping') {
      event.source.postMessage(
        { type: 'theme-studio:pong', tokens: getCurrentTokens() },
        event.origin,
      );
      return;
    }

    if (
      (data.type === 'theme-studio:theme-update' ||
        data.type === 'theme-update') &&
      data.tokens
    ) {
      applyTokens(data.tokens);
    }
  });
})();
