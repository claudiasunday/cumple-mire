# Per a tu 🧡

Pàgina sorpresa (només mòbil/tablet): comença amb la pila d'aniversari "Feliços 29" i
acaba amb la revelació d'un regal.

## Veure-la en local

No cal instal·lar res, és HTML/CSS/JS pur. Des d'aquesta carpeta:

```bash
python3 -m http.server 8000
```

I obre `http://localhost:8000` al mòbil o al navegador (redueix la finestra a mida mòbil).

## Recorregut actual

1. **Intro** → tap "Comença".
2. **"Feliços 29"**: cada toc apila una foto nova fins a 29. Fons: `assets/graphics/beach-collage.jpg`.
3. **Part 3, pas 1**: els tres caps (Mire al centre) amb les ulleres de RV composades.
4. **Part 3, pas 2**: el sobre ("El teu regal més virtual t'espera") i, en obrir-lo, la
   targeta amb la info del regal.

La part 1 original (collage de 10 fotos, tap-to-reveal) es manté al codi (`PART1_STEPS`,
`createRevealSequence` a `js/main.js`) per si es vol reactivar, però ara queda oculta: el
botó "Comença" salta directament a la part 2.

## Com editar el contingut

- **"Feliços 29"**: `js/main.js` → `BIRTHDAY_AGE` (nombre de tocs/anys) i array
  `PART2_POOL` (fotos que es van apilant; si n'hi ha menys que `BIRTHDAY_AGE` es repeteixen
  en bucle variant la posició). Títol/subtítol a `index.html`, secció `data-screen="part2"`.
- **Caps + ulleres (part 3)**: `js/main.js` → `PART3_HEADS` (ordre dels caps i text).
- **Fotos**: `assets/collage/` (16 fotos retallades) i `assets/heads/` (els 3 caps, amb i
  sense ulleres de RV).
- **Regal**: text directament a `index.html`, secció `data-screen="part3"` →
  `#part3-envelope` / `.gift-card`.
- **Tipografia**: Fredoka (titulars) + Poppins (text), carregades a `index.html`.
