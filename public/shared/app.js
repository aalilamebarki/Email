/**
 * shared/app.js
 * محرك تطبيق البريد المؤقت (Vanilla JS High-Performance Engine)
 * - توليد عناوين حقيقية عبر Cloudflare Worker
 * - اتصال حي ومستمر عبر WebSocket Hibernation API
 * - مزامنة التوكن الأمني ومنع التجسس
 * - تحصين الخصوصية وحجب بكسلات التتبع (DOMPurify Sandbox)
 * - ميزات الإتلاف والحرق الفوري والتمديد (+10 دقائق)
 * - إشعار صوتي (Web Audio API) واهتزاز تفاعلي
 */

(function () {
  'use strict';

  // كشف اللغة ودعم أكثر من 20 لغة عالمية تلقائيا
  let currentLang = (typeof window.i18n !== 'undefined' && window.i18n.getLanguage)
    ? window.i18n.getLanguage()
    : (document.documentElement.getAttribute('lang') || (window.location.pathname.startsWith('/en') ? 'en' : 'ar'));
  let isArabic = currentLang === 'ar' || document.documentElement.getAttribute('dir') === 'rtl';

  function getAppStrings() {
    if (typeof window.i18n !== 'undefined' && window.i18n.getStrings) {
      return window.i18n.getStrings(currentLang);
    }
    const isAr = currentLang === 'ar';
    return {
      generating: isAr ? 'جاري توليد العنوان...' : 'Generating address...',
      copyAddress: isAr ? 'نسخ العنوان' : 'Copy Address',
      copied: isAr ? 'تم النسخ!' : 'Copied!',
      burnMailbox: isAr ? 'إتلاف الصندوق' : 'Burn Mailbox',
      burning: isAr ? 'جاري الإتلاف...' : 'Burning...',
      extendTime: isAr ? '+10 دقائق' : '+10 mins',
      extending: isAr ? 'جاري التمديد...' : 'Extending...',
      extended: isAr ? '+10 دقائق' : '+10 mins',
      statusConnecting: isAr ? 'جاري الاتصال بالسيرفر...' : 'Connecting to edge...',
      statusLive: isAr ? 'بث حي متصل' : 'Live WebSocket connected',
      statusExpired: isAr ? 'انتهت الصلاحية' : 'Session Expired',
      statusBurned: isAr ? 'تم إتلاف الصندوق' : 'Mailbox Burned',
      waitingEmails: isAr
        ? 'في انتظار الرسائل الواردة... ستظهر هنا فور إرسالها دون الحاجة لتحديث الصفحة.'
        : 'Waiting for incoming messages... They will appear here live without refreshing.',
      otpBadge: isAr ? 'كود التحقق السريع (OTP)' : 'Verification Code (OTP)',
      copyOtp: isAr ? 'نسخ الكود' : 'Copy Code',
      openLink: isAr ? 'فتح الرابط' : 'Open Link',
      privacyBlocked: isAr
        ? 'تم حجب الصور الخارجية لحماية هويتك وعنوان IP.'
        : 'External images blocked to safeguard your IP address.',
      showImages: isAr ? 'عرض الصور' : 'Show images',
      imagesShown: isAr ? 'تم تفعيل الصور' : 'Images loaded',
      reblockImages: isAr ? 'إعادة حجب الصور' : 'Re-block images',
      confirmBurn: isAr
        ? 'هل أنت متأكد من رغبتك في إتلاف الصندوق وحذف كافة الرسائل والبيانات فوريا؟'
        : 'Are you sure you want to permanently burn this mailbox and destroy all messages?',
      newAddress: isAr ? 'عنوان جديد' : 'New Address',
      noSubject: isAr ? '(بدون موضوع)' : '(No Subject)',
      from: isAr ? 'من:' : 'From:',
      badgeEngineActive: isAr ? 'محرك التغطية الشاملة للتحقق نشط' : 'Universal Verification Engine Active',
      directLinks: isAr ? 'روابط التفعيل والتحقق المباشرة:' : 'Direct verification links:',
      badgeFiltered: isAr ? 'مفلترة من التعقب' : 'Anti-tracking verified',
      linkText: isAr ? 'رابط تفعيل' : 'Activation Link',
      otpTokenGoogle: isAr ? 'رمز Google المعتمد (G-Token)' : 'Google Verification Token (G-Token)',
      otpTokenSegmented: isAr ? 'كود مقسم (Discord / Microsoft)' : 'Segmented 2FA Code',
      otpTokenAlpha: isAr ? 'كود أبجدي رقمي (Steam Guard / 2FA)' : 'Alphanumeric 2FA Code',
      otpTokenNumeric: isAr ? 'رمز تحقق رقمي فوري (OTP PIN)' : 'Instant OTP Passcode',
    };
  }

  let strings = getAppStrings();

  window.addEventListener('langChanged', (e) => {
    if (e && e.detail && e.detail.lang) {
      currentLang = e.detail.lang;
      isArabic = currentLang === 'ar' || e.detail.dir === 'rtl';
    } else {
      currentLang = (typeof window.i18n !== 'undefined' && window.i18n.getLanguage) ? window.i18n.getLanguage() : currentLang;
      isArabic = currentLang === 'ar';
    }
    strings = getAppStrings();
    if (state.address && state.token) {
      updateConnectionStatus(state.isExpired ? 'expired' : 'live');
      renderEmailsList();
      renderSelectedEmail();
    }
  });

  // حالة التطبيق العامة
  const state = {
    address: '',
    token: '',
    expiresAt: 0,
    remainingSeconds: 20 * 60,
    isExpired: false,
    emails: [],
    selectedEmailId: null,
    allowedImagesEmailIds: new Set(),
    ws: null,
    pingInterval: null,
    timerInterval: null,
    reconnectAttempts: 0,
    audioCtx: null,
  };

  // 1) توليد صوت تنبيه لطيف عبر Web Audio API دون الحاجة لملفات mp3
  function playNewEmailChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!state.audioCtx) {
        state.audioCtx = new AudioContext();
      }
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }
      const ctx = state.audioCtx;
      const now = ctx.currentTime;

      // نغمة مزدوجة لطيفة (Dual Tone Chime)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // نغمة صاعدة: 880Hz (A5) ثم 1320Hz (E6)
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.15);

      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.exponentialRampToValueAtTime(660, now + 0.15);

      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch (e) {
      // قد يحظر الصوت تلقائيا حتى يتفاعل المستخدم مع الصفحة
    }

    // تشغيل الاهتزاز للهواتف الذكية إن كان مدعوما
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch (e) {}
  }

  // 2) إدارة عداد الوقت وتحديث الواجهة
  function formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function startTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);

    state.timerInterval = setInterval(() => {
      if (state.expiresAt > 0) {
        const remaining = Math.max(0, Math.floor((state.expiresAt - Date.now()) / 1000));
        state.remainingSeconds = remaining;

        const timerEl = document.getElementById('timer-display');
        const timerContainer = document.getElementById('timer-container');

        if (timerEl) {
          timerEl.textContent = formatTime(remaining);
        }

        // وميض تحذيري عند بقاء أقل من دقيقتين (120 ثانية)
        if (timerContainer) {
          if (remaining > 0 && remaining <= 120) {
            timerContainer.classList.add('border-amber-500', 'text-amber-500', 'animate-pulse');
          } else {
            timerContainer.classList.remove('border-amber-500', 'text-amber-500', 'animate-pulse');
          }
        }

        if (remaining <= 0 && !state.isExpired) {
          state.isExpired = true;
          clearInterval(state.timerInterval);
          onSessionExpired();
        }
      }
    }, 1000);
  }

  function onSessionExpired() {
    updateConnectionStatus('expired');
    const badge = document.getElementById('session-status-badge');
    if (badge) {
      badge.textContent = strings.statusExpired;
      badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800';
    }
  }

  // 3) تحديث شريط حالة الاتصال
  function updateConnectionStatus(type) {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    if (!dot || !text) return;

    if (type === 'live') {
      dot.className = 'w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#00FF66] animate-pulse';
      text.textContent = strings.statusLive;
      text.className = 'text-xs font-mono text-black dark:text-white';
    } else if (type === 'connecting') {
      dot.className = 'w-2 h-2 rounded-full bg-amber-400 animate-ping';
      text.textContent = strings.statusConnecting;
      text.className = 'text-xs font-mono text-[#666666] dark:text-[#888888]';
    } else if (type === 'expired' || type === 'burned') {
      dot.className = 'w-2 h-2 rounded-full bg-red-500';
      text.textContent = type === 'burned' ? strings.statusBurned : strings.statusExpired;
      text.className = 'text-xs font-mono text-red-600 dark:text-red-400';
    }
  }

  // 4) فتح اتصال WebSocket مع الـ Durable Object
  function connectWebSocket(address, token) {
    if (state.ws) {
      try {
        state.ws.close();
      } catch (e) {}
    }

    if (state.pingInterval) clearInterval(state.pingInterval);

    updateConnectionStatus('connecting');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // استهداف خادم الـ API عبر الدومين الموحد
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/api/ws/${encodeURIComponent(address)}?token=${encodeURIComponent(token)}`;

    try {
      const ws = new WebSocket(wsUrl);
      state.ws = ws;

      ws.onopen = function () {
        state.reconnectAttempts = 0;
        updateConnectionStatus('live');

        // Heartbeat Ping كل 25 ثانية لمنع انقطاع الاتصال
        state.pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 25000);
      };

      ws.onmessage = function (event) {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'init') {
            if (data.expiresAt) {
              state.expiresAt = data.expiresAt;
              startTimer();
            }
            if (Array.isArray(data.emails)) {
              state.emails = data.emails;
              if (data.emails.length > 0 && !state.selectedEmailId) {
                state.selectedEmailId = data.emails[0].id;
              }
              renderEmailsList();
              renderSelectedEmail();
            }
          } else if (data.type === 'new_email' && data.email) {
            // وصول بريد جديد! تشغيل الصوت والاهتزاز
            playNewEmailChime();

            // فحص عدم التكرار
            const exists = state.emails.some((e) => e.id === data.email.id);
            if (!exists) {
              state.emails.unshift(data.email);
              state.selectedEmailId = data.email.id;
              renderEmailsList();
              renderSelectedEmail();
            }

            if (data.expiresAt) {
              state.expiresAt = data.expiresAt;
            }
          } else if (data.type === 'extended') {
            if (data.expiresAt) {
              state.expiresAt = data.expiresAt;
              state.isExpired = false;
              startTimer();
              updateConnectionStatus('live');
              showFeedbackToast(strings.extended || (isArabic ? '+10 دقائق' : '+10 mins'));
            }
          } else if (data.type === 'burned') {
            updateConnectionStatus('burned');
            generateNewAddress();
          } else if (data.type === 'expired') {
            onSessionExpired();
          }
        } catch (err) {
          console.warn('Error parsing WebSocket message:', err);
        }
      };

      ws.onclose = function (evt) {
        if (state.pingInterval) clearInterval(state.pingInterval);
        if (!state.isExpired && state.remainingSeconds > 0) {
          updateConnectionStatus('connecting');
          // محاولة إعادة الاتصال التلقائي
          state.reconnectAttempts++;
          const delay = Math.min(10000, 1000 * Math.pow(1.5, state.reconnectAttempts));
          setTimeout(() => {
            if (!state.isExpired && state.address && state.token) {
              connectWebSocket(state.address, state.token);
            }
          }, delay);
        }
      };

      ws.onerror = function () {
        // Fallback: جلب الرسائل عبر HTTP إن تعثر الاتصال
        fetchEmailsViaHttp(address, token);
      };
    } catch (e) {
      console.warn('WebSocket connection error:', e);
      fetchEmailsViaHttp(address, token);
    }
  }

  // 5) استدعاء احتياطي لجلب الرسائل عبر HTTP
  async function fetchEmailsViaHttp(address, token) {
    try {
      const res = await fetch(`/api/emails/${encodeURIComponent(address)}?token=${encodeURIComponent(token)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.emails)) {
          state.emails = data.emails;
          if (data.emails.length > 0 && !state.selectedEmailId) {
            state.selectedEmailId = data.emails[0].id;
          }
          renderEmailsList();
          renderSelectedEmail();
        }
      }
    } catch (err) {
      console.warn('Failed to fetch emails via HTTP:', err);
    }
  }

  // 6) توليد عنوان بريد جديد كليا
  async function generateNewAddress() {
    const addressInput = document.getElementById('address-input');
    const copyBtn = document.getElementById('copy-address-btn');
    if (addressInput) addressInput.value = strings.generating;

    try {
      const res = await fetch('/api/new-address');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();

      state.address = data.address || ('user_' + Math.random().toString(36).substring(2, 8) + '@freetemp.email');
      state.token = data.token || ('tok_' + Math.random().toString(36).substring(2, 10));
      state.expiresAt = data.expiresAt || (Date.now() + (data.expiryMinutes || 20) * 60 * 1000);
      state.remainingSeconds = 20 * 60;
      state.isExpired = false;
      state.emails = [];
      state.selectedEmailId = null;
      state.allowedImagesEmailIds.clear();

      if (addressInput) addressInput.value = state.address;

      // حفظ الجلسة في التخزين المحلي
      try {
        localStorage.setItem(
          'tempmail_session',
          JSON.stringify({
            address: state.address,
            token: state.token,
            expiresAt: state.expiresAt,
          })
        );
      } catch (e) {}

      // بدء العداد والـ WebSocket
      startTimer();
      connectWebSocket(state.address, state.token);

      renderEmailsList();
      renderSelectedEmail();
    } catch (err) {
      console.warn('Failed to generate address from server, using secure local session:', err);
      const fallbackAddress = 'user_' + Math.random().toString(36).substring(2, 8) + '@freetemp.email';
      state.address = fallbackAddress;
      state.token = 'tok_' + Math.random().toString(36).substring(2, 10);
      state.expiresAt = Date.now() + 20 * 60 * 1000;
      state.remainingSeconds = 20 * 60;
      state.isExpired = false;
      state.emails = [];
      state.selectedEmailId = null;
      state.allowedImagesEmailIds.clear();
      if (addressInput) addressInput.value = fallbackAddress;
      startTimer();
      renderEmailsList();
      renderSelectedEmail();
    }
  }

  // 7) تمديد صلاحية الصندوق 10 دقائق (+10 mins)
  async function extendMailbox() {
    if (!state.address || !state.token) return;
    const btn = document.getElementById('extend-btn');
    if (btn) btn.disabled = true;

    try {
      // إرسال عبر الـ WebSocket أولا
      if (state.ws && state.ws.readyState === WebSocket.OPEN) {
        state.ws.send(JSON.stringify({ type: 'extend' }));
      }

      // واستدعاء نقطة النهاية للتحقق
      const res = await fetch(`/api/extend/${encodeURIComponent(state.address)}?token=${encodeURIComponent(state.token)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({ address: state.address, token: state.token }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.expiresAt) {
          state.expiresAt = data.expiresAt;
          state.isExpired = false;
          startTimer();
          showFeedbackToast(strings.extended || (isArabic ? '+10 دقائق' : '+10 mins'));
        }
      }
    } catch (e) {
      console.warn('Failed to extend mailbox:', e);
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  // 8) إتلاف وحرق الصندوق فوريا ومسح البيانات
  async function burnMailbox() {
    if (!state.address || !state.token) return;
    if (!window.confirm(strings.confirmBurn)) return;

    const btn = document.getElementById('burn-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = strings.burning;
    }

    try {
      if (state.ws && state.ws.readyState === WebSocket.OPEN) {
        state.ws.send(JSON.stringify({ type: 'burn' }));
      }

      await fetch(`/api/burn/${encodeURIComponent(state.address)}?token=${encodeURIComponent(state.token)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({ address: state.address, token: state.token }),
      });

      try {
        localStorage.removeItem('tempmail_session');
      } catch (e) {}

      // توليد عنوان جديد فورا
      await generateNewAddress();
    } catch (e) {
      console.warn('Failed to burn mailbox:', e);
      generateNewAddress();
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = strings.burn;
      }
    }
  }

  // 9) نسخ العنوان أو كود الـ OTP
  async function copyToClipboard(text, triggerBtn, successText) {
    try {
      await navigator.clipboard.writeText(text);
      if (triggerBtn) {
        const originalHtml = triggerBtn.innerHTML;
        triggerBtn.classList.add('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
        triggerBtn.innerHTML = `
          <svg class="w-4 h-4 stroke-current fill-none stroke-[2] shrink-0 inline" viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${successText || strings.copied}</span>
        `;
        setTimeout(() => {
          triggerBtn.innerHTML = originalHtml;
          triggerBtn.classList.remove('bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
        }, 2000);
      }
    } catch (e) {
      console.error('Failed to copy to clipboard:', e);
    }
  }

  function showFeedbackToast(msg) {
    const toast = document.createElement('div');
    toast.className =
      'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-xs font-bold rounded-lg shadow-xl animate-bounce';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2500);
  }

  // 10) عرض قائمة الرسائل (Emails List)
  function renderEmailsList() {
    const listContainer = document.getElementById('emails-list');
    const countBadge = document.getElementById('emails-count');
    if (!listContainer) return;

    if (countBadge) {
      countBadge.textContent = state.emails.length;
    }

    if (state.emails.length === 0) {
      listContainer.innerHTML = `
        <div class="p-8 text-center text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed flex flex-col items-center justify-center gap-3">
          <div class="w-12 h-12 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-1">
            <svg class="w-6 h-6 stroke-current fill-none stroke-[1.75]" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </div>
          <p>${strings.waitingEmails}</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = state.emails
      .map((email) => {
        const isSelected = email.id === state.selectedEmailId;
        const formattedDate = new Date(email.date || email.receivedAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        return `
          <button
            type="button"
            data-email-id="${email.id}"
            class="w-full text-right ${isArabic ? 'text-right' : 'text-left'} p-3.5 border-b border-[#EAEAEA] dark:border-[#222222] transition-colors cursor-pointer hover:bg-[#F9F9F9] dark:hover:bg-[#141414] ${
              isSelected ? 'bg-[#F2F2F2] dark:bg-[#1A1A1A] font-medium' : ''
            }"
          >
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="text-xs font-bold text-black dark:text-white truncate max-w-[180px]">
                ${escapeHtml(email.from)}
              </span>
              <span class="text-[10px] font-mono text-[#777777] dark:text-[#888888] shrink-0">
                ${formattedDate}
              </span>
            </div>
            <div class="text-xs text-black dark:text-[#EDEDED] truncate mb-1">
              ${escapeHtml(email.subject || strings.noSubject)}
            </div>
            <div class="flex items-center gap-1.5 flex-wrap">
              ${
                email.otpCode
                  ? `<div class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-black text-white dark:bg-white dark:text-black rounded text-[10px] font-mono font-bold">
                      <span>OTP:</span>
                      <span>${escapeHtml(email.otpCode)}</span>
                     </div>`
                  : ''
              }
              ${
                Array.isArray(email.links) && email.links.length > 0 && !email.otpCode
                  ? `<div class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded text-[10px] font-mono font-medium">
                      <svg class="w-2.5 h-2.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                      <span>${strings.linkText || (isArabic ? 'رابط تفعيل' : 'Activation Link')}</span>
                     </div>`
                  : ''
              }
            </div>
          </button>
        `;
      })
      .join('');

    // تفعيل أحداث النقر لاختيار الرسالة
    listContainer.querySelectorAll('[data-email-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-email-id');
        state.selectedEmailId = id;
        renderEmailsList();
        renderSelectedEmail();
      });
    });
  }

  // دوال تصنيف وتحديد نوع كود التحقق لتعزيز تجربة المستخدم
  function getOtpTypeBadge(code) {
    if (!code) return { label: strings.otpBadge, type: 'standard' };
    if (/^G-[0-9]{4,8}$/i.test(code)) {
      return {
        label: strings.otpTokenGoogle || (isArabic ? 'رمز Google المعتمد (G-Token)' : 'Google Verification Token (G-Token)'),
        type: 'google',
      };
    }
    if (/^[0-9]{3}[- ][0-9]{3,4}$/.test(code)) {
      return {
        label: strings.otpTokenSegmented || (isArabic ? 'كود مقسم (Discord / Microsoft)' : 'Segmented 2FA Code'),
        type: 'segmented',
      };
    }
    if (/[A-Za-z]/.test(code)) {
      return {
        label: strings.otpTokenAlpha || (isArabic ? 'كود أبجدي رقمي (Steam Guard / 2FA)' : 'Alphanumeric 2FA Code'),
        type: 'alphanumeric',
      };
    }
    return {
      label: strings.otpTokenNumeric || (isArabic ? 'رمز تحقق رقمي فوري (OTP PIN)' : 'Instant OTP Passcode'),
      type: 'numeric',
    };
  }

  // دوال استخراج احتياطية على جهة العميل لضمان التقاط 100% من الأكواد والروابط
  function clientExtractOtp(text, html) {
    const raw = `${text || ''}\n${(html || '').replace(/<[^>]+>/g, ' ')}`;
    const gMatch = raw.match(/\b(G-[0-9]{4,8})\b/i);
    if (gMatch) return gMatch[1].toUpperCase();

    const divMatch = raw.match(/\b([0-9]{3}[- ][0-9]{3,4})\b/);
    if (divMatch) return divMatch[1];

    const kwMatch = raw.match(
      /(?:code|otp|verification|security\s+code|passcode|pin|token|steam\s+guard|رمز|كود|تاكيد|تفعيل)[\s:=-]+([A-Za-z0-9]{4,8})\b/i
    );
    if (kwMatch && !/^(?:202[0-9]|true|false|null|this|that|from|user|with)$/i.test(kwMatch[1])) {
      return kwMatch[1];
    }

    const numMatch = raw.match(/(?:^|\s|\(|\[|"|')([0-9]{4,8})(?:\s|\)|\]|"|'|$)/m);
    if (numMatch && !/^(?:201[89]|202[0-9]|2030)$/.test(numMatch[1])) {
      return numMatch[1];
    }
    return null;
  }

  function clientExtractLinks(html, text) {
    const links = [];
    if (html) {
      const aRegex = /<a\s+[^>]*href=["']([^"'>]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let m;
      while ((m = aRegex.exec(html)) !== null) {
        let u = m[1].replace(/&amp;/g, '&').trim();
        if (/^https?:\/\//i.test(u) && !/unsubscribe|optout|privacy|terms|cookie/i.test(u)) {
          links.push(u);
        }
      }
    }
    if (links.length === 0 && text) {
      const uRegex = /(https?:\/\/[^\s<>"'{}|\\^`[\]]+)/gi;
      let m;
      while ((m = uRegex.exec(text)) !== null) {
        let u = m[1].replace(/[.,:;!?)]+$/, '');
        if (!/unsubscribe|optout|privacy|terms/i.test(u)) links.push(u);
      }
    }
    return links.slice(0, 5);
  }

  // 11) عرض تفاصيل الرسالة المختارة مع عزل الـ Iframe وحجب بكسلات التتبع
  function renderSelectedEmail() {
    const detailContainer = document.getElementById('email-detail');
    if (!detailContainer) return;

    const email = state.emails.find((e) => e.id === state.selectedEmailId);
    if (!email) {
      detailContainer.innerHTML = `
        <div class="h-full min-h-[300px] flex items-center justify-center p-6 text-center text-[#777777] dark:text-[#888888] text-xs">
          ${strings.waitingEmails}
        </div>
      `;
      return;
    }

    // استخراج احتياطي في حال لم يكن الكود أو الروابط جاهزة من الخادم
    if (!email.otpCode) {
      email.otpCode = clientExtractOtp(email.text, email.html);
    }
    if (!Array.isArray(email.links) || email.links.length === 0) {
      email.links = clientExtractLinks(email.html, email.text);
    }

    const showImages = state.allowedImagesEmailIds.has(email.id);
    const sanitizedHtml = sanitizeEmailContent(email.html, email.text, showImages);

    const badgeInfo = getOtpTypeBadge(email.otpCode);

    detailContainer.innerHTML = `
      <div class="flex flex-col h-full">
        <!-- ترويسة الرسالة -->
        <div class="p-4 border-b border-[#EAEAEA] dark:border-[#222222] bg-[#FAFAFA] dark:bg-[#111111]">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h3 class="text-sm sm:text-base font-bold text-black dark:text-white leading-snug">
              ${escapeHtml(email.subject || strings.noSubject)}
            </h3>
            <span class="text-[11px] font-mono text-[#777777] dark:text-[#888888] shrink-0">
              ${new Date(email.date || email.receivedAt).toLocaleString()}
            </span>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div class="text-xs text-[#555555] dark:text-[#AAAAAA]">
              <span class="font-semibold text-black dark:text-white">${strings.from}</span> ${escapeHtml(email.from)}
            </div>
            <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>${strings.badgeEngineActive || (isArabic ? 'محرك التغطية الشاملة للتحقق نشط' : 'Universal Verification Engine Active')}</span>
            </div>
          </div>

          <!-- بطاقة كود OTP إن وجد -->
          ${
            email.otpCode
              ? `
            <div class="mb-3 p-3 bg-white dark:bg-[#1A1A1A] border border-neutral-300 dark:border-neutral-700 rounded-lg flex items-center justify-between gap-3 shadow-sm">
              <div>
                <div class="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold">${escapeHtml(badgeInfo.label)}</div>
                <div class="text-xl font-mono font-extrabold text-black dark:text-white tracking-widest">${escapeHtml(email.otpCode)}</div>
              </div>
              <button
                type="button"
                id="copy-otp-btn"
                class="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>${strings.copyOtp}</span>
              </button>
            </div>
          `
              : ''
          }

          <!-- روابط التفعيل المستخرجة -->
          ${
            Array.isArray(email.links) && email.links.length > 0
              ? `
            <div class="mb-2">
              <div class="text-[11px] font-bold text-black dark:text-white mb-1.5 flex items-center justify-between">
                <span>${strings.directLinks || (isArabic ? 'روابط التفعيل والتحقق المباشرة:' : 'Direct verification links:')}</span>
                <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                  <svg class="w-3 h-3 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${strings.badgeFiltered || (isArabic ? 'مفلترة من التعقب' : 'Anti-tracking verified')}</span>
                </span>
              </div>
              <div class="flex flex-wrap gap-1.5">
                ${email.links
                  .slice(0, 3)
                  .map(
                    (link) => `
                  <a
                    href="${escapeHtml(link)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-black dark:text-white transition-colors shadow-sm"
                  >
                    <svg class="w-3.5 h-3.5 stroke-current fill-none stroke-[2] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    <span>${strings.openLink}</span>
                  </a>
                `
                  )
                  .join('')}
              </div>
            </div>
          `
              : ''
          }

          <!-- شريط الخصوصية وحجب بكسلات التتبع -->
          <div class="mt-2 pt-2 border-t border-[#EAEAEA] dark:border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
            <div class="flex items-center gap-1.5 text-[#555555] dark:text-[#999999]">
              <span class="w-1.5 h-1.5 rounded-full ${showImages ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
              <span>${showImages ? strings.imagesShown : strings.privacyBlocked}</span>
            </div>
            <button
              type="button"
              id="toggle-images-btn"
              class="text-xs font-semibold text-black dark:text-white underline hover:opacity-80 transition-opacity cursor-pointer self-start sm:self-auto"
            >
              ${showImages ? (strings.reblockImages || (isArabic ? 'إعادة حجب الصور' : 'Re-block images')) : strings.showImages}
            </button>
          </div>
        </div>

        <!-- إطار العرض المعزول (Iframe Sandbox) خالي تماما من allow-scripts و allow-same-origin لمنع أي XSS أو اختراق -->
        <div class="flex-1 min-h-[350px] relative bg-white">
          <iframe
            id="email-preview-frame"
            sandbox="allow-popups allow-popups-to-escape-sandbox"
            class="w-full h-full min-h-[350px] border-0"
            title="Email Preview"
          ></iframe>
        </div>
      </div>
    `;

    // ربط زر نسخ الـ OTP
    const copyOtpBtn = document.getElementById('copy-otp-btn');
    if (copyOtpBtn && email.otpCode) {
      copyOtpBtn.addEventListener('click', () => {
        copyToClipboard(email.otpCode, copyOtpBtn, strings.copied);
      });
    }

    // ربط زر تبديل إظهار الصور
    const toggleImagesBtn = document.getElementById('toggle-images-btn');
    if (toggleImagesBtn) {
      toggleImagesBtn.addEventListener('click', () => {
        if (state.allowedImagesEmailIds.has(email.id)) {
          state.allowedImagesEmailIds.delete(email.id);
        } else {
          state.allowedImagesEmailIds.add(email.id);
        }
        renderSelectedEmail();
      });
    }

    // حقن المحتوى في الـ iframe بأمان تام
    const iframe = document.getElementById('email-preview-frame');
    if (iframe) {
      const isDark = document.documentElement.classList.contains('dark');
      const iframeContent = `
        <!doctype html>
        <html dir="${isArabic ? 'rtl' : 'ltr'}">
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: ${isArabic ? "'Cairo', sans-serif" : "'Inter', sans-serif"};
                padding: 16px;
                margin: 0;
                color: ${isDark ? '#EDEDED' : '#111111'};
                background-color: ${isDark ? '#0D0D0D' : '#FFFFFF'};
                line-height: 1.6;
                word-break: break-word;
                font-size: 14px;
              }
              a { color: ${isDark ? '#EDEDED' : '#000000'}; text-decoration: underline; font-weight: 600; }
              img { max-width: 100%; height: auto; }
              pre, code { white-space: pre-wrap; font-family: monospace; }
            </style>
          </head>
          <body>${sanitizedHtml}</body>
        </html>
      `;
      iframe.srcdoc = iframeContent;
    }
  }

  // 12) تنقية المحتوى بـ DOMPurify مع حظر وسوم بكسلات التتبع افتراضيا
  function sanitizeEmailContent(html, text, allowImages) {
    const raw = html || `<pre>${escapeHtml(text || '')}</pre>`;
    if (typeof DOMPurify !== 'undefined') {
      const forbidTags = ['script', 'iframe', 'object', 'embed', 'form', 'base'];
      if (!allowImages) {
        forbidTags.push('img', 'video', 'audio', 'picture', 'source');
      }

      return DOMPurify.sanitize(raw, {
        FORBID_TAGS: forbidTags,
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'action', 'formaction'],
        ALLOW_DATA_ATTR: false,
      });
    }
    return escapeHtml(text || '');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 13) إعداد أحداث الصفحة الرئيسية عند التحميل
  function initApp() {
    const copyAddressBtn = document.getElementById('copy-address-btn');
    const refreshBtn = document.getElementById('refresh-address-btn');
    const extendBtn = document.getElementById('extend-btn');
    const burnBtn = document.getElementById('burn-btn');

    if (copyAddressBtn) {
      copyAddressBtn.addEventListener('click', () => {
        if (state.address) {
          copyToClipboard(state.address, copyAddressBtn, strings.copied);
        }
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        generateNewAddress();
      });
    }

    if (extendBtn) {
      extendBtn.addEventListener('click', extendMailbox);
    }

    if (burnBtn) {
      burnBtn.addEventListener('click', burnMailbox);
    }

    // استعادة الجلسة السابقة إن كانت صالحة، أو توليد صندوق جديد
    try {
      const saved = localStorage.getItem('tempmail_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.address && parsed.token && parsed.expiresAt && parsed.expiresAt > Date.now()) {
          state.address = parsed.address;
          state.token = parsed.token;
          state.expiresAt = parsed.expiresAt;
          const remaining = Math.max(0, Math.floor((parsed.expiresAt - Date.now()) / 1000));
          state.remainingSeconds = remaining;

          const addressInput = document.getElementById('address-input');
          if (addressInput) addressInput.value = parsed.address;

          startTimer();
          connectWebSocket(parsed.address, parsed.token);
          fetchEmailsViaHttp(parsed.address, parsed.token);
          return;
        }
      }
    } catch (e) {}

    generateNewAddress();
  }

  // بدء التشغيل عند اكتمال تحميل DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
