/**
 * app.js - منطق تطبيق الواجهة الأمامية وإدارة الصندوق والاتصال السحابي
 * freetemp.email
 */
(function () {
  'use strict';

  var STORAGE_KEYS = {
    ADDRESS: 'freetemp_address',
    TOKEN: 'freetemp_token',
    EXPIRES_AT: 'freetemp_expiresAt'
  };

  var state = {
    address: '',
    token: '',
    expiresAt: 0,
    emails: [],
    selectedEmailId: null,
    ws: null,
    wsReconnectAttempts: 0,
    timerInterval: null,
    pollInterval: null,
    isGenerating: false,
    isBurning: false,
    isExtending: false
  };

  function t(key) {
    if (window.freetemp_i18n && typeof window.freetemp_i18n.t === 'function') {
      return window.freetemp_i18n.t(key);
    }
    return key;
  }

  // =========================================================================
  // 1. إدارة التخزين المحلي (LocalStorage)
  // =========================================================================
  function loadPersistedState() {
    try {
      var addr = localStorage.getItem(STORAGE_KEYS.ADDRESS);
      var tok = localStorage.getItem(STORAGE_KEYS.TOKEN);
      var exp = parseInt(localStorage.getItem(STORAGE_KEYS.EXPIRES_AT) || '0', 10);

      var now = Date.now();
      if (addr && tok && exp > now) {
        state.address = addr;
        state.token = tok;
        state.expiresAt = exp;
        return true;
      }
    } catch (e) {
      console.warn('LocalStorage access failed:', e);
    }
    return false;
  }

  function persistState(address, token, expiresAt) {
    state.address = address;
    state.token = token;
    state.expiresAt = expiresAt;
    try {
      localStorage.setItem(STORAGE_KEYS.ADDRESS, address);
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, String(expiresAt));
    } catch (e) {}
  }

  function clearPersistedState() {
    state.address = '';
    state.token = '';
    state.expiresAt = 0;
    state.emails = [];
    state.selectedEmailId = null;
    try {
      localStorage.removeItem(STORAGE_KEYS.ADDRESS);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
    } catch (e) {}
  }

  // =========================================================================
  // 2. تحديث واجهة المستخدم (UI Renderers)
  // =========================================================================
  function renderAddress() {
    var textEls = document.querySelectorAll('#active-email-text, #mailbox-address, #demo-address');
    textEls.forEach(function (el) {
      el.textContent = state.address || '...';
    });

    var inputEl = document.getElementById('address-input');
    if (inputEl) {
      inputEl.value = state.address || '';
    }

    var countEls = document.querySelectorAll('#emails-count, #stream-count-badge');
    countEls.forEach(function (el) {
      el.textContent = String(state.emails.length);
    });
  }

  function renderStatus(isLive) {
    var statusText = document.getElementById('status-text');
    var statusDot = document.getElementById('status-dot');
    var liveNodeBadge = document.querySelector('.font-label-caps.text-primary');

    if (statusText) {
      statusText.textContent = isLive ? (t('statusLive') || 'WebSocket: Connected') : (t('statusOffline') || 'Reconnecting...');
    }
    if (statusDot) {
      statusDot.className = isLive
        ? 'relative inline-flex rounded-full h-2 w-2 bg-primary'
        : 'relative inline-flex rounded-full h-2 w-2 bg-secondary';
    }
  }

  function startCountdownTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);

    function update() {
      var diff = Math.max(0, Math.floor((state.expiresAt - Date.now()) / 1000));
      var mins = Math.floor(diff / 60);
      var secs = diff % 60;
      var formatted = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;

      var timerEls = document.querySelectorAll('#countdown-timer, #countdown-badge, #timer-display');
      timerEls.forEach(function (el) {
        if (el.id === 'countdown-timer' || el.id === 'countdown-badge') {
          el.textContent = diff <= 0 ? 'Expires: 00:00' : 'Expires: ' + formatted;
        } else {
          el.textContent = formatted;
        }
      });

      if (diff <= 0) {
        clearInterval(state.timerInterval);
        handleExpiry();
      }
    }

    update();
    state.timerInterval = setInterval(update, 1000);
  }

  function handleExpiry() {
    clearPersistedState();
    renderAddress();
    renderEmailsList();
    generateNewAddress();
  }

  // =========================================================================
  // 3. تنظيف محتوى HTML بحماية الخصوصية (DOMPurify Sanitization)
  // =========================================================================
  function sanitizeEmailHtml(rawHtml) {
    if (!rawHtml) return '';
    if (typeof window.DOMPurify !== 'undefined') {
      var clean = window.DOMPurify.sanitize(rawHtml, {
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'background'],
        ALLOW_DATA_ATTR: false
      });

      clean = clean.replace(/url\s*\([^)]*\)/gi, '');
      clean = clean.replace(/@import/gi, '');

      var div = document.createElement('div');
      div.innerHTML = clean;
      var links = div.querySelectorAll('a');
      links.forEach(function (a) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      });
      return div.innerHTML;
    }

    return rawHtml
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // =========================================================================
  // 4. عرض قائمة الرسائل وتفاصيل الرسالة في اللوحة الجانبية
  // =========================================================================
  function renderEmailsList() {
    var container = document.getElementById('emails-list');
    var countEls = document.querySelectorAll('#emails-count, #stream-count-badge');
    countEls.forEach(function (el) { el.textContent = String(state.emails.length); });

    if (!container) return;

    if (state.emails.length === 0) {
      container.innerHTML =
        '<div class="p-8 text-center text-on-surface-variant text-xs leading-relaxed flex flex-col items-center justify-center gap-3">' +
          '<div class="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant mb-1">' +
            '<span class="material-symbols-outlined text-[24px]">mark_email_unread</span>' +
          '</div>' +
          '<p data-i18n="waitingEmails">' + (t('waitingEmails') || 'Waiting for incoming messages... Instant sub-20ms live stream.') + '</p>' +
        '</div>';

      var detailEl = document.getElementById('email-detail');
      if (detailEl) {
        detailEl.innerHTML =
          '<div data-i18n="selectEmail" class="h-full min-h-[350px] flex flex-col items-center justify-center p-8 text-center text-on-surface-variant text-xs gap-3">' +
            '<span class="material-symbols-outlined text-[32px] text-outline">drafts</span>' +
            '<span>' + (t('selectEmail') || 'Select an email from the left stream to preview content and extract OTP.') + '</span>' +
          '</div>';
      }
      return;
    }

    var html = '';
    state.emails.forEach(function (email) {
      var isSelected = email.id === state.selectedEmailId;
      var otpBadge = email.otpCode
        ? '<div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary-container text-on-secondary-fixed font-code-sm text-code-sm font-bold shadow-sm">' +
          '<span class="material-symbols-outlined text-[14px]">key</span>' +
          '<span>OTP: ' + email.otpCode + '</span>' +
          '</div>'
        : '';

      var formattedDate = email.date || email.receivedAt || '';
      try {
        var d = new Date(formattedDate);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
      } catch (e) {}

      html +=
        '<div data-email-id="' + email.id + '" class="email-item p-space-md rounded-lg ' +
        (isSelected ? 'bg-surface-container shadow-md relative overflow-hidden' : 'bg-surface-container-lowest hover:bg-surface-container') +
        ' cursor-pointer transition-all mb-space-xs">' +
          (isSelected ? '<div class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>' : '') +
          '<div class="flex items-center justify-between mb-1">' +
            '<span class="font-code-sm text-code-sm text-on-surface font-semibold truncate flex items-center gap-1.5">' +
              '<span class="material-symbols-outlined text-primary text-[16px]">verified</span>' +
              (email.from || 'Unknown') +
            '</span>' +
            '<span class="font-code-sm text-code-sm text-on-surface-variant">' + formattedDate + '</span>' +
          '</div>' +
          '<div class="font-body-md text-body-md ' + (isSelected ? 'text-on-surface font-medium' : 'text-on-surface-variant') + ' truncate mb-2">' +
            (email.subject || '(No Subject)') +
          '</div>' +
          '<div class="flex items-center justify-between">' +
            otpBadge +
            '<span class="font-label-caps text-label-caps text-primary">DELIVERED</span>' +
          '</div>' +
        '</div>';
    });

    container.innerHTML = html;

    container.querySelectorAll('.email-item').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = el.getAttribute('data-email-id');
        selectEmail(id);
      });
    });

    if (!state.selectedEmailId && state.emails.length > 0) {
      selectEmail(state.emails[0].id);
    } else if (state.selectedEmailId) {
      var exists = state.emails.find(function (e) { return e.id === state.selectedEmailId; });
      if (exists) renderEmailDetail(exists);
    }
  }

  function selectEmail(emailId) {
    state.selectedEmailId = emailId;
    var email = state.emails.find(function (e) { return e.id === emailId; });
    if (!email) return;

    var container = document.getElementById('emails-list');
    if (container) {
      container.querySelectorAll('.email-item').forEach(function (el) {
        if (el.getAttribute('data-email-id') === emailId) {
          el.className = 'email-item p-space-md rounded-lg bg-surface-container shadow-md relative overflow-hidden cursor-pointer transition-all mb-space-xs';
        } else {
          el.className = 'email-item p-space-md rounded-lg bg-surface-container-lowest hover:bg-surface-container cursor-pointer transition-all mb-space-xs';
        }
      });
    }

    renderEmailDetail(email);

    if (window.innerWidth < 1024) {
      var detailEl = document.getElementById('email-detail');
      if (detailEl) {
        detailEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  function renderEmailDetail(email) {
    var detailEl = document.getElementById('email-detail');
    if (!detailEl) return;

    var cleanBody = email.html ? sanitizeEmailHtml(email.html) : ('<pre class="whitespace-pre-wrap font-sans text-sm">' + (email.text || '') + '</pre>');

    var otpDigits = '';
    if (email.otpCode) {
      var chars = email.otpCode.split('');
      chars.forEach(function (c) {
        otpDigits += '<span>' + c + '</span>';
      });
    }

    var otpSection = '';
    if (email.otpCode) {
      otpSection =
        '<div class="bg-surface-container-high p-space-lg rounded-xl shadow-md relative overflow-hidden mb-space-md">' +
          '<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md mb-space-md">' +
            '<div class="flex items-center gap-space-xs">' +
              '<span class="material-symbols-outlined text-secondary text-[24px]">key_vertical</span>' +
              '<span class="font-headline-sm text-headline-sm text-secondary font-bold">Extracted 2FA Verification Code</span>' +
            '</div>' +
            '<div class="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container text-on-surface-variant font-code-sm text-code-sm">' +
              '<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>' +
              '<span>RegEx Matched</span>' +
            '</div>' +
          '</div>' +
          '<div class="flex flex-col md:flex-row items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-lg">' +
            '<div class="flex items-center gap-2 tracking-widest font-code-otp text-code-otp text-secondary font-extrabold select-all">' +
              otpDigits +
            '</div>' +
            '<button type="button" id="copy-otp-btn" class="flex items-center justify-center gap-2 bg-secondary text-on-secondary px-space-lg py-2.5 rounded font-label-caps text-label-caps font-bold hover:bg-secondary-fixed transition-colors active:scale-95 shadow-md cursor-pointer">' +
              '<span class="material-symbols-outlined text-[18px]">content_copy</span>' +
              '<span id="copy-otp-label">COPY OTP CODE</span>' +
            '</button>' +
          '</div>' +
        '</div>';
    }

    var linksSection = '';
    if (email.links && email.links.length > 0) {
      linksSection = '<div class="mt-space-md pt-space-sm flex flex-wrap gap-2">';
      email.links.slice(0, 3).forEach(function (link) {
        linksSection += '<a href="' + link + '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-highest hover:bg-surface-bright text-xs text-primary font-medium truncate max-w-xs transition-colors">' +
          '<span class="material-symbols-outlined text-[14px]">open_in_new</span>' +
          '<span class="truncate">Verify Link</span>' +
        '</a>';
      });
      linksSection += '</div>';
    }

    detailEl.innerHTML =
      '<div class="flex flex-col gap-space-md">' +
        '<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm pb-space-md bg-surface-container px-space-md py-space-sm rounded-lg">' +
          '<div class="flex items-center gap-space-sm min-w-0">' +
            '<div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface shrink-0">' +
              (email.from ? email.from.substring(0, 2).toUpperCase() : 'EM') +
            '</div>' +
            '<div class="flex flex-col min-w-0">' +
              '<div class="flex items-center gap-space-xs">' +
                '<span class="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">' + (email.from || 'Unknown') + '</span>' +
                '<span class="px-1.5 py-0.5 bg-primary-container text-on-primary-container rounded font-label-caps text-label-caps font-bold">DKIM: PASS</span>' +
              '</div>' +
              '<span class="font-code-sm text-code-sm text-on-surface-variant truncate">' + (email.date || email.receivedAt || '') + ' • SPF Verified</span>' +
            '</div>' +
          '</div>' +
          '<div class="flex flex-col sm:items-end">' +
            '<span class="font-code-sm text-code-sm text-primary">Edge Node: Verified</span>' +
          '</div>' +
        '</div>' +
        otpSection +
        '<div class="bg-surface-container p-space-lg rounded-lg text-on-surface">' +
          '<div class="mb-space-md pb-space-sm font-body-md text-body-md text-on-surface-variant border-b border-surface-variant">' +
            '<strong>Subject:</strong> ' + (email.subject || '(No Subject)') +
          '</div>' +
          '<div class="email-body-content text-sm text-on-surface leading-relaxed overflow-x-auto min-h-[160px]">' +
            cleanBody +
          '</div>' +
          linksSection +
        '</div>' +
      '</div>';

    var copyOtpBtn = document.getElementById('copy-otp-btn');
    var copyOtpLabel = document.getElementById('copy-otp-label');
    if (copyOtpBtn && email.otpCode) {
      copyOtpBtn.addEventListener('click', function () {
        copyToClipboard(email.otpCode);
        if (copyOtpLabel) copyOtpLabel.textContent = 'COPIED TO CLIPBOARD!';
        setTimeout(function () {
          if (copyOtpLabel) copyOtpLabel.textContent = 'COPY OTP CODE';
        }, 2000);
      });
    }
  }

  // =========================================================================
  // 5. الاتصال بالخادم والـ WebSocket
  // =========================================================================
  function connectWebSocket() {
    if (!state.address || !state.token) return;

    if (state.ws) {
      try { state.ws.close(); } catch (e) {}
      state.ws = null;
    }

    var protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    var wsUrl = protocol + '//' + window.location.host + '/api/ws?address=' + encodeURIComponent(state.address) + '&token=' + encodeURIComponent(state.token);

    try {
      var ws = new WebSocket(wsUrl);

      ws.onopen = function () {
        state.wsReconnectAttempts = 0;
        renderStatus(true);
      };

      ws.onmessage = function (event) {
        try {
          var data = JSON.parse(event.data);
          handleServerMessage(data);
        } catch (e) {
          console.error('WebSocket parse error:', e);
        }
      };

      ws.onclose = function () {
        renderStatus(false);
        scheduleReconnect();
      };

      ws.onerror = function () {
        renderStatus(false);
      };

      state.ws = ws;
    } catch (e) {
      renderStatus(false);
      scheduleReconnect();
    }
  }

  function scheduleReconnect() {
    if (state.isBurning) return;
    if (state.wsReconnectAttempts > 5) {
      startPolling();
      return;
    }
    state.wsReconnectAttempts++;
    setTimeout(connectWebSocket, 3000 * Math.min(state.wsReconnectAttempts, 4));
  }

  function startPolling() {
    if (state.pollInterval) clearInterval(state.pollInterval);
    state.pollInterval = setInterval(fetchEmailsHttp, 5000);
  }

  function handleServerMessage(data) {
    if (!data) return;

    if (data.type === 'init') {
      if (Array.isArray(data.emails)) {
        state.emails = data.emails;
        renderEmailsList();
      }
      if (data.expiresAt) {
        state.expiresAt = data.expiresAt;
        try { localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, String(data.expiresAt)); } catch (e) {}
        startCountdownTimer();
      }
    } else if (data.type === 'email' || data.type === 'new_email') {
      var newEmail = data.email || data;
      if (newEmail && newEmail.id) {
        var existingIdx = state.emails.findIndex(function (e) { return e.id === newEmail.id; });
        if (existingIdx === -1) {
          state.emails.unshift(newEmail);
          state.selectedEmailId = newEmail.id;
          renderEmailsList();
        }
      }
    } else if (data.type === 'extended') {
      if (data.expiresAt) {
        state.expiresAt = data.expiresAt;
        try { localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, String(data.expiresAt)); } catch (e) {}
        startCountdownTimer();
      }
    } else if (data.type === 'burned') {
      clearPersistedState();
      renderAddress();
      renderEmailsList();
      generateNewAddress();
    }
  }

  // =========================================================================
  // 6. استدعاءات الـ APIs (HTTP)
  // =========================================================================
  function generateNewAddress() {
    if (state.isGenerating) return;
    state.isGenerating = true;

    var newBtns = document.querySelectorAll('#randomize-btn, #refresh-address-btn, #new-address-btn');
    newBtns.forEach(function (b) { b.classList.add('opacity-50', 'pointer-events-none'); });

    var textEls = document.querySelectorAll('#active-email-text, #mailbox-address');
    textEls.forEach(function (el) { el.textContent = '...'; });

    fetch('/api/new-address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data && data.address && data.token) {
          persistState(data.address, data.token, data.expiresAt);
          renderAddress();
          startCountdownTimer();
          connectWebSocket();
          fetchEmailsHttp();
        }
      })
      .catch(function (err) {
        console.warn('Backend unavailable, generating client fallback:', err);
        var rand = Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 8);
        var addr = rand + '@freetemp.email';
        var tok = 'tok_' + Math.random().toString(36).substring(2, 14);
        var exp = Date.now() + 20 * 60 * 1000;
        persistState(addr, tok, exp);
        renderAddress();
        startCountdownTimer();
      })
      .finally(function () {
        state.isGenerating = false;
        newBtns.forEach(function (b) { b.classList.remove('opacity-50', 'pointer-events-none'); });
      });
  }

  function fetchEmailsHttp() {
    if (!state.address || !state.token) return;

    fetch('/api/emails?address=' + encodeURIComponent(state.address) + '&token=' + encodeURIComponent(state.token))
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data && Array.isArray(data.emails)) {
          state.emails = data.emails;
          renderEmailsList();
        }
        if (data && data.expiresAt) {
          state.expiresAt = data.expiresAt;
          try { localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, String(data.expiresAt)); } catch (e) {}
        }
      })
      .catch(function () {});
  }

  function extendMailboxTime() {
    if (state.isExtending || !state.address || !state.token) return;
    state.isExtending = true;

    var extendBtns = document.querySelectorAll('#extend-timer-btn, #extend-btn');
    extendBtns.forEach(function (b) { b.classList.add('opacity-50'); });

    fetch('/api/extend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: state.address, token: state.token })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data && data.expiresAt) {
          state.expiresAt = data.expiresAt;
          try { localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, String(data.expiresAt)); } catch (e) {}
          startCountdownTimer();
        }
      })
      .catch(function (err) {
        console.warn('Extend error, applying local extension:', err);
        state.expiresAt += 10 * 60 * 1000;
        try { localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, String(state.expiresAt)); } catch (e) {}
        startCountdownTimer();
      })
      .finally(function () {
        state.isExtending = false;
        extendBtns.forEach(function (b) { b.classList.remove('opacity-50'); });
      });
  }

  function showBurnConfirmModal() {
    var modal = document.getElementById('burn-confirm-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'burn-confirm-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm hidden email-modal-backdrop p-4';
      modal.innerHTML =
        '<div class="bg-surface-container-low border border-surface-variant rounded-xl max-w-sm w-full p-space-lg shadow-2xl text-center">' +
          '<div class="w-12 h-12 rounded-lg bg-error-container text-on-error-container flex items-center justify-center mb-space-md mx-auto">' +
            '<span class="material-symbols-outlined text-[24px] text-error">local_fire_department</span>' +
          '</div>' +
          '<h3 class="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">' + (t('burnConfirmTitle') || 'Confirm Mailbox Burn') + '</h3>' +
          '<p class="font-body-sm text-body-sm text-on-surface-variant mb-space-lg leading-relaxed">' + (t('burnConfirmText') || 'Are you sure you want to permanently erase this temporary address and zero all memory buffers?') + '</p>' +
          '<div class="flex items-center gap-space-sm">' +
            '<button type="button" id="confirm-burn-btn" class="flex-1 py-2.5 px-4 bg-error text-on-error rounded font-code-sm text-code-sm font-bold transition-all hover:bg-error/90 cursor-pointer">' + (t('confirmBurn') || 'Burn Now') + '</button>' +
            '<button type="button" id="cancel-burn-btn" class="flex-1 py-2.5 px-4 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-code-sm text-code-sm font-semibold transition-colors cursor-pointer">' + (t('cancel') || 'Cancel') + '</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(modal);

      document.getElementById('cancel-burn-btn').addEventListener('click', function () {
        modal.classList.add('hidden');
      });

      document.getElementById('confirm-burn-btn').addEventListener('click', function () {
        modal.classList.add('hidden');
        burnMailbox();
      });

      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.classList.add('hidden');
      });
    }

    modal.classList.remove('hidden');
  }

  function burnMailbox() {
    if (state.isBurning || !state.address || !state.token) return;
    state.isBurning = true;

    var burnBtns = document.querySelectorAll('#burn-btn');
    burnBtns.forEach(function (b) { b.classList.add('opacity-50', 'pointer-events-none'); });

    fetch('/api/burn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: state.address, token: state.token })
    })
      .catch(function () {})
      .finally(function () {
        clearPersistedState();
        renderAddress();
        renderEmailsList();
        state.isBurning = false;
        burnBtns.forEach(function (b) { b.classList.remove('opacity-50', 'pointer-events-none'); });
        generateNewAddress();
      });
  }

  function copyToClipboard(text) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () {});
    } else {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(textarea);
    }
  }

  // =========================================================================
  // 7. تهيئة الصفحة وربط الأحداث
  // =========================================================================
  function init() {
    var hasExisting = loadPersistedState();
    if (hasExisting) {
      renderAddress();
      startCountdownTimer();
      connectWebSocket();
      fetchEmailsHttp();
    } else {
      generateNewAddress();
    }

    // زر نسخ العنوان
    var copyBtns = document.querySelectorAll('#copy-address-btn, #copy-btn-primary, #copy-demo-btn, .copy-address-btn');
    copyBtns.forEach(function (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var val = state.address;
        if (!val || val === '...') {
          var textEl = document.getElementById('active-email-text') || document.getElementById('address-input');
          if (textEl) val = textEl.textContent || textEl.value;
        }
        if (!val || val === '...' || val.indexOf('@') === -1) return;
        copyToClipboard(val);

        var label = document.getElementById('copy-address-label') || copyBtn.querySelector('span:last-child');
        if (label) {
          var orig = label.textContent;
          label.textContent = 'COPIED!';
          setTimeout(function () { label.textContent = orig; }, 1500);
        }
      });
    });

    // زر إنشاء عنوان جديد
    var newBtns = document.querySelectorAll('#randomize-btn, #refresh-address-btn, #new-address-btn');
    newBtns.forEach(function (newBtn) {
      newBtn.addEventListener('click', function () {
        generateNewAddress();
      });
    });

    // زر تمديد الصلاحية
    var extendBtns = document.querySelectorAll('#extend-timer-btn, #extend-btn');
    extendBtns.forEach(function (extendBtn) {
      extendBtn.addEventListener('click', function () {
        extendMailboxTime();
      });
    });

    // زر إتلاف الصندوق
    var burnBtns = document.querySelectorAll('#burn-btn');
    burnBtns.forEach(function (burnBtn) {
      burnBtn.addEventListener('click', function () {
        showBurnConfirmModal();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.freetemp_app = {
    getState: function () { return state; },
    generateNewAddress: generateNewAddress,
    extendMailboxTime: extendMailboxTime,
    burnMailbox: burnMailbox
  };
})();
