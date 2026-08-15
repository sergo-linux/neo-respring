# NeoRespring

Красивое PWA с одной кнопкой **Respring**. Нажатие открывает страницу
[Web Respring](https://neonmodder123.github.io/respring), которую сделал
**neonmodder123** — она и выполняет сам Respring.

A beautiful one-button **Respring** PWA. Pressing the button opens
[neonmodder123's Web Respring page](https://neonmodder123.github.io/respring),
which performs the actual Respring.

> Спасибо neonmodder123 · Thanks to neonmodder123 ♥

---

## Что внутри / What's inside

- **Одна большая кнопка** — Respring запускается в одно нажатие, с анимацией
  перехода (затемнение экрана, логотип, прогресс) перед открытием страницы.
- **Два языка** — русский и английский. Язык берётся из настроек устройства
  (`navigator.languages`) и переключается вручную; выбор запоминается.
- **Тема по устройству** — светлая или тёмная по `prefers-color-scheme`,
  плюс ручной цикл «как на устройстве → светлая → тёмная».
- **Полноценное PWA** — манифест, service worker, офлайн-кэш, установка на
  домашний экран, ярлык «Respring», подсказка для iOS (Поделиться → На экран
  «Домой»), уведомление об обновлении.
- **Акцент — сине-фиолетовый** во всём интерфейсе и в иконке.
- **Логотип на всю иконку** — градиент заполняет весь квадрат, знак крупный по
  центру, никаких маленьких лого в углу пустой плитки.

`Respring`, `Web Respring` и `NeoRespring` пишутся так в любом языке — это
имена, а не переводимые слова.

## Структура / Layout

```
index.html                  разметка и мета-теги PWA
manifest.webmanifest        манифест приложения
sw.js                       service worker: офлайн-кэш оболочки
assets/css/styles.css       токены темы и всё оформление
assets/js/i18n.js           словари RU / EN
assets/js/app.js            язык, тема, запуск Respring, установка, SW
assets/icons/               иконки (192/512, maskable, apple-touch, favicon, OG)
assets/icons/logo.svg       тот же знак в SVG
tools/generate_icons.py     генератор растровых иконок (Pillow)
```

## Запуск локально / Run locally

Service worker требует `http://localhost` или HTTPS, поэтому просто откройте
через любой статический сервер:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Публикация / Deploy

Все пути относительные, поэтому сайт работает и в корне домена, и в подпапке.
Для GitHub Pages включите Pages для ветки с этими файлами — приложение будет
доступно по адресу `https://<user>.github.io/<repo>/`.

## Иконки / Icons

Геометрия знака описана один раз и используется и в SVG, и в PNG. После
изменения `tools/generate_icons.py` перегенерируйте набор:

```bash
pip install pillow
python3 tools/generate_icons.py
```

Для подписи на OG-картинке можно указать шрифт:
`NEORESPRING_FONT_BOLD=/path/Bold.ttf NEORESPRING_FONT=/path/Regular.ttf`.
Без шрифта карточка соберётся без текста.

## Оговорка / Disclaimer

Respring срабатывает на устройствах, которые поддерживает страница Web
Respring; на остальных она просто откроется. NeoRespring — неофициальный
клиент, не связан с Apple, и не выполняет Respring самостоятельно.
