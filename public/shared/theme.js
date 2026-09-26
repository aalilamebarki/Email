// Shared Theme Controller (Light / Dark mode)
(function () {
  'use strict';

  function getSavedTheme() {
    try {
      var saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {}
    return 'light';
  }

  var sunSvg = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
  var moonSvg = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';

  function updateIcons(isDark) {
    var icons = document.querySelectorAll('.theme-toggle-icon');
    icons.forEach(function (icon) {
      icon.innerHTML = isDark ? sunSvg : moonSvg;
    });
    var btns = document.querySelectorAll('#theme-toggle-btn, .theme-toggle-btn');
    btns.forEach(function (btn) {
      var isAr = document.documentElement.getAttribute('lang') === 'ar';
      btn.setAttribute(
        'aria-label',
        isDark
          ? (isAr ? 'التبديل إلى الوضع النهاري' : 'Switch to light mode')
          : (isAr ? 'التبديل إلى الوضع الليلي' : 'Switch to dark mode')
      );
    });
  }

  function applyTheme(theme) {
    var isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
      var metaTheme = document.getElementById('meta-theme-color') || document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', isDark ? '#0d0d0d' : '#ffffff');
      }
    } catch (e) {}
    updateIcons(isDark);
  }

  window.toggleTheme = function () {
    var current = document.documentElement.getAttribute('data-theme') || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  };

  window.getSavedTheme = getSavedTheme;

  // Initialize immediately
  var initial = getSavedTheme();
  applyTheme(initial);

  // Bind click listener to button when ready
  function initButtons() {
    var btns = document.querySelectorAll('#theme-toggle-btn, .theme-toggle-btn');
    btns.forEach(function (btn) {
      btn.removeEventListener('click', window.toggleTheme);
      btn.addEventListener('click', window.toggleTheme);
    });
    updateIcons(document.documentElement.getAttribute('data-theme') === 'dark');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButtons);
  } else {
    initButtons();
  }
})();
