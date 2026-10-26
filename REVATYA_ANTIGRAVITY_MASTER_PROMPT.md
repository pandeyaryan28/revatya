# Revatya Website --- Master Build Prompt for Antigravity

**Role:** Principal product designer, brand designer, frontend engineer,
technical architect, and quality assurance lead.\
**Project:** Revatya --- a long-term vision for a space city.\
**Execution environment:** Google Antigravity.\
**Content source of truth:** `REVATYA_WEBSITE_CONTENT.md` (the companion
content file).

------------------------------------------------------------------------

## 1. Mission

Design, implement, test, and polish a premium, production-quality
website for **Revatya**, a space technology initiative whose ultimate
ambition is to develop a city in space.

This is not a generic aerospace landing page, a science-fiction fan
site, or a generic startup template. It should feel like the digital
headquarters of a serious, ambitious organisation exploring the
infrastructure required for humanity to live, research, manufacture, and
operate beyond Earth.

The website must combine: 1. The emotional scale and cinematic quality
of a future orbital city. 2. The technical clarity and credibility of an
aerospace infrastructure organisation. 3. The visual discipline of a
premium architectural institution. 4. Clear pathways for technical
partners, research collaborators, potential commercial users, investors,
and individual contributors.

Do not stop after producing a plan, wireframe, or static mockup. Inspect
the available project, implement the website, run it, test it, and
refine it.

## 2. Read the source of truth first

Before coding: 1. Locate and read `REVATYA_WEBSITE_CONTENT.md` in full.
2. Inspect the existing repository, framework, package manager, routing,
design system, assets, and current implementation. 3. Preserve useful
existing work unless there is a clear reason to change it. 4. If no
project exists, choose a modern, maintainable web stack appropriate to
the environment and use the simplest architecture that supports the
requirements. 5. Create a brief implementation plan and then proceed
with development without waiting for approval on routine design
decisions. 6. Do not invent factual company information to fill gaps.
Use the provided copy and clearly labelled conceptual content.

The content file is the canonical source for page copy, navigation, SEO
metadata, disclaimers, and factual-integrity rules. If the design
requires a shorter line of copy, preserve the meaning and avoid making
stronger claims.

## 3. Brand positioning

**Brand:** Revatya\
**Core idea:** A city beyond Earth.\
**Primary line:** "A city beyond Earth."\
**Supporting line:** "Building the infrastructure of life beyond Earth."

Revatya's ultimate focus is a space city. Underwater habitat research or
testing may be an intermediate programme for selected transferable
engineering principles, but it must not dominate the website, brand,
hero, or primary navigation.

The city could potentially support: - Microgravity-enabled
manufacturing - Orbital logistics and a port-like transport hub -
Research and experimentation - Space resource utilisation - Commercial
habitation and tourism - Assembly, servicing, and future exploration

Describe these as potential applications requiring validation, not
guaranteed outcomes.

## 4. Design direction

### Overall direction

Combine three design qualities: - **Cinematic immersion:** monumental
orbital architecture, Earth views, arriving spacecraft, human-scale
interiors. - **Engineering credibility:** diagrams, architectural
sections, systems maps, roadmap details, research categories, evidence
and status labels. - **Premium editorial minimalism:** generous
whitespace, careful typography, restrained colours, clear hierarchy,
considered pacing.

The experience should be beautiful but not cluttered. Avoid an overly
gamified dashboard aesthetic, excessive neon, gratuitous holograms,
noisy particle effects, generic AI visuals, or a sea of identical
rounded cards.

### Colour system

Use a restrained palette: - Midnight navy / near-black for immersive
sections. - Warm white / very light grey for technical and editorial
sections. - Graphite for text. - Muted silver and restrained icy blue as
accents. - Accessible status colours only where meaningful.

Create reusable colour tokens. Check contrast in all interactive states.
Do not rely on colour alone to communicate status.

### Typography

Use a contemporary, high-quality sans serif for body and UI, paired with
a refined editorial display typeface if it improves the brand. Keep the
number of font families limited. Use fluid typography responsibly and
preserve legibility on small screens.

### Layout

-   Strong grid and consistent spacing scale.
-   Wide cinematic image sections with deliberate cropping.
-   Large, concise headlines.
-   Long-form copy broken into scannable, meaningful sections.
-   Technical diagrams with labels and legends.
-   Cards only where they improve comparison or navigation.
-   Responsive content widths and comfortable reading line lengths.
-   Footer that is useful, not ornamental.

### Motion

Use subtle, intentional motion: fade/slide reveals, low-amplitude
parallax, gentle transitions, and small interactive feedback. Do not
make scrolling feel slow or theatrical. Respect
`prefers-reduced-motion`. Keep critical information visible without
animation.

## 5. Image and video generation: required workflow

Use the image and video generation capabilities available through Google
Gemini models in Antigravity wherever bespoke visual assets are needed.
Prefer native, supported Gemini image-generation models for still images
and Google's Veo video-generation models for video when available in the
connected environment.

**Important model-selection instruction:** First inspect the model
picker, installed integrations, and available Antigravity tools. Use the
current image and video models actually available to the project. Do not
assume a model identifier or API endpoint. Do not fabricate an
integration. If a requested capability is unavailable, use an available
approved image/video generation route or create a well-designed, clearly
identified fallback asset and report the limitation.

Do not generate assets solely to decorate every section. Choose assets
based on a real content need.

### Required asset workflow

1.  Inventory existing assets and identify missing visuals.
2.  Create a small visual asset plan before generation.
3.  Generate bespoke images for the hero, city architecture,
    research/manufacturing, orbital logistics, and other essential
    sections.
4.  Generate video only for sections where motion adds meaningful value.
5.  Save generated assets in a clearly organised project directory, for
    example:
    -   `public/images/hero/`
    -   `public/images/city/`
    -   `public/images/applications/`
    -   `public/images/research/`
    -   `public/video/` Adapt this to the repository's existing
        conventions.
6.  Use descriptive, stable filenames.
7.  Optimise generated assets for web delivery. Prefer modern formats
    such as WebP or AVIF for images where supported, and an efficient
    video format for clips.
8.  Generate responsive crops or use `object-position` thoughtfully.
    Never stretch an image to fit.
9.  Add meaningful alt text to informative images; decorative images
    should have empty alt text.
10. Keep a record of the prompt and purpose for important generated
    assets in a small asset manifest if useful.
11. Do not embed API keys or credentials in client-side code.
12. Do not use image-generation tools to create fake logos, fake partner
    marks, fake screenshots, fabricated technical evidence, or fake data
    visualisations.

### Visual consistency rules

Generated assets must feel like they belong to the same project: - A
consistent architectural language: refined silver/white structures,
plausible geometry, monumental but not fantastical proportions. - A
consistent orbital setting and Earth appearance. - Consistent lighting,
colour grade, materials, and camera sensibility. - A mix of
human-eye-level interior perspectives and wide exterior views. -
Spacecraft should look like transport vehicles with a plausible
relationship to docking infrastructure, not random decorative objects. -
The city should read as an interconnected metropolis or expandable
habitat system, not merely a small station. - No text, watermarks,
pseudo-logos, or illegible UI inside generated images.

### Hero image generation brief

Generate a photorealistic architectural visualisation of a vast orbital
city, viewed from inside at human eye level. The foreground is a refined
public observation area with sophisticated architectural details.
Through enormous windows, Earth is clearly visible. In the distance,
interconnected city structures, docking infrastructure, and a small
number of spacecraft approaching or departing suggest a functioning
orbital hub. The city must feel monumental, inhabited, interconnected,
and designed for long-term human activity. Premium architectural
photography, physically plausible light, refined silver and white
materials, cinematic scale, subtle cool accents, no text, no logos, no
watermark, no fake UI. Compose for a wide desktop hero and ensure a
mobile crop remains compelling.

### Additional image briefs

Generate separate assets, not one repeated image, for: - A city exterior
above Earth - A city architectural cutaway / sectional concept -
Microgravity research or manufacturing interior - Orbital cargo and
docking infrastructure - A research laboratory / scientific work - A
robotic asteroid prospecting concept - Habitation and shared
environments - Clean technical diagrams or blueprint-style visuals

Technical diagrams that need exact labels should be built as real
SVG/HTML/CSS components rather than asking an image model to render
readable text. AI-generated text in images is unreliable.

### Video generation brief

If a supported Veo model is available and video materially improves the
hero, generate a short, silent, seamless or gently loopable cinematic
clip: slow camera movement from within an immense orbital city, Earth
visible through panoramic windows, subtle motion from a distant arriving
spacecraft, and gentle environmental lighting. Avoid abrupt camera
movement, rapid cuts, impossible physics, visible text, logos, or
invented mission insignia.

Requirements: - No audio autoplay. - Provide a static poster/fallback
image. - Respect reduced-motion preferences by showing the poster
instead of playing the clip. - Lazy-load non-critical video. - Use
`muted`, `playsinline`, and appropriate loop behaviour where autoplay is
used. - Ensure the site remains usable when video fails or is
unsupported. - Do not let video compromise page performance or mobile
data use.

All generated imagery and video are conceptual illustrations. Label it
appropriately wherever a visitor might mistake it for real facilities or
operational footage.

## 6. Information architecture and routes

Implement the core pages: - `/` --- Home - `/vision` --- Vision and
mission - `/city` --- Proposed city architecture and systems -
`/applications` --- Potential use cases - `/roadmap` --- Development
stages and status - `/research` --- Research programmes and open
questions - `/insights` --- Publications and articles, with a thoughtful
empty state if none exist - `/partners` --- Partner and collaborator
pathways - `/join` --- Individual contributors - `/contact` --- Enquiry
form

Potential later routes: - `/space-economy` - `/updates` -
`/city-atlas` - `/privacy` - `/terms`

Build a scalable route structure, but do not expose empty, broken, or
repetitive pages. If a route is not ready, omit it from visible
navigation until it contains useful content.

### Main navigation

Vision · The City · Applications · Roadmap · Research · Partners ·
**Collaborate**

The wordmark links to Home. Navigation should have clear hover, focus,
active, and mobile states. The Collaborate CTA should be prominent but
restrained.

## 7. Home page requirements

Implement the Home page in this order: 1. Hero with headline, concise
supporting copy, primary and secondary CTA, cinematic visual, and
conceptual-image label. 2. The thesis: "Space should become a place to
live, work, and build." 3. Why a city: manufacturing, orbital logistics,
research, resource utilisation, and habitation. 4. The city concept:
interconnected systems and a link to the City page. 5. The economic
thesis: explain why infrastructure needs real users and a credible
business case. 6. Roadmap preview with proposed stages and accurate
status labels. 7. Research and engineering challenges. 8. Partnership
invitation. 9. Closing statement and complete footer.

Use the exact detailed copy in `REVATYA_WEBSITE_CONTENT.md` as the
default. Maintain a clear narrative from ambition to purpose, systems,
feasibility, progress, and collaboration.

## 8. Page-specific requirements

### Vision

Explain the mission, the central question, guiding principles, long-term
ambition, and what success could look like. Avoid claiming that the
vision is an established outcome.

### The City

Present the city as a system. Include habitation, orbital
port/logistics, research, industrial zones, energy and thermal
management, life support, construction/maintenance, and shared human
environments. Clearly label the architecture as conceptual.

### Applications

Each application should have: - A concise opportunity statement -
Potential users - Key questions to validate - Relevant dependencies - A
clear indication of uncertainty - Links to related research

### Roadmap

Create a visually engaging vertical or horizontal milestone experience.
Each stage should support: - Objective - Workstreams - Exit criteria -
Dependencies - Current status - Supporting evidence, if it exists -
Last-updated date, if maintained

Use actual data from the content/configuration. Do not show fake
percentages, dates, progress bars, or milestones. If no live status data
exists, use "Proposed" or "Research" labels rather than pretending to
have a live project tracker.

### Research

Present research areas as organised programmes. Distinguish established
background, research questions, Revatya hypotheses, concept designs,
test results, and validated requirements. If sources are included,
ensure links and claims are real and verifiable.

### Insights

Create an editorial listing and article template. Do not fabricate
publications. Use a polished empty state when there are no real
articles.

### Partners

Create clear pathways for technology/manufacturing, research/academia,
aerospace infrastructure, commercial users, strategic/financial
partners, and individual contributors. Each pathway should lead to the
contact form with the enquiry category preselected.

Do not invent partner logos or suggest existing agreements.

### Join

Offer a way for contributors to express interest. Do not create fake
vacancies or imply compensation or employment unless the owner provides
those facts.

### Contact

Create a functional, accessible form with name, email, organisation
(optional), enquiry category, subject (optional), message, optional
link, and consent if required. Validate on both client and server when a
backend exists. Show accurate success and failure states. If no backend
is configured, clearly report that a real submission endpoint is
required; do not simulate successful delivery.

## 9. Interaction requirements

Implement only interactions that have a clear user benefit: - Smooth
anchor navigation where appropriate. - Functional route links and
CTAs. - Responsive mobile navigation with keyboard support. - Accessible
accordions for technical detail where helpful. - Roadmap stage expansion
or detail panels. - Application cards linking to relevant details. -
Contact forms with meaningful validation and status feedback. - Optional
lightweight city-atlas interaction if time and architecture permit.

For a city atlas, make it usable on touchscreens as well as desktop.
Each district should open a meaningful detail panel with purpose,
potential users, systems, dependencies, open questions, and status. It
must be labelled conceptual.

Do not create inert buttons, decorative controls that look interactive,
fake live telemetry, or pointless animations.

## 10. Technical implementation standards

First inspect the existing codebase and follow its established
conventions. If starting from scratch, select a modern stack supported
by the environment; favour maintainability and good performance over
novelty.

General requirements: - Componentised architecture and reusable design
tokens. - Semantic HTML and accessible components. - Responsive design
from small mobile screens upward. - Optimised images and videos. - Lazy
loading for below-the-fold media. - Avoid layout shifts; specify image
aspect ratios or dimensions. - Proper route handling and not-found
page. - Meaningful loading, empty, error, and success states. - No
secrets or API keys in frontend bundles. - Secure server-side handling
for form submissions. - Avoid unnecessary dependencies. - Use
environment variables for server-side secrets. - Ensure generated media
paths resolve correctly. - Set page titles, descriptions, canonical
URLs, and social metadata. - Add a favicon and web app metadata if
suitable brand assets exist. - Include a privacy notice appropriate to
actual data collection. - No fake analytics counters or fabricated
statistics.

If the repository already uses a framework or design system, do not
replace it without a strong reason. Do not add a backend, database, CMS,
or authentication system unless required by the actual features and
environment. Prefer a small, reliable first release.

## 11. Accessibility requirements

-   Semantic headings in a logical hierarchy.
-   Keyboard-accessible navigation and controls.
-   Visible focus indicators.
-   Appropriate text and interface contrast.
-   Form fields with persistent labels and useful error messages.
-   Alt text for meaningful images.
-   Empty alt text for decorative images.
-   Reduced-motion support.
-   No essential content available only on hover.
-   Video fallback and no audio autoplay.
-   Touch targets sized for mobile use.
-   Do not communicate status with colour alone.

## 12. Performance requirements

-   Optimise and compress assets.
-   Use responsive image sizes and modern formats when supported.
-   Avoid downloading hero video on constrained devices where a poster
    is sufficient.
-   Lazy-load non-critical media and below-the-fold images.
-   Avoid heavy animation libraries unless necessary.
-   Minimise layout shifts and blocking scripts.
-   Keep mobile performance a first-class concern.
-   Check the network panel and console for failed or oversized assets.
-   Aim for strong Core Web Vitals and a good Lighthouse result; measure
    actual results rather than claiming scores without testing.

## 13. SEO and sharing

Use the page-specific titles and descriptions from the content file.
Implement: - Unique title and description per page - Canonical URLs
where appropriate - Open Graph and social sharing metadata - Sensible
heading structure - Descriptive internal links - Sitemap and robots
configuration if supported by the stack - Structured data only where
accurate and appropriate

Do not add fake reviews, ratings, organisation awards, or unverified
structured data.

## 14. Content integrity and safety rails

These are mandatory: - Never invent staff, partners, customers,
investors, funding, facilities, mission dates, or accomplishments. -
Never represent conceptual art as actual operational footage. - Never
claim a system is validated without evidence. - Never invent telemetry,
visitor counts, research results, market sizes, or performance
statistics. - Distinguish current facts, proposed plans, hypotheses, and
long-term possibilities. - Underwater programmes can test selected
transferable principles but do not reproduce space-specific
conditions. - Explain uncertainty around microgravity manufacturing,
orbital logistics, asteroid resource utilisation, and space tourism. -
Do not fabricate sources or citations. - Use clearly identified
placeholders only during development, and remove or replace them before
launch. - Do not imply an enquiry has been received unless the backend
confirms it.

## 15. Suggested build sequence

### Phase 1 --- Audit and planning

-   Inspect repository and environment.
-   Read the content source.
-   Identify stack, assets, integrations, and constraints.
-   Create a short plan and a route/component map.

### Phase 2 --- Design system

-   Define tokens, typography, spacing, buttons, cards, navigation,
    footer, status labels, and responsive breakpoints.
-   Build the page shell and navigation.
-   Establish the visual direction before duplicating components.

### Phase 3 --- Core homepage

-   Implement hero and major narrative sections.
-   Integrate the main image asset.
-   Add functional navigation and CTAs.
-   Verify mobile composition early.

### Phase 4 --- Core interior pages

-   Build City, Applications, Roadmap, Research, Partners, Join,
    Contact, and Insights.
-   Reuse components without making every page look identical.
-   Add page-specific SEO and metadata.

### Phase 5 --- Media and interaction

-   Generate missing bespoke imagery with available Gemini image models.
-   Generate a short hero video with an available Veo model only if
    useful and supported.
-   Optimise media and create fallbacks.
-   Add the city atlas only if the core experience is complete and
    stable.

### Phase 6 --- Functionality

-   Verify every link and button.
-   Implement and test the contact submission path if backend
    integration is available.
-   Add validation, errors, loading states, and spam protection as
    appropriate.
-   Verify mobile menu, route navigation, and keyboard interaction.

### Phase 7 --- Quality assurance

-   Run the app.
-   Inspect every route at desktop, tablet, and mobile widths.
-   Check console errors, network failures, image crops, line wrapping,
    overflow, and accessibility.
-   Test keyboard navigation and reduced-motion behaviour.
-   Run available automated tests, lint, type checks, and production
    build.
-   Fix problems before finishing.

### Phase 8 --- Handover

-   Summarise what was built.
-   List routes and key components.
-   Document how images/video were generated and where they live.
-   Identify any integrations or environment variables still required.
-   List anything that could not be completed and why.
-   Provide the exact run/build commands supported by the project.
-   Do not claim that untested features work.

## 16. Acceptance criteria

The work is complete only when: - The site has a coherent, premium
Revatya identity. - The homepage clearly communicates the space-city
vision. - The underwater programme is subordinate to the space-city
ambition. - Core pages use the supplied content and are internally
consistent. - Bespoke, relevant imagery is integrated where available. -
Gemini image/video tools were used when available and useful, or any
limitation is explicitly reported. - Generated media is optimised and
has fallbacks where required. - All navigation, links, buttons, and
forms behave correctly. - No fake achievements, partner logos, metrics,
or operational claims remain. - Mobile, accessibility, and performance
have been tested. - The project builds and runs in the available
environment. - The final handover is accurate about what was and was not
completed.

## 17. Final instruction

Take ownership of the full build. Make thoughtful decisions
independently, but do not fabricate facts to make the project look more
mature. Prioritise a coherent, beautiful, fast, accessible, and credible
first release over unnecessary features.

The finished experience should leave visitors with three impressions: 1.
The ambition is extraordinary. 2. The team understands that the
engineering and economics are difficult. 3. There is a clear way to
learn more, contribute, or start a serious conversation.

Begin by inspecting the project and reading
`REVATYA_WEBSITE_CONTENT.md`. Then implement, run, test, and refine the
website.
