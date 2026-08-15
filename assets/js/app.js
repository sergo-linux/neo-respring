/**
 * NeoRespring — app logic: language, theme, the Respring launch, install & SW.
 */
(function () {
  'use strict';

  var TARGET = 'https://neonmodder123.github.io/respring';
  var VERSION = '1.0.0';
  var KEY_LANG = 'neorespring:lang';
  var KEY_THEME = 'neorespring:theme';
  var THEME_COLOR = { dark: '#0A0713', light: '#F4F2FF' };

  var root = document.documentElement;
  var i18n = window.NeoI18n;
  var darkMq = window.matchMedia('(prefers-color-scheme: dark)');
  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');

  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ---------------------------------------------------------------- language */

  var lang = store.get(KEY_LANG);
  if (lang !== 'ru' && lang !== 'en') lang = i18n.detect();

  function t(key) { return i18n.t(lang, key); }

  function applyLang(next, remember) {
    lang = (next === 'ru' || next === 'en') ? next : i18n.detect();
    if (remember) store.set(KEY_LANG, lang);

    root.lang = lang;
    document.title = t('doc.title');
    var desc = $('#metaDescription');
    if (desc) desc.setAttribute('content', t('meta.description'));

    $$('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });

    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length === 2) el.setAttribute(bits[0].trim(), t(bits[1].trim()));
      });
    });

    var sw = $('#langSwitch');
    if (sw) {
      sw.dataset.active = lang;
      $$('#langSwitch .seg__btn').forEach(function (b) {
        var on = b.dataset.lang === lang;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.setAttribute('aria-label', i18n.t(lang, 'a11y.' + b.dataset.lang));
      });
    }

    var respringBtn = $('#respringBtn');
    if (respringBtn) respringBtn.setAttribute('aria-label', t('a11y.respring'));

    labelThemeButton();
    describeInstall();
  }

  /* ------------------------------------------------------------------- theme */

  var themePref = store.get(KEY_THEME);
  if (['auto', 'light', 'dark'].indexOf(themePref) === -1) themePref = 'auto';

  function resolveTheme(pref) {
    if (pref === 'dark') return 'dark';
    if (pref === 'light') return 'light';
    return darkMq.matches ? 'dark' : 'light';
  }

  function applyTheme(pref, remember) {
    themePref = pref;
    if (remember) store.set(KEY_THEME, pref);
    var mode = resolveTheme(pref);
    root.dataset.theme = mode;
    root.dataset.themePref = pref;
    var meta = $('#themeColorMeta');
    if (meta) meta.setAttribute('content', THEME_COLOR[mode]);
    labelThemeButton();
  }

  function labelThemeButton() {
    var btn = $('#themeBtn');
    if (!btn) return;
    var label = t('a11y.theme.' + themePref);
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  }

  darkMq.addEventListener('change', function () {
    if (themePref === 'auto') applyTheme('auto', false);
  });

  /* --------------------------------------------------------------- the launch */

  var firing = false;

  function respring() {
    if (firing) return;
    firing = true;

    var btn = $('#respringBtn');
    var curtain = $('#curtain');
    if (btn) btn.classList.add('is-firing');
    if (navigator.vibrate) { try { navigator.vibrate([10, 40, 16]); } catch (e) { /* ignore */ } }

    if (curtain) {
      curtain.hidden = false;
      curtain.setAttribute('aria-hidden', 'false');
      // force a frame so the transition actually runs
      void curtain.offsetWidth;
      curtain.classList.add('is-on');
      setTimeout(function () { curtain.classList.add('is-slow'); }, 2200);
    }

    setTimeout(function () {
      window.location.href = TARGET;
    }, reduceMq.matches ? 260 : 1150);
  }

  function resetLaunch() {
    firing = false;
    var btn = $('#respringBtn');
    var curtain = $('#curtain');
    if (btn) btn.classList.remove('is-firing');
    if (curtain) {
      curtain.classList.remove('is-on', 'is-slow');
      curtain.setAttribute('aria-hidden', 'true');
      curtain.hidden = true;
    }
  }

  // Coming back from the Respring page (or from bfcache) must not leave the
  // dark curtain stuck on screen.
  window.addEventListener('pageshow', resetLaunch);

  /* ----------------------------------------------------------------- install */

  var deferredPrompt = null;

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      navigator.standalone === true;
  }

  function isIos() {
    var ua = navigator.userAgent || '';
    return /iphone|ipad|ipod/i.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function describeInstall() {
    var text = $('#installText');
    if (text) text.textContent = isStandalone() ? t('install.installed') : t('install.text');
  }

  function refreshInstallUi() {
    var panel = $('#installPanel');
    var btn = $('#installBtn');
    var ios = $('#installIos');
    if (!panel) return;

    if (isStandalone()) {
      panel.hidden = true;
      return;
    }
    if (deferredPrompt) {
      panel.hidden = false;
      if (btn) btn.hidden = false;
      if (ios) ios.hidden = true;
    } else if (isIos()) {
      panel.hidden = false;
      if (btn) btn.hidden = true;
      if (ios) ios.hidden = false;
    } else {
      panel.hidden = true;
    }
    describeInstall();
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    refreshInstallUi();
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    refreshInstallUi();
  });

  /* -------------------------------------------------------------------- wire */

  function wire() {
    $$('#langSwitch .seg__btn').forEach(function (btn) {
      btn.addEventListener('click', function () { applyLang(btn.dataset.lang, true); });
    });

    var themeBtn = $('#themeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var order = ['auto', 'light', 'dark'];
        applyTheme(order[(order.indexOf(themePref) + 1) % order.length], true);
      });
    }

    var btn = $('#respringBtn');
    if (btn) {
      btn.addEventListener('click', respring);
      // Specular highlight that follows the pointer on devices that have one.
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        btn.addEventListener('pointermove', function (e) {
          var r = btn.getBoundingClientRect();
          btn.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
          btn.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
        });
        btn.addEventListener('pointerleave', function () {
          btn.style.removeProperty('--mx');
          btn.style.removeProperty('--my');
        });
      }
    }

    var installBtn = $('#installBtn');
    if (installBtn) {
      installBtn.addEventListener('click', function () {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.finally(function () {
          deferredPrompt = null;
          refreshInstallUi();
        });
      });
    }

    var version = $('#appVersion');
    if (version) version.textContent = 'v' + VERSION;

    var curtainLink = $('#curtainFallback');
    if (curtainLink) curtainLink.setAttribute('href', TARGET);
  }

  /* ------------------------------------------------------------ service worker */

  var pendingReload = false;

  function offerUpdate(worker) {
    var toast = $('#updateToast');
    var btn = $('#updateBtn');
    if (!toast || !btn) return;
    toast.hidden = false;
    requestAnimationFrame(function () { toast.classList.add('is-on'); });
    btn.addEventListener('click', function () {
      pendingReload = true;
      worker.postMessage({ type: 'SKIP_WAITING' });
    }, { once: true });
  }

  function registerSw() {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('./sw.js').then(function (reg) {
      if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg.waiting);
      reg.addEventListener('updatefound', function () {
        var next = reg.installing;
        if (!next) return;
        next.addEventListener('statechange', function () {
          if (next.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(next);
        });
      });
    }).catch(function () { /* offline or unsupported — the app still works */ });

    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!pendingReload) return;
      pendingReload = false;
      window.location.reload();
    });
  }

  /* ------------------------------------------------------------------- start */

  applyTheme(themePref, false);
  applyLang(lang, false);
  wire();
  refreshInstallUi();

  window.addEventListener('load', function () {
    registerSw();
    document.body.classList.add('is-ready');

    // Launched from the manifest shortcut: go straight for the Respring.
    try {
      if (new URLSearchParams(window.location.search).get('action') === 'respring') {
        setTimeout(respring, 350);
      }
    } catch (e) { /* ignore */ }
  });
})();
