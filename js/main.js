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
// BIRTHDAY_AGE taps en total; les fotos del pool es van repetint en bucle
// si n'hi ha menys que anys, variant sempre la posició/gir de cada tanda.
const BIRTHDAY_AGE = 29;

const PART2_POOL = [
  "assets/collage/collage-11.png",
  "assets/collage/collage-12.png",
  "assets/collage/collage-13.png",
  "assets/collage/collage-14.png",
  "assets/collage/collage-15.png",
  "assets/collage/collage-01.png",
  "assets/collage/collage-02.png",
  "assets/collage/collage-03.png",
  "assets/collage/collage-04.png",
  "assets/collage/collage-05.png",
  "assets/collage/collage-06.png",
  "assets/collage/collage-07.png",
  "assets/collage/collage-08.png",
  "assets/collage/collage-09.png",
  "assets/collage/collage-10.png",
];

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
    vr.style.animationDelay = `${0.25 + i * 0.15}s`;
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

    // Dispersió pseudo-aleatòria però determinista, perquè cada tanda
    // de voltes pel pool es vegi diferent de l'anterior.
    const angle = (i * 47) % 360;
    const radius = 10 + ((i * 29) % 18);
    const px = Math.round(Math.cos((angle * Math.PI) / 180) * radius);
    const py = Math.round(Math.sin((angle * Math.PI) / 180) * radius);
    const rot = ((i * 37) % 50) - 25;

    img.style.setProperty("--px", `${px}%`);
    img.style.setProperty("--py", `${py}%`);
    img.style.setProperty("--pr", `${rot}deg`);
    img.style.zIndex = String(i + 1);

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

    if (count === 1 && hintEl) hintEl.textContent = "Toca per continuar →";

    if (count >= total) {
      finished = true;
      if (hintEl) hintEl.textContent = "Toca per obrir el regal →";
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
      goToScreen("part3");
    },
  });

  startBtn.addEventListener("click", () => {
    goToScreen("part2");
    part2.start();
  });

  // Part 3, pas 1: els tres caps amb les ulleres de RV. Es renderitza un sol
  // cop (no és una seqüència de passos) i un toc fa aparèixer el sobre.
  const part3Heads = document.getElementById("part3-heads");
  const part3Envelope = document.getElementById("part3-envelope");
  renderFinale(document.getElementById("part3-stage"), document.getElementById("part3-caption"), PART3_HEADS);

  part3Heads.addEventListener(
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
    setTimeout(() => {
      giftCard.hidden = false;
    }, 350);
  });
});
