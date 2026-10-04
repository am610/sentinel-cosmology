// SENTINEL: Dual-Mode Presentation & Cinematic A/V Experience Engine
const scenes = [...document.querySelectorAll('.scene')];
const navPill = document.getElementById('navPill');
const slideCounter = document.getElementById('slideCounter');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const notesDrawer = document.getElementById('notesDrawer');
const notesContent = document.getElementById('notesContent');
const notesObjective = document.getElementById('notesObjective');
const notesDefense = document.getElementById('notesDefense');
const copyScriptBtn = document.getElementById('copyScriptBtn');
const closeNotesBtn = document.getElementById('closeNotesBtn');
const notesToggle = document.getElementById('notesToggle');
const deckFooter = document.getElementById('deckFooter');
const audioToggle = document.getElementById('audioToggle');
const cinemaTourToggle = document.getElementById('cinemaTourToggle');

const cinemaHUD = document.getElementById('cinemaHUD');
const cinemaProgressBar = document.getElementById('cinemaProgressBar');
const cinemaTag = document.getElementById('cinemaTag');
const cinemaText = document.getElementById('cinemaText');
const cinemaPauseBtn = document.getElementById('cinemaPauseBtn');
const cinemaNextBtn = document.getElementById('cinemaNextBtn');
const cinemaExitBtn = document.getElementById('cinemaExitBtn');

let currentSlide = 0;
let isLabMode = false;
let isTourPlaying = false;
let isTourPaused = false;
let tourProgressInterval = null;
let tourElapsedMs = 0;
const SLIDE_DURATION_MS = 11000;

/* ============================================================
   PILLAR 1: GENERATIVE WEB AUDIO ENGINE
   ============================================================ */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.droneOsc = null;
    this.droneGain = null;
    this.enabled = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Ambient Space Drone (Subtle 55Hz Low Drone with harmonics)
      this.droneOsc = this.ctx.createOscillator();
      this.droneOsc.type = 'sawtooth';
      this.droneOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, this.ctx.currentTime);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.035, this.ctx.currentTime);

      this.droneOsc.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);
      this.droneOsc.start();
      this.enabled = true;
    } catch (e) {
      console.log('Web Audio not supported or blocked');
    }
  }

  toggle() {
    if (!this.ctx) {
      this.init();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
      this.enabled = true;
    } else if (this.ctx.state === 'running') {
      this.ctx.suspend();
      this.enabled = false;
    }
    return this.enabled;
  }

  playBlip(freq = 580, dur = 0.08) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, this.ctx.currentTime + dur);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + dur);
    } catch (e) {}
  }

  playImpact() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, this.ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch (e) {}
  }
}

const sound = new SoundEngine();

audioToggle.onclick = () => {
  const active = sound.toggle();
  audioToggle.classList.toggle('active', active);
  audioToggle.textContent = active ? '🎧 Ambient Synth: On' : '🎧 Ambient Synth: Off';
  if (active) sound.playBlip(700);
};

/* ============================================================
   PILLAR 2: PARALLAX COSMIC STARFIELD CANVAS
   ============================================================ */
const canvas = document.getElementById('cosmicCanvas');
const ctx = canvas.getContext('2d');
let stars = [];
let mouseX = 0, mouseY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = [];
  const numStars = Math.floor((canvas.width * canvas.height) / 8000);
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      twinkle: Math.random() * 0.02 + 0.005,
      depth: Math.random() * 0.8 + 0.2
    });
  }
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', e => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.03;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.03;
});
resizeCanvas();

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.alpha += Math.sin(Date.now() * s.twinkle) * 0.01;
    s.alpha = Math.max(0.15, Math.min(0.95, s.alpha));
    
    const posX = (s.x + mouseX * s.depth + canvas.width) % canvas.width;
    const posY = (s.y + mouseY * s.depth + canvas.height) % canvas.height;

    ctx.beginPath();
    ctx.arc(posX, posY, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180, 220, 255, ${s.alpha})`;
    ctx.shadowBlur = s.radius > 1.2 ? 6 : 0;
    ctx.shadowColor = '#00f2fe';
    ctx.fill();
  });
  requestAnimationFrame(animateStars);
}
requestAnimationFrame(animateStars);

/* ============================================================
   MODE SWITCHING (Deck vs. Lab)
   ============================================================ */
const modeDeckBtn = document.getElementById('modeDeck');
const modeLabBtn = document.getElementById('modeLab');

function switchMode(lab) {
  isLabMode = lab;
  document.body.classList.toggle('mode-lab', isLabMode);
  modeDeckBtn.classList.toggle('active', !isLabMode);
  modeLabBtn.classList.toggle('active', isLabMode);
  modeLabBtn.classList.toggle('amber-mode', isLabMode);
  sound.playBlip(550);

  if (isTourPlaying) stopTour();

  if (isLabMode) {
    deckFooter.style.display = 'none';
    navPill.style.display = 'none';
    notesDrawer.style.display = 'none';
    renderLabSimulation();
    renderFailureHeatmap();
  } else {
    deckFooter.style.display = 'flex';
    navPill.style.display = 'flex';
    if (document.body.classList.contains('show-notes')) {
      notesDrawer.style.display = 'block';
    }
  }
}

modeDeckBtn.onclick = () => switchMode(false);
modeLabBtn.onclick = () => switchMode(true);

// Structured Data for each slide (Talk Track, Objective, Skeptic Defense, Cinema Subtitles)
const slideData = [
  {
    /* 0 */
    talk: "What if an AI team produces an elegant cosmological fit that claims discovery of dynamic dark energy? The residuals look pristine. But what tells us it hasn't simply absorbed a 0.03 mag host dust drift into the cosmological parameter? Before we let AI accelerate cosmology, we need an adversarial evaluation environment.",
    objective: "Establish the core scientific dilemma: precision science is uniquely vulnerable to self-consistent false discoveries that pass all standard metrics.",
    defense: "Standard optimizers and MCMC will eagerly absorb unmodeled physical shifts into cosmological parameters unless explicit prior margins or blinded red-teaming are enforced.",
    beats: [
      "What if an AI discovery of <span class='hl-cyan'>dynamic dark energy (w₀ ≠ -1)</span> passes every standard likelihood test?",
      "In reality, it merely absorbed an unmodeled <span class='hl-coral'>0.03 mag dust drift</span> into the cosmological parameters.",
      "Before autonomous AI runs precision cosmology, we must test: <span class='hl-amber'>What if the wrong universe passes every test?</span>"
    ]
  },
  {
    /* 1 */
    talk: "This is the Chameleon Systematic. When a physical perturbation projects in the exact same direction as the cosmological sensitivity, maximum-likelihood fitting absorbs it into the parameter. The residuals remain flat (χ²/dof = 1.02). No optimizer can detect what is mathematically degenerate without external priors.",
    objective: "Demonstrate mathematically and visually why degenerate systematics cannot be detected by standard residuals alone.",
    defense: "This is not poor coding—it is an intrinsic mathematical degeneracy (∂μ/∂w) between astrophysics and cosmology.",
    beats: [
      "The <span class='hl-amber'>Chameleon Systematic</span>: when host dust extinction mimics the exact geometric curvature of dark energy.",
      "As drift increases, the optimizer absorbs it into <span class='hl-coral'>w₀ = -0.84</span> while residuals remain flat (χ²/dof = 1.02).",
      "<span class='hl-cyan'>Degeneracy in plain sight</span>: No standard optimizer can catch a mathematically identical distortion without external priors."
    ]
  },
  {
    /* 2 */
    talk: "Here is our core technical architecture: a cryptographically sealed Evaluator Vault separated from the Analyst Sandbox by an air-gap firewall. SNANA simulation seeds, injection amplitudes, and true parameters never touch the LLM context window. Everything is unsealed only after frozen submission.",
    objective: "Show institutional engineering rigor: preventing prompt leaks, data contamination, and reward hacking through an air-gapped architecture.",
    defense: "LLMs cannot cheat or memorize the ground truth because evaluator seeds and injection amplitudes are air-gapped from the analyst agent.",
    beats: [
      "SENTINEL introduces an <span class='hl-emerald'>Air-Gapped Adversarial Architecture</span> separating Red Evaluator from Blue Analyst.",
      "The <span class='hl-coral'>Evaluator Vault</span> holds simulation seeds and truth; the <span class='hl-cyan'>Analyst Sandbox</span> only receives masked catalogs.",
      "Ground truth is cryptographically sealed until frozen inference submission: <span class='hl-amber'>Zero prompt leaks. Zero reward hacking.</span>"
    ]
  },
  {
    /* 3 */
    talk: "We enforce strict ablations. We do not assume that an agent swarm is smarter than a simple χ² test. Tier 1 is our baseline LightGBM scorecard. Tier 4 tests agent teams against the Persuasive Consensus Trap. Every layer must prove its value per dollar of compute.",
    objective: "Establish scientific humility and rigorous ablation: measuring cost-per-discovery rather than assuming LLM superiority.",
    defense: "We actively test for the 'Persuasive Consensus Trap,' where multi-agent teams hallucinate mutual agreement on a false signal.",
    beats: [
      "We enforce <span class='hl-cyan'>strict tier ablations</span>: never assume an expensive multi-agent swarm beats a simple statistician.",
      "From <span class='hl-emerald'>Tier 1 (LightGBM baseline)</span> to <span class='hl-coral'>Tier 4 (Multi-Agent Swarm)</span>, every layer must earn its compute budget.",
      "Crucial test: detecting the <span class='hl-amber'>Persuasive Consensus Trap</span>, where collaborating agents reinforce false discoveries."
    ]
  },
  {
    /* 4 */
    talk: "Here is our pragmatic roadmap. Weeks 1 to 4 reproduce the baseline. Weeks 5 to 12 is the blinded pilot: 1 injection family and 1 cosmological parameter, resulting in the first benchmark paper.",
    objective: "Offer an immediate, de-risked entry point: a concrete 12 week blinded pilot resulting in a paper.",
    defense: "Even a negative result (proving where AI fails) is an immediate high-impact publication in precision astrophysics.",
    beats: [
      "A pragmatic <span class='hl-cyan'>12 Week Pilot</span>: low risk, high rigor, immediate paper deliverable.",
      "Weeks 1–4: Baseline reproduction. <span class='hl-amber'>Weeks 5–12: Blinded pilot</span> on 1 systematic injection family & w₀.",
      "Result: The first <span class='hl-emerald'>adversarial benchmark paper</span>, establishing empirical grounds for NSF funding."
    ]
  },
  {
    /* 5 */
    talk: "Why multi-probe matters: when two independent telescopes agree, cosmologists celebrate concordance. But if both probes share an unmodeled calibration or galactic extinction error, they agree for the wrong reason. Automated cross-probe tension diagnosis is a major open challenge.",
    objective: "Demonstrate that starting with Type Ia supernovae is a stepping stone to the full Rubin LSST multi-probe horizon.",
    defense: "Supernovae provide cheap, fast SNANA ground truth; once proven, the methodology scales directly to Weak Lensing and BAO.",
    beats: [
      "Supernovae are the proving ground; <span class='hl-cyan'>Rubin LSST Multi-Probe</span> is the ultimate destination.",
      "When two probes agree, cosmologists celebrate concordance—unless they share a <span class='hl-coral'>hidden shared systematic</span>.",
      "SENTINEL expands from Type Ia to <span class='hl-emerald'>Weak Lensing, Galaxy Clustering, and Cross-Tension Arbitration</span>."
    ]
  },
  {
    /* 6 */
    talk: "The next step: build on Ayan’s DESC pipeline and SNANA ground truth expertise, with partners in simulation based inference and reasoning evaluation still to be identified, and connect this benchmark to the companion AI for Science test run on the DES 5 year supernova analysis. Target NSF 26-522 Core Research with a science-first proposal focused on Rubin LSST readiness.",
    objective: "Describe the scope and the partners still needed for an NSF 26-522 Core Research proposal.",
    defense: "This is a science-first proposal grounded in real Rubin DESC infrastructure, not generic computer science hype.",
    beats: [
      "The Plan: <span class='hl-cyan'>Ayan's DESC pipeline & SNANA mastery</span> + <span class='hl-amber'>partners in SBI and reasoning evals, to be identified</span>.",
      "Targeting <span class='hl-emerald'>NSF 26-522 Core Research</span>: Science-first, empirically grounded, Rubin LSST-focused.",
      "Action: Scope the blinded pilot protocol and identify <span class='hl-cyan'>computational and evaluation partners</span>."
    ]
  },
  {
    /* 7 */
    talk: "Closing with our scientific boundaries: models like AION and AstroM3 are perception tools, not scientific arbiters. The benchmark has not yet been run. The entire pitch is built on unyielding scientific honesty: Not 'Can AI do science?', but 'What evidence would compel us to trust it?'",
    objective: "Disarm scientific skepticism with total epistemic integrity: clarify what is existing vs proposed, and define strict validation boundaries.",
    defense: "Full transparency: this benchmark has not yet been run; it is an unfunded conceptual proposal seeking collaborative validation.",
    beats: [
      "Epistemic Integrity: Foundation models are <span class='hl-amber'>perception tools</span>, not autonomous scientific arbiters.",
      "The benchmark is <span class='hl-cyan'>conceptually designed, not yet run</span>: Absolute transparency on evidence boundaries.",
      "The defining question of precision science: <span class='hl-emerald'>'What evidence would compel us to trust it?'</span>"
    ]
  }
];

// Initialize Nav Pill
navPill.innerHTML = scenes.map((s, i) => 
  `<button data-nav="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${s.dataset.title}</button>`
).join('');

function updateSlideContent(index) {
  const data = slideData[index];
  if (!data) return;

  if (notesContent) notesContent.textContent = data.talk;
  if (notesObjective) notesObjective.textContent = data.objective;
  if (notesDefense) notesDefense.textContent = data.defense;
}

function setSlide(index) {
  currentSlide = Math.max(0, Math.min(scenes.length - 1, index));
  
  scenes.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
  [...navPill.children].forEach((b, i) => {
    b.classList.toggle('active', i === currentSlide);
    b.setAttribute('aria-current', i === currentSlide ? 'page' : 'false');
  });

  slideCounter.textContent = `${String(currentSlide + 1).padStart(2, '0')} / 08`;
  btnPrev.disabled = currentSlide === 0;
  btnNext.disabled = currentSlide === scenes.length - 1;
  btnPrev.style.opacity = currentSlide === 0 ? '0.3' : '1';
  btnNext.style.opacity = currentSlide === scenes.length - 1 ? '0.3' : '1';

  updateSlideContent(currentSlide);
  history.replaceState(null, '', '#' + currentSlide);
  window.scrollTo(0, 0);

  sound.playBlip(620);
}

// Navigation Listeners
navPill.querySelectorAll('[data-nav]').forEach(btn => {
  btn.addEventListener('click', () => setSlide(Number(btn.dataset.nav)));
});
btnPrev.onclick = () => setSlide(currentSlide - 1);
btnNext.onclick = () => setSlide(currentSlide + 1);

document.querySelectorAll('[data-go]').forEach(b => {
  b.addEventListener('click', () => setSlide(Number(b.dataset.go)));
});

document.addEventListener('keydown', e => {
  if (isLabMode || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') {
    e.preventDefault();
    if (isTourPlaying) nextTourSlide();
    else setSlide(currentSlide + 1);
  }
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault();
    setSlide(currentSlide - 1);
  }
  if (e.key === ' ' && isTourPlaying) {
    e.preventDefault();
    if (isTourPaused) resumeTour();
    else pauseTour();
  }
  if (e.key === 'Escape' && isTourPlaying) {
    stopTour();
  }
});

// Presenter Notes Toggle
notesToggle.onclick = () => {
  document.body.classList.toggle('show-notes');
  const active = document.body.classList.contains('show-notes');
  notesToggle.setAttribute('aria-pressed', active);
  notesToggle.style.borderColor = active ? 'var(--amber)' : 'var(--border-subtle)';
  notesToggle.style.color = active ? 'var(--amber)' : 'var(--text-main)';
  sound.playBlip(480);
  if (!isLabMode) {
    notesDrawer.style.display = active ? 'block' : 'none';
  }
};

if (closeNotesBtn) {
  closeNotesBtn.onclick = () => {
    document.body.classList.remove('show-notes');
    notesToggle.setAttribute('aria-pressed', false);
    notesToggle.style.borderColor = 'var(--border-subtle)';
    notesToggle.style.color = 'var(--text-main)';
    notesDrawer.style.display = 'none';
  };
}

// Teleprompter Copy Script Button
if (copyScriptBtn) {
  copyScriptBtn.onclick = () => {
    const cur = slideData[currentSlide];
    const fullText = `SENTINEL COSMOLOGY PRESENTATION - SLIDE ${currentSlide + 1} (${scenes[currentSlide].dataset.title.toUpperCase()})\n\n🗣️ LIVE TALK TRACK:\n${cur.talk}\n\n🎯 STRATEGIC OBJECTIVE:\n${cur.objective}\n\n🛡️ SKEPTIC DEFENSE:\n${cur.defense}`;
    navigator.clipboard.writeText(fullText).then(() => {
      copyScriptBtn.textContent = '✓ Copied!';
      setTimeout(() => { copyScriptBtn.textContent = '📋 Copy Script'; }, 2000);
    }).catch(() => {
      copyScriptBtn.textContent = '✓ Done';
    });
  };
}

// Fullscreen Toggle
document.getElementById('fullscreenToggle').onclick = async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch (err) {
    console.log('Fullscreen toggled via browser');
  }
};

/* ============================================================
   PILLAR 3: SILENT CINEMATIC TOUR WITH DYNAMIC DATA TRIGGERS
   ============================================================ */
function startTour() {
  if (isLabMode) switchMode(false);
  isTourPlaying = true;
  isTourPaused = false;
  cinemaTourToggle.classList.add('playing');
  cinemaTourToggle.textContent = '⏹ Exit Tour';
  if (cinemaHUD) cinemaHUD.style.display = 'block';

  playTourSlide(currentSlide);
}

function stopTour() {
  isTourPlaying = false;
  isTourPaused = false;
  cinemaTourToggle.classList.remove('playing');
  cinemaTourToggle.textContent = '🎬 Cinematic Tour';
  if (cinemaHUD) cinemaHUD.style.display = 'none';
  if (cinemaProgressBar) cinemaProgressBar.style.width = '0%';
  if (cinemaPauseBtn) cinemaPauseBtn.textContent = '⏸ Pause';

  clearInterval(tourProgressInterval);
  tourProgressInterval = null;
  tourElapsedMs = 0;
}

function pauseTour() {
  if (!isTourPlaying) return;
  isTourPaused = true;
  cinemaPauseBtn.textContent = '▶ Resume';
  clearInterval(tourProgressInterval);
  tourProgressInterval = null;
}

function resumeTour() {
  if (!isTourPlaying || !isTourPaused) return;
  isTourPaused = false;
  cinemaPauseBtn.textContent = '⏸ Pause';
  startSlideProgress(currentSlide, tourElapsedMs);
}

function nextTourSlide() {
  if (!isTourPlaying) return;
  clearInterval(tourProgressInterval);
  tourProgressInterval = null;
  tourElapsedMs = 0;
  if (currentSlide < scenes.length - 1) {
    playTourSlide(currentSlide + 1);
  } else {
    stopTour();
  }
}

function playTourSlide(index) {
  if (!isTourPlaying) return;
  setSlide(index);
  tourElapsedMs = 0;

  if (cinemaTag) {
    cinemaTag.textContent = `CINEMATIC WALKTHROUGH · CHAPTER ${String(index + 1).padStart(2, '0')} / 08 · ${scenes[index].dataset.title.toUpperCase()}`;
  }

  // Trigger contextual slide animations during the tour
  triggerSceneAnimation(index);

  startSlideProgress(index, 0);
}

function startSlideProgress(index, startOffsetMs = 0) {
  clearInterval(tourProgressInterval);

  const data = slideData[index];
  const beats = data.beats;
  const totalMs = SLIDE_DURATION_MS;

  function renderBeat(elapsed) {
    if (!beats || beats.length === 0 || !cinemaText) return;
    let beatIdx = 0;
    if (elapsed >= 7500 && beats.length > 2) beatIdx = 2;
    else if (elapsed >= 3800 && beats.length > 1) beatIdx = 1;

    if (cinemaText.dataset.currentBeat !== String(beatIdx)) {
      cinemaText.dataset.currentBeat = String(beatIdx);
      cinemaText.style.opacity = '0';
      setTimeout(() => {
        cinemaText.innerHTML = beats[beatIdx];
        cinemaText.style.opacity = '1';
      }, 150);
    }
  }

  renderBeat(startOffsetMs);

  const tickMs = 50;
  tourProgressInterval = setInterval(() => {
    if (isTourPaused || !isTourPlaying) return;
    tourElapsedMs += tickMs;

    const pct = Math.min(100, (tourElapsedMs / totalMs) * 100);
    if (cinemaProgressBar) cinemaProgressBar.style.width = `${pct}%`;

    renderBeat(tourElapsedMs);

    if (tourElapsedMs >= totalMs) {
      clearInterval(tourProgressInterval);
      tourProgressInterval = null;
      if (currentSlide < scenes.length - 1) {
        playTourSlide(currentSlide + 1);
      } else {
        stopTour();
      }
    }
  }, tickMs);
}

function triggerSceneAnimation(index) {
  if (index === 0) {
    // Hologram: Reveal ground truth at 4.2s with sound impact
    setTimeout(() => {
      if (!isTourPlaying || isTourPaused || currentSlide !== 0) return;
      if (typeof heroBtnTru !== 'undefined' && heroBtnTru) heroBtnTru.click();
      sound.playImpact();
    }, 4200);
  } else if (index === 1) {
    // Hubble: Animate drift range from 0.5 to 2.5, then reveal truth
    if (typeof driftRange !== 'undefined' && driftRange) {
      driftRange.value = 0.5;
      renderHubble();
      let step = 0;
      const interval = setInterval(() => {
        if (!isTourPlaying || isTourPaused || currentSlide !== 1) { clearInterval(interval); return; }
        step++;
        driftRange.value = (0.5 + step * 0.25).toFixed(1);
        renderHubble();
        if (step >= 8) {
          clearInterval(interval);
          setTimeout(() => {
            if (!isTourPlaying || isTourPaused || currentSlide !== 1) return;
            if (typeof btnRevealTruth !== 'undefined' && btnRevealTruth) btnRevealTruth.click();
            sound.playImpact();
          }, 1000);
        }
      }, 320);
    }
  } else if (index === 3) {
    // AI tiers: cycle through Tiers 1, 2, 3, 4
    setTimeout(() => { if (isTourPlaying && !isTourPaused && currentSlide === 3) document.querySelector('[data-tier="1"]')?.click(); }, 2500);
    setTimeout(() => { if (isTourPlaying && !isTourPaused && currentSlide === 3) document.querySelector('[data-tier="2"]')?.click(); }, 5200);
    setTimeout(() => { if (isTourPlaying && !isTourPaused && currentSlide === 3) document.querySelector('[data-tier="3"]')?.click(); }, 7800);
  }
}

// Cinema Tour Controls
if (cinemaTourToggle) {
  cinemaTourToggle.onclick = () => {
    if (isTourPlaying) stopTour();
    else startTour();
  };
}

if (cinemaPauseBtn) {
  cinemaPauseBtn.onclick = () => {
    if (isTourPaused) resumeTour();
    else pauseTour();
  };
}

if (cinemaNextBtn) {
  cinemaNextBtn.onclick = () => nextTourSlide();
}

if (cinemaExitBtn) {
  cinemaExitBtn.onclick = () => stopTour();
}

/* ============================================================
   SCENE 0: Hero Hologram (w0, wa Parameter Likelihood)
   ============================================================ */
let heroRevealTruth = false;
function renderHeroHologram() {
  const svg = document.getElementById('heroHologram');
  if (!svg) return;

  const px = w0 => 70 + ((w0 - (-1.4)) / 0.8) * 460;
  const py = wa => 360 - ((wa - (-1.0)) / 2.0) * 300;

  let gridLines = '';
  for (let w0 = -1.4; w0 <= -0.61; w0 += 0.2) {
    const x = px(w0);
    gridLines += `<line x1="${x}" y1="40" x2="${x}" y2="360" stroke="#131e38" stroke-width="1"/>`;
    gridLines += `<text x="${x}" y="385" fill="#64748b" font-size="11" text-anchor="middle" font-family="var(--font-mono)">${w0.toFixed(1)}</text>`;
  }
  for (let wa = -1.0; wa <= 1.01; wa += 0.5) {
    const y = py(wa);
    gridLines += `<line x1="60" y1="${y}" x2="540" y2="${y}" stroke="#131e38" stroke-width="1"/>`;
    gridLines += `<text x="50" y="${y + 4}" fill="#64748b" font-size="11" text-anchor="end" font-family="var(--font-mono)">${wa.toFixed(1)}</text>`;
  }

  const trueX = px(-1.0), trueY = py(0.0);
  const infX = px(-0.84), infY = py(0.38);

  let markup = `
    ${gridLines}
    <text x="300" y="410" fill="#94a3b8" font-size="12" text-anchor="middle" font-family="var(--font-display)">Dark Energy Equation of State w₀</text>
    <text x="20" y="200" fill="#94a3b8" font-size="12" text-anchor="middle" transform="rotate(-90,20,200)" font-family="var(--font-display)">Evolution Parameter wₐ</text>

    <!-- Inferred Likelihood Contours -->
    <g transform="translate(${infX}, ${infY}) rotate(-32)">
      <ellipse rx="135" ry="54" fill="rgba(0, 242, 254, 0.05)" stroke="#00f2fe" stroke-width="1" stroke-opacity="0.4"/>
      <ellipse rx="88" ry="35" fill="rgba(0, 242, 254, 0.12)" stroke="#00f2fe" stroke-width="1.5" stroke-opacity="0.75"/>
      <ellipse rx="44" ry="18" fill="rgba(0, 242, 254, 0.28)" stroke="#00f2fe" stroke-width="2"/>
    </g>
    <circle cx="${infX}" cy="${infY}" r="4" fill="#00f2fe"/>
    <text x="${infX + 16}" y="${infY - 20}" fill="#00f2fe" font-size="13" font-weight="700" font-family="var(--font-display)">Inferred Fit (w₀ ≠ -1)</text>
    <text x="${infX + 16}" y="${infY - 4}" fill="#79f9ff" font-size="11" font-family="var(--font-mono)">5.1σ Tension Claimed</text>
  `;

  if (heroRevealTruth) {
    markup += `
      <!-- Connecting vector -->
      <line x1="${trueX}" y1="${trueY}" x2="${infX}" y2="${infY}" stroke="#ff2a6d" stroke-width="2.5" stroke-dasharray="5 5"/>
      <!-- True Point Marker -->
      <circle cx="${trueX}" cy="${trueY}" r="6" fill="#ff9e00" stroke="#fff" stroke-width="2"/>
      <path d="M${trueX - 12} ${trueY}h24M${trueX} ${trueY - 12}v24" stroke="#ff9e00" stroke-width="2"/>
      <text x="${trueX}" y="${trueY + 26}" fill="#ff9e00" font-size="13" font-weight="700" text-anchor="middle" font-family="var(--font-display)">True ΛCDM Universe (w₀ = -1, wₐ = 0)</text>
      <text x="310" y="235" fill="#ff2a6d" font-size="11" font-family="var(--font-mono)" font-weight="700">0.03 mag Dust Camouflage Vector</text>
    `;
  } else {
    markup += `<circle cx="${trueX}" cy="${trueY}" r="3" fill="#334155"/>`;
  }

  svg.innerHTML = markup;
}

const heroBtnObs = document.getElementById('heroToggleObserver');
const heroBtnTru = document.getElementById('heroToggleTruth');
if (heroBtnObs && heroBtnTru) {
  heroBtnObs.onclick = () => {
    heroRevealTruth = false;
    heroBtnObs.classList.add('active');
    heroBtnTru.classList.remove('active');
    document.getElementById('heroStatusText').style.display = 'block';
    document.getElementById('heroWarningText').style.display = 'none';
    renderHeroHologram();
    sound.playBlip(500);
  };
  heroBtnTru.onclick = () => {
    heroRevealTruth = true;
    heroBtnTru.classList.add('active');
    heroBtnObs.classList.remove('active');
    document.getElementById('heroStatusText').style.display = 'none';
    document.getElementById('heroWarningText').style.display = 'block';
    renderHeroHologram();
    sound.playImpact();
  };
}
renderHeroHologram();

/* ============================================================
   SCENE 1: Interactive Hubble Diagram & Residual Simulator
   ============================================================ */
let hubbleRevealed = false;
const driftRange = document.getElementById('driftRange');
const driftOutput = document.getElementById('driftOutput');
const btnRevealTruth = document.getElementById('btnRevealTruth');

// Generate 32 deterministic synthetic supernovae
const syntheticSNe = [];
for (let i = 0; i < 32; i++) {
  const z = 0.05 + (i / 31) * 1.05;
  const baseMu = 43.1 + 5 * Math.log10(z) + 1.1 * z;
  const scatter = Math.sin(i * 12.3) * 0.12 + Math.cos(i * 7.7) * 0.05;
  syntheticSNe.push({ z, mu: baseMu + scatter, scatter });
}

function renderHubble() {
  const svg = document.getElementById('hubblePlot');
  if (!svg) return;

  const d = Number(driftRange.value);
  driftOutput.textContent = `${d.toFixed(1)}σ`;

  const px = z => 80 + (z / 1.2) * 640;
  const pyMu = mu => 210 - ((mu - 35) / 11) * 170;
  const pyRes = res => 300 - (res / 0.5) * 40;

  let grid = '';
  for (let z = 0.2; z <= 1.2; z += 0.2) {
    const x = px(z);
    grid += `<line x1="${x}" y1="30" x2="${x}" y2="350" stroke="#131e38" stroke-width="1"/>`;
    grid += `<text x="${x}" y="368" fill="#64748b" font-size="11" text-anchor="middle" font-family="var(--font-mono)">z=${z.toFixed(1)}</text>`;
  }

  let trueCurve = '';
  let inferredCurve = '';
  for (let z = 0.05; z <= 1.21; z += 0.02) {
    const trueMu = 43.1 + 5 * Math.log10(z) + 1.1 * z;
    const shift = (d * 0.04) * (z / 1.2);
    const infMu = trueMu + shift;
    trueCurve += (trueCurve ? 'L' : 'M') + px(z).toFixed(1) + ' ' + pyMu(trueMu).toFixed(1);
    inferredCurve += (inferredCurve ? 'L' : 'M') + px(z).toFixed(1) + ' ' + pyMu(infMu).toFixed(1);
  }

  let snPoints = '';
  let resPoints = '';
  syntheticSNe.forEach(sn => {
    const obsShift = (d * 0.04) * (sn.z / 1.2);
    const obsMu = sn.mu + obsShift;
    const x = px(sn.z);
    const y = pyMu(obsMu);
    snPoints += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="#00f2fe" opacity="0.85"/>`;

    const resY = pyRes(sn.scatter);
    resPoints += `<line x1="${x.toFixed(1)}" y1="${(resY - 8).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(resY + 8).toFixed(1)}" stroke="#00f2fe" stroke-opacity="0.35"/>`;
    resPoints += `<circle cx="${x.toFixed(1)}" cy="${resY.toFixed(1)}" r="2.5" fill="#00f2fe"/>`;
  });

  const zeroLine = `<line x1="80" y1="${pyRes(0)}" x2="720" y2="${pyRes(0)}" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4"/>`;

  let content = `
    ${grid}
    <text x="80" y="24" fill="#94a3b8" font-size="11" font-weight="700" font-family="var(--font-display)">DISTANCE MODULUS μ(z)</text>
    <text x="80" y="246" fill="#94a3b8" font-size="11" font-weight="700" font-family="var(--font-display)">HUBBLE RESIDUALS Δμ (mag)</text>

    <!-- Inferred Model Curve -->
    <path d="${inferredCurve}" fill="none" stroke="#00f2fe" stroke-width="2.5"/>
    <text x="635" y="${pyMu(43.1 + 5*Math.log10(1.1) + 1.1*1.1 + d*0.04) - 12}" fill="#00f2fe" font-size="11" font-family="var(--font-mono)" font-weight="700">Inferred Model Fit</text>

    ${snPoints}
    ${zeroLine}
    ${resPoints}
  `;

  if (hubbleRevealed) {
    content += `
      <path d="${trueCurve}" fill="none" stroke="#ff9e00" stroke-width="2" stroke-dasharray="5 5"/>
      <text x="635" y="${pyMu(43.1 + 5*Math.log10(1.1) + 1.1*1.1) + 20}" fill="#ff9e00" font-size="11" font-family="var(--font-mono)" font-weight="700">Ground Truth (ΛCDM)</text>
      
      <rect x="250" y="242" width="280" height="24" rx="6" fill="rgba(255, 42, 109, 0.18)" stroke="#ff2a6d"/>
      <text x="390" y="258" fill="#ff2a6d" font-size="11" text-anchor="middle" font-family="var(--font-mono)" font-weight="700">ABSORBED SYSTEMATIC: Δw = +${(d * 0.08).toFixed(2)}</text>
    `;
  }

  svg.innerHTML = content;

  const inferredW = (-1.00 + d * 0.08).toFixed(2);
  document.getElementById('statEstimate').textContent = `w = ${inferredW}`;
  document.getElementById('statBias').textContent = hubbleRevealed ? `+${(d * 0.08).toFixed(2)} (Biased)` : 'Sealed';
  document.getElementById('statBias').style.color = hubbleRevealed ? 'var(--coral)' : 'var(--text-muted)';

  const badge = document.getElementById('chameleonBadge');
  if (d > 0.3) {
    badge.textContent = 'Systematic perfectly masquerading as dark energy';
    badge.className = 'coral';
  } else {
    badge.textContent = 'Degeneracy in Plain Sight';
    badge.className = 'cyan';
  }
}

if (driftRange) {
  driftRange.addEventListener('input', () => {
    renderHubble();
    sound.playBlip(400 + Number(driftRange.value) * 150, 0.03);
  });
}

if (btnRevealTruth) {
  btnRevealTruth.onclick = () => {
    hubbleRevealed = !hubbleRevealed;
    btnRevealTruth.textContent = hubbleRevealed ? 'Seal Evaluator Truth' : 'Reveal Evaluator Truth';
    btnRevealTruth.classList.toggle('btn-amber', !hubbleRevealed);
    btnRevealTruth.classList.toggle('btn-coral', hubbleRevealed);
    document.getElementById('revealExplainer').textContent = hubbleRevealed
      ? 'The fit passed with flying colors (χ²/dof = 1.02), yet the inferred universe is severely corrupted. Mathematical optimization cannot detect what is collinear with the model response.'
      : 'The analyst sees only the data and residuals. The evaluator holds the sealed injection manifest.';
    renderHubble();
    if (hubbleRevealed) sound.playImpact();
    else sound.playBlip(500);
  };
}
renderHubble();

// Systematic Selector Buttons
['sysZero', 'sysDust', 'sysMalm'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.onclick = () => {
      ['sysZero', 'sysDust', 'sysMalm'].forEach(x => {
        const b = document.getElementById(x);
        b.style.borderColor = 'var(--border-subtle)';
        b.style.color = 'var(--text-main)';
      });
      el.style.borderColor = 'var(--cyan)';
      el.style.color = 'var(--cyan)';
      renderHubble();
      sound.playBlip(680);
    };
  }
});

/* ============================================================
   SCENE 2: Air Gap Simulation Trigger
   ============================================================ */
const btnSimulateAttack = document.getElementById('btnSimulateAttack');
if (btnSimulateAttack) {
  btnSimulateAttack.onclick = () => {
    sound.playImpact();
    alert(
      "Simulated Adversarial Injection Flow:\n\n" +
      "1. [Evaluator Vault]: Injected +0.03 mag chromatic filter drift into 1,000 synthetic SN light curves.\n" +
      "2. [Air-Gap Firewall]: Metadata scrubbed. Evaluator seeds hashed. Leakage audit: 0.00%.\n" +
      "3. [Analyst Sandbox]: Standard BBC baseline executed. Fit reports χ²/dof = 1.01. Parameter w drifts undetected by +0.16.\n\n" +
      "Verdict: Failure successfully mapped without leaking evaluator truth."
    );
  };
}

/* ============================================================
   SCENE 3: Arena Tiers
   ============================================================ */
const tierData = [
  {
    tag: 'TIER 01 / CONTROL BASELINE',
    title: 'Can established statistical tests already solve the problem?',
    text: 'Freeze the reference pipeline and calibrate diagnostics on clean simulations. If a simpler statistical test wins at matched compute cost, it remains the champion.',
    power: '42% (Baseline)',
    powerClass: 'amber',
    bias: '0.85σ (Escapes)',
    biasClass: 'coral',
    falseAlarm: 'Fixed α = 5%',
    cost: '$0.01 / run',
    vulnerability: 'Blind to complex, non-linear multi-band dust variations at high redshift.'
  },
  {
    tag: 'TIER 02 / AUTONOMOUS REASONING',
    title: 'Does an autonomous agent choose better diagnostic tests?',
    text: 'Provide a single agent with approved diagnostic tools, survey metadata, and a resource ceiling—with zero evaluator access. Measure whether autonomous hypothesis testing uncovers masked faults.',
    power: '68% (Moderate)',
    powerClass: 'cyan',
    bias: '0.48σ (Improved)',
    biasClass: 'amber',
    falseAlarm: '8.4% (Elevated)',
    cost: '$0.85 / run',
    vulnerability: 'Prone to generating speculative astrophysical hypotheses for pure Poisson noise.'
  },
  {
    tag: 'TIER 03 / REPRESENTATION & PERCEPTION',
    title: 'Do foundation models expose features missed by tabular cuts?',
    text: 'Evaluate specialist models (AION host embeddings, AstroM3 time-series representations) with identical data access. Foundation models perceive anomalies at scale, but cannot calibrate physical likelihoods alone.',
    power: '84% (High)',
    powerClass: 'cyan',
    bias: '0.28σ (Protected)',
    biasClass: 'cyan',
    falseAlarm: '6.1% (Calibrated)',
    cost: '$2.40 / run',
    vulnerability: 'Vulnerable to out-of-distribution survey transfer shifts (e.g. DES to LSST filter shifts).'
  },
  {
    tag: 'TIER 04 / MULTI-AGENT COORDINATION',
    title: 'Does a multi-agent team improve reliability per dollar of compute?',
    text: 'Separate specialized roles: Investigator, Skeptical Critic, and Sandbox Verifier. Compare against a single agent at matched token and compute budgets to isolate the true effect of coordination.',
    power: '89% (Highest)',
    powerClass: 'cyan',
    bias: '0.19σ (Minimal)',
    biasClass: 'cyan',
    falseAlarm: '5.2% (Controlled)',
    cost: '$6.50 / run',
    vulnerability: 'Persuasive Consensus Trap: agents can convince one another of an unphysical explanation.'
  }
];

document.querySelectorAll('[data-tier]').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('[data-tier]').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    const idx = Number(btn.dataset.tier);
    const t = tierData[idx];

    document.getElementById('arenaTag').textContent = t.tag;
    document.getElementById('arenaTitle').textContent = t.title;
    document.getElementById('arenaText').textContent = t.text;
    document.getElementById('arenaVulnerability').textContent = t.vulnerability;

    const p = document.getElementById('scorePower');
    p.textContent = t.power;
    p.className = 'score-pill ' + t.powerClass;

    const b = document.getElementById('scoreBias');
    b.textContent = t.bias;
    b.className = 'score-pill ' + t.biasClass;

    document.getElementById('scoreFalseAlarm').textContent = t.falseAlarm;
    document.getElementById('scoreCost').textContent = t.cost;
    sound.playBlip(520 + idx * 80);
  };
});

/* ============================================================
   SCENE 4: Roadmap Timeline & Gates
   ============================================================ */
const roadmapPhases = [
  [
    'Weeks 1 to 4',
    'Reproduce the Baseline',
    'Freeze one survey configuration, one inference target (w₀), and one injection family.',
    'SNANA configurations and permitted simulation products. Existing pipeline outputs after provenance review.',
    'A fully reproducible run, clean controls, versioned injection manifest, and measured baseline runtime.',
    'Can an independent evaluator reproduce the baseline and intended injection effect without code drift?',
    'Domain Scientist + Research Software Engineer. Existing CPU allocation.'
  ],
  [
    'Weeks 5 to 12',
    'The Blinded Pilot',
    'Test scientific judgment before scaling infrastructure. Scope with an independent evaluator.',
    'Fresh simulated realizations with clean and perturbed cases. Sample size determined by statistical power.',
    'Baseline vs Single Agent comparison, leakage audit, cost accounting, and preliminary failure map.',
    'Are false alarms controlled at α=5%? Is the injection identifiable from allowed evidence? Pilot paper.',
    'Scientist (Ayan), AI Lead (to be identified), RSE, and Independent Evaluator. Capped model API spend.'
  ],
  [
    'Months 4 to 9',
    'Release Benchmark v1',
    'Transform a demonstration into a reusable scientific instrument for the cosmology community.',
    'Multiple SN systematic families (dust, calibration, selection) with held-out seeds and combinations.',
    'Documented evaluation protocol, uncertainty intervals, ablation suite, public code release, and journal paper.',
    'Does the benchmark expose consequential limitations or improvements beyond established diagnostics?',
    'Costed research effort, graduate student support, maintained software. Supported by NSF Core Research award.'
  ],
  [
    'Months 10 to 18',
    'Add 3×2pt (Lensing + Clustering)',
    'Test whether the evaluation contract survives a change of physical probe and likelihood.',
    'Agreed weak lensing & clustering pipeline (TXPipe/Firecrown), shear calibration, and mock catalogs.',
    'A 3×2pt adapter with one controlled nuisance family (photo-z bias), plus cross-probe transfer study.',
    'Can the second probe be integrated without rewriting the evaluation core or concealing probe assumptions?',
    'Second probe specialist joins. Compute and data access negotiated prior to integration.'
  ],
  [
    'Months 19 to 36',
    'Stress-Test Joint Cosmology',
    'Study shared nuisance errors, misleading concordance, and automated tension diagnosis.',
    'Joint SN and 3×2pt likelihood products with explicit shared nuisance parameter models.',
    'Joint failure atlas, external community replication, and Rubin DESC analysis workflow integration.',
    'Are correlations modeled correctly, and do external groups obtain reproducible scientific value?',
    'Dedicated engineering maintenance, independent validation board, DESC working group adoption.'
  ]
];

const roadmapTimeline = document.getElementById('roadmapTimeline');
if (roadmapTimeline) {
  roadmapTimeline.innerHTML = roadmapPhases.map((p, i) => 
    `<div class="timeline-step ${i === 1 ? 'spotlight' : ''}" data-phase="${i}">
      ${p[0]}
      <small>${p[1]}</small>
    </div>`
  ).join('');

  function selectPhase(i) {
    const p = roadmapPhases[i];
    document.getElementById('phaseTag').textContent = p[0].toUpperCase();
    document.getElementById('phaseTitle').textContent = p[1];
    document.getElementById('phaseSummary').textContent = p[2];
    document.getElementById('phaseData').textContent = p[3];
    document.getElementById('phaseOutput').textContent = p[4];
    document.getElementById('phaseGate').textContent = p[5];
    document.getElementById('phasePeople').textContent = p[6];

    document.querySelectorAll('.timeline-step').forEach(s => 
      s.classList.toggle('active', Number(s.dataset.phase) === i)
    );
    document.getElementById('roadmapProgress').style.width = [5, 20, 45, 75, 100][i] + '%';
    sound.playBlip(500 + i * 60);
  }

  roadmapTimeline.querySelectorAll('.timeline-step').forEach(s => {
    s.addEventListener('click', () => selectPhase(Number(s.dataset.phase)));
  });
  selectPhase(0);
}

/* ============================================================
   SCENE 5: Probes & Horizon
   ============================================================ */
const probeDetails = [
  {
    tag: 'INITIAL SCOPE / STAGE 1',
    title: 'Supernova Cosmology (SNe Ia)',
    text: 'Inject calibration zero-point shifts, selection functions, host-galaxy dust laws, and core-collapse contamination. Propagate through light-curve fitting and BEAMS bias corrections to dark energy equation of state parameters.',
    caution: 'Simulated ground truth is conditional on the forward simulator (SNANA). Real observations require external spectroscopic calibration and cannot provide a sealed answer key.'
  },
  {
    tag: 'SECOND ADAPTER / STAGE 2',
    title: 'Weak Lensing & Galaxy Clustering (3×2pt)',
    text: 'Add an adapter for controlled photometric redshift errors, shear calibration bias, and intrinsic alignments. Carry survey masks, selection cuts, angular power spectra, and full covariance explicitly.',
    caution: 'A domain specialist in weak lensing and large-scale structure must co-own the physical validity of the injection engine and inference pipeline.'
  },
  {
    tag: 'CROSS-PROBE FRONTIER / STAGE 3',
    title: 'Joint Cosmology & Tension Diagnosis',
    text: 'When two independent probes agree, is it cosmic concordance or shared systematic bias? Inject correlated nuisance parameters (e.g. shared calibration standards or Milky Way extinction) and test automated tension diagnosis.',
    caution: 'Do not combine marginal posteriors under assumed independence when underlying calibration systematics are physically correlated.'
  },
  {
    tag: 'CONDITIONAL HORIZON',
    title: 'CMB, Gravitational Waves & Physical PDEs',
    text: 'The evaluation contract—trusted forward model, sealed fault injection, air-gapped analyst, and measured failure map—generalizes to any physical domain with rigorous simulators.',
    caution: 'Domain transfer is a scientific hypothesis to test. Model weights do not automatically transfer across distinct physical domains.'
  }
];

document.querySelectorAll('.probe-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.probe-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    const idx = Number(btn.dataset.probe);
    const p = probeDetails[idx];

    document.getElementById('probeTag').textContent = p.tag;
    document.getElementById('probeTitle').textContent = p.title;
    document.getElementById('probeText').textContent = p.text;
    document.getElementById('probeCaution').textContent = p.caution;
    sound.playBlip(600 + idx * 50);
  };
});

/* ============================================================
   LABORATORY INTERACTIVE MODULES
   ============================================================ */
let labSelectedInj = 'zero';
const labAmpSlider = document.getElementById('labAmplitude');
const labAmpOutput = document.getElementById('labAmpOutput');

document.querySelectorAll('.lab-inj-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.lab-inj-btn').forEach(b => {
      b.classList.remove('active');
      b.style.borderColor = 'var(--border-subtle)';
    });
    btn.classList.add('active');
    btn.style.borderColor = 'var(--cyan)';
    labSelectedInj = btn.dataset.inj;
    renderLabSimulation();
    sound.playBlip(650);
  };
});

if (labAmpSlider) {
  labAmpSlider.addEventListener('input', () => {
    labAmpOutput.textContent = `${Number(labAmpSlider.value).toFixed(3)} mag`;
    renderLabSimulation();
  });
}

function renderLabSimulation() {
  const svg = document.getElementById('labSimPlot');
  if (!svg) return;

  const amp = Number(labAmpSlider ? labAmpSlider.value : 0.03);
  const px = z => 60 + (z / 1.2) * 560;
  const py = mu => 180 - ((mu - 36) / 10) * 140;

  let points = '';
  for (let i = 0; i < 28; i++) {
    const z = 0.05 + (i / 27) * 1.05;
    const baseMu = 43.1 + 5 * Math.log10(z) + 1.1 * z;
    const shift = (amp * 2.5) * (z / 1.2);
    const noise = (Math.sin(i * 9.1) * 0.1);
    const x = px(z);
    const y = py(baseMu + shift + noise);
    points += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#00f2fe" opacity="0.8"/>`;
  }

  let trueLine = '';
  let infLine = '';
  for (let z = 0.05; z <= 1.2; z += 0.04) {
    const baseMu = 43.1 + 5 * Math.log10(z) + 1.1 * z;
    const shift = (amp * 2.5) * (z / 1.2);
    trueLine += (trueLine ? 'L' : 'M') + px(z).toFixed(1) + ' ' + py(baseMu).toFixed(1);
    infLine += (infLine ? 'L' : 'M') + px(z).toFixed(1) + ' ' + py(baseMu + shift).toFixed(1);
  }

  svg.innerHTML = `
    <!-- Axes -->
    <line x1="60" y1="20" x2="60" y2="280" stroke="#16263f"/>
    <line x1="60" y1="280" x2="620" y2="280" stroke="#16263f"/>
    <text x="340" y="310" fill="#94a3b8" font-size="11" text-anchor="middle" font-family="var(--font-mono)">Supernova Redshift z</text>
    <text x="25" y="150" fill="#94a3b8" font-size="11" text-anchor="middle" transform="rotate(-90,25,150)" font-family="var(--font-mono)">Distance Modulus μ</text>

    <!-- Curves -->
    <path d="${trueLine}" fill="none" stroke="#ff9e00" stroke-width="2" stroke-dasharray="4 4"/>
    <path d="${infLine}" fill="none" stroke="#00f2fe" stroke-width="2.5"/>
    ${points}

    <text x="480" y="70" fill="#ff9e00" font-size="11" font-family="var(--font-mono)">Truth: ΛCDM</text>
    <text x="480" y="90" fill="#00f2fe" font-size="11" font-family="var(--font-mono)">Inferred: w₀ = ${(-1.00 + amp * 3.8).toFixed(2)}</text>
  `;

  const inferredW = (-1.00 + amp * 3.8).toFixed(2);
  const biasSigma = (amp * 48).toFixed(1);
  document.getElementById('labW0').textContent = inferredW;
  document.getElementById('labBias').textContent = `+${biasSigma}σ`;
  document.getElementById('labChi2').textContent = (1.015 + (amp * 0.1)).toFixed(3);
}

function renderFailureHeatmap() {
  const svg = document.getElementById('heatmapSvg');
  if (!svg) return;

  const cols = 12;
  const rows = 5;

  let cells = '';
  for (let r = 0; r < rows; r++) {
    const ampVal = (0.01 + r * 0.015).toFixed(3);
    const y = 30 + r * 36;
    cells += `<text x="70" y="${y + 22}" fill="#94a3b8" font-size="10" text-anchor="end" font-family="var(--font-mono)">${ampVal}m</text>`;

    for (let c = 0; c < cols; c++) {
      const zVal = (0.1 + c * 0.1).toFixed(1);
      const x = 90 + c * 64;

      const hazardScore = Math.min(1.0, (r * 0.25) * (1 - c * 0.05));
      let fill = 'rgba(5, 255, 161, 0.2)';
      let stroke = 'rgba(5, 255, 161, 0.4)';

      if (r >= 2 && c <= 7) {
        fill = 'rgba(255, 42, 109, 0.55)';
        stroke = 'rgba(255, 42, 109, 0.8)';
      } else if (r >= 3) {
        fill = 'rgba(255, 158, 0, 0.4)';
        stroke = 'rgba(255, 158, 0, 0.7)';
      }

      cells += `
        <rect x="${x}" y="${y}" width="58" height="30" rx="4" fill="${fill}" stroke="${stroke}"/>
        <text x="${x + 29}" y="${y + 19}" fill="#fff" font-size="9" text-anchor="middle" font-family="var(--font-mono)">${(hazardScore * 100).toFixed(0)}%</text>
      `;

      if (r === rows - 1) {
        cells += `<text x="${x + 29}" y="${y + 48}" fill="#94a3b8" font-size="10" text-anchor="middle" font-family="var(--font-mono)">z=${zVal}</text>`;
      }
    }
  }

  svg.innerHTML = `
    <text x="30" y="18" fill="#94a3b8" font-size="10" font-weight="700" font-family="var(--font-mono)">AMPLITUDE</text>
    <text x="500" y="235" fill="#94a3b8" font-size="10" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">REDSHIFT BIN</text>
    ${cells}
  `;
}

// Initial Hash Route
const initialSlide = Number(location.hash.slice(1)) || 0;
setSlide(initialSlide);
