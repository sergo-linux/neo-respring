/**
 * NeoRespring — dictionaries.
 *
 * House rule: "Respring", "Web Respring" and "NeoRespring" are written exactly
 * like that in every language. They are names, not words to translate — do not
 * transliterate them into "респринг" in the Russian strings.
 */
(function (global) {
  'use strict';

  var DICT = {
    ru: {
      'doc.title': 'NeoRespring — Respring в одно нажатие',
      'meta.description': 'NeoRespring — приложение с одной кнопкой, которое запускает Web Respring на вашем устройстве.',

      'hero.eyebrow': 'Web Respring · PWA',
      'hero.title': 'Respring в одно нажатие',
      'hero.lede': 'NeoRespring — лёгкое приложение с одной кнопкой. Нажмите её, и откроется страница Web Respring, которая сделает всё остальное.',
      'hero.hint': 'Нажмите, чтобы выполнить Web Respring',
      'hero.opens': 'Откроется',

      'what.title': 'Что это такое?',
      'what.p1': 'Respring — это перезапуск графической оболочки устройства. Экран гаснет на пару секунд, интерфейс поднимается заново, и всё это быстрее полной перезагрузки: перезапускается только оболочка, а не вся система.',
      'what.p2': 'Web Respring делает то же самое прямо из браузера: не нужно ставить твики или отдельные приложения. Всю работу берёт на себя страница, которую сделал neonmodder123.',
      'what.p3': 'NeoRespring — удобная обёртка над ней: ставится на домашний экран как обычное приложение, открывается офлайн и запускает Respring одной большой кнопкой. Сам Respring выполняет страница neonmodder123 — вся заслуга принадлежит ему.',
      'what.note': 'Respring срабатывает на устройствах, которые поддерживает страница Web Respring. На остальных она просто откроется, и ничего не сломается. NeoRespring — неофициальный клиент и не связан с Apple.',

      'cards.one.t': 'Одна кнопка',
      'cards.one.d': 'Ни меню, ни настроек. Открыл, нажал, Respring.',
      'cards.two.t': 'Ставится как приложение',
      'cards.two.d': 'Настоящее PWA: иконка на домашнем экране, запуск на весь экран и офлайн-кэш.',
      'cards.three.t': 'Ваш язык и ваша тема',
      'cards.three.d': 'Русский или английский, светлая или тёмная — берутся из настроек устройства и переключаются вручную.',

      'thanks.title': 'Спасибо, neonmodder123',
      'thanks.text': 'Web Respring — его работа. NeoRespring лишь добавляет к ней красивую кнопку.',
      'thanks.link': 'Открыть оригинальную страницу',

      'install.title': 'Поставьте на домашний экран',
      'install.text': 'После установки NeoRespring открывается на весь экран и работает без интернета.',
      'install.installed': 'Приложение установлено — вы открыли его с домашнего экрана.',
      'install.action': 'Установить',
      'install.ios': 'Поделиться → «На экран „Домой“»',

      'curtain.text': 'Выполняем Respring…',
      'curtain.fallback': 'Ничего не произошло? Открыть вручную',

      'update.text': 'Готова новая версия',
      'update.action': 'Обновить',

      'foot.thanks': 'Спасибо',
      'foot.for': 'за Web Respring',
      'foot.unofficial': 'Неофициальный клиент',

      'a11y.lang': 'Язык интерфейса',
      'a11y.ru': 'Русский',
      'a11y.en': 'Английский',
      'a11y.theme.auto': 'Тема: как на устройстве',
      'a11y.theme.light': 'Тема: светлая',
      'a11y.theme.dark': 'Тема: тёмная',
      'a11y.respring': 'Выполнить Respring'
    },

    en: {
      'doc.title': 'NeoRespring — Respring in a single tap',
      'meta.description': 'NeoRespring — a one-button app that runs a Web Respring on your device.',

      'hero.eyebrow': 'Web Respring · PWA',
      'hero.title': 'Respring in a single tap',
      'hero.lede': 'NeoRespring is a featherweight one-button app. Press the button and the Web Respring page opens and does the rest.',
      'hero.hint': 'Press to run a Web Respring',
      'hero.opens': 'Opens',

      'what.title': 'What is this?',
      'what.p1': 'A Respring restarts the device’s interface shell. The screen goes dark for a couple of seconds and the interface comes back up — faster than a full reboot, because only the shell restarts, not the whole system.',
      'what.p2': 'A Web Respring does the same thing straight from the browser: no tweaks, no extra apps to install. All the work is done by the page neonmodder123 built.',
      'what.p3': 'NeoRespring is a comfortable shell around that page: it installs to your home screen like a normal app, opens offline, and fires the Respring from one big button. The Respring itself is performed by neonmodder123’s page — all the credit belongs there.',
      'what.note': 'The Respring fires on the devices the Web Respring page supports. Everywhere else the page simply opens and nothing breaks. NeoRespring is an unofficial client and is not affiliated with Apple.',

      'cards.one.t': 'One button',
      'cards.one.d': 'No menus, no settings. Open it, press it, Respring.',
      'cards.two.t': 'Installs like an app',
      'cards.two.d': 'A real PWA: home screen icon, full-screen launch and an offline cache.',
      'cards.three.t': 'Your language, your theme',
      'cards.three.d': 'Russian or English, light or dark — taken from your device settings and switchable by hand.',

      'thanks.title': 'Thanks, neonmodder123',
      'thanks.text': 'Web Respring is his work. NeoRespring only puts a nice button on top of it.',
      'thanks.link': 'Open the original page',

      'install.title': 'Put it on your home screen',
      'install.text': 'Once installed, NeoRespring opens full screen and works with no connection.',
      'install.installed': 'Installed — you are running it from the home screen.',
      'install.action': 'Install',
      'install.ios': 'Share → Add to Home Screen',

      'curtain.text': 'Respringing…',
      'curtain.fallback': 'Nothing happened? Open it manually',

      'update.text': 'A new version is ready',
      'update.action': 'Refresh',

      'foot.thanks': 'Thanks to',
      'foot.for': 'for Web Respring',
      'foot.unofficial': 'Unofficial client',

      'a11y.lang': 'Interface language',
      'a11y.ru': 'Russian',
      'a11y.en': 'English',
      'a11y.theme.auto': 'Theme: match device',
      'a11y.theme.light': 'Theme: light',
      'a11y.theme.dark': 'Theme: dark',
      'a11y.respring': 'Run a Respring'
    }
  };

  global.NeoI18n = {
    langs: ['ru', 'en'],
    dict: DICT,
    /** Detect from the device, falling back to English. */
    detect: function () {
      var list = (navigator.languages && navigator.languages.length)
        ? navigator.languages
        : [navigator.language || 'en'];
      for (var i = 0; i < list.length; i++) {
        if (/^ru\b/i.test(list[i])) return 'ru';
      }
      return 'en';
    },
    t: function (lang, key) {
      var table = DICT[lang] || DICT.en;
      return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : (DICT.en[key] || key);
    }
  };
})(window);
