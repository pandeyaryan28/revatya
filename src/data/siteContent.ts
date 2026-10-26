export type RoadmapStatus =
  | 'Researching'
  | 'Proposed'
  | 'In development'
  | 'Validated'
  | 'Deferred';

export type ResearchEpistemicStatus =
  | 'Established background'
  | 'Research question'
  | 'Revatya hypothesis'
  | 'Concept design'
  | 'Test result'
  | 'Validated requirement';

export interface PageSeoMeta {
  title: string;
  description: string;
  path: string;
}

export interface VisualAssetMeta {
  src: string;
  alt: string;
  caption: string;
  conditionLabel?: string;
}

export interface CityDistrict {
  id: string;
  title: string;
  shortTitle: string;
  summary: string;
  intendedPurpose: string;
  potentialUsers: string[];
  keySystems: string[];
  dependencies: string[];
  engineeringQuestions: string[];
  statusLabel: string;
  epistemicStatus: ResearchEpistemicStatus;
  potentialCommercialRole: string;
  relatedResearchIds: string[];
  relatedApplicationId?: string;
  image: VisualAssetMeta;
  coordinates: {
    cx: number;
    cy: number;
    ring: 'inner' | 'mid' | 'outer' | 'spine';
    sectorLabel: string;
  };
}

export interface ApplicationItem {
  id: string;
  number: string;
  title: string;
  shortCardCopy: string;
  cardLinkLabel: string;
  opportunity: string;
  questionsToInvestigate: string[];
  potentialUsers: string[];
  dependencies: string[];
  status: string;
  epistemicStatus: ResearchEpistemicStatus;
  relatedResearchIds: string[];
  image: VisualAssetMeta;
}

export interface RoadmapStage {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  status: RoadmapStatus;
  environmentTag: string;
  homeSummary: string;
  objective: string;
  workstreams: string[];
  boundaryNote?: string;
  exitCriteria: string;
  dependencies: string[];
  risksAndUnresolvedQuestions: string[];
  supportingEvidence: string;
  image: VisualAssetMeta;
}

export interface ResearchProgramme {
  id: string;
  code: string;
  title: string;
  summary: string;
  epistemicStatus: ResearchEpistemicStatus;
  establishedBackground: string;
  researchQuestions: string[];
  revatyaHypothesis: string;
  conceptDesignFocus: string;
  validationRequirements: string;
  image: VisualAssetMeta;
}

export interface PartnerPathway {
  id: string;
  enquiryCategoryValue: string;
  title: string;
  description: string;
  ctaLabel: string;
  focusTopics: string[];
}

export const SEO_METADATA: Record<string, PageSeoMeta> = {
  home: {
    title: 'Revatya · Building Toward a Space City',
    description:
      "Explore Revatya's vision for a future orbital city connecting habitation, research, manufacturing, and space logistics.",
    path: '/',
  },
  vision: {
    title: 'Our Vision · Revatya',
    description:
      "Discover Revatya's long term ambition to develop a connected orbital environment for human activity and industry.",
    path: '/vision',
  },
  city: {
    title: 'The City Concept · Revatya',
    description:
      "Explore the proposed systems, districts, and engineering questions behind Revatya's future space city.",
    path: '/city',
  },
  cityAtlas: {
    title: 'Interactive City Atlas · Revatya',
    description:
      'Explore a conceptual systems map of the districts, dependencies, and infrastructure that may form a future orbital city.',
    path: '/city-atlas',
  },
  applications: {
    title: 'What a Space City Could Enable · Revatya',
    description:
      'Explore potential applications in microgravity manufacturing, orbital logistics, research, resource utilisation, and habitation.',
    path: '/applications',
  },
  spaceEconomy: {
    title: 'The Space Economy · Revatya',
    description:
      'Examine the potential commercial logic, use cases, and challenges behind shared orbital infrastructure.',
    path: '/space-economy',
  },
  roadmap: {
    title: 'Development Roadmap · Revatya',
    description:
      "Follow Revatya's proposed pathway from foundational research to a future orbital city.",
    path: '/roadmap',
  },
  research: {
    title: 'Research and Engineering · Revatya',
    description:
      'Explore the technical questions shaping future orbital habitats, infrastructure, life support, and industry.',
    path: '/research',
  },
  insights: {
    title: 'Insights and Publications · Revatya',
    description:
      "Revatya's publications explore the engineering, architecture, economics, and systems questions behind a future space city.",
    path: '/insights',
  },
  updates: {
    title: 'Progress Updates · Revatya',
    description:
      'Follow the questions Revatya is investigating, the work being completed, and the decisions that shape the development pathway.',
    path: '/updates',
  },
  partners: {
    title: 'Partners and Collaborators · Revatya',
    description:
      'Connect with Revatya about potential aerospace, research, technology, manufacturing, and strategic collaborations.',
    path: '/partners',
  },
  join: {
    title: 'Join the Mission · Revatya',
    description:
      'Bring your expertise in engineering, science, architecture, manufacturing, human factors, or economics to a difficult orbital infrastructure problem.',
    path: '/join',
  },
  contact: {
    title: 'Contact Revatya',
    description:
      'Contact Revatya about research, technology, aerospace infrastructure, commercial applications, or partnerships.',
    path: '/contact',
  },
  privacy: {
    title: 'Privacy Notice · Revatya',
    description:
      'How Revatya collects, validates, and stores enquiry and contributor interest submissions.',
    path: '/privacy',
  },
  terms: {
    title: 'Terms of Use · Revatya',
    description:
      'Terms governing the use of the Revatya website and conceptual engineering materials.',
    path: '/terms',
  },
};

export const BRAND_CONTENT = {
  name: 'Revatya',
  oneLineDescription:
    'Revatya is developing a vision and long term pathway toward a space city: an interconnected orbital environment for human habitation, research, industry, and transportation.',
  primaryPositioning: "A city beyond Earth. Infrastructure for humanity's next frontier.",
  primaryLine: 'A city beyond Earth.',
  supportingLine: 'Building the infrastructure of life beyond Earth.',
  mission:
    'To investigate and develop the concepts, technologies, partnerships, and infrastructure pathways that could make a productive, expandable human city in space possible.',
  vision:
    'A future in which orbital infrastructure supports more than individual missions: it supports an interconnected environment where people can live, conduct research, manufacture specialised products, transfer cargo, and enable further exploration.',
  shortBrandStatement:
    'Humanity has learned to reach orbit. The next challenge is building the infrastructure that allows people and industries to operate there at greater scale. Revatya is working toward that future.',
  underwaterPositioningNote:
    "Revatya's ultimate focus is a space city. Underwater habitat work is a potential intermediate engineering and testing programme, not the company's primary identity or end goal.",
  underwaterBoundaryStatement:
    "Revatya's ultimate focus is a space city. Underwater or extreme environment habitat work is a potential intermediate engineering and testing programme for selected closed environment principles, not the company's primary identity or end goal. Underwater tests cannot validate orbital microgravity, vacuum exposure, radiation shielding, launch loads, or orbital operations.",
  footerDisclaimer:
    "Revatya's city, systems, applications, and roadmap are conceptual or exploratory unless explicitly identified otherwise. Visualisations are illustrative. Potential applications and business models are hypotheses that require technical, economic, regulatory, and operational validation.",
  GlobalConceptDisclaimer:
    "Revatya's city, systems, applications, and roadmap are conceptual or exploratory unless explicitly identified otherwise. Visualisations are illustrative. Potential applications and business models are hypotheses that require technical, economic, regulatory, and operational validation.",
  EconomicDisclaimer:
    'Potential applications and business models are hypotheses for analysis, not claims of existing revenue or guaranteed outcomes. Every proposed use case must be evaluated against customer demand, launch and operating costs, technical feasibility, safety, regulation, and competing terrestrial or orbital alternatives.',
};

export const MAIN_NAVIGATION = [
  { label: 'Vision', href: '/vision' },
  { label: 'The City', href: '/city' },
  { label: 'Applications', href: '/applications' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'Partners', href: '/partners' },
] as const;

export const HOME_CONTENT = {
  hero: {
    eyebrow: "HUMANITY'S NEXT FRONTIER",
    headline: 'A city beyond Earth.',
    body: 'Revatya is developing a vision for an orbital city that brings together human habitation, scientific discovery, advanced industry, and space logistics.',
    primaryCta: { label: 'Explore the vision', href: '/vision' },
    secondaryCta: { label: 'View the roadmap', href: '/roadmap' },
    imageCaption: 'Conceptual visualisation of a possible future orbital city.',
    imageSrc: '/images/hero/orbital-city-hero.webp',
    videoSrc: '/video/orbital-city-hero-loop.mp4',
    imageAlt:
      'Human eye level interior view from a refined orbital observation gallery looking out through monumental windows toward interconnected space city structures, docking infrastructure, approaching spacecraft, and Earth below.',
  },
  thesis: {
    eyebrow: 'THE THESIS',
    headline: 'Space should become a place to live, work, and build.',
    body: "Reaching orbit is only one part of humanity's expansion beyond Earth. A larger opportunity may emerge when transport, habitation, research, manufacturing, and supporting services are connected through shared infrastructure. Revatya is investigating what a city scale orbital environment could require and what it could make possible.",
    supportingStatement:
      'A city is the long term vision. The infrastructure required to make it viable is the work.',
    image: {
      src: '/images/journey/thesis-living-in-orbit.webp',
      alt: 'Human eye level interior view inside an orbital transit concourse and observation gallery at orbital sunrise overlooking Earth and interconnected habitat rings.',
      caption: 'Conceptual visualisation: human scale transit and observation concourse in low Earth orbit.',
      conditionLabel: 'ORBITAL SUNRISE · 400 KM LEO TRANSIT CONCOURSE',
    },
  },
  whyACity: {
    eyebrow: 'WHY A CITY',
    headline: 'Beyond the space station.',
    intro:
      'Individual spacecraft and stations serve specific missions. A city scale concept asks a different question: what could become possible when people, facilities, services, and industries operate as part of a connected orbital ecosystem?',
  },
  cityConcept: {
    eyebrow: 'THE VISION',
    headline: 'One city. Multiple interconnected systems.',
    body: "Revatya's proposed city is not a single building or a collection of disconnected modules. It is a systems level concept in which habitation, transport, energy, life support, research, industrial facilities, and public spaces are designed around shared infrastructure and the possibility of gradual expansion.",
    statusNote:
      'These are conceptual categories for exploration, not a claim that Revatya has finalised an engineering design or built any of these systems.',
    cta: { label: 'Explore the proposed city', href: '/city' },
    perspectives: [
      {
        id: 'exterior',
        label: 'Macro Orbital Exterior',
        code: 'VIEW 01 · ORBITAL COMPLEX',
        src: '/images/city/orbital-city-exterior.webp',
        alt: 'Exterior architectural overview of the interconnected orbital city above Earth with central spine, radiator wings, and concentric habitat rings.',
        caption: 'Conceptual visualisation: macro orbital architecture integrating logistics spine, radiative wings, and concentric habitation.',
        telemetry: 'SOLAR/THERMAL SPINE + CONCENTRIC RINGS',
      },
      {
        id: 'cutaway',
        label: 'Multi Deck Cutaway',
        code: 'VIEW 02 · SECTIONAL DECKS',
        src: '/images/city/orbital-city-cutaway.webp',
        alt: 'Architectural sectional perspective inside a multi deck orbital habitat module showing hydroponic terrace, transit concourse, and utility spine.',
        caption: 'Conceptual visualisation: three level sectional cutaway showing pressurized transit, environmental terraces, and utility routing.',
        telemetry: 'PRESSURISED MULTI DECK SECTION',
      },
      {
        id: 'commons',
        label: 'Human Civic Commons',
        code: 'VIEW 03 · INTERIOR SCALE',
        src: '/images/city/orbital-habitation-commons.webp',
        alt: 'Interior architectural photograph of a serene shared residential commons inside an orbital space city with botanical wall panels and Earth viewport.',
        caption: 'Conceptual visualisation: human centred civic and residential commons designed for long duration wellbeing.',
        telemetry: 'ACOUSTIC & BIOPHILIC INTERIOR',
      },
    ],
  },
  economicThesis: {
    eyebrow: 'THE SPACE ECONOMY',
    headline: 'Infrastructure that enables new industries.',
    body: 'A city in orbit would need a reason to exist beyond its scale or appearance. Revatya is exploring whether shared infrastructure could make certain space based activities more practical by connecting customers, facilities, transport, and services. Each potential application must be evaluated against customer demand, launch and operating costs, technical feasibility, regulation, and competing alternatives.',
    cta: { label: 'Explore the space economy', href: '/space-economy' },
    image: {
      src: '/images/economy/shared-utility-infrastructure.webp',
      alt: 'Aerospace engineering visualisation of commercial research and manufacturing modules berthed to a shared orbital utility bus supplying power, cooling, and cargo logistics.',
      caption: 'Conceptual visualisation: multi tenant commercial modules connected to a shared power, thermal, and logistics spine.',
      conditionLabel: 'SHARED UTILITY BUS · MULTI OPERATOR TENANCY',
    },
  },
  roadmapPreview: {
    eyebrow: 'THE JOURNEY',
    headline: 'From research to a city in orbit.',
    body: "Revatya's development pathway begins with understanding the constraints, testing selected engineering principles, identifying viable applications, and building evidence. The route toward a city is long term and depends on technical progress, capital, partnerships, and commercial validation.",
    statusNote:
      'These are proposed strategic stages. No dates, completed milestones, or claims of active hardware deployment are implied.',
    cta: { label: 'View the complete roadmap', href: '/roadmap' },
  },
  researchPreview: {
    eyebrow: 'THE HARD PROBLEMS',
    headline: 'A vision this ambitious must begin with difficult questions.',
    body: "Building a city beyond Earth requires advances across many disciplines. Revatya's research programme should identify the constraints, map existing capabilities, distinguish open questions from established knowledge, and investigate where focused experimentation could create useful evidence.",
    areas: [
      'Radiation shielding and exposure management',
      'Environmental control and life support systems',
      'Water recovery and resource efficiency',
      'Artificial gravity and human health',
      'Thermal management and power',
      'Orbital construction and modular assembly',
      'Autonomous inspection and maintenance',
      'Cargo logistics and spacecraft interfaces',
      'Microgravity manufacturing economics',
      'Habitat architecture and human factors',
      'Governance, safety, and operational resilience',
    ],
    cta: { label: 'Explore research and insights', href: '/research' },
  },
  collaboration: {
    eyebrow: 'BUILD WITH REVATYA',
    headline: 'The next frontier will require more than one discipline.',
    body: 'The path toward a space city spans aerospace engineering, architecture, materials science, robotics, life support systems, manufacturing, research, and economics. Revatya welcomes conversations with people and organisations who can contribute knowledge, technology, facilities, research, or a rigorous perspective.',
    primaryCta: { label: 'Discuss a partnership', href: '/partners' },
    secondaryCta: { label: 'Contact Revatya', href: '/contact' },
    supportingLine:
      'Have a technology, research programme, or capability that may be relevant? Tell us what you are working on and where you see a potential connection.',
    image: {
      src: '/images/partners/multidisciplinary-engineering-deck.webp',
      alt: 'Multidisciplinary orbital systems engineering and mission synthesis deck looking out into an active orbital integration bay.',
      caption: 'Conceptual visualisation: multidisciplinary engineering synthesis across aerospace, architecture, life support, and economics.',
      conditionLabel: 'SYSTEMS SYNTHESIS · MULTIDISCIPLINARY COLLABORATION',
    },
  },
  closing: {
    headline:
      'The future is not only somewhere we travel to. It is somewhere we could learn to live and build.',
    body: 'Revatya is investigating the systems, partnerships, and pathways that could help make that future possible.',
    cta: { label: 'Explore the vision', href: '/vision' },
  },
};

export const VISION_CONTENT = {
  hero: {
    eyebrow: 'OUR VISION',
    headline: 'From reaching orbit to building in orbit.',
    body: "Revatya's long term ambition is to develop a space city: an interconnected environment where human habitation, research, industry, and transportation can operate together.",
  },
  problemWeAreExploring: {
    title: 'The problem we are exploring',
    body: 'Human activity in space depends on specialised vehicles, facilities, supply chains, and expensive transport. As orbital activity expands, shared infrastructure may create new possibilities, but it must justify its cost, complexity, and risk.',
    image: {
      src: '/images/vision/vision-isolated-vs-connected.webp',
      alt: 'Crew transport spacecraft approaching a permanent interconnected orbital infrastructure complex in low Earth orbit.',
      caption: 'Conceptual visualisation: transitioning from isolated single mission spacecraft to persistent shared orbital infrastructure.',
      conditionLabel: 'INFRASTRUCTURE THESIS · PERSISTENT ORBITAL NODE',
    },
  },
  centralQuestion: {
    title: 'The central question',
    question:
      'What would it take to create an expandable orbital environment that supports people and productive activity, rather than a single isolated mission?',
  },
  principles: [
    {
      number: '01',
      title: 'Systems before spectacle',
      description: 'Architecture must follow operational requirements, safety, and feasibility.',
    },
    {
      number: '02',
      title: 'Evidence before claims',
      description: 'Publish what is known, what is hypothesised, and what needs validation.',
    },
    {
      number: '03',
      title: 'Modularity and expansion',
      description: 'Investigate whether infrastructure can be developed incrementally.',
    },
    {
      number: '04',
      title: 'Economic purpose',
      description: 'Connect proposed capabilities to actual users and defensible use cases.',
    },
    {
      number: '05',
      title: 'Human centred design',
      description:
        'Treat health, comfort, privacy, community, and long duration wellbeing as engineering concerns.',
    },
    {
      number: '06',
      title: 'Collaboration',
      description: 'The challenge crosses disciplines and organisations.',
    },
    {
      number: '07',
      title: 'Long term responsibility',
      description:
        'Consider environmental impacts, orbital sustainability, governance, and responsible use of resources.',
    },
  ],
  whatSuccessCouldLookLike: {
    title: 'What success could look like',
    body: 'A future in which a network of orbital facilities supports sustained human activity, specialised manufacturing, research, logistics, and further exploration. A city would be an interconnected infrastructure system, not simply a large structure.',
    image: {
      src: '/images/vision/vision-connected-ecosystem.webp',
      alt: 'Panoramic twilight view above Earth terminator showing an interconnected orbital ecosystem with illuminated habitation rings, research labs, and docking ports.',
      caption: 'Conceptual visualisation: an interconnected orbital ecosystem operating above Earth’s twilight terminator.',
      conditionLabel: 'ORBITAL ECOSYSTEM · MULTI DISTRICT HORIZON',
    },
  },
  closingCta: {
    headline: 'Help investigate what comes next.',
    body: 'If you work in aerospace, research, engineering, architecture, manufacturing, or related fields, we welcome relevant conversations.',
    buttonLabel: 'Build with Revatya',
    href: '/partners',
  },
};

export const CITY_DISTRICTS: CityDistrict[] = [
  {
    id: 'habitation',
    title: 'Habitation',
    shortTitle: 'Habitation',
    summary:
      'Spaces for crews, residents, and specialist personnel, with safety and human factors at the centre.',
    intendedPurpose:
      'Design questions include crew and resident capacity, privacy, health, emergency refuge, community spaces, environmental quality, and long duration human factors.',
    potentialUsers: [
      'Orbital research crews',
      'Specialist industrial and maintenance personnel',
      'Long duration mission operators',
      'Carefully regulated commercial visitors',
    ],
    keySystems: [
      'Pressurised acoustic isolated residential quarters',
      'Radiation storm shelters and independent pressure bulkheads',
      'Circadian lighting and atmospheric quality monitoring',
      'Medical diagnostics and physiological countermeasures',
    ],
    dependencies: [
      'Life support infrastructure (closed loop air and water)',
      'Energy and thermal management (continuous baseload power & heat rejection)',
      'Orbital port and logistics (crew rotation and emergency return vehicles)',
    ],
    engineeringQuestions: [
      'What minimum pressurised volume per person is required for psychological and physiological stability over multi month stays?',
      'Whether and at what scale partial artificial gravity is necessary versus microgravity countermeasures?',
      'How should pressure isolation zones be segmented so any single hull or subsystem fault guarantees immediate refuge?',
    ],
    statusLabel: 'Conceptual architecture under exploration',
    epistemicStatus: 'Concept design',
    potentialCommercialRole:
      'Providing habitation and operational support services for institutional and commercial specialist personnel.',
    relatedResearchIds: ['human-factors', 'radiation-health', 'habitat-life-support'],
    relatedApplicationId: 'habitation-tourism',
    image: {
      src: '/images/districts/district-01-habitation.webp',
      alt: 'Interior architectural view of acoustic isolated residential crew quarters and circadian lit corridor in the Habitation District.',
      caption: 'Conceptual visualisation: Sector H 01 acoustic isolated residential corridor and shielded viewport.',
      conditionLabel: 'SECTOR H 01 · CIRCADIAN RESIDENTIAL QUARTERS',
    },
    coordinates: { cx: 290, cy: 155, ring: 'outer', sectorLabel: 'SECTOR H 01 · HABITATION RING' },
  },
  {
    id: 'orbital-port',
    title: 'Orbital port and logistics',
    shortTitle: 'Orbital Port',
    summary: 'Docking, cargo transfer, servicing, and logistics interfaces.',
    intendedPurpose:
      'Explore docking interfaces, cargo transfer, servicing, storage, traffic coordination, assembly, and the relationships between the city and transport providers.',
    potentialUsers: [
      'Crew and cargo launch providers',
      'In space orbital transfer and tug operators',
      'Satellite servicing and spacecraft operators',
      'Payload customers requiring pressurised/unpressurised warehousing',
    ],
    keySystems: [
      'Standardised international passive and active berthing ports',
      'Automated cargo airlocks and robotic pallet transfer rails',
      'Propellant and fluid depot isolation manifold (stand off safety zone)',
      'Relative navigation, approach corridor radar, and traffic control',
    ],
    dependencies: [
      'Construction and maintenance (robotic manipulators and inspection)',
      'Energy and thermal management (docked vehicle umbilical power)',
      'Industrial and research districts (payload transfer routing)',
    ],
    engineeringQuestions: [
      'How can docking plume impingement, structural vibration, and momentum transfer be isolated from microgravity sensitive laboratories?',
      'Which mechanical, electrical, and data interface standards maximise compatibility across diverse commercial vehicles?',
      'What safety stand off distances are required for propellant transfer or spacecraft servicing operations?',
    ],
    statusLabel: 'Conceptual architecture under exploration',
    epistemicStatus: 'Concept design',
    potentialCommercialRole:
      'Providing cargo handling, storage, berthing, and orbital logistics services across multiple operators.',
    relatedResearchIds: ['orbital-logistics', 'orbital-architecture'],
    relatedApplicationId: 'orbital-port-logistics',
    image: {
      src: '/images/districts/district-02-orbital-port.webp',
      alt: 'Exterior view of the Axial Orbital Port with standardized docking adapters, cargo transfer rails, and an approaching spacecraft.',
      caption: 'Conceptual visualisation: Sector P 01 axial docking hub and automated cargo transfer spine.',
      conditionLabel: 'SECTOR P 01 · AXIAL DOCKING & LOGISTICS HUB',
    },
    coordinates: { cx: 140, cy: 250, ring: 'spine', sectorLabel: 'SECTOR P 01 · LOGISTICS HUB' },
  },
  {
    id: 'research',
    title: 'Research district',
    shortTitle: 'Research',
    summary: 'Laboratories and facilities for scientific and industrial experiments.',
    intendedPurpose:
      'Investigate laboratories and specialised environments for physical sciences, materials research, life sciences, and other experiments that require access to space.',
    potentialUsers: [
      'University and national scientific laboratories',
      'Biotechnology and pharmaceutical research teams',
      'Materials science and fluid physics investigators',
      'Aerospace technology demonstration programmes',
    ],
    keySystems: [
      'Microgravity isolated experiment racks with standardised power/data/cooling buses',
      'External vacuum exposure platforms and optical Earth/deep space ports',
      'Glovebox containment and sample cryo preservation storage',
      'High throughput telemetry downlink for remote terrestrial investigators',
    ],
    dependencies: [
      'Orbital port and logistics (regular sample upmass and cold stowage return)',
      'Energy and thermal management (precision thermal stability)',
      'Habitation (tend capable specialist crew availability)',
    ],
    engineeringQuestions: [
      'How must research modules be structurally decoupled from crew exercise, docking events, and rotating machinery to preserve microgravity quality?',
      'Which laboratory instruments should be shared core utilities versus customer supplied modular payloads?',
      'How can chemical and biological containment be assured within a closed loop habitat environment?',
    ],
    statusLabel: 'Conceptual architecture under exploration',
    epistemicStatus: 'Concept design',
    potentialCommercialRole:
      'Leasing specialised research racks, external exposure slots, and laboratory capacity with crew or automated support.',
    relatedResearchIds: ['manufacturing-industrial', 'habitat-life-support'],
    relatedApplicationId: 'research-experimentation',
    image: {
      src: '/images/districts/district-03-research.webp',
      alt: 'Interior of the Research District laboratory module showing vibration isolated payload racks and sealed fluid physics glovebox.',
      caption: 'Conceptual visualisation: Sector R 02 microgravity isolated scientific payload racks and glovebox containment.',
      conditionLabel: 'SECTOR R 02 · MICROGRAVITY LABORATORY MODULE',
    },
    coordinates: { cx: 430, cy: 135, ring: 'mid', sectorLabel: 'SECTOR R 02 · RESEARCH LABS' },
  },
  {
    id: 'manufacturing',
    title: 'Industrial district',
    shortTitle: 'Manufacturing',
    summary: 'Facilities designed around validated processes that benefit from operating in space.',
    intendedPurpose:
      'Study the facility requirements, supply chains, safety processes, and commercial case for selected space based manufacturing activities.',
    potentialUsers: [
      'Specialty optical fibre and semiconductor crystal producers',
      'Bioprinting and protein crystallisation developers',
      'In space structural component fabricators',
      'Industrial R&D consortia',
    ],
    keySystems: [
      'Automated feedstock handling and sealed processing chambers',
      'Independent atmospheric scrubbing and process hazard isolation',
      'High capacity electrical bus and dedicated process heat rejection loops',
      'Non destructive metrological inspection and quality assurance rigs',
    ],
    dependencies: [
      'Energy and thermal management (high peak power and furnace/process cooling)',
      'Orbital port and logistics (feedstock delivery and high value product return)',
      'Research district (process validation prior to scale up)',
    ],
    engineeringQuestions: [
      'Which specific products possess a value to mass ratio high enough to overcome launch and return transport costs?',
      'Should high power or hazardous industrial processes operate in co orbiting free flyer platforms serviced by the city rather than attached modules?',
      'What level of full automation is required to minimise expensive crew time per unit produced?',
    ],
    statusLabel: 'Conceptual architecture under exploration',
    epistemicStatus: 'Revatya hypothesis',
    potentialCommercialRole:
      'Hosting validated microgravity manufacturing processes with shared power, thermal rejection, and return logistics.',
    relatedResearchIds: ['manufacturing-industrial', 'power-thermal'],
    relatedApplicationId: 'microgravity-manufacturing',
    image: {
      src: '/images/districts/district-04-manufacturing.webp',
      alt: 'Interior of the Industrial Manufacturing District showing automated crystal growth furnaces and robotic feedstock handling.',
      caption: 'Conceptual visualisation: Sector M 03 automated orbital crystal growth and fiber drawing cleanroom.',
      conditionLabel: 'SECTOR M 03 · AUTOMATED INDUSTRIAL CLEANROOM',
    },
    coordinates: { cx: 525, cy: 250, ring: 'mid', sectorLabel: 'SECTOR M 03 · INDUSTRIAL ZONE' },
  },
  {
    id: 'energy-thermal',
    title: 'Energy and thermal management',
    shortTitle: 'Energy & Thermal',
    summary: 'Power generation, storage, heat rejection, and distribution.',
    intendedPurpose:
      'Evaluate generation, storage, distribution, redundancy, heat rejection, and the impact of system failure.',
    potentialUsers: [
      'All habitat, research, and industrial districts',
      'Visiting spacecraft requiring umbilical power',
      'High compute orbital data and control systems',
    ],
    keySystems: [
      'Deployable high efficiency solar arrays with sun tracking gimbals',
      'Eclipse energy storage (fault isolated battery banks / regenerative fuel cells)',
      'Multi loop ammonia/fluid active thermal buses and deployable radiative panels',
      'Fault tolerant DC microgrid with automated load shedding',
    ],
    dependencies: [
      'Construction and maintenance (autonomous inspection of micrometeoroid radiator damage)',
      'Orbital architecture (wake/shadowing avoidance and attitude control)',
    ],
    engineeringQuestions: [
      'As power generation scales for industrial users, how do radiator surface area and mass scale to reject the corresponding waste heat in vacuum?',
      'How do large solar and radiator wings affect atmospheric drag, propellant station keeping budgets, and docking approach corridors?',
      'What redundancy architecture prevents a single coolant loop leak or power bus fault from cascading across districts?',
    ],
    statusLabel: 'Conceptual architecture under exploration',
    epistemicStatus: 'Concept design',
    potentialCommercialRole:
      'Providing shared utility grade electrical power and thermal rejection capacity to tenant modules and payloads.',
    relatedResearchIds: ['power-thermal', 'orbital-architecture'],
    image: {
      src: '/images/districts/district-05-energy-thermal.webp',
      alt: 'Exterior orbital view of deployable white ceramic radiative heat rejection panels and sun tracking solar arrays on the Energy and Thermal Spine.',
      caption: 'Conceptual visualisation: Sector E 04 high capacity radiative heat rejection wings and solar array gimbals.',
      conditionLabel: 'SECTOR E 04 · RADIATIVE HEAT REJECTION & SOLAR SPINE',
    },
    coordinates: { cx: 660, cy: 250, ring: 'spine', sectorLabel: 'SECTOR E 04 · POWER & RADIATORS' },
  },
  {
    id: 'life-support',
    title: 'Life support infrastructure',
    shortTitle: 'Life Support',
    summary: 'Air revitalisation, water management, waste processing, monitoring, and redundancy.',
    intendedPurpose:
      'Consider atmosphere management, water recovery, waste handling, resource loops, monitoring, maintenance, and backup systems.',
    potentialUsers: [
      'All pressurised habitation, research, and shared districts',
      'Emergency safe haven sectors',
    ],
    keySystems: [
      'Physico chemical CO₂ scrubbing, O₂ generation, and trace contaminant control',
      'Closed loop greywater/wastewater distillation and catalytic oxidation',
      'Distributed real time atmospheric, microbial, and pressure telemetry network',
      'Independent sector isolation valves and high pressure reserve gas storage',
    ],
    dependencies: [
      'Energy and thermal management (continuous life critical electrical power)',
      'Orbital port and logistics (consumables resupply, filter spares, and nitrogen makeup)',
    ],
    engineeringQuestions: [
      'What closure percentage in water and oxygen loops is achievable before system complexity and maintenance downtime outweigh resupply mass savings?',
      'How should centralised utility processing be balanced against decentralised, self sufficient sector ECLSS units for survivability?',
      'Which sensors and fault response algorithms can be validated reliably in terrestrial closed environment analog tests?',
    ],
    statusLabel: 'Conceptual architecture under exploration',
    epistemicStatus: 'Research question',
    potentialCommercialRole:
      'Core municipal life support utility reducing the need for every visiting mission or commercial module to carry standalone ECLSS.',
    relatedResearchIds: ['habitat-life-support', 'radiation-health'],
    image: {
      src: '/images/districts/district-06-life-support.webp',
      alt: 'Interior engineering photograph of the central ECLSS life support utility core with CO2 scrubbers and water distillation manifolds.',
      caption: 'Conceptual visualisation: Sector L 05 closed loop atmospheric revitalisation and water recovery core.',
      conditionLabel: 'SECTOR L 05 · CLOSED LOOP ECLSS UTILITY CORE',
    },
    coordinates: { cx: 400, cy: 250, ring: 'inner', sectorLabel: 'SECTOR L 05 · ECLSS CORE' },
  },
  {
    id: 'construction-maintenance',
    title: 'Construction and maintenance',
    shortTitle: 'Construction & Robotics',
    summary: 'Modular assembly, inspection, repair, and eventual expansion.',
    intendedPurpose:
      'Explore modular assembly, robotic assistance, inspection, repair, and the feasibility of adding capacity over time.',
    potentialUsers: [
      'City operations and structural integrity teams',
      'External payload and spacecraft assembly customers',
      'Module manufacturers integrating new city sectors',
    ],
    keySystems: [
      'Inchworm and track mounted exterior robotic manipulators',
      'Autonomous free flying/crawler optical and ultrasonic hull inspection drones',
      'MMOD (micrometeoroid and orbital debris) shield replacement tooling',
      'Standardised structural, fluid, power, and data interconnect nodes',
    ],
    dependencies: [
      'Orbital port and logistics (arrival of new structural modules and replacement orbital replacement units)',
      'Energy and thermal management (power and thermal rerouting during expansion)',
    ],
    engineeringQuestions: [
      'How can modules be berthed, reconfigured, or replaced over decades without depressurising adjacent districts or interrupting utility loops?',
      'What proportion of exterior maintenance can be executed robotically to minimise high risk human extravehicular activity (EVA)?',
      'How do structural dynamics and attitude control adapt as mass distribution changes during staged expansion?',
    ],
    statusLabel: 'Conceptual architecture under exploration',
    epistemicStatus: 'Concept design',
    potentialCommercialRole:
      'Offering in orbit structural assembly, inspection, and servicing facilities for large spacecraft and infrastructure.',
    relatedResearchIds: ['orbital-architecture', 'orbital-logistics'],
    relatedApplicationId: 'assembly-servicing',
    image: {
      src: '/images/districts/district-07-construction-robotics.webp',
      alt: 'Exterior orbital view of track mounted robotic manipulators and inspection drones installing shielding on a modular habitat node.',
      caption: 'Conceptual visualisation: Sector C 06 exterior robotic assembly manipulators and hull inspection drones.',
      conditionLabel: 'SECTOR C 06 · AUTONOMOUS ROBOTIC ASSEMBLY & MMOD INSPECTION',
    },
    coordinates: { cx: 430, cy: 365, ring: 'mid', sectorLabel: 'SECTOR C 06 · ASSEMBLY & ROBOTICS' },
  },
  {
    id: 'shared-environments',
    title: 'Human environments',
    shortTitle: 'Shared Environments',
    summary: 'Spaces that support long duration habitation and human wellbeing.',
    intendedPurpose:
      'Consider exercise, recreation, social connection, accessibility, work life boundaries, and psychological wellbeing.',
    potentialUsers: [
      'Long duration crew and specialist personnel',
      'Visiting researchers and commercial participants',
    ],
    keySystems: [
      'Panoramic Earth observation cupola and quiet restorative commons',
      'Vibration isolated resistive and cardiovascular exercise bays',
      'Shared dining, acoustic privacy booths, and telemedicine suites',
      'Plant growth and biophilic sensory environments',
    ],
    dependencies: [
      'Habitation (adjacent crew quarters and safe haven access)',
      'Life support infrastructure (humidity, odour, and CO₂ control during high occupancy)',
    ],
    engineeringQuestions: [
      'How do architectural volume, sightlines, lighting spectrum, and material acoustics mitigate isolation and confinement stress?',
      'What radiation shielding trade offs apply to large structural observation windows?',
      'How can shared spaces accommodate mixed cohorts of researchers, engineers, and short stay visitors without operational friction?',
    ],
    statusLabel: 'Conceptual architecture under exploration',
    epistemicStatus: 'Concept design',
    potentialCommercialRole:
      'Enabling productive multi month human deployments, specialist training, and high trust collaborative environments.',
    relatedResearchIds: ['human-factors', 'radiation-health'],
    relatedApplicationId: 'habitation-tourism',
    image: {
      src: '/images/districts/district-08-shared-environments.webp',
      alt: 'Interior architectural photograph of the Shared Human Environments cupola overlooking Earth with biophilic plant walls and tiered seating.',
      caption: 'Conceptual visualisation: Sector S 07 panoramic Earth observation cupola and biophilic restorative commons.',
      conditionLabel: 'SECTOR S 07 · PANORAMIC CUPOLA & BIOPHILIC COMMONS',
    },
    coordinates: { cx: 290, cy: 345, ring: 'outer', sectorLabel: 'SECTOR S 07 · HUMAN COMMONS' },
  },
];

export const APPLICATIONS_LIST: ApplicationItem[] = [
  {
    id: 'microgravity-manufacturing',
    number: '01',
    title: 'Microgravity enabled manufacturing',
    shortCardCopy:
      'Some materials and production processes may benefit from the microgravity environment. Revatya will investigate which use cases offer meaningful advantages, what facilities they require, and whether their economics can support commercial operations.',
    cardLinkLabel: 'Explore manufacturing',
    opportunity:
      'Some manufacturing processes may benefit from microgravity or the ability to conduct operations in space.',
    questionsToInvestigate: [
      'Which specific processes have demonstrated or credible advantages?',
      'Can the benefit be reproduced consistently?',
      'How will feedstock reach the facility and products return to customers?',
      'What are the costs of production, transport, maintenance, and quality assurance?',
      'Is an orbital city necessary, or would a smaller facility be sufficient?',
    ],
    potentialUsers: [
      'Materials researchers',
      'Specialist manufacturers',
      'Life sciences companies',
      'Industrial research organisations',
    ],
    dependencies: [
      'Reliable upmass and gentle downmass return transport',
      'Vibration isolated microgravity racks and high electrical/thermal capacity',
      'Automated quality assurance and containment',
    ],
    status: 'Potential application requiring case by case validation.',
    epistemicStatus: 'Revatya hypothesis',
    relatedResearchIds: ['manufacturing-industrial', 'power-thermal', 'economics-governance'],
    image: {
      src: '/images/applications/microgravity-manufacturing.webp',
      alt: 'Conceptual interior of a cleanroom microgravity materials research and manufacturing bay in orbit.',
      caption: 'Conceptual visualisation: microgravity research and manufacturing facility.',
      conditionLabel: 'APPLICATION 01 · ZERO G CLEANROOM PROCESSING',
    },
  },
  {
    id: 'orbital-port-logistics',
    number: '02',
    title: 'Orbital port and logistics',
    shortCardCopy:
      'A future orbital hub could support cargo transfer, spacecraft servicing, assembly, resupply, and movement between Earth orbit and destinations beyond. The case depends on transport costs, customer demand, and infrastructure requirements.',
    cardLinkLabel: 'Explore orbital logistics',
    opportunity:
      'Shared infrastructure could support cargo transfer, spacecraft servicing, storage, assembly, resupply, and movement between orbital destinations.',
    questionsToInvestigate: [
      'What demand could justify a permanent facility?',
      'Which orbits and transport interfaces would be useful?',
      'What services would customers pay for?',
      'How would orbital debris, safety, traffic coordination, and regulation be handled?',
      'What infrastructure can be reused or shared?',
    ],
    potentialUsers: [
      'Spacecraft operators',
      'Logistics providers',
      'Satellite service companies',
      'Research organisations',
      'Future commercial space operators',
    ],
    dependencies: [
      'Standardised mechanical, power, and data docking interfaces',
      'Traffic coordination, collision avoidance, and regulatory licensing',
      'Sufficient launch cadence and multi operator orbital traffic',
    ],
    status: 'Long term infrastructure thesis requiring demand and feasibility analysis.',
    epistemicStatus: 'Research question',
    relatedResearchIds: ['orbital-logistics', 'orbital-architecture', 'economics-governance'],
    image: {
      src: '/images/applications/orbital-logistics-port.webp',
      alt: 'Conceptual visualisation of an orbital logistics port with docking adapters, cargo modules, and approaching spacecraft.',
      caption: 'Conceptual visualisation: orbital docking and cargo transfer infrastructure.',
      conditionLabel: 'APPLICATION 02 · ORBITAL TRANSFER & BERTHING NODE',
    },
  },
  {
    id: 'research-experimentation',
    number: '03',
    title: 'Research and experimentation',
    shortCardCopy:
      'A dedicated orbital environment could support scientific experiments, materials research, life sciences work, and other activities that require specialised conditions or sustained access to space.',
    cardLinkLabel: 'Explore research',
    opportunity:
      'A dedicated facility could support repeated access to specialised environments, equipment, and operational support.',
    questionsToInvestigate: [
      'Which research needs sustained or frequent access to orbit?',
      'What environmental controls and safety provisions are necessary?',
      'Which facilities could serve multiple research customers?',
      'How would experiments, data, samples, and equipment move through the facility?',
    ],
    potentialUsers: [
      'Universities',
      'Laboratories',
      'Scientific agencies',
      'Commercial research teams',
    ],
    dependencies: [
      'Modular laboratory racks with shared power, cooling, and high bandwidth telemetry',
      'Crew tending or tele operated robotic manipulation',
      'Cold stowage sample return pathways',
    ],
    status: 'Established orbital activity category requiring shared facility economic evaluation.',
    epistemicStatus: 'Established background',
    relatedResearchIds: ['habitat-life-support', 'radiation-health', 'manufacturing-industrial'],
    image: {
      src: '/images/applications/orbital-research-lab.webp',
      alt: 'Conceptual interior of an orbital scientific laboratory with modular experiment racks and analytical equipment.',
      caption: 'Conceptual visualisation: orbital scientific research laboratory.',
      conditionLabel: 'APPLICATION 03 · MULTIDISCIPLINARY ORBITAL LABORATORY',
    },
  },
  {
    id: 'space-resource-utilisation',
    number: '04',
    title: 'Space resource utilisation',
    shortCardCopy:
      'Prospecting, processing, and using resources beyond Earth may eventually support a broader space economy. These possibilities remain technically and economically challenging and require substantial validation.',
    cardLinkLabel: 'Explore resource utilisation',
    opportunity:
      'Prospecting and processing resources beyond Earth could eventually support selected space activities.',
    questionsToInvestigate: [
      'Which resources are useful and accessible?',
      'What prospecting and extraction methods are viable?',
      'What processing is possible in situ?',
      'What are the transport and energy requirements?',
      'What demand exists for the resulting materials?',
      'What legal, environmental, and governance issues apply?',
    ],
    potentialUsers: [
      'Deep space prospecting researchers',
      'In situ resource utilisation (ISRU) technology developers',
      'Future orbital propellant and shielding consumers',
    ],
    dependencies: [
      'Autonomous deep space prospecting and assay verification',
      'Breakthroughs in low gravity material extraction and beneficiation',
      'In space demand for bulk water, propellant, or structural feedstock',
    ],
    status:
      'Highly uncertain long term opportunity. Asteroid mining is not commercially established or inevitable.',
    epistemicStatus: 'Research question',
    relatedResearchIds: ['economics-governance', 'orbital-logistics', 'power-thermal'],
    image: {
      src: '/images/applications/app-04-space-resource-utilisation.webp',
      alt: 'Conceptual deep space visualisation of a robotic volatile extraction and resource utilisation lander anchored to a carbonaceous asteroid.',
      caption: 'Conceptual visualisation: in situ volatile extraction and resource beneficiation study.',
      conditionLabel: 'APPLICATION 04 · IN SITU RESOURCE BENEFICIATION STUDY',
    },
  },
  {
    id: 'habitation-tourism',
    number: '05',
    title: 'Habitation, training, and tourism',
    shortCardCopy:
      'Longer term orbital facilities may support research crews, specialist workers, visitors, and commercial human spaceflight experiences. Safety, life support, transport, and affordability are central constraints.',
    cardLinkLabel: 'Explore habitation',
    opportunity:
      'Future orbital infrastructure may support specialist personnel, research crews, training, and commercial visitors.',
    questionsToInvestigate: [
      'What level of safety and reliability is required?',
      'What services can be provided in orbit?',
      'What are the transport and operating costs?',
      'What demand could support the service?',
      'How can facilities support human health and wellbeing?',
    ],
    potentialUsers: [
      'Institutional and sovereign astronaut programmes',
      'Commercial payload specialists and industrial crews',
      'Carefully trained commercial visitors',
    ],
    dependencies: [
      'Redundant ECLSS, radiation protection, and assured crew return vehicles',
      'Human centred acoustic, lighting, and spatial architecture',
      'Strict medical, training, and operational safety protocols',
    ],
    status: 'Constrained by launch affordability, life support reliability, and human safety.',
    epistemicStatus: 'Concept design',
    relatedResearchIds: ['human-factors', 'habitat-life-support', 'radiation-health'],
    image: {
      src: '/images/applications/app-05-habitation-training.webp',
      alt: 'Conceptual interior of a professional orbital crew training and specialist habitation deck overlooking Earth.',
      caption: 'Conceptual visualisation: specialist crew operations, training, and habitation deck.',
      conditionLabel: 'APPLICATION 05 · SPECIALIST CREW HABITATION & TRAINING',
    },
  },
  {
    id: 'assembly-servicing',
    number: '06',
    title: 'Assembly and servicing',
    shortCardCopy:
      'Certain spacecraft or large structures may benefit from assembly, inspection, repair, or servicing in orbit rather than launching fully integrated within a single fairing.',
    cardLinkLabel: 'Explore assembly & servicing',
    opportunity:
      'Certain spacecraft or large structures may benefit from assembly, inspection, repair, or servicing in orbit.',
    questionsToInvestigate: [
      'Which structures are difficult or inefficient to launch fully assembled?',
      'What robotics, tools, and crew capabilities would be needed?',
      'What interfaces and safety standards are required?',
      'Could servicing reduce lifecycle costs?',
    ],
    potentialUsers: [
      'Large aperture telescope and communications array operators',
      'Deep space transport vehicle programmes',
      'Modular habitat and infrastructure developers',
    ],
    dependencies: [
      'Precision dexterous robotics and non destructive inspection tools',
      'Standardised modular grappling, fluid, and structural couplers',
      'Safe proximity operations and debris mitigation protocols',
    ],
    status: 'Emerging technical capability requiring interface standardisation and customer demand.',
    epistemicStatus: 'Research question',
    relatedResearchIds: ['orbital-architecture', 'orbital-logistics'],
    image: {
      src: '/images/applications/app-06-assembly-servicing.webp',
      alt: 'Conceptual exterior view of an unpressurized in orbit assembly bay where robotic arms assemble a segmented telescope reflector.',
      caption: 'Conceptual visualisation: in orbit robotic structural assembly and spacecraft servicing bay.',
      conditionLabel: 'APPLICATION 06 · IN ORBIT ROBOTIC SERVICING & ASSEMBLY',
    },
  },
];

export const SPACE_ECONOMY_CONTENT = {
  hero: {
    eyebrow: 'THE COMMERCIAL THESIS',
    headline: 'A city must create value, not only occupy space.',
    body: 'Revatya is exploring whether shared orbital infrastructure could make selected space activities more useful, accessible, or economically viable.',
  },
  whySharedInfrastructure: {
    title: 'Why shared infrastructure?',
    body: 'In principle, a shared facility can distribute certain fixed costs across multiple users and connect services that would otherwise be developed separately. Whether this creates a real advantage depends on demand, utilisation, transport costs, operating complexity, and the alternatives available.',
  },
  hypothesesNote: 'These are hypotheses for analysis, not claims of existing revenue:',
  businessModelHypotheses: [
    {
      code: 'BM 01',
      title: 'Leasing specialised research or laboratory capacity',
      detail:
        'Providing pressurised experiment racks, external vacuum exposure fixtures, telemetry, and crew/robotic tending on a predictable subscription or campaign basis.',
    },
    {
      code: 'BM 02',
      title: 'Providing cargo handling, storage, and orbital logistics services',
      detail:
        'Acting as a staging, warehousing, and transfer node between Earth to orbit launch vehicles and in space tugs or return capsules.',
    },
    {
      code: 'BM 03',
      title: 'Hosting selected manufacturing processes',
      detail:
        'Supplying power, high capacity heat rejection, microgravity isolation, and return integration for validated high value space manufactured goods.',
    },
    {
      code: 'BM 04',
      title: 'Offering assembly, inspection, or servicing facilities',
      detail:
        'Supporting in orbit structural integration, sensor calibration, anomaly repair, and module upgrades for spacecraft that benefit from persistent robotic infrastructure.',
    },
    {
      code: 'BM 05',
      title: 'Providing habitation and support services for professional users',
      detail:
        'Delivering life support, radiation refuge, medical monitoring, and workspaces for institutional astronauts and industrial payload specialists.',
    },
    {
      code: 'BM 06',
      title: 'Supporting training and carefully regulated commercial visits',
      detail:
        'Hosting structured, safety governed human spaceflight missions where demand and transport reliability permit.',
    },
    {
      code: 'BM 07',
      title: 'Providing shared utilities or infrastructure to multiple operators',
      detail:
        'Allowing partner modules to plug into common power, thermal, communications, and environmental buses rather than duplicating spacecraft bus hardware.',
    },
  ],
  validationFramework: [
    {
      step: '01',
      title: 'Customer and unmet need',
      question: 'Who is the specific buyer, and what problem cannot be solved on Earth or via a small uncrewed satellite?',
    },
    {
      step: '02',
      title: 'Evidence of demand',
      question: 'Is there verifiable willingness to pay, rather than speculative total addressable market projections?',
    },
    {
      step: '03',
      title: 'Technical requirements',
      question: 'What exact mass, volume, power, thermal rejection, microgravity quality, and crew time are required?',
    },
    {
      step: '04',
      title: 'Transport and operating costs',
      question: 'How sensitive is unit economics to launch price per kilogram, return cadence, and orbital maintenance?',
    },
    {
      step: '05',
      title: 'Capital requirements',
      question: 'What upfront R&D, qualification, and deployment capital is needed before first productive use?',
    },
    {
      step: '06',
      title: 'Utilisation and pricing assumptions',
      question: 'What occupancy or duty cycle is required to cover fixed station keeping and life support overhead?',
    },
    {
      step: '07',
      title: 'Regulatory and safety requirements',
      question: 'What licensing, orbital debris mitigation, export control, and human rating standards apply?',
    },
    {
      step: '08',
      title: 'Competing alternatives',
      question: 'How does a shared orbital city compare against terrestrial automation, parabolic flights, or free flying capsules?',
    },
    {
      step: '09',
      title: 'Key uncertainties',
      question: 'Which single technical or market assumption carries the highest risk of invalidating the case?',
    },
    {
      step: '10',
      title: 'Criteria for proceeding, pausing, or abandoning the idea',
      question: 'What explicit, pre committed evidence threshold determines whether work advances or stops?',
    },
  ],
  closing:
    'The commercial case for a city should be built from validated use cases and infrastructure economics, not from market size figures alone.',
  cta: {
    label: 'Discuss a potential commercial or research use case',
    href: '/contact?category=commercial-use-case',
  },
};

export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: 'stage-01',
    number: 'Phase 01',
    title: 'Foundational research',
    shortTitle: 'Foundational Research',
    status: 'Researching',
    environmentTag: 'TERRESTRIAL SYSTEMS & TRADE STUDIES',
    homeSummary:
      'Study orbital mechanics, space habitat engineering, radiation protection, life support, human factors, transport economics, and commercial space infrastructure.',
    objective:
      'Establish a comprehensive systems architecture for space habitats, orbital infrastructure, engineering requirements, and commercial applications.',
    workstreams: [
      'Literature and industry review',
      'System requirements and constraints',
      'Potential customers and applications',
      'Technology readiness assessment',
      'Initial economic models',
      'Research and collaboration priorities',
    ],
    exitCriteria:
      'A documented systems architecture, technical baseline, and prioritised engineering roadmap.',
    dependencies: [
      'Multidisciplinary technical literature synthesis',
      'Collaboration with aerospace, habitat, and industrial domain specialists',
    ],
    risksAndUnresolvedQuestions: [],
    supportingEvidence:
      'Architecture and systems baseline defined in the Revatya foundational specification.',
    image: {
      src: '/images/roadmap/stage-01-foundational-research.webp',
      alt: 'Terrestrial aerospace systems engineering research studio with orbital habitat wireframes and ECLSS mass balance displays.',
      caption: 'Conceptual visualisation: Phase 01 foundational systems engineering, architecture trade studies, and techno economic modelling.',
      conditionLabel: 'PHASE 01 · TERRESTRIAL SYSTEMS SYNTHESIS',
    },
  },
  {
    id: 'stage-02',
    number: 'Phase 02',
    title: 'Developing an underwater city',
    shortTitle: 'Underwater City',
    status: 'Proposed',
    environmentTag: 'SUBSEA CITY ARCHITECTURE & OPERATIONS',
    homeSummary:
      'Design, engineer, and develop an underwater city to master closed loop life support, pressurized modular architecture, autonomous utility grids, and sustained human habitation in an extreme environment on Earth.',
    objective:
      'Develop an operational underwater city to prove closed loop environmental systems, pressurized habitat construction, and multi sector urban operations before scaling to orbit.',
    workstreams: [
      'Pressurized subsea habitat architecture and modular construction',
      'Closed loop environmental control, water recovery, and air revitalization',
      'Subsea power distribution, thermal regulation, and autonomous monitoring',
      'Sustained human habitation, crew logistics, and urban operations',
      'Subsea to orbital systems transfer and operational readiness',
    ],
    exitCriteria:
      'Operational underwater city modules demonstrating sustained closed loop habitation, resilient utility networks, and verified human operations.',
    dependencies: [
      'Phase 01 foundational systems architecture and pressurized module engineering',
      'Marine engineering, subsea robotics, and environmental life support integration',
    ],
    risksAndUnresolvedQuestions: [],
    supportingEvidence:
      'Integrated subsea habitat engineering and closed-loop urban systems architecture.',
    image: {
      src: '/images/roadmap/stage-02-subsea-analog.webp',
      alt: 'Pressurized modular underwater city on the continental shelf with interconnected habitat domes, research bays, and closed-loop life support infrastructure.',
      caption: 'Conceptual visualisation: Phase 02 developing an underwater city for closed-loop habitation and subsea urban operations.',
      conditionLabel: 'PHASE 02 · DEVELOPING AN UNDERWATER CITY',
    },
  },
  {
    id: 'stage-03',
    number: 'Phase 03',
    title: 'Technology and system prototypes',
    shortTitle: 'System Prototypes',
    status: 'Proposed',
    environmentTag: 'THERMAL VACUUM & BENCH QUALIFICATION',
    homeSummary:
      'Build and qualify orbital-grade hardware prototypes, modular utility interfaces, and autonomous robotics in thermal vacuum and flight-like test environments.',
    objective:
      'Build and qualify critical orbital subsystems and prove their performance against explicit flight requirements.',
    workstreams: [
      'Monitoring systems and autonomous telemetry',
      'Autonomous inspection workflows',
      'Closed-loop life support subsystems',
      'Modular mechanical, fluid, and data interfaces',
      'Robotics and orbital assembly mechanisms',
    ],
    exitCriteria:
      'Qualified subsystem prototypes, repeatable thermal vacuum test reports, and flight readiness sign-off.',
    dependencies: [
      'Validated requirements from Phase 01 and operational systems experience from the Phase 02 underwater city',
      'Laboratory, academic, and industrial testing partnerships',
    ],
    risksAndUnresolvedQuestions: [],
    supportingEvidence: 'Hardware-in-the-loop qualification and thermal vacuum verification.',
    image: {
      src: '/images/roadmap/stage-03-system-prototypes.webp',
      alt: 'Full scale metallic orbital docking ring and ECLSS utility bulkhead prototype inside a stainless steel thermal vacuum chamber.',
      caption: 'Conceptual visualisation: Phase 03 hardware in the loop docking and utility interface qualification in a thermal vacuum chamber.',
      conditionLabel: 'PHASE 03 · HARDWARE IN THE LOOP QUALIFICATION',
    },
  },
  {
    id: 'stage-04',
    number: 'Phase 04',
    title: 'Initial orbital infrastructure concept',
    shortTitle: 'Initial Orbital Node',
    status: 'Proposed',
    environmentTag: 'INITIAL LEO CORE NODE',
    homeSummary:
      'Deploy an initial orbital core platform integrating docking interfaces, shared power and thermal buses, life support, and commercial research and manufacturing bays.',
    objective:
      'Establish the foundational orbital platform connecting transport, power, thermal rejection, and initial commercial modules in low Earth orbit.',
    workstreams: [
      'Mission and orbit selection',
      'Transport and launch integration',
      'Habitat and payload module deployment',
      'Power and thermal bus commissioning',
      'Life support and crew safety operations',
      'Anchor customer payload operations',
    ],
    exitCriteria:
      'Commissioned initial orbital core node supporting sustained power, thermal, logistics, and commercial payload operations.',
    dependencies: [
      'Flight-qualified subsystems from Phase 03 and anchor commercial use cases',
      'Integration with commercial launch and crew/cargo transport vehicles',
    ],
    risksAndUnresolvedQuestions: [],
    supportingEvidence: 'Minimum viable orbital core node architecture and mission integration.',
    image: {
      src: '/images/roadmap/stage-04-initial-orbital-node.webp',
      alt: 'Initial minimum viable orbital core module in low Earth orbit with radial berthing nodes, solar wings, and a docked spacecraft.',
      caption: 'Conceptual visualisation: Phase 04 initial orbital platform in low Earth orbit.',
      conditionLabel: 'PHASE 04 · INITIAL ORBITAL PLATFORM',
    },
  },
  {
    id: 'stage-05',
    number: 'Phase 05',
    title: 'Expansion toward a city',
    shortTitle: 'Expansion Toward a City',
    status: 'Proposed',
    environmentTag: 'MULTI SECTOR ORBITAL COMPLEX',
    homeSummary:
      'Scale additional habitats, research laboratories, industrial cleanrooms, logistics ports, and civic commons into an interconnected orbital city.',
    objective:
      'Connect multi-sector habitation, research, industrial, and logistics modules into an expandable urban ecosystem in orbit.',
    workstreams: [
      'Modular expansion architecture',
      'Shared utilities and high capacity infrastructure',
      'Transport and logistics networks',
      'Human habitation and community design',
      'Industrial and research districts',
      'Governance, safety, and operations',
      'Long term economic sustainability',
    ],
    exitCriteria:
      'A multi-district orbital city operating across shared utility, logistics, industrial, and residential rings.',
    dependencies: [
      'Demonstrated technical and commercial operations of the Phase 04 initial orbital node',
      'Multi-operator interface standards and sustained orbital market growth',
    ],
    risksAndUnresolvedQuestions: [],
    supportingEvidence: 'Long term architectural horizon.',
    image: {
      src: '/images/roadmap/stage-05-city-expansion.webp',
      alt: 'Mature multi ring expandable orbital city complex in low Earth orbit above Earths cloud deck.',
      caption: 'Conceptual visualisation: Stage 05 long horizon modular expansion into a multi district orbital city.',
      conditionLabel: 'STAGE 05 · EXPANDABLE MULTI DISTRICT ORBITAL CITY',
    },
  },
];

export const RESEARCH_STATUS_FRAMEWORK: {
  status: ResearchEpistemicStatus;
  description: string;
}[] = [
  {
    status: 'Established background',
    description: 'Supported by reliable published evidence.',
  },
  {
    status: 'Research question',
    description: 'An unresolved issue being investigated.',
  },
  {
    status: 'Revatya hypothesis',
    description: 'A proposition requiring validation.',
  },
  {
    status: 'Concept design',
    description: 'A proposed arrangement or architecture.',
  },
  {
    status: 'Test result',
    description: 'A result from a documented test with methodology and limitations.',
  },
  {
    status: 'Validated requirement',
    description: 'A requirement supported by evidence appropriate to its intended use.',
  },
];

export const RESEARCH_PROGRAMMES: ResearchProgramme[] = [
  {
    id: 'habitat-life-support',
    code: 'RP 01',
    title: 'Habitat systems and life support',
    summary:
      'Atmosphere revitalisation, water recovery, waste processing, environmental monitoring, redundancy, maintainability, and failure response.',
    epistemicStatus: 'Research question',
    establishedBackground:
      'International Space Station ECLSS operations have demonstrated multi year physico chemical water recovery and oxygen generation, while revealing high crew maintenance hours and spare parts dependency.',
    researchQuestions: [
      'How can life support architectures transition from high maintenance filter replacement toward modular, automated, easily serviceable loops for larger populations?',
      'What architecture best combines centralised city scale utility processing with independent sector level emergency life support?',
      'Which continuous trace contaminant and microbial monitoring methods can detect faults before crew health is affected?',
    ],
    revatyaHypothesis:
      'A zoned, dual tier ECLSS architecture, pairing district level survival autonomy with a central high efficiency recovery spine, may reduce per capita resupply mass while containing fault propagation.',
    conceptDesignFocus:
      'Standardised utility bulkheads carrying redundant air, potable water, greywater, and telemetry buses with automated isolation valves.',
    validationRequirements:
      'Requires quantitative mass balance modelling, reliability block diagram analysis, and long duration closed loop hardware endurance testing.',
    image: {
      src: '/images/research/rp-01-eclss-loop.webp',
      alt: 'Close up engineering view of a dual tier closed loop ECLSS water purification and atmospheric revitalisation rack.',
      caption: 'Conceptual visualisation: RP 01 closed loop water recovery and atmospheric revitalisation testbed.',
      conditionLabel: 'RP 01 · DUAL TIER CLOSED LOOP ECLSS ARCHITECTURE',
    },
  },
  {
    id: 'radiation-health',
    code: 'RP 02',
    title: 'Radiation and human health',
    summary:
      'Exposure management, shielding approaches, health monitoring, crew wellbeing, and the implications of long duration habitation.',
    epistemicStatus: 'Research question',
    establishedBackground:
      'Ionising radiation in orbit (trapped belt protons, solar particle events, and galactic cosmic rays) alongside microgravity fluid shifts, bone/muscle deconditioning, and neuro ocular changes remain primary limits on career and residential duration in space.',
    researchQuestions: [
      'How can structural mass, water storage, and consumables be arranged concentrically around sleeping and high occupancy zones to reduce cumulative dose without prohibitive launch mass?',
      'What occupational and residential dose limits would govern non astronaut industrial workers or researchers in low Earth orbit?',
      'Under what duration thresholds does partial artificial gravity become mandatory rather than optional?',
    ],
    revatyaHypothesis:
      'Integrating water tanks, propellant/feedstock reserves, and hydrogen rich polymers directly into residential sleeping walls and storm shelters can meaningfully lower effective dose in LEO.',
    conceptDesignFocus:
      'Multi layered hull shielding geometries, active real time dosimetry zoning, and human physiological countermeasure facilities.',
    validationRequirements:
      'Requires radiation transport simulation (e.g., Geant4/OLTARIS) across target orbital inclinations and aerospace medicine clinical review.',
    image: {
      src: '/images/research/rp-02-radiation-shielding.webp',
      alt: 'Cutaway architectural detail of concentric hydrogen rich water wall radiation shielding surrounding a crew sleeping berth.',
      caption: 'Conceptual visualisation: RP 02 concentric water wall radiation storm shelter and active dosimetry zoning.',
      conditionLabel: 'RP 02 · HYDROGEN RICH MASS SHIELDING & DOSIMETRY',
    },
  },
  {
    id: 'orbital-architecture',
    code: 'RP 03',
    title: 'Orbital architecture and construction',
    summary:
      'Modular interfaces, assembly, structural design, inspection, robotic assistance, maintenance, and expansion.',
    epistemicStatus: 'Concept design',
    establishedBackground:
      'Large orbital structures have historically been assembled from cylindrical launch fairing constrained modules using berthing mechanisms and extravehicular activity.',
    researchQuestions: [
      'What mechanical, power, thermal, and fluid interface geometries allow modules to be added, upgraded, or retired without interrupting city operations?',
      'How do expandable/inflatable structures compare against rigid metallic or in space assembled truss habitats across safety, acoustic, and outfitting metrics?',
      'How can exterior robotic crawlers and autonomous sensors perform continuous MMOD (micrometeoroid and orbital debris) hull inspection and repair?',
    ],
    revatyaHypothesis:
      'Separating the primary structural/utility spine from replaceable pressurised habitat and industrial pods allows incremental growth and technology refresh over decades.',
    conceptDesignFocus:
      'Central logistics and utility truss spine with radial berthing nodes and exterior robotic servicing rails.',
    validationRequirements:
      'Requires structural dynamics modelling, docking load analysis, and hardware in the loop robotic interconnect testing.',
    image: {
      src: '/images/research/rp-03-modular-coupler.webp',
      alt: 'Precision engineering view of a standardized orbital structural, high voltage power, fluid, and optical data berthing coupler.',
      caption: 'Conceptual visualisation: RP 03 standardized mechanical, electrical, thermal, and data module interconnect.',
      conditionLabel: 'RP 03 · STANDARDISED MODULAR UTILITY COUPLER',
    },
  },
  {
    id: 'power-thermal',
    code: 'RP 04',
    title: 'Power and thermal systems',
    summary:
      'Power generation, storage, distribution, thermal control, heat rejection, and resilience.',
    epistemicStatus: 'Research question',
    establishedBackground:
      'In vacuum, every kilowatt of electrical power consumed inside a habitat or industrial furnace eventually becomes waste heat that can only be rejected through radiative surfaces or expendable phase change media.',
    researchQuestions: [
      'What is the practical thermal rejection ceiling for an orbital complex supporting energy intensive manufacturing alongside human habitation?',
      'How can multi district fluid thermal loops be isolated against micrometeoroid punctures and toxic working fluid leaks?',
      'How should high voltage DC microgrids manage transient industrial loads during orbital eclipse periods?',
    ],
    revatyaHypothesis:
      'Treating radiative heat rejection capacity, not merely solar power generation, as the primary sizing constraint for industrial districts leads to a fundamentally more realistic city layout.',
    conceptDesignFocus:
      'Dedicated thermal spine with modular deployable radiators and heat exchanger interfaces isolating internal benign water loops from external radiator fluids.',
    validationRequirements:
      'Requires orbital thermal balance modelling across beta angles and eclipse cycles.',
    image: {
      src: '/images/research/rp-04-thermal-heat-rejection.webp',
      alt: 'Exterior orbital engineering view of a dual loop brazed heat exchanger manifold and deployable radiator wing.',
      caption: 'Conceptual visualisation: RP 04 dual loop heat exchanger manifold and micrometeoroid armored radiator wing.',
      conditionLabel: 'RP 04 · ACTIVE THERMAL BUS & RADIATIVE REJECTION',
    },
  },
  {
    id: 'human-factors',
    code: 'RP 05',
    title: 'Human factors and habitation',
    summary:
      'Privacy, accessibility, sleep, exercise, community, psychological wellbeing, emergency procedures, and design for long duration use.',
    epistemicStatus: 'Concept design',
    establishedBackground:
      'Historical space stations and submarine/polar analog studies demonstrate that acoustic noise, visual monotony, lack of privacy, and cramped utility first interiors degrade cognitive performance and crew cohesion.',
    researchQuestions: [
      'How can interior architecture establish clear spatial boundaries between concentrated work, communal dining/recreation, and private restoration?',
      'What acoustic dampening, circadian lighting, and tactile material choices pass strict flammability and off gassing certifications while feeling humane?',
      'How must emergency egress routes and pressure bulkhead hatches be arranged for intuitive navigation by non career astronauts?',
    ],
    revatyaHypothesis:
      'Human wellbeing is a hard engineering subsystem: designing acoustic calm, private quarters, and shared observation commons from the start improves operational safety and retention.',
    conceptDesignFocus:
      'Human eye level interior perspectives, modular acoustic crew cabins, and shared panoramic observation spaces.',
    validationRequirements:
      'Requires human in the loop volumetric mockups, acoustic modelling, and NASA STD 3001 / spacecraft material compliance evaluation.',
    image: {
      src: '/images/research/rp-05-human-factors-acoustics.webp',
      alt: 'Interior architectural photograph of an orbital crew cabin mockup with micro perforated acoustic panels and circadian lighting.',
      caption: 'Conceptual visualisation: RP 05 volumetric human factors cabin mockup with acoustic dampening and circadian illumination.',
      conditionLabel: 'RP 05 · ACOUSTIC CALM & CIRCADIAN ARCHITECTURE',
    },
  },
  {
    id: 'orbital-logistics',
    code: 'RP 06',
    title: 'Orbital logistics and services',
    summary:
      'Docking, cargo transfer, storage, servicing, spacecraft interfaces, and the relationship between infrastructure and transport systems.',
    epistemicStatus: 'Research question',
    establishedBackground:
      'Current orbital logistics rely on point to point resupply missions tailored to single stations, with high crew overhead spent unpacking and stowing cargo bags.',
    researchQuestions: [
      'How can cargo containers, fluid couplers, and robotic transfer tracks be standardised from terrestrial payload integration through orbital storage?',
      'What safe proximity operations, approach corridors, and docking schedules are required when multiple commercial vehicles visit a shared hub?',
      'Under what orbital mechanics and delta v budgets does a centralised orbital port make sense versus direct insertion to customer orbits?',
    ],
    revatyaHypothesis:
      'Automated palletised cargo handling and standardised utility umbilicals are prerequisites for scaling an orbital facility beyond a small crew tended outpost.',
    conceptDesignFocus:
      'Dedicated orbital port district with axial/radial berthing adapters, robotic cargo airlocks, and segregated servicing bays.',
    validationRequirements:
      'Requires astrodynamics trade studies, docking throughput queueing models, and interface standardisation alignment.',
    image: {
      src: '/images/research/rp-06-automated-cargo-handling.webp',
      alt: 'Interior view of an automated orbital logistics transfer corridor and cargo airlock with overhead robotic pallet rails.',
      caption: 'Conceptual visualisation: RP 06 automated pressurized cargo airlock and robotic pallet warehousing rail.',
      conditionLabel: 'RP 06 · AUTOMATED PALLETISED CARGO LOGISTICS',
    },
  },
  {
    id: 'manufacturing-industrial',
    code: 'RP 07',
    title: 'Manufacturing and industrial applications',
    summary:
      'Specific processes that may benefit from space based operations, customer requirements, production quality, transport, and commercial feasibility.',
    epistemicStatus: 'Revatya hypothesis',
    establishedBackground:
      'Microgravity suppresses buoyancy driven convection and sedimentation, enabling distinct physical phenomena in crystal growth, exotic optical fibres, and tissue engineering, though few processes have yet crossed the commercial cost threshold.',
    researchQuestions: [
      'Which specific materials or biological products demonstrate an advantage in microgravity that cannot be replicated by terrestrial magnetic levitation, acoustic levitation, or process refinement?',
      'What is the end to end cost per kilogram including feedstock upmass, orbital power/cooling, quality assurance, and low g re entry return?',
      'When does co locating manufacturing in a crewed city outperform uncrewed free flying return capsules?',
    ],
    revatyaHypothesis:
      'A shared orbital facility is most valuable during iterative process discovery, multi step synthesis requiring human/laboratory intervention, and in space manufacturing of components used directly in orbit.',
    conceptDesignFocus:
      'Vibration isolated industrial racks and co orbiting tended industrial platforms.',
    validationRequirements:
      'Requires rigorous process by process techno economic analysis and blind comparative benchmarking against terrestrial state of the art.',
    image: {
      src: '/images/research/rp-07-microgravity-crystallisation.webp',
      alt: 'Close up engineering view inside a microgravity materials rack showing containerless laser heated alloy levitation and metrology optics.',
      caption: 'Conceptual visualisation: RP 07 vibration isolated containerless materials processing and optical metrology rig.',
      conditionLabel: 'RP 07 · CONTAINERLESS MICROGRAVITY METALLURGY & CRYSTAL GROWTH',
    },
  },
  {
    id: 'economics-governance',
    code: 'RP 08',
    title: 'Economics, governance, and sustainability',
    summary:
      'Capital requirements, operating costs, demand, regulation, safety, orbital debris, responsible resource use, and long term governance.',
    epistemicStatus: 'Research question',
    establishedBackground:
      'Large scale infrastructure on Earth relies on project finance, clear property/liability regimes, shared utilities, and anchor tenants, mechanisms that remain nascent or undefined in orbit.',
    researchQuestions: [
      'What staged capital structure and anchor tenancy model could fund incremental orbital infrastructure without relying on speculative demand?',
      'How are liability, safety certification, export controls, and jurisdictional oversight allocated across an international multi tenant orbital facility?',
      'What active debris avoidance, end of life disposal, and orbital sustainability standards must be built into the baseline architecture?',
    ],
    revatyaHypothesis:
      'Credible orbital infrastructure must be underwritten by a disciplined 10 point validation framework that explicitly defines proceed, pause, or abandon criteria for every use case.',
    conceptDesignFocus:
      '10 point techno economic validation framework and multi tenant operational governance model.',
    validationRequirements:
      'Requires space law/regulatory review, insurance risk modelling, and bottom up cost estimation.',
    image: {
      src: '/images/research/rp-08-orbital-traffic-governance.webp',
      alt: 'Orbital operations and traffic governance workstation showing 3D debris conjunction ellipsoids and multi tenant utility metering.',
      caption: 'Conceptual visualisation: RP 08 orbital traffic coordination, conjunction safety envelopes, and multi tenant utility governance.',
      conditionLabel: 'RP 08 · MULTI TENANT GOVERNANCE & ORBITAL SAFETY ENVELOPES',
    },
  },
];

export const LONG_HORIZON_PROSPECTING_BRIEF = {
  eyebrow: 'LONG HORIZON BOUNDARY STUDY',
  headline: 'Deep space prospecting vs. near term orbital infrastructure.',
  epistemicStatus: 'Research question' as ResearchEpistemicStatus,
  body: 'While autonomous asteroid prospecting and in situ volatile extraction could eventually supply radiation shielding mass or propellant to an orbital ecosystem, Revatya separates long horizon resource utilisation from near term LEO infrastructure feasibility. An orbital city must first justify its economics through Earth supplied research, logistics, and manufacturing before depending on extraterrestrial resource chains.',
  image: {
    src: '/images/research/asteroid-prospecting-concept.webp',
    alt: 'Autonomous robotic prospecting spacecraft inspecting the surface of a carbonaceous near Earth asteroid.',
    caption: 'Conceptual visualisation: long horizon autonomous asteroid prospecting and assay verification probe.',
    conditionLabel: 'HORIZON STUDY · AUTONOMOUS DEEP SPACE PROSPECTING',
  },
};

export const INSIGHTS_CONTENT = {
  hero: {
    eyebrow: 'IDEAS, EVIDENCE, AND PROGRESS',
    headline: 'Document the questions before claiming the answers.',
    body: "Revatya's publications explore the engineering, architecture, economics, and systems questions behind a future space city.",
  },
  categories: [
    'All categories',
    'Research briefs',
    'Engineering explainers',
    'Concept architecture',
    'Space economy analysis',
    'Development updates',
    'Collaboration announcements',
    'Lessons from tests and prototypes',
  ],
  emptyStateTitle: 'Research notes are in preparation',
  emptyStateBody:
    'Research notes and publications will appear here when they are ready to share.',
  emptyStateSubtext:
    'Revatya does not publish placeholder articles, fabricated citations, or unverified technical claims. As foundational research briefs and systems architecture papers complete internal review, they will be indexed here with explicit epistemic status labels.',
  articleTemplateSpec: [
    { field: 'Title', detail: 'Clear, descriptive engineering or economic subject' },
    { field: 'Short summary', detail: 'Concise scope of what is examined and what remains open' },
    { field: 'Category', detail: 'One of the 7 canonical publication tracks' },
    { field: 'Author & Affiliation', detail: 'Published when verified and disclosed' },
    { field: 'Publication & Updated Dates', detail: 'Versioned history of revisions' },
    { field: 'Epistemic Status Label', detail: 'Established background, Hypothesis, Concept design, or Test result' },
  ],
};

export const UPDATES_CONTENT = {
  hero: {
    eyebrow: 'TRANSPARENT RECORD',
    headline: 'Progress, documented.',
    body: 'Follow the questions Revatya is investigating, the work being completed, and the decisions that shape the development pathway.',
  },
  emptyStateTitle: 'Public updates will be published as substantive work is completed',
  emptyStateBody:
    'Substantive progress updates will be published here as work develops.',
  emptyStateExplanation:
    'In accordance with Revatya’s content integrity standards, we only publish verified developments. Every future update entry is structured to report not only what changed, but what remains uncertain.',
  updateSchemaFields: [
    { label: 'Title & Date', description: 'Exact milestone or research decision recorded' },
    { label: 'Update type', description: 'Research synthesis, prototype evaluation, or programme decision' },
    { label: 'What changed', description: 'Factual account of work completed' },
    { label: 'Why it matters', description: 'How the work informs the space city pathway' },
    { label: 'Evidence or supporting links', description: 'Verifiable documentation or test data' },
    { label: 'What remains uncertain', description: 'Explicit statement of limitations and open questions' },
    { label: 'Next step & Related roadmap stage', description: 'Connection to Stages 01 to 05' },
  ],
};

export const PARTNERS_CONTENT = {
  hero: {
    eyebrow: 'PARTNERS AND COLLABORATORS',
    headline: 'Help build the foundations of what comes next.',
    body: 'A space city will require expertise across aerospace, architecture, materials, robotics, life support, research, manufacturing, logistics, and economics. Revatya is open to conversations with people and organisations whose capabilities may contribute to this long term challenge.',
  },
  pathways: [
    {
      id: 'technology-manufacturing',
      enquiryCategoryValue: 'Technology or manufacturing partnership',
      title: 'Technology and manufacturing',
      description:
        'For companies working on advanced materials, robotics, manufacturing, energy, thermal management, sensors, or relevant subsystems.',
      ctaLabel: 'Discuss a technology partnership',
      focusTopics: ['Advanced materials', 'Robotics & sensors', 'Thermal & power subsystems', 'In space manufacturing'],
    },
    {
      id: 'research-academia',
      enquiryCategoryValue: 'Technical or research collaboration',
      title: 'Research and academia',
      description:
        'For universities, research centres, laboratories, and research teams interested in relevant technical or economic questions.',
      ctaLabel: 'Propose a research collaboration',
      focusTopics: ['ECLSS & closed loop systems', 'Radiation shielding', 'Human factors', 'Techno economic studies'],
    },
    {
      id: 'aerospace-infrastructure',
      enquiryCategoryValue: 'Aerospace or infrastructure',
      title: 'Aerospace and infrastructure',
      description:
        'For organisations working on launch, spacecraft, transport, docking, servicing, orbital infrastructure, or habitation.',
      ctaLabel: 'Discuss infrastructure',
      focusTopics: ['Launch & orbital transfer', 'Docking interfaces', 'In orbit servicing', 'Modular habitats'],
    },
    {
      id: 'commercial-users',
      enquiryCategoryValue: 'Commercial use case',
      title: 'Commercial users',
      description:
        'For organisations exploring potential research, manufacturing, logistics, or other use cases that may benefit from access to orbital facilities.',
      ctaLabel: 'Discuss a use case',
      focusTopics: ['Microgravity R&D', 'Payload hosting', 'Orbital warehousing', 'Specialist crew missions'],
    },
    {
      id: 'strategic-financial',
      enquiryCategoryValue: 'Investment or strategic discussion',
      title: 'Strategic and financial partners',
      description:
        'For investors, incubators, advisors, and institutions interested in understanding the thesis, development requirements, and potential collaboration models.',
      ctaLabel: 'Request a conversation',
      focusTopics: ['Infrastructure thesis', 'Staged capital models', 'Institutional advisory', 'Long horizon R&D'],
    },
    {
      id: 'individual-contributors',
      enquiryCategoryValue: 'Technical or research collaboration',
      title: 'Individual contributors',
      description:
        'For engineers, architects, designers, students, and independent researchers with relevant expertise.',
      ctaLabel: 'Introduce yourself',
      focusTopics: ['Systems engineering', 'Space architecture', 'Research synthesis', 'Simulation & visualisation'],
    },
  ] satisfies PartnerPathway[],
  whatToInclude: [
    'Name',
    'Organisation, if applicable',
    'Work email or preferred contact method',
    'Enquiry category',
    'Relevant capability or research area',
    'Short description of the proposed collaboration',
    'Optional website or supporting link',
    'Consent to be contacted, where required',
  ],
  transparencyStatement:
    'Revatya is developing its concepts and relationships over time. Unless specifically identified and verified, organisations mentioned in a conversation or listed as potential collaborators should not be represented as existing partners.',
};

export const JOIN_CONTENT = {
  hero: {
    eyebrow: 'INDIVIDUAL CONTRIBUTORS',
    headline: 'Bring your expertise to a difficult problem.',
    body: "Revatya's long term ambition spans engineering, science, architecture, manufacturing, human factors, and economics. If you have relevant expertise or want to contribute to a clearly defined research effort, introduce yourself.",
  },
  contributionAreas: [
    'Aerospace and mechanical engineering',
    'Architecture and systems design',
    'Robotics and autonomy',
    'Materials and manufacturing',
    'Life support and environmental systems',
    'Human factors and habitation',
    'Space economics and market research',
    'Technical writing and research synthesis',
    'Web, visualisation, and interactive tools',
  ],
  honestEmploymentNotice:
    'Transparency note: This form is for independent researchers, domain specialists, and potential collaborators to introduce their expertise for focused research or technical discussions. It is not an advertisement for paid employment or open job vacancies.',
  ctaLabel: 'Introduce yourself',
};

export const CONTACT_CONTENT = {
  hero: {
    eyebrow: 'ENQUIRIES & DIALOGUE',
    headline: 'Start a conversation.',
    body: "Have a question, a research idea, a technical capability, or a potential partnership in mind? Tell us what you are working on and how it might connect with Revatya's vision.",
  },
  enquiryTypes: [
    'Technical or research collaboration',
    'Technology or manufacturing partnership',
    'Aerospace or infrastructure',
    'Commercial use case',
    'Investment or strategic discussion',
    'Media or speaking enquiry',
    'General enquiry',
  ] as const,
  validationMessages: {
    name: 'Please enter your name.',
    email: 'Enter a valid email address.',
    enquiryType: 'Select an enquiry type.',
    message: 'Please provide a short message.',
    consent: 'Please review the required consent field.',
  },
  submitButton: 'Send enquiry',
  successMessage:
    "Thank you for reaching out. Your message has been submitted. If your enquiry is relevant to Revatya's work, we will follow up using the contact details you provided.",
  errorMessage: 'Your message could not be submitted. Please try again.',
};
