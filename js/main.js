// ---------------------------------------------------------------------------
// Contingut: edita aquestes llistes per canviar fotos i textos.
// Cada pas normal és { img, caption }.
//
// NOTA: la part 1 original (collage de 10 fotos) es manté aquí per si es vol
// reactivar algun dia, però ara queda oculta: l'experiència comença
// directament a la part 2 ("Feliços 29"). Vegeu la inicialització més avall.
// ---------------------------------------------------------------------------

const PART1_STEPS = [
  { img: "assets/collage/collage-01.png", caption: "Aquella nit que ho vam donar tot ✨" },
  { img: "assets/collage/collage-02.png", caption: "Les cares de sempre 💛" },
  { img: "assets/collage/collage-03.png", caption: "Brindant per nosaltres 🥂" },
  { img: "assets/collage/collage-04.png", caption: "Filtres i rialles sense parar" },
  { img: "assets/collage/collage-05.png", caption: "Els nostres petits rituals" },
  { img: "assets/collage/collage-06.png", caption: "Mai falta un moment boig" },
  { img: "assets/collage/collage-07.png", caption: "Morrets per a la càmera 😚" },
  { img: "assets/collage/collage-08.png", caption: "Un dia qualsevol, inoblidable" },
  { img: "assets/collage/collage-09.png", caption: "De viatge, com sempre" },
  { img: "assets/collage/collage-10.png", caption: "Des de fa anys, juntes" },
];

// Part 3, primer pas: els tres caps + ulleres de RV. La Mire (l'aniversari)
// va al centre.
const PART3_HEADS = {
  text: "I ara... prepara't per entrar en una realitat on tot és possible 🥽",
  heads: [
    { plain: "assets/heads/head-1.png", vr: "assets/heads/head-1-vr.png", position: "left" },
    { plain: "assets/heads/head-3.png", vr: "assets/heads/head-3-vr.png", position: "center" },
    { plain: "assets/heads/head-2.png", vr: "assets/heads/head-2-vr.png", position: "right" },
  ],
};

// Part 2: "Feliços 29" — cada toc apila una foto nova (una per any).
// BIRTHDAY_AGE taps en total. Hi ha exactament 29 fotos úniques a
// assets/pile/ (pile-01.png … pile-29.png), així que no cal repetir cap.
// Per canviar-ne alguna, substitueix el fitxer corresponent sense canviar
// el nom; per afegir-ne de noves caldria tornar a un array explícit.
const BIRTHDAY_AGE = 29;

const PART2_POOL = Array.from(
  { length: BIRTHDAY_AGE },
  (_, i) => `assets/pile/pile-${String(i + 1).padStart(2, "0")}.png`
);

// Segons que es veuen els caps sense ulleres abans que comenci la transició.
const HEADS_HOLD_S = 2.5;

// ---------------------------------------------------------------------------
// Motor de navegació entre pantalles
// ---------------------------------------------------------------------------

const screens = Array.from(document.querySelectorAll(".screen"));

function goToScreen(name) {
  screens.forEach((el) => el.classList.toggle("is-active", el.dataset.screen === name));
  window.scrollTo(0, 0);
}

// ---------------------------------------------------------------------------
// Motor reutilitzable de "toca per revelar"
// ---------------------------------------------------------------------------

function renderDots(dotsEl, total, currentIndex) {
  dotsEl.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    dot.className = "dot";
    if (i < currentIndex) dot.classList.add("is-done");
    if (i === currentIndex) dot.classList.add("is-current");
    dotsEl.appendChild(dot);
  }
}

function renderStep(stageEl, captionEl, step, tiltSeed) {
  stageEl.classList.remove("is-finale");
  stageEl.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "stage-step";
  wrap.style.setProperty("--tilt", `${tiltSeed}deg`);

  const img = document.createElement("img");
  img.className = "stage-photo";
  img.src = step.img;
  img.alt = step.caption || "";
  wrap.appendChild(img);

  stageEl.appendChild(wrap);

  captionEl.textContent = step.caption;
  captionEl.classList.remove("is-finale-caption");
}

function renderFinale(stageEl, captionEl, finale) {
  stageEl.classList.add("is-finale");
  stageEl.innerHTML = "";

  const heads = document.createElement("div");
  heads.className = "finale-heads";

  finale.heads.forEach((head, i) => {
    const slot = document.createElement("div");
    slot.className = `head-slot is-${head.position}`;
    if (head.position !== "center") slot.classList.add("is-side");

    const plain = document.createElement("img");
    plain.className = "head-img";
    plain.src = head.plain;
    plain.alt = "";
    slot.appendChild(plain);

    const vr = document.createElement("img");
    vr.className = "head-img is-vr";
    vr.src = head.vr;
    vr.alt = "";
    // Primer es veuen els tres caps sense ulleres una bona estona; després
    // les ulleres apareixen amb un fos suau, una darrere l'altra.
    vr.style.animationDelay = `${HEADS_HOLD_S + i * 0.5}s`;
    slot.appendChild(vr);

    heads.appendChild(slot);
  });

  stageEl.appendChild(heads);

  captionEl.textContent = finale.text;
  captionEl.classList.add("is-finale-caption");
}

/**
 * Crea una seqüència "toca per revelar" dins d'una pantalla.
 * steps: array de { img, caption }
 * finale: opcional, { img, text, glasses } mostrat com a últim pas especial
 * onFinished: callback quan s'acaben tots els passos (inclòs el finale)
 */
function createRevealSequence({ screenName, stageId, captionId, dotsId, steps, finale, onFinished }) {
  const screenEl = document.querySelector(`[data-screen="${screenName}"]`);
  const stageEl = document.getElementById(stageId);
  const captionEl = document.getElementById(captionId);
  const dotsEl = document.getElementById(dotsId);
  const totalDots = steps.length + (finale ? 1 : 0);

  let index = -1;
  let finished = false;

  function showCurrent() {
    renderDots(dotsEl, totalDots, index);
    if (index < steps.length) {
      const tiltSeed = index % 2 === 0 ? -3 - (index % 3) : 3 + (index % 3);
      renderStep(stageEl, captionEl, steps[index], tiltSeed);
    } else if (finale) {
      renderFinale(stageEl, captionEl, finale);
    }
  }

  function advance() {
    if (finished) return;
    if (index < totalDots - 1) {
      index += 1;
      showCurrent();
    } else {
      finished = true;
      if (onFinished) onFinished();
    }
  }

  screenEl.addEventListener("click", advance);
  return { start: advance };
}

function halton(index, base) {
  let result = 0;
  let f = 1 / base;
  let i = index;
  while (i > 0) {
    result += f * (i % base);
    i = Math.floor(i / base);
    f /= base;
  }
  return result;
}

/**
 * Crea la pila d'aniversari de la part 2: cada toc "estampa" una foto nova
 * sobre la pila (com una pila de polaroids) i avança un comptador fins a
 * `total`. No hi ha textos per foto, només el comptador.
 */
function createBirthdayPile({ screenName, stageId, counterId, hintId, pool, total, onFinished }) {
  const screenEl = document.querySelector(`[data-screen="${screenName}"]`);
  const stageEl = document.getElementById(stageId);
  const counterEl = document.getElementById(counterId);
  const hintEl = document.getElementById(hintId);

  let count = 0;
  let finished = false;

  function stampPhoto(i) {
    const img = document.createElement("img");
    img.className = "pile-photo";
    img.src = pool[i % pool.length];
    img.alt = "";

    // Repartits per tota la pantalla amb una seqüència de Halton (bases 2 i
    // 3): sembla aleatori però cobreix l'espai de manera uniforme, sense
    // amuntegar-se al centre. Determinista, així sempre es veu igual.
    const x = 14 + halton(i + 1, 2) * 72;
    const y = 27 + halton(i + 1, 3) * 54;
    const rot = ((i * 37) % 30) - 15;

    img.style.left = `${x}%`;
    img.style.top = `${y}%`;
    img.style.setProperty("--pr", `${rot}deg`);
    img.style.zIndex = String(i + 1);

    // Els stickers anteriors queden una mica enfosquits perquè el nou destaqui.
    stageEl.querySelectorAll(".pile-photo:not(.is-old)").forEach((el) => el.classList.add("is-old"));
    stageEl.appendChild(img);
  }

  function advance() {
    if (finished) return;
    count += 1;
    stampPhoto(count - 1);
    counterEl.textContent = String(count);
    counterEl.parentElement.classList.remove("bday-counter");
    void counterEl.parentElement.offsetWidth; // reinicia l'animació del pols
    counterEl.parentElement.classList.add("bday-counter");

    // Després del primer toc ja s'ha entès la mecànica: amaguem la pista.
    if (count === 1 && hintEl) hintEl.hidden = true;

    if (count >= total) {
      finished = true;
      // Al final la tornem a mostrar: ara cal saber que hi ha un pas més.
      if (hintEl) {
        hintEl.textContent = "Toca per continuar →";
        hintEl.hidden = false;
      }
      screenEl.addEventListener(
        "click",
        () => {
          if (onFinished) onFinished();
        },
        { once: true }
      );
    }
  }

  screenEl.addEventListener("click", () => {
    if (!finished) advance();
  });

  return { start: advance };
}

// ---------------------------------------------------------------------------
// Inicialització
// ---------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");

  // La part 1 (collage de 10 fotos) queda oculta del recorregut: l'experiència
  // comença directament a "Feliços 29". Es deixa `createRevealSequence` i
  // `PART1_STEPS` intactes per si es vol reactivar més endavant — simplement
  // caldria tornar a cridar `part1.start()` des del botó d'inici.

  const part2 = createBirthdayPile({
    screenName: "part2",
    stageId: "pile-stage",
    counterId: "pile-count",
    hintId: "part2-hint",
    pool: PART2_POOL,
    total: BIRTHDAY_AGE,
    onFinished: () => {
      // Es renderitzen els caps just en entrar a la pantalla perquè
      // l'animació comenci quan l'usuari la mira, no en carregar la pàgina.
      renderFinale(document.getElementById("part3-stage"), document.getElementById("part3-caption"), PART3_HEADS);
      goToScreen("part3");
    },
  });

  startBtn.addEventListener("click", () => {
    goToScreen("part2");
    part2.start();
  });

  // Part 3, pas 1: els tres caps amb les ulleres de RV. Es renderitza un sol
  // cop (no és una seqüència de passos) i el botó fa aparèixer el sobre.
  const part3Heads = document.getElementById("part3-heads");
  const part3Envelope = document.getElementById("part3-envelope");

  document.getElementById("part3-continue").addEventListener(
    "click",
    () => {
      part3Heads.hidden = true;
      part3Envelope.hidden = false;
    },
    { once: true }
  );

  // Part 3, pas 2: sobre que s'obre amb el regal
  const envelopeWrap = document.getElementById("envelope-wrap");
  const envelope = document.getElementById("envelope");
  const giftCard = document.getElementById("gift-card");

  envelopeWrap.addEventListener("click", () => {
    if (envelope.classList.contains("is-open")) return;
    envelope.classList.add("is-open");
    envelopeWrap.classList.add("is-open");
    // segell → solapa → carta que surt; la targeta arriba quan la carta ja és fora
    setTimeout(() => {
      giftCard.hidden = false;
      // baixa fins que la carta queda a dalt de tot, amb la targeta a sota
      const letter = envelope.querySelector(".envelope-letter");
      const top = letter.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, 1500);
  });
});
