# 🃏 My Poker Shot Clock

> © 2026 by Divinerites — [GPL Licence](https://www.gnu.org/licenses/gpl-3.0.html)

Application web de shot clock poker, autonome, sans backend, 100% privacy-friendly.

## Structure

```
my-poker-shot-clock/
├── index.html            ← Structure HTML
├── style.css             ← Styles (dark theme, animations, responsive)
├── app.js                ← Logique JavaScript (timer, audio, localStorage)
├── shot_clock_logo.png   ← Logo
├── netlify.toml          ← En-têtes de sécurité HTTP
└── README.md
```

## Fonctionnalités

- ⏱ Shot clock configurable : 15 / 30 / 45 / 60 / 90 secondes
- ⚡ Time Bank par joueur (0 / 15 / 30 / 60s)
- 🎨 Couleurs progressives : vert → jaune → orange → rouge pulsant
- 🔊 Alertes sonores Web Audio API (bips à 10s, 5s, timeout)
- 📳 Vibration haptique (mobile)
- 📊 Statistiques de session (joueurs, timeouts, moyenne)
- 💾 Persistance des préférences via `localStorage`
- 🌐 Bunny Fonts (RGPD, EU, zéro tracking Google)

## Déploiement Netlify

1. Glisser le dossier sur [app.netlify.com](https://app.netlify.com/drop)
2. ✅ HTTPS automatique + headers sécurité via `netlify.toml`

## Usage local

Ouvrir `index.html` directement dans un navigateur.
> ⚠️ Certains navigateurs bloquent `localStorage` en `file://` — héberger sur Netlify pour la persistance.

## Licence

Ce projet est distribué sous licence [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.html).
