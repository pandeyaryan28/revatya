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

def make_mat(name, color, roughness=0.45, metallic=0.15, emission_color=None, emission_strength=0.0, alpha=1.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if alpha < 1.0 and "Alpha" in bsdf.inputs:
        bsdf.inputs["Alpha"].default_value = alpha
        if hasattr(mat, "blend_method"):
            mat.blend_method = 'BLEND'
    if emission_color and "Emission Color" in bsdf.inputs:
        bsdf.inputs["Emission Color"].default_value = (*emission_color, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    mat.diffuse_color = (*color, alpha)
    return mat

def make_unshadowed_planet_mat(name, base_col, limb_col):
    """Planet shader using emission so city geometry never casts a tabletop shadow onto Earth."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
    bsdf.inputs["Base Color"].default_value = (0.0, 0.0, 0.0, 1.0)
    bsdf.inputs["Roughness"].default_value = 1.0
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = 0.0

    # Layer Weight -> Mix between deep ocean blue and cyan atmospheric limb
    lw = nt.nodes.new("ShaderNodeLayerWeight")
    lw.inputs["Blend"].default_value = 0.35
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = 'RGBA'
    mix.inputs["A"].default_value = (*base_col, 1.0)
    mix.inputs["B"].default_value = (*limb_col, 1.0)
    nt.links.new(lw.outputs["Facing"], mix.inputs["Factor"])

    if "Emission Color" in bsdf.inputs:
        nt.links.new(mix.outputs["Result"], bsdf.inputs["Emission Color"])
        bsdf.inputs["Emission Strength"].default_value = 1.15
    mat.diffuse_color = (*base_col, 1.0)
    return mat

def arc_pos(angle_deg, radius, z=0.0):
    cx, cy = 0.0, 280.0
    rad = math.radians(angle_deg)
    x = cx + radius * math.sin(rad)
    y = cy - radius * math.cos(rad)
    return (x, y, z), rad

def create_mesh_obj(name, bm, col, mat, loc=(0, 0, 0), rot=(0, 0, 0), smooth=False):
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    if smooth:
        for p in mesh.polygons:
            p.use_smooth = True
    obj = bpy.data.objects.new(name, mesh)
    obj.location = loc
    obj.rotation_euler = rot
    if mat:
        obj.data.materials.append(mat)
    col.objects.link(obj)
    return obj

def bmesh_add_box(bm, center, size):
    sx, sy, sz = size
    mat_t = (
        Vector((sx, 0, 0)),
        Vector((0, sy, 0)),
        Vector((0, 0, sz)),
    )
    ret = bmesh.ops.create_cube(bm, size=1.0)
    for v in ret["verts"]:
        v.co.x = v.co.x * sx + center[0]
        v.co.y = v.co.y * sy + center[1]
        v.co.z = v.co.z * sz + center[2]
    return ret["verts"]

def bmesh_add_cyl(bm, center, radius_bottom, radius_top, depth, segments=20, rot_x=0.0, rot_y=0.0, rot_z=0.0):
    ret = bmesh.ops.create_cone(
        bm,
        cap_ends=True,
        cap_tris=False,
        segments=segments,
        radius1=radius_bottom,
        radius2=radius_top,
        depth=depth,
    )
    eul = Euler((rot_x, rot_y, rot_z), 'XYZ')
    for v in ret["verts"]:
        co = v.co.copy()
        co.rotate(eul)
        v.co = co + Vector(center)
    return ret["verts"]

def build_architecture():
    clear_scene()
    cols = ensure_collections()
    rng = random.Random(108)

    mats = {
        "core_light": make_mat("Arch_Core_White", (0.86, 0.88, 0.91), roughness=0.38, metallic=0.18),
        "core_dark": make_mat("Arch_Core_Graphite", (0.20, 0.24, 0.29), roughness=0.45, metallic=0.55),
        "civic_white": make_mat("Arch_Civic_Alabaster", (0.94, 0.95, 0.98), roughness=0.30, metallic=0.15),
        "civic_glass": make_mat("Arch_Civic_Glass", (0.42, 0.66, 0.86), roughness=0.12, metallic=0.10, emission_color=(0.85, 0.72, 0.48), emission_strength=0.35),
        "res_warm": make_mat("Arch_Res_Satin", (0.88, 0.87, 0.85), roughness=0.42, metallic=0.12),
        "res_slate": make_mat("Arch_Res_Slate", (0.62, 0.66, 0.72), roughness=0.45, metallic=0.25),
        "rec_dome": make_mat("Arch_Biodome_Glass", (0.48, 0.78, 0.72), roughness=0.15, metallic=0.05, emission_color=(0.32, 0.65, 0.45), emission_strength=0.25, alpha=0.55),
        "rec_foliage": make_mat("Arch_Biodome_Foliage", (0.18, 0.46, 0.24), roughness=0.75, metallic=0.0),
        "sci_silver": make_mat("Arch_Sci_Titanium", (0.78, 0.84, 0.90), roughness=0.28, metallic=0.42),
        "ind_steel": make_mat("Arch_Ind_HeavySteel", (0.48, 0.52, 0.57), roughness=0.52, metallic=0.55),
        "port_hull": make_mat("Arch_Port_Module", (0.66, 0.71, 0.77), roughness=0.38, metallic=0.35),
        "solar": make_mat("Arch_Solar_Array", (0.10, 0.20, 0.42), roughness=0.22, metallic=0.65),
        "radiator": make_mat("Arch_Thermal_Radiator", (0.95, 0.96, 0.98), roughness=0.32, metallic=0.10),
        "const_yellow": make_mat("Arch_Construction_Frame", (0.86, 0.68, 0.24), roughness=0.42, metallic=0.35),
        "earth_body": make_unshadowed_planet_mat("Arch_Earth_Surface", (0.08, 0.28, 0.64), (0.38, 0.75, 1.0)),
        "earth_atmo": make_unshadowed_planet_mat("Arch_Earth_Atmo", (0.28, 0.68, 1.0), (0.55, 0.85, 1.0)),
    }

    # =========================================================================
    # 1. CITY_CORE: Foreground Observation Promenade, Skybridges, Terraced Decks & Underhull Truss
    # =========================================================================
    bm_fg = bmesh.new()
    # Multi-tier Foreground Observation Promenade Deck
    bmesh_add_box(bm_fg, (0, -68, 21.5), (92, 26, 2.4))
    bmesh_add_box(bm_fg, (0, -65, 22.9), (78, 18, 0.6))
    # Stepped seating / planter plinths on the promenade
    for px in [-24, -12, 0, 12, 24]:
        bmesh_add_box(bm_fg, (px, -61.5, 23.5), (6.5, 3.2, 0.8))
    # Front glass parapet & safety rail posts along observation edge (y = -55.2)
    bmesh_add_box(bm_fg, (0, -55.3, 23.6), (86, 0.35, 1.15))
    for rx in range(-42, 44, 4):
        bmesh_add_box(bm_fg, (rx, -55.3, 23.8), (0.22, 0.45, 1.4))
    # West & East Architectural Observation Pavilions with cantilevered roofs & colonnades
    for side, x_c in [(-1, -34.0), (1, 36.0)]:
        bmesh_add_box(bm_fg, (x_c, -69.0, 25.5), (18.0, 15.0, 5.2))
        bmesh_add_box(bm_fg, (x_c, -67.5, 28.5), (21.0, 18.5, 0.9))  # Cantilevered roof canopy
        for col_x in [x_c - 8.5, x_c - 3.0, x_c + 3.0, x_c + 8.5]:
            bmesh_add_box(bm_fg, (col_x, -59.5, 25.5), (0.55, 0.55, 5.2))
    create_mesh_obj("Core_FG_Observation_Promenade", bm_fg, cols["CITY_CORE"], mats["civic_white"])

    # Pressurized Ribbed Skybridges + Mag-Lev Transit Guideways connecting FG Promenade to City Arc
    bm_bridges = bmesh.new()
    for idx, bx in enumerate([-26.0, 0.0, 26.0]):
        bw = 8.0 if idx == 1 else 5.2
        # Main sloped bridge deck & roof
        for s_i in range(12):
            t = s_i / 11.0
            sy = -54.0 + t * 42.0
            sz = 22.0 - t * 18.0
            bmesh_add_box(bm_bridges, (bx, sy, sz), (bw, 4.0, 0.8))
            bmesh_add_box(bm_bridges, (bx, sy, sz + 3.4), (bw * 0.92, 4.0, 0.5))
            # Structural ribs on both sides of the pressurized walkway
            bmesh_add_box(bm_bridges, (bx - bw * 0.48, sy, sz + 1.7), (0.4, 0.6, 3.2))
            bmesh_add_box(bm_bridges, (bx + bw * 0.48, sy, sz + 1.7), (0.4, 0.6, 3.2))
        # Twin tapered support pylons
        bmesh_add_cyl(bm_bridges, (bx, -32.0, -2.0), 2.8, 1.6, 32.0, segments=16)
    create_mesh_obj("Core_Skybridges_And_Pylons", bm_bridges, cols["CITY_CORE"], mats["core_light"])

    # Sweeping Curved Metropolitan Super-Decks (4 Stepped Amphitheatre Rings)
    deck_tiers = [
        (255.0, 34.0, 5.0, -2.5, 98.0),
        (220.0, 38.0, 6.5, 1.5, 104.0),
        (182.0, 42.0, 8.0, 6.0, 110.0),
        (145.0, 36.0, 9.5, 11.0, 114.0),
    ]
    bm_decks = bmesh.new()
    bm_keel = bmesh.new()
    for tier_idx, (r_mid, width, thick, z_base, span_deg) in enumerate(deck_tiers):
        steps = 28
        for s in range(steps):
            a_deg = -span_deg * 0.5 + (span_deg * (s + 0.5) / steps)
            pos, rz = arc_pos(a_deg, r_mid, z_base)
            seg_len = (2 * math.pi * r_mid * (span_deg / 360.0)) / steps * 1.04
            # Create deck segment in local coords then rotate
            ret = bmesh.ops.create_cube(bm_decks, size=1.0)
            eul = Euler((0, 0, rz), 'XYZ')
            for v in ret["verts"]:
                co = Vector((v.co.x * seg_len, v.co.y * width, v.co.z * thick))
                co.rotate(eul)
                v.co = co + Vector(pos)
            # Add underhull keel truss ribs every 2 segments
            if s % 2 == 0:
                kpos, krz = arc_pos(a_deg, r_mid, z_base - thick * 0.85)
                ret_k = bmesh.ops.create_cube(bm_keel, size=1.0)
                for v in ret_k["verts"]:
                    co = Vector((v.co.x * (seg_len * 0.55), v.co.y * (width * 0.92), v.co.z * 7.5))
                    co.rotate(eul)
                    v.co = co + Vector(kpos)
    create_mesh_obj("Core_Terraced_Metropolitan_Decks", bm_decks, cols["CITY_CORE"], mats["core_light"])
    create_mesh_obj("Core_Underhull_Engineering_Keel", bm_keel, cols["CITY_CORE"], mats["core_dark"])

    # Elevated Mag-Lev Transit Viaduct Rings & Radial Boulevards
    bm_transit = bmesh.new()
    for r_via, z_via in [(238.0, 5.5), (200.0, 12.0), (162.0, 18.5)]:
        steps = 32
        for s in range(steps):
            a_deg = -52.0 + (104.0 * (s + 0.5) / steps)
            pos, rz = arc_pos(a_deg, r_via, z_via)
            seg_len = (2 * math.pi * r_via * (104.0 / 360.0)) / steps * 1.04
            eul = Euler((0, 0, rz), 'XYZ')
            ret = bmesh.ops.create_cube(bm_transit, size=1.0)
            for v in ret["verts"]:
                co = Vector((v.co.x * seg_len, v.co.y * 4.2, v.co.z * 1.6))
                co.rotate(eul)
                v.co = co + Vector(pos)
            if s % 2 == 0:
                ppos = (pos[0], pos[1], z_via - 5.0)
                bmesh_add_cyl(bm_transit, ppos, 1.1, 0.9, 9.0, segments=12)
    create_mesh_obj("Core_Elevated_MagLev_Viaducts", bm_transit, cols["CITY_CORE"], mats["civic_white"])

    # =========================================================================
    # 2. DISTRICT_CIVIC (Grand Rotunda, Fluted Spire, Observation Crown & Stepped Council Halls)
    # =========================================================================
    civic_pos, _ = arc_pos(0.0, 182.0, 10.0)
    bm_civic = bmesh.new()
    cx, cy, cz = civic_pos
    # Multi-tier Rotunda Podium with 24 perimeter structural fins
    bmesh_add_cyl(bm_civic, (cx, cy, cz + 8.0), 32.0, 29.0, 16.0, segments=48)
    bmesh_add_cyl(bm_civic, (cx, cy, cz + 22.0), 25.0, 22.0, 14.0, segments=48)
    bmesh_add_cyl(bm_civic, (cx, cy, cz + 34.0), 19.0, 17.0, 12.0, segments=40)
    for fin_i in range(24):
        fa = math.radians(fin_i * 15.0)
        fx = cx + 29.5 * math.sin(fa)
        fy = cy - 29.5 * math.cos(fa)
        ret = bmesh.ops.create_cube(bm_civic, size=1.0)
        eul = Euler((0, 0, fa), 'XYZ')
        for v in ret["verts"]:
            co = Vector((v.co.x * 1.4, v.co.y * 4.5, v.co.z * 28.0))
            co.rotate(eul)
            v.co = co + Vector((fx, fy, cz + 14.0))
    # Central Fluted Spire Shaft with horizontal sky-lobby rings every 8m
    bmesh_add_cyl(bm_civic, (cx, cy, cz + 64.0), 13.5, 10.2, 54.0, segments=32)
    for ring_z in range(44, 88, 7):
        bmesh_add_cyl(bm_civic, (cx, cy, cz + ring_z), 14.2, 14.2, 1.4, segments=32)
    # Double-Deck Panoramic Observation Crown & Communications Mast
    bmesh_add_cyl(bm_civic, (cx, cy, cz + 92.0), 18.5, 16.0, 4.5, segments=40)
    bmesh_add_cyl(bm_civic, (bm_civic and cx or 0, cy, cz + 98.0), 15.0, 17.5, 4.0, segments=40)
    bmesh_add_cyl(bm_civic, (cx, cy, cz + 106.0), 7.5, 3.5, 12.0, segments=24)
    bmesh_add_cyl(bm_civic, (cx, cy, cz + 120.0), 1.8, 0.4, 20.0, segments=16)
    create_mesh_obj("Civic_Grand_Rotunda_And_Spire", bm_civic, cols["DISTRICT_CIVIC"], mats["civic_white"])

    # Flanking Stepped Civic Council Towers & Skybridge Halls
    civic_specs = [
        (-5.5, 250.0, 16, 12, 11, 0.0), (5.5, 250.0, 16, 12, 11, 0.0),
        (-7.0, 218.0, 16, 15, 28, 4.0), (7.0, 218.0, 16, 15, 28, 4.0),
        (-9.5, 196.0, 16, 16, 46, 6.0), (9.5, 196.0, 16, 16, 46, 6.0),
        (-6.2, 160.0, 17, 17, 68, 9.0), (6.2, 160.0, 17, 17, 68, 9.0),
        (-10.5, 150.0, 15, 15, 58, 10.0), (10.5, 150.0, 15, 15, 58, 10.0),
    ]
    for idx, (ang, rad, w, d, h, z_off) in enumerate(civic_specs):
        p, rz = arc_pos(ang, rad, z_off)
        bm_t = bmesh.new()
        # 3-stepped ziggurat high-rise tower with floor ledges
        bmesh_add_box(bm_t, (0, 0, h * 0.25), (w, d, h * 0.5))
        bmesh_add_box(bm_t, (0, 0, h * 0.62), (w * 0.82, d * 0.82, h * 0.35))
        bmesh_add_box(bm_t, (0, 0, h * 0.88), (w * 0.62, d * 0.62, h * 0.24))
        for fl_z in range(4, int(h), 5):
            scale_f = 1.03 if fl_z < h * 0.5 else (0.85 if fl_z < h * 0.78 else 0.65)
            bmesh_add_box(bm_t, (0, 0, fl_z), (w * scale_f, d * scale_f, 0.65))
        create_mesh_obj(f"Civic_SteppedTower_{idx:02d}", bm_t, cols["DISTRICT_CIVIC"], mats["civic_white"], loc=p, rot=(0, 0, rz))

    # =========================================================================
    # 3. DISTRICT_RESIDENTIAL (Sector H-01 — 5 Architectural Building Archetypes)
    # =========================================================================
    tier_heights = [
        (255.0, 9.0, 17.0, 0.0),    # Tier 0: Low-rise terraced promenade residences
        (220.0, 18.0, 35.0, 4.5),   # Tier 1: Mid-rise courtyard & balcony apartments
        (182.0, 32.0, 60.0, 9.0),   # Tier 2: High-rise setback residential towers
        (145.0, 46.0, 84.0, 14.0),  # Tier 3: Tall skyline residential landmarks
    ]
    res_idx = 0
    for ang_step in range(16):
        ang = -44.0 + ang_step * 2.15
        for t_i, (r_tier, h_min, h_max, z_off) in enumerate(tier_heights):
            h = rng.uniform(h_min, h_max)
            w = rng.uniform(9.5, 15.5)
            d = rng.uniform(9.5, 14.5)
            p, rz = arc_pos(ang + rng.uniform(-0.35, 0.35), r_tier + rng.uniform(-2.0, 2.0), z_off)
            bm_r = bmesh.new()
            archetype = (res_idx + t_i) % 4
            if archetype == 0:
                # Setback Tower with cantilevered floor plates & roof penthouse
                bmesh_add_box(bm_r, (0, 0, h * 0.35), (w, d, h * 0.7))
                bmesh_add_box(bm_r, (0, 0, h * 0.82), (w * 0.76, d * 0.76, h * 0.36))
                bmesh_add_box(bm_r, (0, 0, h + 2.0), (w * 0.45, d * 0.45, 4.0))
                for fz in range(4, int(h), 4):
                    sf = 1.04 if fz < h * 0.7 else 0.80
                    bmesh_add_box(bm_r, (0, 0, fz), (w * sf, d * sf, 0.55))
            elif archetype == 1:
                # Twin-Core Skybridge Residence
                sub_w = w * 0.44
                bmesh_add_box(bm_r, (-w * 0.32, 0, h * 0.5), (sub_w, d, h))
                bmesh_add_box(bm_r, (w * 0.32, 0, h * 0.46), (sub_w, d, h * 0.92))
                # Connecting skybridges at 40% and 75% height
                bmesh_add_box(bm_r, (0, 0, h * 0.42), (w * 0.8, d * 0.5, 3.2))
                bmesh_add_box(bm_r, (0, 0, h * 0.75), (w * 0.8, d * 0.5, 3.2))
            elif archetype == 2:
                # Cantilevered Balcony Slab with alternating terrace ledges
                bmesh_add_box(bm_r, (0, 0, h * 0.5), (w, d * 0.85, h))
                for fz in range(3, int(h), 4):
                    shift_x = 0.8 if (fz // 4) % 2 == 0 else -0.8
                    bmesh_add_box(bm_r, (shift_x, -d * 0.48, fz), (w * 0.88, 1.6, 0.7))
            else:
                # Stepped Courtyard / Podium Block
                bmesh_add_box(bm_r, (0, 0, h * 0.22), (w * 1.18, d * 1.15, h * 0.44))
                bmesh_add_box(bm_r, (-w * 0.2, d * 0.1, h * 0.62), (w * 0.68, d * 0.72, h * 0.76))
                bmesh_add_box(bm_r, (w * 0.28, -d * 0.15, h * 0.48), (w * 0.52, d * 0.58, h * 0.52))

            mat_choice = mats["res_warm"] if res_idx % 3 != 0 else mats["res_slate"]
            create_mesh_obj(f"Res_Building_{res_idx:03d}", bm_r, cols["DISTRICT_RESIDENTIAL"], mat_choice, loc=p, rot=(0, 0, rz))
            res_idx += 1

    # =========================================================================
    # 4. DISTRICT_RECREATION (Geodesic Ribbed Biophilic Domes + Interior Greenery)
    # =========================================================================
    dome_specs = [
        (-14.5, 250.0, 15.0, 0.5),
        (0.0, 248.0, 18.0, 0.5),
        (14.5, 250.0, 15.0, 0.5),
        (-13.0, 214.0, 16.5, 4.5),
        (13.0, 214.0, 16.5, 4.5),
    ]
    for idx, (ang, rad, drad, z_off) in enumerate(dome_specs):
        p, rz = arc_pos(ang, rad, z_off)
        # Structural Base Collar + Arch Spaceframe Cage
        bm_base = bmesh.new()
        bmesh_add_cyl(bm_base, (0, 0, 1.8), drad * 1.06, drad * 1.02, 3.6, segments=36)
        # 8 Radial structural arch ribs over the dome
        for rib_i in range(8):
            ra = math.radians(rib_i * 22.5)
            for step_a in range(1, 12):
                phi = math.radians(step_a * 15.0)
                rx = drad * 1.02 * math.cos(phi) * math.cos(ra)
                ry = drad * 1.02 * math.cos(phi) * math.sin(ra)
                rz_rib = 2.0 + drad * 0.58 * math.sin(phi)
                bmesh_add_box(bm_base, (rx, ry, rz_rib), (0.65, 0.65, 2.2))
        create_mesh_obj(f"Rec_Biodome_Frame_{idx}", bm_base, cols["DISTRICT_RECREATION"], mats["civic_white"], loc=p, rot=(0, 0, rz))

        # Interior Biophilic Park Mounds & Tree Canopies
        bm_trees = bmesh.new()
        bmesh_add_cyl(bm_trees, (0, 0, 2.2), drad * 0.88, drad * 0.82, 1.4, segments=24)
        for t_i in range(14):
            ta = rng.uniform(0, math.tau)
            tr = rng.uniform(2.0, drad * 0.72)
            tx, ty = tr * math.cos(ta), tr * math.sin(ta)
            th = rng.uniform(3.2, 6.2)
            bmesh_add_cyl(bm_trees, (tx, ty, 3.0 + th * 0.4), th * 0.55, th * 0.15, th, segments=10)
        create_mesh_obj(f"Rec_Biodome_Park_{idx}", bm_trees, cols["DISTRICT_RECREATION"], mats["rec_foliage"], loc=p, rot=(0, 0, rz))

        # Translucent Glazed Dome Shell
        bpy.ops.mesh.primitive_uv_sphere_add(segments=36, ring_count=18, radius=drad, location=(p[0], p[1], p[2] + 2.0))
        dome = bpy.context.active_object
        dome.name = f"Rec_Biodome_Glass_{idx}"
        dome.scale = (1.0, 1.0, 0.58)
        for poly in dome.data.polygons:
            poly.use_smooth = True
        dome.data.materials.append(mats["rec_dome"])
        for c in list(dome.users_collection):
            c.objects.unlink(dome)
        cols["DISTRICT_RECREATION"].objects.link(dome)

    # =========================================================================
    # 5. DISTRICT_RESEARCH (Sector R-02 — Stacked Drum Labs, Hex Towers & Observatories)
    # =========================================================================
    sci_idx = 0
    for ang_step in range(10):
        ang = 12.0 + ang_step * 2.1
        for t_i, (r_tier, h_min, h_max, z_off) in enumerate(tier_heights):
            h = rng.uniform(h_min * 0.88, h_max * 0.90)
            radius = rng.uniform(5.5, 8.8)
            p, rz = arc_pos(ang, r_tier, z_off)
            bm_s = bmesh.new()
            if sci_idx % 2 == 0:
                # Stacked Drum Laboratory Tower with constricted utility necks
                num_drums = max(3, int(h // 10))
                drum_h = h / num_drums
                for d_i in range(num_drums):
                    zc = (d_i + 0.5) * drum_h
                    bmesh_add_cyl(bm_s, (0, 0, zc), radius, radius, drum_h * 0.72, segments=28)
                    bmesh_add_cyl(bm_s, (0, 0, zc + drum_h * 0.42), radius * 0.68, radius * 0.68, drum_h * 0.30, segments=20)
                # Observatory / Sensor Dome on roof
                bmesh_add_cyl(bm_s, (0, 0, h + 2.0), radius * 0.75, radius * 0.35, 4.0, segments=24)
            else:
                # Hexagonal Precision Cleanroom Tower with external structural ribs & sky-lab bridge
                bmesh_add_cyl(bm_s, (0, 0, h * 0.5), radius * 1.08, radius * 0.92, h, segments=6)
                for fz in range(5, int(h), 6):
                    bmesh_add_cyl(bm_s, (0, 0, fz), radius * 1.15, radius * 1.15, 0.8, segments=6)
                if sci_idx % 3 == 0:
                    bmesh_add_box(bm_s, (0, 0, h * 0.68), (radius * 3.1, radius * 1.25, 4.8))
            create_mesh_obj(f"Sci_Facility_{sci_idx:02d}", bm_s, cols["DISTRICT_RESEARCH"], mats["sci_silver"], loc=p, rot=(0, 0, rz))
            sci_idx += 1

    # =========================================================================
    # 6. DISTRICT_INDUSTRIAL (Sector M-03 — Portal-Framed Cleanroom Vaults, Furnaces & Silos)
    # =========================================================================
    ind_idx = 0
    for ang in [34.0, 38.5, 43.0, 47.5]:
        for r_tier, z_off in [(248.0, 1.0), (212.0, 5.5), (174.0, 10.5), (142.0, 14.5)]:
            w = rng.uniform(21.0, 29.0)
            d = rng.uniform(16.0, 23.0)
            h = rng.uniform(16.0, 34.0) + (260.0 - r_tier) * 0.14
            p, rz = arc_pos(ang, r_tier, z_off)
            bm_ind = bmesh.new()
            # Main Production Hall Volume
            bmesh_add_box(bm_ind, (0, 0, h * 0.45), (w, d, h * 0.9))
            # Chamfered Skylight/Cooling Vault Roof
            bmesh_add_box(bm_ind, (0, 0, h * 0.95), (w * 0.82, d * 0.72, h * 0.15))
            # External Portal Truss Frames every 5m
            for px in range(int(-w * 0.42), int(w * 0.45), 5):
                bmesh_add_box(bm_ind, (px, 0, h * 0.5), (0.85, d * 1.06, h * 1.02))
            # Twin Vertical Crystal-Growth Furnace Silos & Gantry Bridge
            bmesh_add_cyl(bm_ind, (w * 0.42, d * 0.38, h * 0.58), 3.8, 3.8, h * 1.15, segments=20)
            bmesh_add_cyl(bm_ind, (w * 0.42, -d * 0.25, h * 0.58), 3.8, 3.8, h * 1.15, segments=20)
            bmesh_add_box(bm_ind, (0, 0, h + 3.2), (w * 1.15, 2.6, 2.8))
            create_mesh_obj(f"Ind_ManufacturingComplex_{ind_idx:02d}", bm_ind, cols["DISTRICT_INDUSTRIAL"], mats["ind_steel"], loc=p, rot=(0, 0, rz))
            ind_idx += 1

    # =========================================================================
    # 7. DISTRICT_PORT (Sector P-01 — Axial Logistics Hub, 6 Berthing Piers & Propellant Depot)
    # =========================================================================
    port_hub_pos, port_rz = arc_pos(-47.0, 236.0, 4.0)
    bm_port = bmesh.new()
    # Multi-tier Port Traffic Control Tower & Logistics Hub
    bmesh_add_cyl(bm_port, (0, 0, 12.0), 17.5, 16.0, 24.0, segments=32)
    bmesh_add_cyl(bm_port, (0, 0, 28.0), 13.5, 15.0, 9.0, segments=32)
    bmesh_add_cyl(bm_port, (0, 0, 37.0), 9.5, 11.5, 8.0, segments=24)
    bmesh_add_cyl(bm_port, (0, 0, 46.0), 1.8, 0.4, 12.0, segments=12)
    # Axial Logistics Spine with truss ribs & cargo container stacks
    bmesh_add_box(bm_port, (-56.0, 0.0, 4.0), (112.0, 11.0, 8.0))
    for rib_x in range(-105, -8, 10):
        bmesh_add_box(bm_port, (rib_x, 0.0, 4.5), (1.2, 13.5, 10.5))
        # Cargo container clusters along dorsal spine
        bmesh_add_box(bm_port, (rib_x + 4.0, 0.0, 10.2), (6.5, 7.5, 3.6))
    # 6 Articulated Docking Piers with Berthing Rings & Umbilical Arms
    for pier_i in range(6):
        px = -18.0 - pier_i * 16.5
        bmesh_add_box(bm_port, (px, -21.0, 4.0), (5.5, 34.0, 5.2))
        for p_rib in [-12.0, -20.0, -28.0]:
            bmesh_add_box(bm_port, (px, p_rib, 4.0), (7.2, 1.0, 6.8))
        # International Docking Adapter Collar at tip of pier
        bmesh_add_cyl(bm_port, (px, -39.5, 4.0), 4.5, 3.6, 3.8, segments=24, rot_x=math.radians(90))
    create_mesh_obj("Port_Logistics_Hub_And_Piers", bm_port, cols["DISTRICT_PORT"], mats["port_hull"], loc=port_hub_pos, rot=(0, 0, 0.22))

    # Propellant Depot Spheres in Standoff Truss Cradle
    bm_depot = bmesh.new()
    bmesh_add_box(bm_depot, (-85.0, 26.0, 4.0), (62.0, 4.0, 4.0))
    for sp_i in range(4):
        bmesh_add_cyl(bm_depot, (-62.0 - sp_i * 15.0, 26.0, 4.0), 6.2, 6.2, 10.0, segments=24)
    create_mesh_obj("Port_Propellant_Depot", bm_depot, cols["DISTRICT_PORT"], mats["civic_white"], loc=port_hub_pos, rot=(0, 0, 0.22))

    # =========================================================================
    # 8. DISTRICT_UTILITIES (Sector E-04 — Dorsal Solar Array Wings & Ceramic Radiators)
    # =========================================================================
    for wing_idx, ang in enumerate([-42.0, -27.0, -13.0, 13.0, 27.0, 42.0]):
        upos, urz = arc_pos(ang, 118.0, 20.0)
        bm_pylon = bmesh.new()
        bmesh_add_box(bm_pylon, (0, 0, 15.0), (8.5, 24.0, 42.0))
        bmesh_add_cyl(bm_pylon, (0, 8.0, 42.0), 4.5, 4.5, 16.0, segments=20)
        create_mesh_obj(f"Util_SpinePylon_{wing_idx}", bm_pylon, cols["DISTRICT_UTILITIES"], mats["core_dark"], loc=upos, rot=(0, 0, urz))

        # Twin Segmented Solar Array Wings
        bm_sol = bmesh.new()
        for side_x in [-9.5, 9.5]:
            bmesh_add_box(bm_sol, (side_x, 12.0, 62.0), (0.9, 1.2, 92.0))  # Central deployment boom
            for seg_z in range(22, 106, 12):
                bmesh_add_box(bm_sol, (side_x, 12.0, seg_z), (13.5, 0.45, 10.8))
        create_mesh_obj(f"Util_SolarWings_{wing_idx}", bm_sol, cols["DISTRICT_UTILITIES"], mats["solar"], loc=upos, rot=(0.20, 0, urz))

        # Accordion-Style White Ceramic Thermal Rejection Radiator Fins
        bm_rad = bmesh.new()
        for r_fin in [-7.0, 0.0, 7.0]:
            bmesh_add_box(bm_rad, (r_fin, 20.0, -18.0), (5.5, 0.55, 48.0))
        create_mesh_obj(f"Util_ThermalRadiators_{wing_idx}", bm_rad, cols["DISTRICT_UTILITIES"], mats["radiator"], loc=upos, rot=(-0.18, 0, urz))

    # =========================================================================
    # 9. CONSTRUCTION_ZONE (Sector C-06 — Open Spaceframe Cages & Articulated Robotic Cranes)
    # =========================================================================
    for c_i, ang in enumerate([50.0, 54.5, 59.0]):
        cpos, crz = arc_pos(ang, 215.0, 12.0)
        bm_c = bmesh.new()
        # Lower half clad module, upper half open 3D structural spaceframe grid
        bmesh_add_box(bm_c, (0, 0, 8.0), (16.0, 16.0, 16.0))
        for cx_p in [-7.5, 0.0, 7.5]:
            for cy_p in [-7.5, 0.0, 7.5]:
                bmesh_add_box(bm_c, (cx_p, cy_p, 26.0), (0.85, 0.85, 24.0))
        for cz_b in [20.0, 26.0, 32.0, 38.0]:
            bmesh_add_box(bm_c, (0, -7.5, cz_b), (16.0, 0.75, 0.75))
            bmesh_add_box(bm_c, (0, 7.5, cz_b), (16.0, 0.75, 0.75))
            bmesh_add_box(bm_c, (-7.5, 0, cz_b), (0.75, 16.0, 0.75))
            bmesh_add_box(bm_c, (7.5, 0, cz_b), (0.75, 16.0, 0.75))
        # High Robotic Manipulator Tower Crane + Boom + Suspended Module
        bmesh_add_box(bm_c, (10.5, 0, 32.0), (2.4, 2.4, 52.0))
        bmesh_add_box(bm_c, (2.0, 0, 57.0), (36.0, 2.2, 2.4))
        bmesh_add_box(bm_c, (-10.0, 0, 47.0), (0.35, 0.35, 18.0))  # Hoist cable
        bmesh_add_box(bm_c, (-10.0, 0, 36.5), (7.5, 7.5, 4.5))     # Module being hoisted
        create_mesh_obj(f"Const_AssemblyRig_{c_i}", bm_c, cols["CONSTRUCTION_ZONE"], mats["const_yellow"], loc=cpos, rot=(0, 0, crz))

    # =========================================================================
    # 10. PLANET_EARTH (Colossal Unshadowed Planetary Horizon)
    # =========================================================================
    earth_center = (380.0, 2150.0, -2220.0)
    earth_radius = 2800.0
    bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=64, radius=earth_radius, location=earth_center)
    earth_obj = bpy.context.active_object
    earth_obj.name = "Earth_Surface_Sphere"
    for p in earth_obj.data.polygons:
        p.use_smooth = True
    earth_obj.data.materials.append(mats["earth_body"])
    for c in list(earth_obj.users_collection):
        c.objects.unlink(earth_obj)
    cols["PLANET_EARTH"].objects.link(earth_obj)

    # =========================================================================
    # 11. LIGHTING & WORLD
    # =========================================================================
    world = bpy.context.scene.world
    if not world:
        world = bpy.data.worlds.new("Revatya_Orbital_World")
        bpy.context.scene.world = world
    world.use_nodes = True
    bg_node = next(n for n in world.node_tree.nodes if n.type == "BACKGROUND")
    bg_node.inputs["Color"].default_value = (0.004, 0.008, 0.016, 1.0)
    bg_node.inputs["Strength"].default_value = 1.0

    bpy.ops.object.light_add(type='SUN', location=(250, -200, 350), rotation=(math.radians(52), math.radians(16), math.radians(-38)))
    sun = bpy.context.active_object
    sun.name = "SUN_PRIMARY_ORBITAL"
    sun.data.energy = 4.2
    sun.data.color = (1.0, 0.97, 0.92)
    sun.data.angle = math.radians(0.53)
    for c in list(sun.users_collection):
        c.objects.unlink(sun)
    cols["LIGHTING"].objects.link(sun)

    bpy.ops.object.light_add(type='SUN', location=(180, 400, -200), rotation=(math.radians(122), math.radians(-12), math.radians(150)))
    earthshine = bpy.context.active_object
    earthshine.name = "SUN_EARTHSHINE_BOUNCE"
    earthshine.data.energy = 1.35
    earthshine.data.color = (0.38, 0.66, 1.0)
    earthshine.data.angle = math.radians(35.0)
    for c in list(earthshine.users_collection):
        c.objects.unlink(earthshine)
    cols["LIGHTING"].objects.link(earthshine)

    # =========================================================================
    # 12. CAMERAS (Refined Framing so Port, Civic Spire, Domes, & Earth all frame harmoniously)
    # =========================================================================
    def add_cam(name, loc, target_pt, lens=22.0, clip_end=6000.0):
        bpy.ops.object.camera_add(location=loc)
        cam = bpy.context.active_object
        cam.name = name
        cam.data.lens = lens
        cam.data.clip_start = 0.5
        cam.data.clip_end = clip_end
        direction = Vector(target_pt) - Vector(loc)
        rot_quat = direction.to_track_quat('-Z', 'Y')
        cam.rotation_euler = rot_quat.to_euler()
        for c in list(cam.users_collection):
            c.objects.unlink(cam)
        cols["CAMERAS"].objects.link(cam)
        return cam

    cam_main = add_cam("CAM_MAIN_HERO", (-16.0, -78.0, 30.5), (-4.0, 110.0, 26.0), lens=19.5)
    add_cam("CAM_MOBILE_HERO", (-8.0, -82.0, 32.0), (0.0, 110.0, 28.0), lens=18.5)
    add_cam("CAM_DIAG_01_ESTABLISHING", (0.0, -170.0, 84.0), (0.0, 110.0, 18.0), lens=19.5)
    add_cam("CAM_DIAG_02_PORT", (-270.0, -35.0, 48.0), (-170.0, 92.0, 10.0), lens=25.0)
    add_cam("CAM_DIAG_03_RESIDENTIAL_CIVIC", (-105.0, -35.0, 42.0), (-10.0, 88.0, 26.0), lens=25.0)
    add_cam("CAM_DIAG_04_MASTERPLAN", (0.0, -215.0, 235.0), (0.0, 95.0, 0.0), lens=20.5)
    add_cam("CAM_DIAG_05_HUMAN_SCALE", (-10.0, -64.0, 24.8), (4.0, 110.0, 24.0), lens=24.0)

    bpy.context.scene.camera = cam_main
    bpy.ops.wm.save_as_mainfile(filepath="/home/pandeyaryan28/Documents/revatya/revatya_orbital_city.blend")
    print("Iteration 2 Architecture complete. Objects count:", len(bpy.data.objects))

build_architecture()
