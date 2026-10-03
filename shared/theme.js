/**
 * theme.js - إدارة المظهر الداكن والفاتح بسلاسة وبدون وميض (Zero-FOUC)
 * freetemp.email
 */
(function () {
  function getPreferredTheme() {
    try {
      var stored = localStorage.getItem('freetemp_theme');
      if (stored === 'dark' || stored === 'light') return stored;
    } catch (e) {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    var isDark = theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    var metaTheme = document.getElementById('meta-theme-color');
    if (metaTheme) {
      metaTheme.setAttribute('content', isDark ? '#0D0D0D' : '#ffffff');
    }

    try {
      localStorage.setItem('freetemp_theme', theme);
    } catch (e) {}
  }

  window.toggleTheme = function () {
    var isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  };

  // تطبيق فوري
  applyTheme(getPreferredTheme());

  // ربط الأزرار عند اكتمال تحميل المستند
  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('#theme-toggle, [data-action="toggle-theme"], .theme-toggle-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.toggleTheme();
      });
    });
  });

  // الاستماع لتغييرات النظام في حال لم يختر المستخدم يدوياً
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      try {
        if (!localStorage.getItem('freetemp_theme')) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      } catch (err) {}
    });
  }
})();
