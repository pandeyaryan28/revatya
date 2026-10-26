# Revatya Orbital City — Art Direction, Architectural Masterplan & Spatial Hierarchy (v1.0.0)

## 1. Visual Philosophy & Art Direction
Revatya is conceived as a monumental, permanent orbital metropolis in Low Earth Orbit—not a cramped cluster of tin-can space station modules or a barren geometric ring, but a thriving, high-density urban civilization with distinct architectural neighbourhoods, public civic plazas, pressurized skybridges, elevated transit viaducts, biophilic botanical vaults, research campuses, microgravity industrial halls, and an active orbital logistics port.

### Architectural Language
- **Primary Structural Palette**: Satin architectural white ceramic-composite panels (`#EAECEF`), brushed warm titanium-silver spaceframes (`#B8C0C8`), and deep anodized graphite structural ribs (`#1E242B`).
- **Glazing & Habitation Warmth**: Selective low-iron architectural glass with subtle cool orbital sky reflection (`#6BA4D8`), paired with warm circadian interior illumination (`2900K–3400K` amber/warm white) in residential, civic, and recreational zones, and crisp lab-white/cyan (`4800K–6000K`) in research, port, and industrial facilities.
- **Scale Cues**: Multi-story floor-plate stratification (`3.5m–4.0m` floor-to-floor), horizontal window bands, cantilevered terraces, visible structural mullions, pedestrian railings (`1.1m`), transit pods, docking adapters, and scaled `1.75m` human figures.

---

## 2. Masterplan Spatial Layout & District Zoning

The city is organized around a **Sweeping Terraced Metropolitan Arc (`CITY_CORE`)** coupled with an **Inner Civic Nucleus**, **Radial Pressurized Transit Corridors**, a **Dorsal Energy/Thermal Utility Spine**, a **Port Logistics Wing (West / Left)**, and an **Industrial & Modular Construction Frontier (East / Right)**.

| Collection | District / Sector | Spatial Coordinates (Scene Units) | Architectural Typology & Key Features |
| :--- | :--- | :--- | :--- |
| `CITY_CORE` | Primary Structural Cradle, Transit Ring & Foreground Promenade | `X: [-260, +260]`, `Y: [-80, +260]`, `Z: [-15, +20]` | Multi-tier curved urban deck, pressurized mag-lev transit viaducts, structural hull ribbing, and the Foreground Observation Promenade (`Y: -72 to -48`) directly in front of the primary camera. |
| `DISTRICT_CIVIC` | **A. Central Civic District** (Sector L-05 / Central Plaza) | `X: [-55, +55]`, `Y: [0, +110]`, `Z: [0, +95]` | The **Revatya Civic Spire & Grand Observation Rotunda**, stepped public plazas, cantilevered terraces, glass-roofed civic atriums, and multi-level pedestrian skybridges. |
| `DISTRICT_RESIDENTIAL` | **B. Residential District** (Sector H-01 Habitation Arc) | `X: [-210, -35]`, `Y: [-30, +160]`, `Z: [0, +78]` | High-density terraced apartment towers of varied heights (`18m–75m`), L-shaped and courtyard residential blocks, recessed balconies, warm circadian window grids, and neighbourhood skywalks. |
| `DISTRICT_RECREATION` | **G. Recreation & Shared Environments** | `X: [-75, +85]`, `Y: [-35, +65]`, `Z: [+6, +42]` | Translucent ribbed geodesic/arch **Biophilic Botanical Domes** with enclosed greenery, tree canopies, restorative commons, and panoramic Earth-facing observation amphitheatres. |
| `DISTRICT_RESEARCH` | **C. Research & Science District** (Sector R-02) | `X: [+45, +175]`, `Y: [-15, +145]`, `Z: [0, +72]` | Precision cylindrical and hexagonal laboratory towers, stacked microgravity cleanroom wings, optical observatory domes, cryo-storage spheres, and telemetry arrays. |
| `DISTRICT_INDUSTRIAL` | **D. Industrial & Manufacturing District** (Sector M-03) | `X: [+145, +285]`, `Y: [+40, +210]`, `Z: [-10, +58]` | Monumental long-span production halls, crystal-growth furnace cylinders, external truss gantries, automated feedstock silos, and dedicated cargo rail links isolated from pedestrian plazas. |
| `DISTRICT_PORT` | **E. Orbital Port & Transport District** (Sector P-01) | `X: [-350, -165]`, `Y: [-20, +190]`, `Z: [-25, +45]` | Multi-berth axial & radial docking piers, standardized international berthing rings, cargo container yards, robotic transfer cranes, approach corridor alignment beacons, and propellant depot spheres. |
| `DISTRICT_UTILITIES` | **F. Energy & Utilities District** (Sector E-04) | `X: [-320, +320]`, `Y: [+165, +310]`, `Z: [-40, +135]` | Monumental sun-tracking photovoltaic solar array wings and white ceramic radiative heat-rejection panel wings mounted along the dorsal utility spine. |
| `CONSTRUCTION_ZONE` | **H. Expansion & Construction Zone** (Sector C-06) | `X: [+240, +370]`, `Y: [+60, +230]`, `Z: [-5, +75]` | Partially assembled spaceframe modules, exposed structural cores, articulated track-mounted robotic manipulator cranes, and cargo barges delivering new trusses. |
| `HUMAN_FIGURES` | Inhabited Public & Work Spaces | Foreground Promenade (`Y: -68 to -50`), Civic Plaza, Skybridges | Scaled `1.75m` articulated low-poly human silhouettes & foreground figures in varied poses (observing Earth, walking in pairs, conversing, tending research consoles). |
| `SPACECRAFT` | Orbital Traffic & Docked Fleet | Port Approach (`X: -420 to -180`), Foreground Flyby, Distant Lanes | 4 distinct spacecraft classes: Crew/Passenger Shuttle (arriving), Heavy Cargo Freighters (berthed & departing), Orbital Transfer Tug, and Maintenance Inspection Drones. |
| `PLANET_EARTH` | Curved Earth & Atmospheric Limb | Center `(140, 860, -390)`, `R = 680` | Multi-layer planetary sphere: high-res continental/ocean surface, volumetric-style cloud deck, and Fresnel Rayleigh cyan atmospheric halo. |

---

## 3. Camera Architecture
1. **`CAM_MAIN_HERO`**: Desktop 16:9 wide cinematic view (`26mm`), positioned on the upper level of the Foreground Observation Promenade looking across the sweeping city skyline toward Earth on the right/background horizon. Left-center sky/plaza transition preserves clean contrast for website hero typography.
2. **`CAM_MOBILE_HERO`**: Vertical 9:16 crop/framing optimized for mobile viewports.
3. **`CAM_DIAG_01_ESTABLISHING`**: Wide panoramic establishing shot encompassing the full orbital city silhouette from Port to Construction Zone against Earth.
4. **`CAM_DIAG_02_PORT`**: Focused architectural shot of the Orbital Port (`DISTRICT_PORT`), docking piers, cargo yards, and arriving/berthed spacecraft.
5. **`CAM_DIAG_03_RESIDENTIAL_CIVIC`**: Mid-altitude architectural view through the dense Residential towers (`DISTRICT_RESIDENTIAL`), Biophilic Domes (`DISTRICT_RECREATION`), and Central Civic Spire (`DISTRICT_CIVIC`).
6. **`CAM_DIAG_04_MASTERPLAN`**: Elevated oblique masterplan view (`45°`俯視) clearly revealing all 8 districts, radial transit bridges, utility spine, and urban connectivity.
7. **`CAM_DIAG_05_HUMAN_SCALE`**: Eye-level (`1.70m` above promenade deck) architectural view behind foreground human figures standing at the glass railing looking out at the monumental city skyline and Earth.
