# 🃏 TankBuster - No More Tanking

A Poker Shot Clock - Free - Running inside your browser.
100% privacy-friendly. Multilanguage. WebApp.

![GitHub Tag](https://img.shields.io/github/v/tag/divinerites/tankbuster)
![License](https://img.shields.io/github/license/divinerites/tankbuster)
![Last commit](https://img.shields.io/github/last-commit/divinerites/tankbuster)

Please, consider **leaving a star on Github if you like it**. ![Github Stars](https://img.shields.io/github/stars/divinerites/tankbuster?style=social)

[![Star History Chart](https://api.star-history.com/svg?repos=divinerites/tankbuster&type=Date)](https://star-history.com/#divinerites/tankbuster&Date)

## Fonctionnalités

- ⏱ Shot clock configurable : 15 / 30 / 45 / 60 / 90 secondes
- ⚡ Time Bank par joueur (0 / 15 / 30 / 60s)
- 🎨 Couleurs progressives : vert → jaune → orange → rouge pulsant
- 🔊 Alertes sonores Web Audio API (bips à 10s, 5s, timeout)
- 📳 Vibration haptique (mobile)
- 💾 Persistance des préférences via `localStorage`
- 🌐 Bunny Fonts are now LOCAL.
- Affichage des time bank utilisé dans une main
- WebApp installable sur l'écran d'accueil
- Works on Tablet, Computer and small phone screens.
- Multi language : Français, English, Deutsch, Italiano, Русский, 语言, Nederlands, Čeština, Español, Português

## Screenshots

<p align="center">
  <img src="./screenshots/StartingScreen-3.png" alt="Poker Shot Clock home screen" width="260">
  <img src="./screenshots/Running clock-3.png" alt="Poker Shot Clock settings screen" width="260">
  <img src="./screenshots/RunningClock-warning-3.png" alt="Poker Shot Clock time bank screen" width="260">
</p>

## Languages

<p align="center">
  <img src="./screenshots/mpsc-fr.png" alt="Poker Shot Clock home screen" width="260">
  <img src="./screenshots/mpsc-en.png" alt="Poker Shot Clock home screen" width="260">
  <img src="./screenshots/mpsc-nl.png" alt="Poker Shot Clock home screen" width="260">
  <img src="./screenshots/mpsc-cs.png" alt="Poker Shot Clock home screen" width="260">
  <img src="./screenshots/mpsc-it.png" alt="Poker Shot Clock home screen" width="260">
  <img src="./screenshots/mpsc-nl.png" alt="Poker Shot Clock home screen" width="260">
  <img src="./screenshots/mpsc-ru.png" alt="Poker Shot Clock home screen" width="260">
  <img src="./screenshots/mpsc-zh.png" alt="Poker Shot Clock home screen" width="260">
</p>

## Structure

```txt
tankbuster/
├──
   ├── fonts              ← Local fonts
   ├── screenshots        ← Screenshot exemples
   ├── locales.           ← translations
├── index.html            ← Structure HTML
├── style.css             ← Styles (dark theme, animations, responsive)
├── app.js                ← Logique JavaScript (timer, audio, localStorage)
├── sw.js.                ← Service Worker
├── shot_clock_logo.png   ← Logo
├── favicon.ico           ← Favicons
├── favicon-16.png        ←    "
├── favicon-32.png        ←    "
├── favicon-64.png        ←    "
├── manifest.webmanifest  ← PWA configuration
├── netlify.toml          ← En-têtes de sécurité HTTP
├── _redirects            ← Redirect for Plausible on Netlify
└── README.md
```

## Application

- Sources Github : https://github.com/divinerites/tankbuster
- Application : https://tankbuster.netlify.app/

## WebApp

- Sur Chrome/Android, tu verras “Ajouter à l’écran d’accueil” avec un comportement d’app fullscreen.
- Sur iOS Safari, tu peux faire “Ajouter à l’écran d’accueil”

## Déploiement Netlify

1. Glisser le dossier sur [app.netlify.com](https://app.netlify.com/drop)
2. ✅ HTTPS automatique + headers sécurité via `netlify.toml`

## Usage local

Ouvrir `index.html` directement dans un navigateur.
> ⚠️ Certains navigateurs bloquent `localStorage` en `file://` — héberger sur Netlify pour la persistance.

## Licence

Ce projet est distribué sous licence [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.html).

> © 2026 by Divinerites
