# nebula-site

Site vitrine du projet [NEBULA Client](https://github.com/c2server-hub/nebula-client) — mod visuel premium pour Minecraft 1.21.11 (Fabric).

Site statique sans dépendance de build : HTML + CSS + JS. Les captures d'écran proviennent directement du dépôt du mod (`docs/screenshots/`).

## Aperçu local

```sh
python3 -m http.server 8000
```

Puis ouvrir <http://localhost:8000>.

## Structure

```
index.html            page unique (hero, modules, interface, galerie, installation, tech)
assets/css/style.css  design system (dark / verre / accent menthe)
assets/js/main.js     starfield canvas, reveal au scroll, switcher d'interface, lightbox
assets/img/           captures 1280×720 + icône du mod
```

## Crédits

- Captures et icône : projet NEBULA (CC0-1.0)
- Polices : Space Grotesk, Inter (SIL OFL), JetBrains Mono (SIL OFL)
