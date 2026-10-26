import bpy
import bmesh
import math
import random
import os
from mathutils import Vector, Euler

def clear_scene():
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for col in list(bpy.data.collections):
        bpy.data.collections.remove(col)
    for mesh in list(bpy.data.meshes):
        if mesh.users == 0:
            bpy.data.meshes.remove(mesh)
    for mat in list(bpy.data.materials):
        if mat.users == 0:
            bpy.data.materials.remove(mat)

def ensure_collections():
    col_names = [
        "CITY_CORE",
        "DISTRICT_CIVIC",
        "DISTRICT_RESIDENTIAL",
        "DISTRICT_RESEARCH",
        "DISTRICT_INDUSTRIAL",
        "DISTRICT_PORT",
        "DISTRICT_UTILITIES",
        "DISTRICT_RECREATION",
        "CONSTRUCTION_ZONE",
        "HUMAN_FIGURES",
        "SPACECRAFT",
        "PLANET_EARTH",
        "LIGHTING",
        "CAMERAS",
        "WEB_EXPORT",
    ]
    cols = {}
    scene_col = bpy.context.scene.collection
    for name in col_names:
        c = bpy.data.collections.new(name)
        scene_col.children.link(c)
        cols[name] = c
    return cols

def make_greybox_mat(name, color, roughness=0.50, metallic=0.15, emission_color=None, emission_strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if emission_color and "Emission Color" in bsdf.inputs:
        bsdf.inputs["Emission Color"].default_value = (*emission_color, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    mat.diffuse_color = (*color, 1.0)
    return mat

def link_obj(obj, col):
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    col.objects.link(obj)

def add_box(name, loc, scale, col, mat, rot=(0, 0, 0), bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc, rotation=rot)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0:
        mod = obj.modifiers.new("Bevel", 'BEVEL')
        mod.width = bevel
        mod.segments = 2
    if mat:
        obj.data.materials.append(mat)
    link_obj(obj, col)
    return obj

def add_cyl(name, loc, radius, depth, col, mat, vertices=24, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc, rotation=rot)
    obj = bpy.context.active_object
    obj.name = name
    if mat:
        obj.data.materials.append(mat)
    link_obj(obj, col)
    return obj

def add_sphere(name, loc, radius, col, mat, segments=64, ring_count=32, smooth=True):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=ring_count, radius=radius, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    if smooth:
        for poly in obj.data.polygons:
            poly.use_smooth = True
    if mat:
        obj.data.materials.append(mat)
    link_obj(obj, col)
    return obj

def arc_pos(angle_deg, radius, z=0.0):
    # Arc center at (0, 280) so the city curves gently like a vast orbital amphitheatre
    cx, cy = 0.0, 280.0
    rad = math.radians(angle_deg)
    x = cx + radius * math.sin(rad)
    y = cy - radius * math.cos(rad)
    rot_z = rad
    return (x, y, z), rot_z

def build_greybox():
    clear_scene()
    cols = ensure_collections()
    rng = random.Random(42)

    mats = {
        "core": make_greybox_mat("GB_Core_Structure", (0.68, 0.72, 0.77), roughness=0.45, metallic=0.25),
        "civic": make_greybox_mat("GB_Civic", (0.92, 0.94, 0.97), roughness=0.35, metallic=0.15),
        "res": make_greybox_mat("GB_Residential", (0.83, 0.85, 0.88), roughness=0.48, metallic=0.12),
        "rec": make_greybox_mat("GB_Recreation_Dome", (0.52, 0.78, 0.70), roughness=0.22, metallic=0.05),
        "research": make_greybox_mat("GB_Research", (0.74, 0.82, 0.91), roughness=0.35, metallic=0.22),
        "ind": make_greybox_mat("GB_Industrial", (0.54, 0.58, 0.63), roughness=0.55, metallic=0.40),
        "port": make_greybox_mat("GB_Port", (0.62, 0.67, 0.74), roughness=0.42, metallic=0.35),
        "util": make_greybox_mat("GB_Utilities", (0.18, 0.28, 0.48), roughness=0.28, metallic=0.55),
        "radiator": make_greybox_mat("GB_Radiator", (0.93, 0.94, 0.96), roughness=0.38, metallic=0.10),
        "const": make_greybox_mat("GB_Construction", (0.82, 0.68, 0.36), roughness=0.48, metallic=0.30),
        "earth": make_greybox_mat("GB_Earth", (0.10, 0.32, 0.68), roughness=0.65, metallic=0.0, emission_color=(0.10, 0.30, 0.65), emission_strength=0.55),
        "earth_atmo": make_greybox_mat("GB_Earth_Atmo", (0.35, 0.70, 1.00), roughness=0.2, metallic=0.0, emission_color=(0.28, 0.65, 1.0), emission_strength=0.65),
    }

    # 1. CITY_CORE: Elevated Foreground Observation Promenade (Z=24m) overlooking the terraced city amphitheatre
    add_box("Core_FG_Promenade_Deck", (0, -68, 22.0), (84, 24, 3.0), cols["CITY_CORE"], mats["core"], bevel=0.3)
    add_box("Core_FG_West_Pavilion", (-32, -70, 26.5), (18, 16, 6.0), cols["CITY_CORE"], mats["civic"], bevel=0.25)
    add_box("Core_FG_East_Pavilion", (34, -70, 26.0), (16, 14, 5.0), cols["CITY_CORE"], mats["civic"], bevel=0.25)
    add_box("Core_FG_Observation_Parapet", (0, -56.2, 24.1), (76, 0.6, 1.1), cols["CITY_CORE"], mats["civic"])

    # Sloped Pressurized Skybridges descending gracefully from Foreground Promenade (Z=21m) to Front Urban Terrace (Z=3m)
    for idx, bx in enumerate([-26.0, 0.0, 26.0]):
        add_box(f"Core_Skybridge_{idx}", (bx, -32.0, 12.0), (7.5 if idx == 1 else 5.0, 52.0, 3.2), cols["CITY_CORE"], mats["core"], rot=(math.radians(-19.5), 0, 0), bevel=0.2)
        # Support Pylons under skybridges
        add_cyl(f"Core_BridgePylon_{idx}", (bx, -18.0, -4.0), 2.2, 24.0, cols["CITY_CORE"], mats["core"], vertices=16)

    # Terraced Metropolitan Super-Decks (Stepping UP from front to back like an orbital amphitheatre!)
    # Front Terrace (r=255, z=0), Mid-Front Plaza Ring (r=220, z=4), Mid-Back High-Rise Deck (r=182, z=9), Dorsal Spine Deck (r=145, z=14)
    deck_tiers = [
        (255.0, 34.0, 5.0, -2.5, 96.0),
        (220.0, 38.0, 6.5, 1.0, 102.0),
        (182.0, 42.0, 8.0, 5.0, 108.0),
        (145.0, 34.0, 9.0, 9.5, 112.0),
    ]
    for tier_idx, (r_mid, width, thick, z_base, span_deg) in enumerate(deck_tiers):
        steps = 26
        for s in range(steps):
            a0 = -span_deg * 0.5 + (span_deg * s / steps)
            pos, rz = arc_pos(a0 + (span_deg / steps) * 0.5, r_mid, z_base)
            seg_len = (2 * math.pi * r_mid * (span_deg / 360.0)) / steps * 1.06
            add_box(f"Core_ArcDeck_T{tier_idx}_S{s:02d}", pos, (seg_len, width, thick), cols["CITY_CORE"], mats["core"], rot=(0, 0, rz), bevel=0.35)

    # Deep Structural Hull Belly Trusses beneath the city so it reads as monumental orbital engineering
    for s in range(15):
        a_deg = -49.0 + s * 7.0
        pos, rz = arc_pos(a_deg, 200.0, -12.0)
        add_box(f"Core_Underhull_Keel_{s:02d}", pos, (14.0, 145.0, 10.0), cols["CITY_CORE"], mats["ind"], rot=(0, 0, rz), bevel=0.3)

    # Elevated Mag-Lev Transit Viaducts weaving across the city tiers
    for r_via, z_via in [(238.0, 6.5), (200.0, 12.5), (162.0, 18.5)]:
        for s in range(30):
            a_deg = -51.0 + (102.0 * s / 30)
            pos, rz = arc_pos(a_deg + 1.7, r_via, z_via)
            seg_len = (2 * math.pi * r_via * (102.0 / 360.0)) / 30 * 1.05
            add_box(f"Core_TransitViaduct_{int(r_via)}_{s:02d}", pos, (seg_len, 3.8, 2.0), cols["CITY_CORE"], mats["civic"], rot=(0, 0, rz))

    # Radial Transit Boulevards connecting Front Terrace to Dorsal Spine
    for rad_idx, a_deg in enumerate([-36, -18, 0, 18, 36]):
        pos, rz = arc_pos(a_deg, 200.0, 6.0)
        add_box(f"Core_RadialBoulevard_{rad_idx}", pos, (9.0, 148.0, 3.5), cols["CITY_CORE"], mats["core"], rot=(0, 0, rz))

    # 2. DISTRICT_CIVIC (Center: angle -10 to +10 deg — Stepped Amphitheatre Plazas leading up to the Grand Civic Rotunda & Spire)
    # Front Civic Plaza low-rise pavilions (r=252) so they NEVER block the central vista
    for side in [-1, 1]:
        p_low, rz_low = arc_pos(side * 5.5, 252.0, 5.0)
        add_box(f"Civic_FrontPavilion_{side}", p_low, (18.0, 12.0, 10.0), cols["DISTRICT_CIVIC"], mats["civic"], rot=(0, 0, rz_low), bevel=0.25)

    # Grand Civic Rotunda & Landmark Spire at r=182 (Mid-Back Deck)
    civic_pos, _ = arc_pos(0.0, 182.0, 9.0)
    add_cyl("Civic_Grand_Rotunda_Base", (civic_pos[0], civic_pos[1], 18.0), 30.0, 18.0, cols["DISTRICT_CIVIC"], mats["civic"], vertices=40)
    add_cyl("Civic_Rotunda_TerraceTier", (civic_pos[0], civic_pos[1], 34.0), 22.0, 16.0, cols["DISTRICT_CIVIC"], mats["civic"], vertices=40)
    add_cyl("Civic_Central_Spire_Tower", (civic_pos[0], civic_pos[1], 66.0), 12.0, 52.0, cols["DISTRICT_CIVIC"], mats["civic"], vertices=28)
    add_cyl("Civic_Observation_Crown", (civic_pos[0], civic_pos[1], 95.0), 16.0, 8.0, cols["DISTRICT_CIVIC"], mats["civic"], vertices=36)
    add_cyl("Civic_Spire_Apex", (civic_pos[0], civic_pos[1], 112.0), 2.4, 28.0, cols["DISTRICT_CIVIC"], mats["civic"], vertices=16)

    # Flanking Stepped Civic Council Towers (stepping upward toward the center)
    civic_towers = [
        (-6.5, 218.0, 16, 14, 26), (6.5, 218.0, 16, 14, 26),
        (-9.5, 198.0, 15, 15, 42), (9.5, 198.0, 15, 15, 40),
        (-6.0, 162.0, 16, 16, 64), (6.0, 162.0, 16, 16, 62),
        (-11.0, 152.0, 15, 15, 54), (11.0, 152.0, 15, 15, 52),
    ]
    for idx, (ang, rad, w, d, h) in enumerate(civic_towers):
        p, rz = arc_pos(ang, rad, h * 0.5 + 4.0)
        add_box(f"Civic_Tower_{idx:02d}", p, (w, d, h), cols["DISTRICT_CIVIC"], mats["civic"], rot=(0, 0, rz), bevel=0.3)

    # 3. DISTRICT_RESIDENTIAL (West/Left Wing: angle -44 to -11 deg — Stepped Low-Rise Front to High-Rise Back)
    res_idx = 0
    tier_heights = {
        255.0: (8.0, 16.0, 0.0),    # Low-rise waterfront/terrace housing
        220.0: (16.0, 32.0, 4.0),   # Mid-rise courtyard apartments
        182.0: (28.0, 56.0, 8.0),   # High-rise residential towers
        145.0: (42.0, 78.0, 13.0),  # Tall skyline residential landmarks
    }
    for ang_step in range(15):
        ang = -43.0 + ang_step * 2.2
        for r_tier, (h_min, h_max, z_off) in tier_heights.items():
            h = rng.uniform(h_min, h_max)
            w = rng.uniform(9.0, 15.5)
            d = rng.uniform(9.0, 14.5)
            p, rz = arc_pos(ang + rng.uniform(-0.4, 0.4), r_tier + rng.uniform(-2.0, 2.0), z_off + h * 0.5)
            add_box(f"Res_Tower_{res_idx:03d}", p, (w, d, h), cols["DISTRICT_RESIDENTIAL"], mats["res"], rot=(0, 0, rz), bevel=0.25)
            if rng.random() > 0.35:
                ph = h * rng.uniform(0.35, 0.6)
                pp, _ = arc_pos(ang + 0.7, r_tier + 4.5, z_off + ph * 0.5)
                add_box(f"Res_Annex_{res_idx:03d}", pp, (w * 0.85, d * 0.85, ph), cols["DISTRICT_RESIDENTIAL"], mats["res"], rot=(0, 0, rz), bevel=0.2)
            res_idx += 1

    # 4. DISTRICT_RECREATION (Biophilic Botanical Domes clearly visible on the Front & Mid Plazas!)
    dome_specs = [
        (-14.0, 250.0, 15.0, 1.0),
        (0.0, 248.0, 17.5, 1.0),
        (14.0, 250.0, 15.0, 1.0),
        (-12.5, 212.0, 16.5, 5.0),
        (12.5, 212.0, 16.5, 5.0),
    ]
    for idx, (ang, rad, drad, z_off) in enumerate(dome_specs):
        p, rz = arc_pos(ang, rad, z_off)
        add_cyl(f"Rec_Biodome_Base_{idx}", p, drad * 1.06, 3.5, cols["DISTRICT_RECREATION"], mats["civic"], vertices=36)
        dome = add_sphere(f"Rec_Biodome_Glass_{idx}", (p[0], p[1], p[2] + 1.2), drad, cols["DISTRICT_RECREATION"], mats["rec"], segments=36, ring_count=18)
        dome.scale = (1.0, 1.0, 0.58)

    # 5. DISTRICT_RESEARCH (East/Right-Center Wing: angle +11 to +32 deg — Stepped Cylindrical & Hexagonal Science Campus)
    sci_idx = 0
    for ang_step in range(10):
        ang = 12.0 + ang_step * 2.1
        for r_tier, (h_min, h_max, z_off) in tier_heights.items():
            h = rng.uniform(h_min * 0.9, h_max * 0.92)
            radius = rng.uniform(5.2, 8.8)
            p, rz = arc_pos(ang, r_tier, z_off + h * 0.5)
            verts = 6 if sci_idx % 2 == 0 else 28
            add_cyl(f"Sci_LabTower_{sci_idx:02d}", p, radius, h, cols["DISTRICT_RESEARCH"], mats["research"], vertices=verts, rot=(0, 0, rz))
            if sci_idx % 3 == 0:
                add_box(f"Sci_CleanroomBridge_{sci_idx:02d}", (p[0], p[1], z_off + h * 0.65), (radius * 3.0, radius * 1.3, 5.0), cols["DISTRICT_RESEARCH"], mats["research"], rot=(0, 0, rz), bevel=0.25)
            sci_idx += 1

    # 6. DISTRICT_INDUSTRIAL (East Wing: angle +33 to +48 deg — Large Manufacturing Halls, Gantry Frames, Silos)
    ind_idx = 0
    for ang in [34.0, 38.5, 43.0, 47.5]:
        for r_tier, z_off in [(248.0, 1.0), (212.0, 5.0), (172.0, 10.0), (142.0, 14.0)]:
            w = rng.uniform(20.0, 28.0)
            d = rng.uniform(16.0, 24.0)
            h = rng.uniform(16.0, 36.0) + (260.0 - r_tier) * 0.15
            p, rz = arc_pos(ang, r_tier, z_off + h * 0.5)
            add_box(f"Ind_ProductionHall_{ind_idx:02d}", p, (w, d, h), cols["DISTRICT_INDUSTRIAL"], mats["ind"], rot=(0, 0, rz), bevel=0.35)
            add_box(f"Ind_GantryFrame_{ind_idx:02d}", (p[0], p[1], z_off + h + 2.5), (w * 1.12, 2.8, 3.2), cols["DISTRICT_INDUSTRIAL"], mats["core"], rot=(0, 0, rz))
            add_cyl(f"Ind_Silo_{ind_idx:02d}", (p[0] + 7.5, p[1], z_off + h * 0.55), 4.2, h * 1.08, cols["DISTRICT_INDUSTRIAL"], mats["ind"], vertices=20)
            ind_idx += 1

    # 7. DISTRICT_PORT (West / Left Wing: angle -45 to -62 deg, positioned so docking piers are clearly visible in CAM_MAIN_HERO!)
    port_hub_pos, port_rz = arc_pos(-48.0, 235.0, 6.0)
    add_cyl("Port_Central_Control_Hub", (port_hub_pos[0], port_hub_pos[1], 18.0), 16.0, 28.0, cols["DISTRICT_PORT"], mats["port"], vertices=28)
    add_cyl("Port_Control_Tower_Crown", (port_hub_pos[0], port_hub_pos[1], 36.0), 10.0, 12.0, cols["DISTRICT_PORT"], mats["civic"], vertices=28)

    # Axial Logistics Spine extending forward-left into the orbital approach lane
    spine_center = (port_hub_pos[0] - 52.0, port_hub_pos[1] - 18.0, 6.0)
    add_box("Port_Axial_Logistics_Spine", spine_center, (115.0, 12.0, 8.5), cols["DISTRICT_PORT"], mats["port"], rot=(0, 0, 0.25), bevel=0.3)

    # 6 Docking Berths / Piers branching off the spine
    for pier_i in range(6):
        px = port_hub_pos[0] - 16.0 - pier_i * 16.5
        py = port_hub_pos[1] - 6.0 - pier_i * 4.2
        add_box(f"Port_DockingPier_{pier_i:02d}", (px, py - 22.0, 6.0), (5.8, 36.0, 5.5), cols["DISTRICT_PORT"], mats["port"], rot=(0, 0, 0.25))
        add_cyl(f"Port_BerthingRing_{pier_i:02d}", (px + 4.5, py - 39.0, 6.0), 4.6, 3.8, cols["DISTRICT_PORT"], mats["civic"], vertices=24, rot=(math.radians(90), 0, 0.25))

    # Propellant Depot Spheres at standoff
    for sp_i in range(4):
        add_sphere(f"Port_PropellantDepot_{sp_i}", (port_hub_pos[0] - 88.0 - sp_i * 13.0, port_hub_pos[1] + 24.0, 2.0), 6.0, cols["DISTRICT_PORT"], mats["civic"], segments=24, ring_count=16)

    # 8. DISTRICT_UTILITIES (Dorsal Energy & Thermal Spine behind the city: Wide Solar Wings & White Ceramic Radiators)
    for wing_idx, ang in enumerate([-42.0, -26.0, -12.0, 12.0, 26.0, 42.0]):
        upos, urz = arc_pos(ang, 118.0, 22.0)
        add_box(f"Util_SpinePylon_{wing_idx}", upos, (9.0, 26.0, 42.0), cols["DISTRICT_UTILITIES"], mats["core"], rot=(0, 0, urz))
        # Twin High-Aspect Solar Array Wings angled gracefully outward
        add_box(f"Util_SolarWing_Upper_{wing_idx}A", (upos[0] - 8.5, upos[1] + 12.0, 76.0), (13.0, 1.5, 86.0), cols["DISTRICT_UTILITIES"], mats["util"], rot=(0.22, 0, urz))
        add_box(f"Util_SolarWing_Upper_{wing_idx}B", (upos[0] + 8.5, upos[1] + 12.0, 76.0), (13.0, 1.5, 86.0), cols["DISTRICT_UTILITIES"], mats["util"], rot=(0.22, 0, urz))
        # White Ceramic Thermal Rejection Radiator Panels extending horizontally/downward
        add_box(f"Util_RadiatorWing_{wing_idx}", (upos[0], upos[1] + 20.0, -22.0), (20.0, 1.0, 48.0), cols["DISTRICT_UTILITIES"], mats["radiator"], rot=(-0.18, 0, urz))

    # 9. CONSTRUCTION_ZONE (Far East Frontier: angle +50 to +60 deg — Modular Expansion Spaceframes & Robotic Cranes)
    for c_i, ang in enumerate([50.0, 54.5, 59.0]):
        cpos, crz = arc_pos(ang, 215.0, 16.0)
        add_box(f"Const_Spaceframe_Core_{c_i}", cpos, (18.0, 18.0, 32.0), cols["CONSTRUCTION_ZONE"], mats["const"], rot=(0, 0, crz))
        add_box(f"Const_RoboticCrane_Mast_{c_i}", (cpos[0], cpos[1], 44.0), (2.8, 2.8, 46.0), cols["CONSTRUCTION_ZONE"], mats["const"], rot=(0, 0, crz))
        add_box(f"Const_RoboticCrane_Boom_{c_i}", (cpos[0] + 12.0, cpos[1], 65.0), (38.0, 2.5, 2.8), cols["CONSTRUCTION_ZONE"], mats["const"], rot=(0, 0, crz + 0.35))

    # 10. PLANET_EARTH (Colossal Curved Planetary Horizon sweeping across the background/lower-right)
    # Radius = 2800m so the horizon curves majestically across the entire frame like true Low Earth Orbit!
    earth_center = (420.0, 2150.0, -2280.0)
    earth_radius = 2800.0
    earth_obj = add_sphere("Earth_Surface_Sphere", earth_center, earth_radius, cols["PLANET_EARTH"], mats["earth"], segments=128, ring_count=64)
    earth_obj.visible_shadow = False
    atmo = add_sphere("Earth_Atmosphere_Limb", earth_center, earth_radius * 1.012, cols["PLANET_EARTH"], mats["earth_atmo"], segments=128, ring_count=64)
    atmo.visible_shadow = False
    atmo.display_type = 'WIRE'

    # 11. LIGHTING & WORLD
    world = bpy.context.scene.world
    if not world:
        world = bpy.data.worlds.new("Revatya_Orbital_World")
        bpy.context.scene.world = world
    world.use_nodes = True
    bg_node = next(n for n in world.node_tree.nodes if n.type == "BACKGROUND")
    bg_node.inputs["Color"].default_value = (0.005, 0.009, 0.018, 1.0)
    bg_node.inputs["Strength"].default_value = 1.0

    bpy.ops.object.light_add(type='SUN', location=(250, -200, 350), rotation=(math.radians(54), math.radians(16), math.radians(-36)))
    sun = bpy.context.active_object
    sun.name = "SUN_PRIMARY_ORBITAL"
    sun.data.energy = 4.2
    sun.data.color = (1.0, 0.97, 0.93)
    sun.data.angle = math.radians(0.53)
    link_obj(sun, cols["LIGHTING"])

    bpy.ops.object.light_add(type='SUN', location=(180, 400, -200), rotation=(math.radians(120), math.radians(-12), math.radians(150)))
    earthshine = bpy.context.active_object
    earthshine.name = "SUN_EARTHSHINE_BOUNCE"
    earthshine.data.energy = 1.25
    earthshine.data.color = (0.38, 0.65, 1.0)
    earthshine.data.angle = math.radians(30.0)
    link_obj(earthshine, cols["LIGHTING"])

    # 12. CAMERAS
    def add_cam(name, loc, target_pt, lens=24.0, clip_end=6000.0):
        bpy.ops.object.camera_add(location=loc)
        cam = bpy.context.active_object
        cam.name = name
        cam.data.lens = lens
        cam.data.clip_start = 0.5
        cam.data.clip_end = clip_end
        direction = Vector(target_pt) - Vector(loc)
        rot_quat = direction.to_track_quat('-Z', 'Y')
        cam.rotation_euler = rot_quat.to_euler()
        link_obj(cam, cols["CAMERAS"])
        return cam

    # Primary Hero Camera: Positioned on the Foreground Promenade looking slightly down and across the entire amphitheatre city + Port + Earth horizon
    cam_main = add_cam("CAM_MAIN_HERO", (-18.0, -76.0, 32.0), (5.0, 120.0, 18.0), lens=22.0)
    add_cam("CAM_MOBILE_HERO", (-10.0, -78.0, 34.0), (4.0, 120.0, 22.0), lens=20.0)
    add_cam("CAM_DIAG_01_ESTABLISHING", (0.0, -165.0, 82.0), (0.0, 110.0, 16.0), lens=20.0)
    add_cam("CAM_DIAG_02_PORT", (-275.0, -25.0, 46.0), (-165.0, 95.0, 12.0), lens=26.0)
    add_cam("CAM_DIAG_03_RESIDENTIAL_CIVIC", (-110.0, -35.0, 44.0), (-10.0, 85.0, 24.0), lens=26.0)
    add_cam("CAM_DIAG_04_MASTERPLAN", (0.0, -210.0, 230.0), (0.0, 95.0, 0.0), lens=21.0)
    add_cam("CAM_DIAG_05_HUMAN_SCALE", (-8.0, -64.0, 24.5), (8.0, 110.0, 22.0), lens=26.0)

    bpy.context.scene.camera = cam_main
    bpy.ops.wm.save_as_mainfile(filepath="/home/pandeyaryan28/Documents/revatya/revatya_orbital_city.blend")
    print("Iteration 1B Revised Greybox complete. Objects count:", len(bpy.data.objects))

build_greybox()
