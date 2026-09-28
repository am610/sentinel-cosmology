// SENTINEL: Dual-Mode Presentation & Interactive Research Laboratory Engine
const scenes = [...document.querySelectorAll('.scene')];
const navPill = document.getElementById('navPill');
const slideCounter = document.getElementById('slideCounter');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const notesDrawer = document.getElementById('notesDrawer');
const notesContent = document.getElementById('notesContent');
const notesToggle = document.getElementById('notesToggle');
const deckFooter = document.getElementById('deckFooter');

let currentSlide = 0;
let isLabMode = false;

// Mode Switching (Slide Deck vs. Interactive Lab)
const modeDeckBtn = document.getElementById('modeDeck');
const modeLabBtn = document.getElementById('modeLab');

function switchMode(lab) {
  isLabMode = lab;
  document.body.classList.toggle('mode-lab', isLabMode);
  modeDeckBtn.classList.toggle('active', !isLabMode);
  modeLabBtn.classList.toggle('active', isLabMode);
  modeLabBtn.classList.toggle('amber-mode', isLabMode);
  
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

// Presenter Talk Tracks for each scene
const talkTracks = [
  /* 0 */ "“Imagine an AI team delivers an automated cosmological analysis claiming evidence for dynamical dark energy (w ≠ -1) at high significance. The residuals look completely clean. But what tells us it hasn't simply absorbed a 0.03 mag host dust drift into the dark energy parameter? Before we let AI accelerate cosmology, we need an adversarial evaluation environment.”",
  /* 1 */ "“This is the Chameleon Systematic. When a physical perturbation projects in the exact same direction as the model's cosmological sensitivity, maximum-likelihood fitting absorbs it into the parameter. The residuals remain flat (χ²/dof = 1.02). No optimizer can detect what is mathematically degenerate without external priors. A trustworthy scientific agent must recognize non-identifiability and abstain.”",
  /* 2 */ "“Here is the core technical architecture: a cryptographically sealed Evaluator Vault separated from the Analyst Sandbox by an air-gap firewall. SNANA simulation seeds, injection amplitudes, and true parameters never touch the LLM context window, filenames, or logs. Everything is unsealed only after frozen analyst submission.”",
  /* 3 */ "“We enforce strict ablations. We don't assume that an agent swarm is smarter than a simple χ² test. Tier 1 is our baseline LightGBM scorecard. Notice Tier 4: agent teams risk the Persuasive Consensus Trap, where agents convince each other of an unphysical explanation. Every layer must prove its value per dollar of compute.”",
  /* 4 */ "“Here is the pragmatic roadmap. Weeks 1–4 reproduce the baseline. Weeks 5–12 is the primary ask for Sid: a jointly scoped, blinded pilot with 1 injection family and 1 cosmological parameter, resulting in the first co-authored benchmark paper. We only scale to multi-probe after proving the metric.”",
  /* 5 */ "“Why multi-probe matters: when two independent telescopes agree, cosmologists celebrate concordance. But if both probes share an unmodeled calibration or galactic extinction error, they agree for the wrong reason. Automated cross-probe tension diagnosis is a major open challenge with no current owner.”",
  /* 6 */ "“The collaboration ask for Sid: combine Ayan’s DESC pipeline and SNANA ground-truth mastery with Sid’s leadership in simulation-based inference (SBI) and foundation reasoning evals. Target NSF 26-522 (Astronomical Sciences Core Research) with a science-first proposal focused on Rubin LSST readiness.”",
  /* 7 */ "“Closing with our scientific boundaries: models like AION and AstroM3 are perception tools, not scientific arbiters. The benchmark has not yet been run. The entire pitch is built on unyielding scientific honesty: Not 'Can AI do science?', but 'What evidence would compel us to trust it?'”"
];

// Initialize Nav Pill
navPill.innerHTML = scenes.map((s, i) => 
  `<button data-nav="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${s.dataset.title}</button>`
).join('');

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

  notesContent.textContent = talkTracks[currentSlide] || '';
  history.replaceState(null, '', '#' + currentSlide);
  window.scrollTo(0, 0);
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
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
    e.preventDefault();
    setSlide(currentSlide + 1);
  }
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault();
    setSlide(currentSlide - 1);
  }
});

// Presenter Notes Toggle
notesToggle.onclick = () => {
  document.body.classList.toggle('show-notes');
  const active = document.body.classList.contains('show-notes');
  notesToggle.setAttribute('aria-pressed', active);
  notesToggle.style.borderColor = active ? 'var(--amber)' : 'var(--border-subtle)';
  notesToggle.style.color = active ? 'var(--amber)' : 'var(--text-main)';
  if (!isLabMode) {
    notesDrawer.style.display = active ? 'block' : 'none';
  }
};

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
  };
  heroBtnTru.onclick = () => {
    heroRevealTruth = true;
    heroBtnTru.classList.add('active');
    heroBtnObs.classList.remove('active');
    document.getElementById('heroStatusText').style.display = 'none';
    document.getElementById('heroWarningText').style.display = 'block';
    renderHeroHologram();
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
  driftRange.addEventListener('input', renderHubble);
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
    };
  }
});

/* ============================================================
   SCENE 2: Air Gap Simulation Trigger
   ============================================================ */
const btnSimulateAttack = document.getElementById('btnSimulateAttack');
if (btnSimulateAttack) {
  btnSimulateAttack.onclick = () => {
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
    'The Blinded Pilot (Sid & Ayan)',
    'Test scientific judgment before scaling infrastructure. Scope jointly with BU/IAIFI.',
    'Fresh simulated realizations with clean and perturbed cases. Sample size determined by statistical power.',
    'Baseline vs Single Agent comparison, leakage audit, cost accounting, and preliminary failure map.',
    'Are false alarms controlled at α=5%? Is the injection identifiable from allowed evidence? Co-author Pilot Paper.',
    'Scientist (Ayan), AI Lead (Sid), RSE, and Independent Evaluator. Capped model API spend.'
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

  // Update readouts
  const inferredW = (-1.00 + amp * 3.8).toFixed(2);
  const biasSigma = (amp * 48).toFixed(1);
  document.getElementById('labW0').textContent = inferredW;
  document.getElementById('labBias').textContent = `+${biasSigma}σ`;
  document.getElementById('labChi2').textContent = (1.015 + (amp * 0.1)).toFixed(3);
}

function renderFailureHeatmap() {
  const svg = document.getElementById('heatmapSvg');
  if (!svg) return;

  const cols = 12; // Redshift bins
  const rows = 5;  // Systematic amplitudes

  let cells = '';
  for (let r = 0; r < rows; r++) {
    const ampVal = (0.01 + r * 0.015).toFixed(3);
    const y = 30 + r * 36;
    cells += `<text x="70" y="${y + 22}" fill="#94a3b8" font-size="10" text-anchor="end" font-family="var(--font-mono)">${ampVal}m</text>`;

    for (let c = 0; c < cols; c++) {
      const zVal = (0.1 + c * 0.1).toFixed(1);
      const x = 90 + c * 64;

      // Calculate hazard level: high bias + low detection power = invisible hazard (coral)
      const hazardScore = Math.min(1.0, (r * 0.25) * (1 - c * 0.05));
      let fill = 'rgba(5, 255, 161, 0.2)'; // safe
      let stroke = 'rgba(5, 255, 161, 0.4)';

      if (r >= 2 && c <= 7) {
        fill = 'rgba(255, 42, 109, 0.55)'; // invisible hazard zone
        stroke = 'rgba(255, 42, 109, 0.8)';
      } else if (r >= 3) {
        fill = 'rgba(255, 158, 0, 0.4)'; // detected but high bias
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
