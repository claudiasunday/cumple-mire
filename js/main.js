// ---------------------------------------------------------------------------
// Contingut: edita aquestes llistes per canviar fotos i textos.
// Cada pas normal és { img, caption }. L'últim pas de la part 1 és el
// "finale": les tres amigues + ulleres de RV superposades.
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

const PART1_FINALE = {
  img: "assets/collage/collage-finale.png",
  text: "I ara... prepara't per entrar en una realitat on tot és possible 🥽",
  glasses: [
    { left: "31%", top: "32%", width: "30%", tilt: "-6deg" },
    { left: "52%", top: "37%", width: "30%", tilt: "3deg" },
    { left: "71%", top: "40%", width: "30%", tilt: "8deg" },
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
  stageEl.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "stage-step is-finale";
  wrap.style.setProperty("--tilt", "0deg");

  const img = document.createElement("img");
  img.className = "stage-photo";
  img.src = finale.img;
  img.alt = "";
  wrap.appendChild(img);

  finale.glasses.forEach((g, i) => {
    const glasses = document.createElement("img");
    glasses.className = "vr-glasses";
    glasses.src = "assets/graphics/vr-glasses.svg";
    glasses.alt = "";
    glasses.style.left = g.left;
    glasses.style.top = g.top;
    glasses.style.width = g.width;
    glasses.style.setProperty("--g-tilt", g.tilt);
    glasses.style.animationDelay = `${0.15 + i * 0.12}s`;
    wrap.appendChild(glasses);
  });

  stageEl.appendChild(wrap);

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

  const part1 = createRevealSequence({
    screenName: "part1",
    stageId: "part1-stage",
    captionId: "part1-caption",
    dotsId: "part1-dots",
    steps: PART1_STEPS,
    finale: PART1_FINALE,
    onFinished: () => {
      goToScreen("part2");
    },
  });

  createBirthdayPile({
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
    goToScreen("part1");
    part1.start();
  });

  // Part 3: sobre que s'obre amb el regal
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
