# Per a tu 💜

Pàgina sorpresa (només mòbil/tablet) amb un collage de fotos "toca per revelar" i la
revelació final d'un regal.

## Veure-la en local

No cal instal·lar res, és HTML/CSS/JS pur. Des d'aquesta carpeta:

```bash
python3 -m http.server 8000
```

I obre `http://localhost:8000` al mòbil o al navegador (redueix la finestra a mida mòbil).

## Com editar el contingut

- **Part 1**: `js/main.js` → array `PART1_STEPS` (foto + text de cada toc) i `PART1_FINALE`
  (la foto final amb les ulleres de RV superposades).
- **Part 2**: `js/main.js` → array `PART2_STEPS`, encara pendent de definir. Afegeix objectes
  `{ img: "assets/collage/...", caption: "..." }` amb el mateix format que la part 1.
- **Fotos**: es guarden a `assets/collage/`. Actualment hi ha 11 fotos retallades
  (`collage-01.png` … `collage-10.png` + `collage-finale.png`). Per afegir-ne de noves,
  exporta-les retallades (fons transparent) des de Figma/el mòbil i posa-les en aquesta carpeta.
- **Regal (Part 3)**: text i enllaç directament a `index.html`, secció `data-screen="part3"`.
