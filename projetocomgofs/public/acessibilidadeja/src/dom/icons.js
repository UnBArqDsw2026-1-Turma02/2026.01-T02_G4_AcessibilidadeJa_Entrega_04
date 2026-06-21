/*!
 * icons.js
 * FACTORY — IconFactory
 * Produz strings SVG a partir de um nome de ícone.
 */

export var IconFactory = {
  _icons: {
    contrast_light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
    contrast_dark:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>',
    zoom:           '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8 11h6M11 8v6"/></svg>',
    reading:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4h7a3 3 0 013 3v13a2 2 0 00-2-2H2zM22 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8z"/></svg>',
    guide:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 7h18M3 17h18"/></svg>',
    dyslexia:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l16 16M20 4L4 20"/></svg>',
    translate:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8h10M9 4v4M5 12s2 5 7 5 7-5 7-5M14 14l4 8 4-8M16 19h4"/></svg>',
    cursor:         '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 8-6 1 4 8-3 1-4-8-5 4z"/></svg>',
    links:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/></svg>',
    pause:          '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
    grayscale:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>',
    access:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.2"/><path d="M5 9l4.5 1.5h5L19 9M12 10.5V14M12 14l-3 7M12 14l3 7"/></svg>',
    close:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  },
  create: function (name) {
    return this._icons[name] || '';
  },
};
