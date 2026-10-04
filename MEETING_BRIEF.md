# SENTINEL: Scientific AI under test

Discussion concept for Ayan Mitra, Pipeline Scientist, LSST DESC. September 27, 2026. No collaboration or institutional endorsement is assumed.

## The strongest pitch

We propose a controlled evaluation environment that measures when autonomous scientific analysis can be trusted. Cosmology is the first demanding application: plausible analyses can produce precise but biased constraints when calibration, selection or astrophysical assumptions are wrong. We will inject physically motivated faults into simulated surveys, keep the answer key outside the analyst environment, and evaluate whether established diagnostics, individual agents and agent teams identify consequential failures at controlled false alarm rates and measured cost.

The scientific question is not whether an agent can execute a pipeline. It is which failures remain invisible, what evidence is needed to expose them, and whether AI changes that boundary.

## Why this is worth pursuing

The valuable result is an empirical map of scientific reliability, including limits and null results. A generic agent wrapper is unlikely to establish strong novelty. A carefully designed benchmark can produce insight into identifiability, selection of diagnostics, correlated reasoning errors and transfer across inference problems. Its novelty still needs a systematic review of blinded cosmology challenges, robustness methods and scientific agent evaluations.

The proposed contribution is the connection between physically meaningful perturbations and the inference pipeline.

## A five minute meeting sequence

1. Open with the question: what if the wrong universe passes the test?
2. Drag the demonstration slider and reveal the evaluator truth. Explain that it is an analytic illustration, not a SNANA forecast or measured agent performance.
3. Show the separated evaluator and analyst architecture. Explain how access control and untouched evaluation cases prevent answer leakage.
4. Show the four experimental conditions. Explicitly allow a simple baseline to win.
5. Ask to jointly scope a twelve week pilot with one injection family, a fixed cosmological target, a resource ceiling and an independent evaluator.

## Initial science plan

Start with a frozen supernova simulation and analysis configuration. Use repeated clean and perturbed realizations. Select injection amplitudes from physically justified bounds, not only convenient numerical ranges. Keep clean controls, evaluation seeds and at least some systematic families out of adaptive development. Report detection power at a specified false alarm rate, bias in a fixed reference covariance, interval coverage, attribution and compute cost. Include uncertainty intervals on benchmark scores. A single successful injection is a demonstration, not a measured reliability rate.

Test established diagnostics first, then a single agent, then optional specialist or foundation model tools, then agent coordination. Match information access. Compare both fixed budgets and performance as a function of cost. An agent team is a treatment to evaluate, not the assumed solution.

A failure to detect an unidentifiable perturbation is not necessarily deficient reasoning. Evaluate whether an agent requests external calibration, acknowledges uncertainty or abstains appropriately. Simulated truth does not establish that the real universe follows the simulator.

## Roadmap and scope discipline

Weeks 1 to 4: reproducible baseline, one validated injection, clean controls and resource measurements.

Weeks 5 to 12: blinded pilot, leakage audit, baseline comparison and preliminary failure map.

Months 4 to 9: multiple SN families, uncertainty estimates, ablations and a documented benchmark release, subject to data and software permissions.

Months 10 to 18: one lensing and clustering adapter with a responsible probe specialist.

Months 19 to 36: joint inference with shared nuisance effects and explicit covariance. CMB and other scientific domains remain conditional extensions rather than initial obligations.

## Funding and the immediate timing decision

The current relevant NSF program is Astronomical Sciences Core Research, formerly AAG. It supports computational and AI astronomy and requires a clear astronomical context. It also highlights Rubin readiness. This suggests a science led proposal rather than a general infrastructure pitch. [Program description](https://www.nsf.gov/funding/opportunities/astro-core-astronomical-sciences-core-research).

NSF 26 522 lists November 16, 2026 as a target date, not an absolute deadline. Proposals are accepted at any time, but later submissions may be reviewed in the following fiscal year. A twelve week pilot beginning in late September would finish after that target. Decide with the program officer whether current evidence supports a November proposal or whether a later submission is scientifically stronger. [Current solicitation](https://www.nsf.gov/funding/opportunities/mps-astro-mps-astronomical-sciences-research-programs/nsf26-522/solicitation).

Do not choose a large dollar figure for effect. Cost named scientific responsibilities: domain leadership, research software engineering, student training, independent evaluation, compute, model access and maintenance. Have institutional administration supply salary, benefits, overhead and eligibility information. Seek a pilot commitment first. Institutional seed support or available compute may help, but none is assumed.

Broader impacts should be concrete: openly documented benchmark protocols where permissions permit, student research training, reproducibility exercises and adoption tutorials. Do not imply that building a website alone satisfies broader impacts.

## Position relative to large models

AION is an astronomical representation model, not a replacement for a forward simulator or an evaluation protocol. AstroM3 and FALCO illustrate relevant time series learning directions. Their scale or task accuracy does not establish cosmology reliability. Use pretrained models when the benchmark demonstrates value; do not promise to outscale them. [AION](https://arxiv.org/abs/2510.17960), [AstroM3](https://arxiv.org/abs/2411.08842), [FALCO](https://arxiv.org/abs/2504.20290).

SNANA is community infrastructure. This project does not depend on a differentiable rewrite. Start with bounded black box search only if the computational budget supports it. Gradients can be an optional future tool, not an ownership or credit claim. [SNANA](https://github.com/RickKessler/SNANA).

## Presentation controls

Open the interactive presentation and use the arrow keys or chapter navigation. The experiment slider changes the injected parameter displacement. The reveal button shows evaluator truth. Method buttons, roadmap phases and probe buttons expose details. Presenter notes supply cautions and a talk track. Print brief uses the browser print dialogue. All numerical illustrations are explicitly conceptual; benchmark results remain pending.
