// SENTINEL Presentation Logic & Interactive Scientific Engines
const scenes = [...document.querySelectorAll('.scene')];
const nav = document.getElementById('nav');
let chapter = 0;

// Setup Nav Buttons
nav.innerHTML = scenes.map((s, i) => 
  `<button data-go="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${s.dataset.title}</button>`
).join('');

function go(i) {
  chapter = Math.max(0, Math.min(scenes.length - 1, i));
  scenes.forEach((s, j) => s.classList.toggle('active', j === chapter));
  [...nav.children].forEach((b, j) => {
    b.classList.toggle('active', j === chapter);
    b.setAttribute('aria-current', j === chapter ? 'step' : 'false');
  });
  document.getElementById('chapterCount').textContent = String(chapter + 1).padStart(2, '0') + ' / 08';
  document.getElementById('prev').disabled = chapter === 0;
  document.getElementById('next').disabled = chapter === scenes.length - 1;
  history.replaceState(null, '', '#' + chapter);
  window.scrollTo(0, 0);
}

document.querySelectorAll('[data-go]').forEach(b => {
  b.addEventListener('click', () => go(Number(b.dataset.go)));
});
document.getElementById('prev').onclick = () => go(chapter - 1);
document.getElementById('next').onclick = () => go(chapter + 1);

document.addEventListener('keydown', e => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') go(chapter + 1);
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(chapter - 1);
});

// Presenter Notes & Fullscreen
const notesBtn = document.getElementById('notesToggle');
notesBtn.onclick = () => {
  document.body.classList.toggle('showNotes');
  const active = document.body.classList.contains('showNotes');
  notesBtn.setAttribute('aria-pressed', active);
  notesBtn.style.borderColor = active ? 'var(--amber)' : 'var(--line)';
};

document.getElementById('fullscreen').onclick = async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    document.getElementById('fullscreen').textContent = 'Use browser F11';
  }
};

/* ============================================================
   SCENE 0: Hero Parameter Likelihood Plot (w0, wa)
   ============================================================ */
let heroShowTruth = false;
function drawHeroPlot() {
  const svg = document.getElementById('heroPlot');
  if (!svg) return;
  
  // Coordinate frame: w0 from -1.4 to -0.6 (x: 60 to 540), wa from -1.0 to 1.0 (y: 380 to 60)
  const px = w0 => 60 + ((w0 - (-1.4)) / 0.8) * 480;
  const py = wa => 380 - ((wa - (-1.0)) / 2.0) * 320;
  
  // Grid lines
  let grid = '';
  for (let w0 = -1.4; w0 <= -0.61; w0 += 0.2) {
    const x = px(w0);
    grid += `<line x1="${x}" y1="50" x2="${x}" y2="390" stroke="#16263f" stroke-width="1"/>`;
    grid += `<text x="${x}" y="415" fill="#64748b" font-size="11" text-anchor="middle" font-family="'JetBrains Mono',monospace">${w0.toFixed(1)}</text>`;
  }
  for (let wa = -1.0; wa <= 1.01; wa += 0.5) {
    const y = py(wa);
    grid += `<line x1="50" y1="${y}" x2="550" y2="${y}" stroke="#16263f" stroke-width="1"/>`;
    grid += `<text x="40" y="${y + 4}" fill="#64748b" font-size="11" text-anchor="end" font-family="'JetBrains Mono',monospace">${wa.toFixed(1)}</text>`;
  }

  // Lambda-CDM True Marker at (-1.0, 0.0)
  const trueX = px(-1.0), trueY = py(0.0);
  
  // Inferred Marker at (-0.84, +0.38)
  const infX = px(-0.84), infY = py(0.38);

  let content = `
    <!-- Background Grid -->
    ${grid}
    <text x="300" y="435" fill="#94a3b8" font-size="12" text-anchor="middle" font-family="'Space Grotesk',sans-serif">Dark Energy Equation of State w₀</text>
    <text x="20" y="220" fill="#94a3b8" font-size="12" text-anchor="middle" transform="rotate(-90,20,220)" font-family="'Space Grotesk',sans-serif">Evolution Parameter wₐ</text>
    
    <!-- Inferred Likelihood Contours -->
    <g transform="translate(${infX}, ${infY}) rotate(-32)">
      <ellipse rx="130" ry="52" fill="rgba(0, 245, 212, 0.06)" stroke="#00f5d4" stroke-width="1" stroke-opacity="0.4"/>
      <ellipse rx="85" ry="34" fill="rgba(0, 245, 212, 0.12)" stroke="#00f5d4" stroke-width="1.5" stroke-opacity="0.8"/>
      <ellipse rx="42" ry="18" fill="rgba(0, 245, 212, 0.25)" stroke="#00f5d4" stroke-width="2"/>
    </g>
    <circle cx="${infX}" cy="${infY}" r="4" fill="#00f5d4"/>
    <text x="${infX + 15}" y="${infY - 20}" fill="#00f5d4" font-size="13" font-weight="700" font-family="'Space Grotesk',sans-serif">Inferred Fit (w ≠ -1)</text>
    <text x="${infX + 15}" y="${infY - 5}" fill="#6ee7b7" font-size="11" font-family="'JetBrains Mono',monospace">χ²/dof = 1.01</text>
  `;

  if (heroShowTruth) {
    content += `
      <!-- Vector of injected bias -->
      <line x1="${trueX}" y1="${trueY}" x2="${infX}" y2="${infY}" stroke="#ff5400" stroke-width="2.5" stroke-dasharray="4 4"/>
      <!-- True point -->
      <circle cx="${trueX}" cy="${trueY}" r="6" fill="#ffb703" stroke="#fff" stroke-width="1.5"/>
      <path d="M${trueX - 10} ${trueY}h20M${trueX} ${trueY - 10}v20" stroke="#ffb703" stroke-width="2"/>
      <text x="${trueX}" y="${trueY + 24}" fill="#ffb703" font-size="13" font-weight="700" text-anchor="middle" font-family="'Space Grotesk',sans-serif">True ΛCDM (w₀ = -1, wₐ = 0)</text>
      <text x="310" y="240" fill="#ff5400" font-size="11" font-family="'JetBrains Mono',monospace" font-weight="600">Unmodeled Dust Drift: +0.03 mag</text>
    `;
  } else {
    content += `
      <circle cx="${trueX}" cy="${trueY}" r="3" fill="#334155"/>
    `;
  }

  svg.innerHTML = content;
}

const btnObs = document.getElementById('viewObserver');
const btnTru = document.getElementById('viewTruth');
if (btnObs && btnTru) {
  btnObs.onclick = () => {
    heroShowTruth = false;
    btnObs.classList.add('active');
    btnTru.classList.remove('active');
    document.getElementById('heroPlotStatus').style.display = 'block';
    document.getElementById('heroPlotTruth').style.display = 'none';
    drawHeroPlot();
  };
  btnTru.onclick = () => {
    heroShowTruth = true;
    btnTru.classList.add('active');
    btnObs.classList.remove('active');
    document.getElementById('heroPlotStatus').style.display = 'none';
    document.getElementById('heroPlotTruth').style.display = 'block';
    drawHeroPlot();
  };
}
drawHeroPlot();

/* ============================================================
   SCENE 1: Supernova Hubble Diagram & Residual Experiment
   ============================================================ */
let experimentRevealed = false;
const driftSlider = document.getElementById('drift');

// Pre-generate 30 deterministic mock SN points across redshift z = 0.05 to 1.1
const mockSNe = [];
for (let i = 0; i < 32; i++) {
  const z = 0.05 + (i / 31) * 1.05;
  // standard cosmology distance modulus approximation
  const baseMu = 43.1 + 5 * Math.log10(z) + 1.1 * z;
  // deterministic pseudo-random scatter
  const scatter = Math.sin(i * 12.3) * 0.12 + Math.cos(i * 7.7) * 0.05;
  mockSNe.push({ z, mu: baseMu + scatter, scatter });
}

function drawExperiment() {
  const d = Number(driftSlider.value);
  const svg = document.getElementById('experimentPlot');
  if (!svg) return;

  // Layout: Top panel: Hubble Diagram (y: 30 to 220), Bottom panel: Residuals (y: 250 to 350)
  // X axis: Redshift z in [0.0, 1.2] mapped to [80, 720]
  const px = z => 80 + (z / 1.2) * 640;
  // Hubble Mu axis: 35 to 46 mapped to [210, 40]
  const pyMu = mu => 210 - ((mu - 35) / 11) * 170;
  // Residual Axis: -0.5 to +0.5 mag mapped to [340, 260]
  const pyRes = res => 300 - (res / 0.5) * 40;

  let grid = '';
  // Vertical z ticks
  for (let z = 0.2; z <= 1.2; z += 0.2) {
    const x = px(z);
    grid += `<line x1="${x}" y1="30" x2="${x}" y2="350" stroke="#14233c" stroke-width="1"/>`;
    grid += `<text x="${x}" y="368" fill="#64748b" font-size="11" text-anchor="middle" font-family="'JetBrains Mono',monospace">z=${z.toFixed(1)}</text>`;
  }

  // Top baseline curves
  // True curve (d=0)
  let trueCurve = '';
  // Shifted model curve matching systematic
  let modelCurve = '';
  for (let z = 0.05; z <= 1.21; z += 0.02) {
    const trueMu = 43.1 + 5 * Math.log10(z) + 1.1 * z;
    const shift = (d * 0.04) * (z / 1.2); // chromatic drift aligned with w
    const inferredMu = trueMu + shift;
    
    trueCurve += (trueCurve ? 'L' : 'M') + px(z).toFixed(1) + ' ' + pyMu(trueMu).toFixed(1);
    modelCurve += (modelCurve ? 'L' : 'M') + px(z).toFixed(1) + ' ' + pyMu(inferredMu).toFixed(1);
  }

  // Draw Supernova points and residuals
  let points = '';
  let resPoints = '';
  mockSNe.forEach(sn => {
    // observed mu has the systematic shift baked into the simulation!
    const obsShift = (d * 0.04) * (sn.z / 1.2);
    const obsMu = sn.mu + obsShift;
    const x = px(sn.z);
    const y = pyMu(obsMu);
    points += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#00f5d4" opacity="0.8"/>`;
    
    // Residual against the INFERRED curve: perfectly flat scatter!
    const resY = pyRes(sn.scatter);
    resPoints += `<line x1="${x.toFixed(1)}" y1="${(resY - 8).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(resY + 8).toFixed(1)}" stroke="#00f5d4" stroke-opacity="0.3"/>`;
    resPoints += `<circle cx="${x.toFixed(1)}" cy="${resY.toFixed(1)}" r="2.5" fill="#00f5d4"/>`;
  });

  // Zero residual line
  const zeroResY = pyRes(0);
  const resLine = `<line x1="80" y1="${zeroResY}" x2="720" y2="${zeroResY}" stroke="#334155" stroke-width="1.5" stroke-dasharray="3 3"/>`;

  let content = `
    ${grid}
    <!-- Labels -->
    <text x="80" y="24" fill="#94a3b8" font-size="11" font-weight="700" font-family="'Space Grotesk',sans-serif">DISTANCE MODULUS μ(z)</text>
    <text x="80" y="244" fill="#94a3b8" font-size="11" font-weight="700" font-family="'Space Grotesk',sans-serif">HUBBLE RESIDUALS Δμ (mag)</text>

    <!-- Inferred Fit Curve -->
    <path d="${modelCurve}" fill="none" stroke="#00f5d4" stroke-width="2.5"/>
    <text x="640" y="${pyMu(43.1 + 5*Math.log10(1.1) + 1.1*1.1 + d*0.04) - 12}" fill="#00f5d4" font-size="11" font-family="'JetBrains Mono',monospace" font-weight="600">Inferred Model Fit</text>

    ${points}

    <!-- Residual Panel -->
    ${resLine}
    ${resPoints}
  `;

  if (experimentRevealed) {
    content += `
      <!-- True Cosmology Curve Revealed -->
      <path d="${trueCurve}" fill="none" stroke="#ffb703" stroke-width="2" stroke-dasharray="4 4"/>
      <text x="640" y="${pyMu(43.1 + 5*Math.log10(1.1) + 1.1*1.1) + 20}" fill="#ffb703" font-size="11" font-family="'JetBrains Mono',monospace" font-weight="600">Ground Truth (ΛCDM)</text>
      <!-- Injected fault vector in residual panel -->
      <rect x="250" y="242" width="280" height="22" rx="4" fill="rgba(255, 51, 102, 0.15)" stroke="#ff3366"/>
      <text x="390" y="257" fill="#ff3366" font-size="11" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-weight="600">UNMODELED DRIFT ABSORBED: Δw = +${(d * 0.08).toFixed(2)}</text>
    `;
  }

  svg.innerHTML = content;

  // Update readouts
  const inferredW = (-1.00 + d * 0.08).toFixed(2);
  document.getElementById('driftValue').textContent = d.toFixed(1) + 'σ';
  document.getElementById('estimate').textContent = 'w = ' + inferredW;
  document.getElementById('bias').textContent = experimentRevealed ? '+' + (d * 0.08).toFixed(2) + ' (Biased)' : 'Sealed';
  document.getElementById('bias').style.color = experimentRevealed ? 'var(--coral)' : 'var(--muted)';
  
  const tag = document.getElementById('degeneracyTag');
  if (d > 0.3) {
    tag.textContent = 'Systematic perfectly masquerading as dark energy';
    tag.className = 'coral';
  } else {
    tag.textContent = 'Degeneracy in plain sight';
    tag.className = 'cyan';
  }
}

if (driftSlider) {
  driftSlider.addEventListener('input', drawExperiment);
}

const revealBtn = document.getElementById('reveal');
if (revealBtn) {
  revealBtn.onclick = () => {
    experimentRevealed = !experimentRevealed;
    revealBtn.textContent = experimentRevealed ? 'Seal evaluator truth' : 'Reveal evaluator truth';
    revealBtn.classList.toggle('amber-btn', !experimentRevealed);
    document.getElementById('revealText').textContent = experimentRevealed 
      ? 'The fit passed with flying colors (χ²/dof = 1.02), yet the cosmological parameter is severely corrupted. Standard optimization cannot detect what is collinear with the model response.'
      : 'The analyst sees only the data and fit. The evaluator holds the sealed injection manifest.';
    drawExperiment();
  };
}
drawExperiment();

/* ============================================================
   SCENE 2: Engine & Air Gap Interactive Triggers
   ============================================================ */
const btnZero = document.getElementById('btnInjectZero');
const btnDust = document.getElementById('btnInjectDust');
if (btnZero && btnDust) {
  btnZero.onclick = () => {
    alert("Simulated Air-Gap Injection:\n[Evaluator Vault]: Planted +0.03 mag filter zero-point drift.\n[Air-Gap]: Metadata scrubbed. Seeds hashed.\n[Analyst Sandbox]: Received sanitized FITS. Baseline fit reports χ²/dof = 1.01. Parameter w drifts by +0.09 undetected.");
  };
  btnDust.onclick = () => {
    alert("Simulated Air-Gap Injection:\n[Evaluator Vault]: Planted Rv = 2.4 host-dust extinction anomaly in high-mass galaxies.\n[Air-Gap]: Sanitized catalog delivered.\n[Analyst Sandbox]: Baseline BBC reports clean Hubble residuals. Dark energy figure of merit biased by 1.8σ.");
  };
}

/* ============================================================
   SCENE 3: Method Ablation Data & Scorecard
   ============================================================ */
const methodData = [
  {
    tag: 'TIER 01: THE BASELINE IS A RESEARCH RESULT',
    title: 'Can established statistical tests already solve the problem?',
    text: 'Freeze the reference pipeline and calibrate its diagnostics on clean simulations. If a simpler gradient-boosted tree or residual test wins at matched compute cost, it remains the champion.',
    power: '42% (Baseline)',
    powerClass: 'amber',
    bias: '0.85σ (Escapes)',
    biasClass: 'coral',
    falseAlarm: 'Fixed α = 5%',
    cost: '$0.01 / run',
    vulnerability: 'Blind to complex, non-linear multi-band dust variations at high redshift.'
  },
  {
    tag: 'TIER 02: REASONING MUST ADD MEASURABLE VALUE',
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
    tag: 'TIER 03: PERCEPTION EXTENDS HUMAN REACH',
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
    tag: 'TIER 04: COORDINATION IS AN EXPERIMENTAL VARIABLE',
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

document.querySelectorAll('[data-method]').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('[data-method]').forEach(x => x.classList.toggle('selected', x === b));
    const idx = Number(b.dataset.method);
    const m = methodData[idx];
    document.getElementById('methodTag').textContent = m.tag;
    document.getElementById('methodTitle').textContent = m.title;
    document.getElementById('methodText').textContent = m.text;
    
    const pEl = document.getElementById('metricPower');
    pEl.textContent = m.power;
    pEl.className = 'score-badge ' + m.powerClass;

    const bEl = document.getElementById('metricBias');
    bEl.textContent = m.bias;
    bEl.className = 'score-badge ' + m.biasClass;

    document.getElementById('metricFalseAlarm').textContent = m.falseAlarm;
    document.getElementById('metricCost').textContent = m.cost;
    document.getElementById('vulnerabilityText').textContent = m.vulnerability;
  };
});

/* ============================================================
   SCENE 4: Roadmap Phases
   ============================================================ */
const phases = [
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

const timelineEl = document.getElementById('timeline');
if (timelineEl) {
  timelineEl.innerHTML = phases.map((p, i) => 
    `<button data-phase="${i}" class="${i === 1 ? 'highlight' : ''}">${p[0]}<small>${p[1]}</small></button>`
  ).join('');

  function setPhase(i) {
    const p = phases[i];
    document.getElementById('phaseTime').textContent = p[0];
    document.getElementById('phaseTitle').textContent = p[1];
    document.getElementById('phaseSummary').textContent = p[2];
    document.getElementById('phaseData').textContent = p[3];
    document.getElementById('phaseOutput').textContent = p[4];
    document.getElementById('phaseGate').textContent = p[5];
    document.getElementById('phasePeople').textContent = p[6];

    document.querySelectorAll('[data-phase]').forEach(b => b.classList.toggle('active', Number(b.dataset.phase) === i));
    document.getElementById('progress').style.width = [5, 20, 45, 75, 100][i] + '%';
  }

  document.querySelectorAll('[data-phase]').forEach(b => {
    b.onclick = () => setPhase(Number(b.dataset.phase));
  });
  setPhase(0);
}

/* ============================================================
   SCENE 5: Probes & Horizon
   ============================================================ */
const probeData = [
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

document.querySelectorAll('[data-probe]').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('[data-probe]').forEach(x => x.classList.toggle('selected', x === b));
    const p = probeData[Number(b.dataset.probe)];
    document.getElementById('probeTag').textContent = p.tag;
    document.getElementById('probeTitle').textContent = p.title;
    document.getElementById('probeText').textContent = p.text;
    document.getElementById('probeCaution').textContent = p.caution;
  };
});

// Initial Hash Route
const initialChapter = Number(location.hash.slice(1)) || 0;
go(initialChapter);
