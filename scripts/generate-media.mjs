import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const PROJECT_ID = 'revatya';
const LOCATION = 'global';

let cachedToken = null;
let cachedTokenTime = 0;

function getAccessToken(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedToken && now - cachedTokenTime < 10 * 60 * 1000) {
    return cachedToken;
  }
  const env = {
    ...process.env,
    CLOUDSDK_METRICS_REQUEST_ATTRIBUTION: 'agent-skills/1.0 (skill:gcloud)',
  };
  try {
    cachedToken = execFileSync(
      'gcloud',
      ['auth', 'application-default', 'print-access-token', `--project=${PROJECT_ID}`, '--quiet'],
      { env, encoding: 'utf8' }
    ).trim();
  } catch {
    cachedToken = execFileSync(
      'gcloud',
      ['auth', 'print-access-token', `--project=${PROJECT_ID}`, '--quiet'],
      { env, encoding: 'utf8' }
    ).trim();
  }
  cachedTokenTime = now;
  return cachedToken;
}

async function fileExistsWithSize(absPath) {
  try {
    const st = await fs.stat(absPath);
    return st.size > 5000 ? st.size : 0;
  } catch {
    return 0;
  }
}

const IMAGE_BRIEFS = [
  // Core Hero & City Perspective Plates
  {
    id: 'orbital-city-hero',
    outputPath: 'public/images/hero/orbital-city-hero.webp',
    aspectRatio: '16:9',
    purpose: 'Hero conceptual architectural visualisation of a vast orbital city from human eye level',
    prompt:
      'Generate a wide 16:9 photorealistic architectural visualisation of a vast orbital city in low Earth orbit, viewed from inside at human eye level. The foreground is a refined public observation gallery with sophisticated minimalist silver and brushed aluminium architectural details, continuous curved glass beams, and subtle warm interior architectural lighting. Through enormous floor-to-ceiling structural windows, the curvature of Earth and atmospheric limb are clearly visible below. In the middle distance outside, interconnected orbital city habitat rings, solar arrays, docking spine infrastructure, and two sleek orbital transfer spacecraft approaching a docking berth suggest a functioning orbital metropolis. Monumental scale, inhabited and interconnected, physically plausible sunlight and Earth albedo, Leica architectural photography, 24mm wide angle lens, no text, no logos, no watermarks, no HUD.',
  },
  {
    id: 'orbital-city-exterior',
    outputPath: 'public/images/city/orbital-city-exterior.webp',
    aspectRatio: '16:9',
    purpose: 'Exterior architectural overview of the interconnected orbital city above Earth',
    prompt:
      'Generate a wide 16:9 photorealistic exterior orbital photograph of a monumental modular space city in Earth orbit. Interconnected habitat rings, central structural logistics spine, large radiator wings, solar power arrays, industrial microgravity bays, and an orbital port with docked cargo transport vehicles. Refined white ceramic, titanium, and brushed silver materials catching crisp orbital sunlight against the deep blue curvature of Earth below. Plausible aerospace engineering, architectural clarity, cinematic scale, no text, no watermarks, no sci-fi neon.',
  },
  {
    id: 'orbital-city-cutaway',
    outputPath: 'public/images/city/orbital-city-cutaway.webp',
    aspectRatio: '16:9',
    purpose: 'Architectural sectional concept showing layered multi-deck interior systems and transit corridors',
    prompt:
      'Generate a wide 16:9 photorealistic architectural sectional perspective inside a large-scale orbital habitat module showing three interconnected deck levels: an upper hydroponic and environmental life-support terrace, a central pedestrian transit concourse with clean pressurized bulkheads, and a lower utility and power distribution spine. Refined white and anodized silver interior architecture, natural-spectrum diffused skylight panels, human scale, aerospace precision, no text, no labels, no watermarks.',
  },
  {
    id: 'orbital-habitation-commons',
    outputPath: 'public/images/city/orbital-habitation-commons.webp',
    aspectRatio: '16:9',
    purpose: 'Habitation and shared civic commons designed for long-duration orbital living',
    prompt:
      'Generate a wide 16:9 photorealistic interior architectural photograph of a serene shared residential commons inside an orbital space city. Curved structural ribs in matte warm white and brushed aluminium, integrated botanical green wall panels for psychological wellbeing, comfortable modular seating, acoustic timber accents, and a large observation viewport revealing the blue curve of Earth. Calm, human-centred Apple-grade architectural minimalism, physically accurate lighting, no text, no watermarks.',
  },

  // Narrative Journey, Vision, Space Economy & Collaboration Bespoke Plates
  {
    id: 'thesis-living-in-orbit',
    outputPath: 'public/images/journey/thesis-living-in-orbit.webp',
    aspectRatio: '16:9',
    purpose: 'Home Section 2 Thesis — Human-eye-level architectural transit and observation gallery at orbital sunrise',
    prompt:
      'Generate a wide 16:9 photorealistic architectural photograph from inside a luminous orbital transit concourse and observation gallery at orbital sunrise. Two aerospace engineers in minimalist dark technical attire stand beside a sweeping curved structural window overlooking the glowing atmospheric limb of Earth and an exterior modular orbital ring connected by pressurized bridges. Warm indirect architectural lighting, brushed titanium and matte white composite structure, serene Apple-grade design clarity, no text, no watermarks.',
  },
  {
    id: 'vision-isolated-vs-connected',
    outputPath: 'public/images/vision/vision-isolated-vs-connected.webp',
    aspectRatio: '16:9',
    purpose: 'Vision Page — Contrasting an approaching crew transport craft with permanent interconnected orbital infrastructure',
    prompt:
      'Generate a wide 16:9 photorealistic orbital photograph showing a sleek crew transport spacecraft in the foreground approaching a massive, permanent interconnected orbital infrastructure network in low Earth orbit. The orbital facility features a long axial utility truss, pressurized habitat rings, docked cargo pods, and wide radiative cooling arrays illuminated by crisp sunlight above a cloud-covered Earth. High-contrast aerospace photography, physically plausible scale, no text, no watermarks.',
  },
  {
    id: 'vision-connected-ecosystem',
    outputPath: 'public/images/vision/vision-connected-ecosystem.webp',
    aspectRatio: '16:9',
    purpose: 'Vision Page — Twilight panoramic view of a multi-district orbital city ecosystem above Earth terminator',
    prompt:
      'Generate a wide 16:9 photorealistic panoramic orbital view above Earths twilight terminator line showing a connected orbital ecosystem: warm interior architectural light glowing softly from habitation windows, research laboratory clusters, microgravity industrial modules, and an illuminated docking port along a central spine. Deep sapphire Earth atmosphere below, realistic aerospace materials, serene monumental architecture, no text, no watermarks.',
  },
  {
    id: 'shared-utility-infrastructure',
    outputPath: 'public/images/economy/shared-utility-infrastructure.webp',
    aspectRatio: '16:9',
    purpose: 'Space Economy — Multi-operator commercial modules and cargo tugs plugged into a shared orbital utility bus',
    prompt:
      'Generate a wide 16:9 photorealistic aerospace engineering visualisation of a shared orbital utility spine in low Earth orbit. Multiple distinct commercial research and manufacturing modules are berthed to standardized radial ports along a central utility core that distributes high-voltage solar power, fluid thermal rejection loops, and automated robotic cargo handling. An orbital transfer tug is berthing a payload container in the midground. Crisp orbital lighting, realistic engineering detail, no text, no watermarks.',
  },
  {
    id: 'multidisciplinary-engineering-deck',
    outputPath: 'public/images/partners/multidisciplinary-engineering-deck.webp',
    aspectRatio: '16:9',
    purpose: 'Partners & Collaboration — Multidisciplinary orbital systems engineering and mission synthesis deck',
    prompt:
      'Generate a wide 16:9 photorealistic interior architectural photograph of an advanced orbital systems engineering and mission synthesis deck. A multidisciplinary team of architects and engineers collaborates around a minimalist glass table showing structural models, while wide observation windows behind them look directly into an active orbital integration bay with a modular habitat node and Earths horizon beyond. Warm neutral lighting, brushed aluminum, calm architectural elegance, no text, no watermarks.',
  },

  // 8 Bespoke City District Plates (Districts 01 to 08)
  {
    id: 'district-01-habitation',
    outputPath: 'public/images/districts/district-01-habitation.webp',
    aspectRatio: '16:9',
    purpose: 'Sector H-01 Habitation — Acoustic-isolated residential crew quarters and circadian neighborhood corridor',
    prompt:
      'Generate a wide 16:9 photorealistic interior architectural photograph of the Habitation District inside an orbital city. A quiet curved residential corridor with private acoustic-isolated cabin doorways, soft circadian ceiling illumination, warm matte composite wall panels, brushed metal handrails, and a recessed radiation-shielded window alcove looking out at Earth. Calm, restorative, human-centred spacecraft architecture, no text, no watermarks.',
  },
  {
    id: 'district-02-orbital-port',
    outputPath: 'public/images/districts/district-02-orbital-port.webp',
    aspectRatio: '16:9',
    purpose: 'Sector P-01 Orbital Port — Axial berthing hub with standardized docking adapters and cargo transfer rails',
    prompt:
      'Generate a wide 16:9 photorealistic orbital photograph of the Axial Orbital Port and Logistics Hub of a space city. Multiple standardized international docking ports, laser approach alignment beacons, automated cargo pallet transfer rails along a metallic truss, and a commercial resupply spacecraft in final soft-capture alignment. Earth limb in background, sharp orbital sunlight, authentic aerospace mechanisms, no text, no watermarks.',
  },
  {
    id: 'district-03-research',
    outputPath: 'public/images/districts/district-03-research.webp',
    aspectRatio: '16:9',
    purpose: 'Sector R-02 Research District — Microgravity-isolated scientific laboratory bay with modular payload racks',
    prompt:
      'Generate a wide 16:9 photorealistic interior of the Research District laboratory module in orbit. Precision vibration-isolated payload racks, a sealed stainless-steel and glass microgravity fluid-physics glovebox, cryogenic sample storage drawers, and an optical Earth-observation instrument port. Clean neutral laboratory lighting, anodized aluminum structure, realistic scientific hardware, no text, no watermarks.',
  },
  {
    id: 'district-04-manufacturing',
    outputPath: 'public/images/districts/district-04-manufacturing.webp',
    aspectRatio: '16:9',
    purpose: 'Sector M-03 Industrial District — Automated orbital crystal growth and optical fiber manufacturing cleanroom',
    prompt:
      'Generate a wide 16:9 photorealistic interior of the Industrial Manufacturing District in an orbital complex. Automated high-purity semiconductor crystal growth furnaces and ZBLAN optical fiber drawing towers housed inside sealed containment enclosures along a cylindrical microgravity cleanroom bay, tended by a precision rail-mounted robotic manipulator. Brushed steel, white cleanroom surfaces, subtle amber and cool white status lighting, no text, no watermarks.',
  },
  {
    id: 'district-05-energy-thermal',
    outputPath: 'public/images/districts/district-05-energy-thermal.webp',
    aspectRatio: '16:9',
    purpose: 'Sector E-04 Energy & Thermal — Monumental deployable radiator wings and sun-tracking solar arrays',
    prompt:
      'Generate a wide 16:9 photorealistic exterior orbital photograph focusing on the Energy and Thermal Management Spine of a space city. Massive deployable white ceramic radiative heat-rejection wings and sun-tracking photovoltaic solar arrays mounted on rotating alpha gimbals, connected to heavy insulated ammonia thermal manifolds and high-voltage DC switchgear modules against deep black space and Earths blue horizon. No text, no watermarks.',
  },
  {
    id: 'district-06-life-support',
    outputPath: 'public/images/districts/district-06-life-support.webp',
    aspectRatio: '16:9',
    purpose: 'Sector L-05 Life Support — Central ECLSS utility core with closed-loop air and water recovery manifolds',
    prompt:
      'Generate a wide 16:9 photorealistic interior engineering photograph of the central Life-Support Infrastructure (ECLSS) utility core inside an orbital city. Modular physico-chemical CO2 scrubbing beds, rotary water distillation and catalytic oxidation columns, color-coded stainless-steel potable water and oxygen manifolds, and automated sector pressure-isolation bulkheads. Immaculate aerospace utility engineering, crisp diagnostic lighting, no text, no watermarks.',
  },
  {
    id: 'district-07-construction-robotics',
    outputPath: 'public/images/districts/district-07-construction-robotics.webp',
    aspectRatio: '16:9',
    purpose: 'Sector C-06 Construction & Robotics — Exterior inchworm robotic manipulators and inspection drones assembling a module',
    prompt:
      'Generate a wide 16:9 photorealistic exterior orbital photograph of the Construction and Maintenance District. Two large track-mounted dexterous robotic manipulator arms and a compact free-flying optical inspection drone are installing a micrometeoroid shield panel onto a newly berthed pressurized habitat module along the orbital city truss spine. High-contrast sunlight in low Earth orbit, realistic robotics, no text, no watermarks.',
  },
  {
    id: 'district-08-shared-environments',
    outputPath: 'public/images/districts/district-08-shared-environments.webp',
    aspectRatio: '16:9',
    purpose: 'Sector S-07 Shared Human Environments — Panoramic Earth-observation cupola and biophilic restorative commons',
    prompt:
      'Generate a wide 16:9 photorealistic interior architectural photograph of the Shared Human Environments cupola in an orbital city. A multi-facet panoramic structural glass dome looks down at oceans and clouds on Earth, surrounded by tiered acoustic seating, warm wood-grain composite surfaces, and vertical hydroponic green plant walls providing psychological restoration for long-duration crews. Serene natural orbital light, Apple-grade minimalism, no text, no watermarks.',
  },

  // 6 Dedicated Application Plates (Applications 01 to 06)
  {
    id: 'microgravity-manufacturing',
    outputPath: 'public/images/applications/microgravity-manufacturing.webp',
    aspectRatio: '16:9',
    purpose: 'Application 01 — Cleanroom microgravity manufacturing bay for specialized crystals and optical fibers',
    prompt:
      'Generate a wide 16:9 photorealistic interior of an advanced orbital microgravity manufacturing facility and cleanroom bay. Precision automated robotic arms and sealed crystal-growth and optical fiber drawing containment chambers mounted along a cylindrical zero-gravity industrial spine. Brushed stainless steel, white cleanroom panels, subtle cool task lighting, high-precision aerospace hardware, realistic engineering environment, no text, no logos, no watermarks.',
  },
  {
    id: 'orbital-logistics-port',
    outputPath: 'public/images/applications/orbital-logistics-port.webp',
    aspectRatio: '16:9',
    purpose: 'Application 02 — Orbital logistics port, docking berths, and automated cargo handling infrastructure',
    prompt:
      'Generate a wide 16:9 photorealistic exterior view of an orbital logistics port and docking hub attached to a large space city. A reusable orbital cargo tug is aligned with a standardized berthing mechanism while articulated robotic cranes transfer pressurized logistics containers along an exterior truss spine. Earth horizon in the background, crisp high-contrast orbital sunlight, realistic spacecraft thermal blankets and metallic surfaces, no text, no watermarks.',
  },
  {
    id: 'orbital-research-lab',
    outputPath: 'public/images/applications/orbital-research-lab.webp',
    aspectRatio: '16:9',
    purpose: 'Application 03 — Orbital scientific laboratory for life sciences, fluid physics, and closed-loop research',
    prompt:
      'Generate a wide 16:9 photorealistic interior of a modern orbital research laboratory. Modular scientific payload racks, sealed fluid-physics gloveboxes, and bioregenerative plant-growth test chambers arranged along a wide curved laboratory corridor. Two researchers in clean minimalist technical workwear inspecting an experiment module. Crisp architectural lighting, credible aerospace laboratory hardware, no text, no watermarks.',
  },
  {
    id: 'app-04-space-resource-utilisation',
    outputPath: 'public/images/applications/app-04-space-resource-utilisation.webp',
    aspectRatio: '16:9',
    purpose: 'Application 04 — In-situ space resource utilisation and volatile processing demonstration rig',
    prompt:
      'Generate a wide 16:9 photorealistic deep-space engineering visualisation of a robotic space resource utilisation and volatile extraction lander anchored to a dark regolith asteroid surface. Solar-thermal concentrator mirrors and a sealed regolith volatile processing reactor extract water ice into spherical cryogenic storage tanks, with stars and a distant prospecting relay satellite in deep space. Realistic aerospace hardware, no sci-fi lasers, no text, no watermarks.',
  },
  {
    id: 'app-05-habitation-training',
    outputPath: 'public/images/applications/app-05-habitation-training.webp',
    aspectRatio: '16:9',
    purpose: 'Application 05 — Specialist crew habitation, pre-mission training, and commercial human spaceflight deck',
    prompt:
      'Generate a wide 16:9 photorealistic interior architectural view of a professional orbital habitation and crew training deck. Two specialist crew members in clean flight suits float gently near an ergonomic workstation and medical telemetry suite, with a wide reinforced viewport showing Earths curvature and a docked crew capsule outside. Refined matte white and brushed aluminum interior, warm human-centred lighting, no text, no watermarks.',
  },
  {
    id: 'app-06-assembly-servicing',
    outputPath: 'public/images/applications/app-06-assembly-servicing.webp',
    aspectRatio: '16:9',
    purpose: 'Application 06 — In-orbit structural assembly and spacecraft servicing bay assembling a large aperture reflector',
    prompt:
      'Generate a wide 16:9 photorealistic exterior orbital photograph of an unpressurized in-orbit assembly and servicing workbay attached to a space city spine. Precision dexterous robotic arms assemble hexagonal mirror segments onto a large-aperture space telescope bus held in a rotatable servicing cradle, with Earths blue atmosphere below. Crisp orbital sunlight, gold multi-layer insulation, realistic aerospace engineering, no text, no watermarks.',
  },

  // 5 Bespoke Roadmap Stage Plates (Stages 01 to 05)
  {
    id: 'stage-01-foundational-research',
    outputPath: 'public/images/roadmap/stage-01-foundational-research.webp',
    aspectRatio: '16:9',
    purpose: 'Stage 01 Foundational Research — Terrestrial systems engineering and orbital architecture research studio',
    prompt:
      'Generate a wide 16:9 photorealistic interior architectural photograph of a terrestrial aerospace systems-engineering research studio. Large high-resolution glass displays and architectural drafting tables show wireframes of orbital habitat rings, ECLSS mass-balance diagrams, and astrodynamics trajectories. Minimalist concrete, brushed steel, and warm indirect lighting, quiet intellectual focus, no readable text, no watermarks.',
  },
  {
    id: 'stage-02-subsea-analog',
    outputPath: 'public/images/roadmap/stage-02-subsea-analog.webp',
    aspectRatio: '16:9',
    purpose: 'Stage 02 Extreme-Environment Test Programmes — Pressurized subsea closed-environment analog habitat on the ocean floor',
    prompt:
      'Generate a wide 16:9 photorealistic underwater architectural photograph of a pressurized cylindrical subsea analog research habitat anchored on a rocky continental shelf in deep clear cobalt-blue ocean water. Warm interior light glows through thick circular viewports while exterior environmental sensor pods and umbilical telemetry cables test closed-loop habitat monitoring. Realistic marine engineering, cinematic natural underwater light rays, no text, no watermarks.',
  },
  {
    id: 'stage-03-system-prototypes',
    outputPath: 'public/images/roadmap/stage-03-system-prototypes.webp',
    aspectRatio: '16:9',
    purpose: 'Stage 03 Technology & System Prototypes — Full-scale orbital docking and ECLSS prototype in a thermal-vacuum chamber',
    prompt:
      'Generate a wide 16:9 photorealistic aerospace test-facility photograph showing a full-scale metallic orbital docking ring and modular life-support utility bulkhead prototype mounted inside an open stainless-steel thermal-vacuum test chamber on Earth. Bundled sensor harnesses, optical laser metrology trackers, and cleanroom lighting reflect off the chamber walls. Authentic hardware-in-the-loop qualification environment, no text, no watermarks.',
  },
  {
    id: 'stage-04-initial-orbital-node',
    outputPath: 'public/images/roadmap/stage-04-initial-orbital-node.webp',
    aspectRatio: '16:9',
    purpose: 'Stage 04 Initial Orbital Infrastructure Concept — First minimum-viable orbital platform module in LEO',
    prompt:
      'Generate a wide 16:9 photorealistic orbital photograph of an initial minimum-viable orbital infrastructure platform in low Earth orbit: a single large core habitat and research module with four radial berthing nodes, symmetric solar and radiator wings, and one visiting crew spacecraft docked at the forward port. Earths curved blue horizon below, crisp sunlight, realistic near-term commercial space station engineering, no text, no watermarks.',
  },
  {
    id: 'stage-05-city-expansion',
    outputPath: 'public/images/roadmap/stage-05-city-expansion.webp',
    aspectRatio: '16:9',
    purpose: 'Stage 05 Expansion Toward a City — Mature multi-ring expandable orbital city complex in low Earth orbit',
    prompt:
      'Generate a wide 16:9 photorealistic orbital photograph of a mature, expanded orbital city in low Earth orbit, evolved from a central spine into multiple concentric habitation rings, research sectors, industrial bays, and an active orbital port with multiple spacecraft. Dramatic high-altitude view above Earths cloud deck and sunlit ocean, refined white and titanium aerospace architecture, no text, no watermarks.',
  },

  // 8 Bespoke Research Programme Plates (RP-01 to RP-08)
  {
    id: 'rp-01-eclss-loop',
    outputPath: 'public/images/research/rp-01-eclss-loop.webp',
    aspectRatio: '16:9',
    purpose: 'RP-01 Habitat Systems & Life Support — Dual-tier closed-loop air and water recovery hardware rack',
    prompt:
      'Generate a wide 16:9 photorealistic close-up engineering photograph of an advanced closed-loop Environmental Control and Life Support System (ECLSS) test rack. Precision stainless-steel fluid tubing, catalytic water purification columns, automated pressure isolation valves, and inline microbial/air-quality optical sensors housed in a modular spacecraft utility frame. Crisp laboratory lighting, high engineering realism, no text, no watermarks.',
  },
  {
    id: 'rp-02-radiation-shielding',
    outputPath: 'public/images/research/rp-02-radiation-shielding.webp',
    aspectRatio: '16:9',
    purpose: 'RP-02 Radiation & Human Health — Multi-layer hydrogen-rich water-wall radiation shielding cutaway',
    prompt:
      'Generate a wide 16:9 photorealistic architectural cutaway mockup of a spacecraft radiation storm shelter wall assembly: outer micrometeoroid Whipple bumper, structural aluminum-lithium pressure hull, concentric translucent high-density polyethylene and modular potable water-wall bladders, and an inner acoustic crew sleeping berth fitted with solid-state active radiation dosimeters. Clean studio engineering lighting, no text, no watermarks.',
  },
  {
    id: 'rp-03-modular-coupler',
    outputPath: 'public/images/research/rp-03-modular-coupler.webp',
    aspectRatio: '16:9',
    purpose: 'RP-03 Orbital Architecture & Construction — Standardized structural, power, fluid, and data berthing coupler',
    prompt:
      'Generate a wide 16:9 photorealistic aerospace engineering close-up of a standardized orbital module interconnect mechanism in space. Precision CNC-machined titanium docking latches, automated blind-mate high-voltage DC electrical connectors, dual-seal thermal fluid quick-disconnects, and fiber-optic data couplings joining two pressurized habitat bulkheads. Sharp orbital lighting, no text, no watermarks.',
  },
  {
    id: 'rp-04-thermal-heat-rejection',
    outputPath: 'public/images/research/rp-04-thermal-heat-rejection.webp',
    aspectRatio: '16:9',
    purpose: 'RP-04 Power & Thermal Systems — High-capacity heat-exchanger manifold and deployable radiator array',
    prompt:
      'Generate a wide 16:9 photorealistic exterior orbital engineering view of a spacecraft active thermal control system: a dual-loop brazed heat-exchanger manifold at the base of a large deployable white radiator wing in low Earth orbit, with micrometeoroid-armored coolant conduits and sun-tracking solar arrays in the background. Deep space contrast, authentic aerospace hardware, no text, no watermarks.',
  },
  {
    id: 'rp-05-human-factors-acoustics',
    outputPath: 'public/images/research/rp-05-human-factors-acoustics.webp',
    aspectRatio: '16:9',
    purpose: 'RP-05 Human Factors & Habitation — Volumetric crew cabin mockup with acoustic panels and circadian lighting',
    prompt:
      'Generate a wide 16:9 photorealistic interior architectural photograph of a long-duration orbital crew quarter and human-factors mockup. Micro-perforated acoustic dampening panels, warm tunable circadian LED light coves, a private sleep alcove with personal storage, and a clean unobstructed emergency egress corridor leading to a pressure hatch. Calm, humane, Apple-inspired industrial design, no text, no watermarks.',
  },
  {
    id: 'rp-06-automated-cargo-handling',
    outputPath: 'public/images/research/rp-06-automated-cargo-handling.webp',
    aspectRatio: '16:9',
    purpose: 'RP-06 Orbital Logistics & Services — Automated pressurized cargo transfer airlock and robotic pallet rail',
    prompt:
      'Generate a wide 16:9 photorealistic interior view of an automated orbital logistics transfer corridor and cargo airlock. Standardized modular cargo pallets move smoothly along an overhead robotic guide rail from a docked spacecraft hatch into organized pressurized storage bays with optical barcode/RFID scanners. Clean metallic and white composite architecture, no text, no watermarks.',
  },
  {
    id: 'rp-07-microgravity-crystallisation',
    outputPath: 'public/images/research/rp-07-microgravity-crystallisation.webp',
    aspectRatio: '16:9',
    purpose: 'RP-07 Manufacturing & Industrial Applications — Vibration-isolated magnetic levitation furnace in microgravity',
    prompt:
      'Generate a wide 16:9 photorealistic close-up engineering view inside a microgravity materials research rack: a transparent quartz and stainless-steel containerless processing chamber where a glowing molten alloy droplet floats in weightlessness, surrounded by laser heating optics, active magnetic vibration-isolation actuators, and high-speed metrology cameras. Authentic space laboratory hardware, no text, no watermarks.',
  },
  {
    id: 'rp-08-orbital-traffic-governance',
    outputPath: 'public/images/research/rp-08-orbital-traffic-governance.webp',
    aspectRatio: '16:9',
    purpose: 'RP-08 Economics, Governance & Sustainability — Orbital traffic coordination and debris safety monitoring console',
    prompt:
      'Generate a wide 16:9 photorealistic interior photograph of an orbital operations and traffic governance workstation inside a space city. A curved minimalist glass display shows 3D orbital debris conjunction ellipsoids, safe approach corridors, and multi-tenant power/thermal utility allocation graphs, while through a viewport ahead an visiting spacecraft holds at a safe stand-off waypoint above Earth. No readable text, no watermarks.',
  },
  {
    id: 'asteroid-prospecting-concept',
    outputPath: 'public/images/research/asteroid-prospecting-concept.webp',
    aspectRatio: '16:9',
    purpose: 'Long-horizon robotic asteroid prospecting probe inspecting a near-Earth carbonaceous body',
    prompt:
      'Generate a wide 16:9 photorealistic deep-space engineering visualisation of an autonomous robotic prospecting spacecraft hovering near the rugged surface of a dark carbonaceous near-Earth asteroid. The probe features high-efficiency solar arrays, optical and spectroscopic sensor turrets, and a compact surface sampling mechanism illuminated by crisp directional sunlight against deep space. Plausible aerospace engineering, no laser beams, no text, no watermarks.',
  },
];

const VEO_MODEL_ID = 'veo-3.1-generate-001';

const VEO_PROMPT =
  'Silent, seamless loopable cinematic architectural shot from inside a refined orbital city observation gallery looking out through monumental glass windows at Earth rotating gently below. Outside the window, interconnected silver and white orbital city rings and a docked spacecraft gleam in calm orbital sunlight. Slow, ultra-smooth forward camera drift, physically accurate lighting, serene atmosphere, no text, no HUD, no watermark.';

const IMAGE_ENDPOINTS = [
  { type: 'gemini', modelId: 'gemini-2.5-flash-image', location: 'global' },
  { type: 'gemini', modelId: 'gemini-2.5-flash-image', location: 'us-central1' },
  { type: 'gemini', modelId: 'gemini-2.5-flash-image', location: 'us-east4' },
  { type: 'gemini', modelId: 'gemini-2.5-flash-image', location: 'us-west1' },
  { type: 'gemini', modelId: 'gemini-2.5-flash-image', location: 'europe-west1' },
  { type: 'gemini', modelId: 'gemini-2.5-flash-image', location: 'europe-west4' },
];

async function generateStillImage(brief, itemIdx = 0) {
  const absOut = path.resolve(process.cwd(), brief.outputPath);
  const existingBytes = await fileExistsWithSize(absOut);
  if (existingBytes > 0) {
    console.log(
      `[Image] Skipping ${brief.id} (already exists: ${Math.round(existingBytes / 1024)} KB)`
    );
    return {
      id: brief.id,
      outputPath: `/${brief.outputPath.replace(/^public\//, '')}`,
      model: 'gemini-2.5-flash-image',
      purpose: brief.purpose,
      prompt: brief.prompt,
      bytes: existingBytes,
      generatedAt: new Date().toISOString(),
    };
  }

  for (let attempt = 0; attempt < 12; attempt++) {
    const target = IMAGE_ENDPOINTS[(itemIdx + attempt) % IMAGE_ENDPOINTS.length];
    const token = getAccessToken(attempt > 3);
    const host =
      target.location === 'global'
        ? 'https://aiplatform.googleapis.com'
        : `https://${target.location}-aiplatform.googleapis.com`;

    console.log(
      `[Image] Generating ${brief.id} via ${target.modelId} (${target.location}) [attempt ${attempt + 1}/12]...`
    );

    let response;
    try {
      if (target.type === 'gemini') {
        const endpoint = `${host}/v1/projects/${PROJECT_ID}/locations/${target.location}/publishers/google/models/${target.modelId}:generateContent`;
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: brief.prompt }],
              },
            ],
            generationConfig: {
              responseModalities: ['TEXT', 'IMAGE'],
            },
          }),
        });
      } else {
        const endpoint = `${host}/v1/projects/${PROJECT_ID}/locations/${target.location}/publishers/google/models/${target.modelId}:predict`;
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instances: [{ prompt: brief.prompt }],
            parameters: {
              sampleCount: 1,
              aspectRatio: '16:9',
              personGeneration: 'allow_adult',
            },
          }),
        });
      }
    } catch (err) {
      console.warn(`[Image] Network error on ${brief.id} (${target.modelId}): ${err.message}`);
      await new Promise((r) => setTimeout(r, 2500));
      continue;
    }

    if (response.status === 429 || response.status === 503 || response.status === 404) {
      const waitMs = 2000 + (attempt % 4) * 2000;
      console.warn(
        `[Image] HTTP ${response.status} on ${brief.id} (${target.modelId}@${target.location}); rotating endpoint in ${Math.round(waitMs / 1000)}s...`
      );
      await new Promise((r) => setTimeout(r, waitMs));
      continue;
    }

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[Image] HTTP ${response.status} from ${target.modelId}: ${errText.slice(0, 200)}`);
      await new Promise((r) => setTimeout(r, 2500));
      continue;
    }

    const data = await response.json();
    let b64Data = null;

    if (target.type === 'gemini') {
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const imgPart = parts.find((p) => p?.inlineData?.data);
      b64Data = imgPart?.inlineData?.data || null;
    } else {
      b64Data = data?.predictions?.[0]?.bytesBase64Encoded || null;
    }

    if (!b64Data) {
      console.warn(`[Image] No image payload on attempt ${attempt + 1} for ${brief.id}, rotating...`);
      await new Promise((r) => setTimeout(r, 2500));
      continue;
    }

    const rawBuffer = Buffer.from(b64Data, 'base64');
    await fs.mkdir(path.dirname(absOut), { recursive: true });

    await sharp(rawBuffer)
      .resize({ width: 1600, height: 900, fit: 'cover', position: 'entropy' })
      .webp({ quality: 86, effort: 5 })
      .toFile(absOut);

    const stat = await fs.stat(absOut);
    console.log(
      `[Image] Saved ${brief.outputPath} (${Math.round(stat.size / 1024)} KB) using ${target.modelId}@${target.location}`
    );

    return {
      id: brief.id,
      outputPath: `/${brief.outputPath.replace(/^public\//, '')}`,
      model: `${target.modelId}@${target.location}`,
      purpose: brief.purpose,
      prompt: brief.prompt,
      bytes: stat.size,
      generatedAt: new Date().toISOString(),
    };
  }

  throw new Error(`Exhausted retries for ${brief.id}`);
}

async function generateHeroVideoVeo3() {
  const outputPath = 'public/video/orbital-city-hero-loop.mp4';
  const absOut = path.resolve(process.cwd(), outputPath);
  const existingBytes = await fileExistsWithSize(absOut);
  if (existingBytes > 0) {
    console.log(
      `[Veo 3] Skipping ${outputPath} (already exists: ${Math.round(existingBytes / 1024)} KB)`
    );
    return {
      id: 'orbital-city-hero-loop',
      outputPath: '/video/orbital-city-hero-loop.mp4',
      model: VEO_MODEL_ID,
      purpose: 'Silent, loopable cinematic hero ambient video of the orbital city',
      prompt: VEO_PROMPT,
      bytes: existingBytes,
      generatedAt: new Date().toISOString(),
    };
  }

  await fs.mkdir(path.dirname(absOut), { recursive: true });

  const token = getAccessToken();
  const startUrl = `https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${VEO_MODEL_ID}:predictLongRunning`;
  console.log(`[Veo 3] Starting video generation using ${VEO_MODEL_ID}...`);

  const startRes = await fetch(startUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instances: [{ prompt: VEO_PROMPT }],
      parameters: {
        aspectRatio: '16:9',
        sampleCount: 1,
        durationSeconds: 8,
        enhancePrompt: true,
        generateAudio: false,
      },
    }),
  });

  if (!startRes.ok) {
    const errText = await startRes.text();
    throw new Error(`[Veo 3] ${VEO_MODEL_ID} start returned ${startRes.status}: ${errText}`);
  }

  const startData = await startRes.json();
  const operationName = startData?.name;
  if (!operationName) {
    throw new Error(`[Veo 3] No operation name returned from ${VEO_MODEL_ID}`);
  }

  console.log(`[Veo 3] Operation started: ${operationName}`);
  const pollUrl = `https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${VEO_MODEL_ID}:fetchPredictOperation`;

  for (let attempt = 1; attempt <= 60; attempt++) {
    await new Promise((r) => setTimeout(r, 6000));
    const pollToken = getAccessToken();
    const pollRes = await fetch(pollUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pollToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operationName }),
    });

    if (!pollRes.ok) {
      const pollErr = await pollRes.text();
      console.warn(`[Veo 3] Poll ${attempt} status ${pollRes.status}: ${pollErr}`);
      continue;
    }

    const pollData = await pollRes.json();
    if (!pollData.done) {
      console.log(`[Veo 3] Polling ${VEO_MODEL_ID} (attempt ${attempt}/60)...`);
      continue;
    }

    if (pollData.error) {
      throw new Error(`[Veo 3] Operation error: ${JSON.stringify(pollData.error)}`);
    }

    const videos =
      pollData?.response?.videos ||
      pollData?.response?.predictions ||
      [];
    const firstVideo = videos[0];
    const b64Video = firstVideo?.bytesBase64Encoded;

    if (b64Video) {
      const buf = Buffer.from(b64Video, 'base64');
      await fs.writeFile(absOut, buf);
      const stat = await fs.stat(absOut);
      console.log(
        `[Veo 3] Saved ${outputPath} (${Math.round(stat.size / 1024)} KB) using ${VEO_MODEL_ID}`
      );
      return {
        id: 'orbital-city-hero-loop',
        outputPath: '/video/orbital-city-hero-loop.mp4',
        model: VEO_MODEL_ID,
        purpose: 'Silent, loopable cinematic hero ambient video of the orbital city',
        prompt: VEO_PROMPT,
        bytes: stat.size,
        generatedAt: new Date().toISOString(),
      };
    } else {
      throw new Error(
        `[Veo 3] Operation completed on ${VEO_MODEL_ID} but no inline bytesBase64Encoded found: ${JSON.stringify(
          pollData.response
        ).slice(0, 400)}`
      );
    }
  }

  throw new Error(`[Veo 3] Timed out waiting for ${VEO_MODEL_ID}`);
}

async function runWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIdx = 0;

  async function runner(workerId) {
    while (nextIdx < items.length) {
      const currentIdx = nextIdx++;
      if (currentIdx > 0) {
        await new Promise((r) => setTimeout(r, workerId * 800));
      }
      results[currentIdx] = await worker(items[currentIdx], currentIdx);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, (_, i) =>
    runner(i)
  );
  await Promise.all(workers);
  return results;
}

async function main() {
  const manifest = {
    project: PROJECT_ID,
    location: LOCATION,
    generatedAt: new Date().toISOString(),
    images: [],
    videos: [],
  };

  const videoPromise = generateHeroVideoVeo3();

  // Generate images with controlled concurrency (4 workers distributed across regions/models)
  const imageItems = await runWithConcurrency(IMAGE_BRIEFS, 4, async (brief, idx) => {
    return generateStillImage(brief, idx);
  });

  manifest.images = imageItems;

  const videoItem = await videoPromise;
  if (videoItem) {
    manifest.videos.push(videoItem);
  }

  const manifestPath = path.resolve(process.cwd(), 'public/images/asset-manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`[Manifest] Written ${manifest.images.length} images and ${manifest.videos.length} videos to public/images/asset-manifest.json`);
}

main().catch((err) => {
  console.error('[generate-media] Fatal error:', err);
  process.exit(1);
});
