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
- **Part 2** ("Feliços 29"): `js/main.js` → `BIRTHDAY_AGE` (nombre de tocs/anys) i array
  `PART2_POOL` (llista de fotos que es van apilant; si n'hi ha menys que `BIRTHDAY_AGE`, es
  repeteixen en bucle variant sempre la posició). El títol i subtítol són a `index.html`,
  secció `data-screen="part2"` (`.bday-title` / `.bday-subtitle`).
- **Fotos**: es guarden a `assets/collage/`. Actualment hi ha 16 fotos retallades
  (`collage-01.png` … `collage-15.png` + `collage-finale.png`). Per afegir-ne de noves,
  exporta-les retallades (fons transparent) des de Figma/el mòbil i posa-les en aquesta carpeta.
- **Regal (Part 3)**: text i enllaç directament a `index.html`, secció `data-screen="part3"`.
