import bpy
import bmesh
import math
import random
from mathutils import Vector, Euler

def ensure_collection(name):
    if name in bpy.data.collections:
        col = bpy.data.collections[name]
        for obj in list(col.objects):
            bpy.data.objects.remove(obj, do_unlink=True)
        return col
    col = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(col)
    return col

def get_or_make_mat(name, color, roughness=0.45, metallic=0.15, emission_color=None, emission_strength=0.0, alpha=1.0):
    if name in bpy.data.materials:
        mat = bpy.data.materials[name]
    else:
        mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if "Alpha" in bsdf.inputs:
        bsdf.inputs["Alpha"].default_value = alpha
    if alpha < 1.0 and hasattr(mat, "blend_method"):
        mat.blend_method = 'BLEND'
    if emission_color and "Emission Color" in bsdf.inputs:
        bsdf.inputs["Emission Color"].default_value = (*emission_color, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    mat.diffuse_color = (*color, alpha)
    return mat

def arc_pos(angle_deg, radius, z=0.0):
    cx, cy = 0.0, 280.0
    rad = math.radians(angle_deg)
    x = cx + radius * math.sin(rad)
    y = cy - radius * math.cos(rad)
    return (x, y, z), rad

def create_mesh_obj(name, bm, col, mat, loc=(0, 0, 0), rot=(0, 0, 0), smooth=False):
    if name in bpy.data.objects:
        old = bpy.data.objects[name]
        bpy.data.objects.remove(old, do_unlink=True)
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

def bmesh_add_box(bm, center, size, rot_euler=(0.0, 0.0, 0.0)):
    sx, sy, sz = size
    ret = bmesh.ops.create_cube(bm, size=1.0)
    eul = Euler(rot_euler, 'XYZ')
    for v in ret["verts"]:
        co = Vector((v.co.x * sx, v.co.y * sy, v.co.z * sz))
        if rot_euler != (0.0, 0.0, 0.0):
            co.rotate(eul)
        v.co = co + Vector(center)
    return ret["verts"]

def bmesh_add_cyl(bm, center, radius_bottom, radius_top, depth, segments=16, rot_euler=(0.0, 0.0, 0.0)):
    ret = bmesh.ops.create_cone(
        bm,
        cap_ends=True,
        cap_tris=False,
        segments=segments,
        radius1=radius_bottom,
        radius2=radius_top,
        depth=depth,
    )
    eul = Euler(rot_euler, 'XYZ')
    for v in ret["verts"]:
        co = v.co.copy()
        if rot_euler != (0.0, 0.0, 0.0):
            co.rotate(eul)
        v.co = co + Vector(center)
    return ret["verts"]

def build_human_bm(pose="OBSERVING", height_scale=1.0):
    """
    Creates an articulated 1.75m human figure mesh with head, neck, torso, pelvis,
    articulated arms, and articulated legs. Origin (0,0,0) is directly between the feet
    so placing at z = deck_z grounds the figure with zero floating.
    """
    bm = bmesh.new()
    s = height_scale

    if pose == "SEATED":
        # Seated on a 0.48m bench: feet on ground (z=0), knees forward, hips at z=0.48m
        # Lower legs (vertical at y = -0.22)
        for side in [-1, 1]:
            lx = side * 0.10 * s
            bmesh_add_cyl(bm, (lx, -0.22 * s, 0.24 * s), 0.048 * s, 0.058 * s, 0.46 * s, segments=10)
            bmesh_add_box(bm, (lx, -0.27 * s, 0.03 * s), (0.09 * s, 0.19 * s, 0.06 * s))
            # Thighs (horizontal from y=0 to y=-0.22 at z=0.48)
            bmesh_add_cyl(bm, (lx, -0.11 * s, 0.49 * s), 0.068 * s, 0.058 * s, 0.30 * s, segments=10, rot_euler=(math.radians(85), 0, 0))
        # Pelvis & Torso
        bmesh_add_box(bm, (0, 0.0, 0.54 * s), (0.33 * s, 0.22 * s, 0.16 * s))
        bmesh_add_cyl(bm, (0, 0.02 * s, 0.80 * s), 0.14 * s, 0.18 * s, 0.42 * s, segments=12)
        # Neck & Head
        bmesh_add_cyl(bm, (0, 0.02 * s, 1.05 * s), 0.052 * s, 0.050 * s, 0.09 * s, segments=10)
        bmesh_add_cyl(bm, (0, 0.01 * s, 1.18 * s), 0.095 * s, 0.088 * s, 0.21 * s, segments=14)
        # Arms resting toward lap
        for side in [-1, 1]:
            ax = side * 0.21 * s
            bmesh_add_cyl(bm, (ax, -0.02 * s, 0.82 * s), 0.045 * s, 0.040 * s, 0.28 * s, segments=10, rot_euler=(math.radians(22), 0, side * math.radians(-8)))
            bmesh_add_cyl(bm, (ax * 0.9, -0.13 * s, 0.64 * s), 0.038 * s, 0.032 * s, 0.25 * s, segments=10, rot_euler=(math.radians(68), 0, 0))
        return bm

    # Standing / Walking / Observing / Conversing poses (1.75m total height)
    stride = 0.14 * s if pose == "WALKING" else 0.0
    for side in [-1, 1]:
        lx = side * 0.095 * s
        ly = (stride if side == -1 else -stride)
        leg_ang = math.radians(14 * side) if pose == "WALKING" else 0.0
        # Foot
        bmesh_add_box(bm, (lx, ly + 0.04 * s, 0.035 * s), (0.092 * s, 0.21 * s, 0.07 * s))
        # Lower leg (calf)
        bmesh_add_cyl(bm, (lx, ly * 0.7, 0.26 * s), 0.046 * s, 0.060 * s, 0.42 * s, segments=10, rot_euler=(leg_ang * 0.6, 0, 0))
        # Upper leg (thigh)
        bmesh_add_cyl(bm, (lx, ly * 0.3, 0.66 * s), 0.064 * s, 0.078 * s, 0.44 * s, segments=10, rot_euler=(leg_ang, 0, 0))

    # Pelvis / Hips
    bmesh_add_box(bm, (0, 0, 0.93 * s), (0.32 * s, 0.20 * s, 0.16 * s))
    # Upper Torso / Jacket / Tunic
    bmesh_add_cyl(bm, (0, 0, 1.22 * s), 0.145 * s, 0.195 * s, 0.46 * s, segments=12)
    # Shoulder yoke
    bmesh_add_box(bm, (0, 0, 1.41 * s), (0.42 * s, 0.21 * s, 0.10 * s))
    # Neck
    bmesh_add_cyl(bm, (0, 0, 1.50 * s), 0.052 * s, 0.048 * s, 0.09 * s, segments=10)
    # Head (slightly tilted up if OBSERVING)
    head_pitch = math.radians(-10) if pose == "OBSERVING" else 0.0
    bmesh_add_cyl(bm, (0, 0.01 * s, 1.63 * s), 0.092 * s, 0.098 * s, 0.22 * s, segments=14, rot_euler=(head_pitch, 0, 0))

    # Articulated Arms
    for side in [-1, 1]:
        ax = side * 0.23 * s
        if pose == "OBSERVING" and side == 1:
            # Right arm reaching slightly forward toward glass balustrade rail
            bmesh_add_cyl(bm, (ax, 0.06 * s, 1.28 * s), 0.046 * s, 0.040 * s, 0.29 * s, segments=10, rot_euler=(math.radians(-28), 0, 0))
            bmesh_add_cyl(bm, (ax, 0.22 * s, 1.15 * s), 0.038 * s, 0.032 * s, 0.27 * s, segments=10, rot_euler=(math.radians(-62), 0, 0))
        elif pose == "CONVERSING" and side == 1:
            # Right forearm raised in expressive conversational gesture
            bmesh_add_cyl(bm, (ax, 0.03 * s, 1.27 * s), 0.046 * s, 0.040 * s, 0.28 * s, segments=10, rot_euler=(math.radians(-18), 0, 0))
            bmesh_add_cyl(bm, (ax * 0.92, 0.16 * s, 1.22 * s), 0.038 * s, 0.032 * s, 0.26 * s, segments=10, rot_euler=(math.radians(-75), 0, math.radians(-15)))
        elif pose == "WALKING":
            arm_swing = math.radians(-16 * side)
            bmesh_add_cyl(bm, (ax, -side * 0.03 * s, 1.26 * s), 0.046 * s, 0.040 * s, 0.29 * s, segments=10, rot_euler=(arm_swing, 0, 0))
            bmesh_add_cyl(bm, (ax, -side * 0.07 * s, 1.01 * s), 0.038 * s, 0.032 * s, 0.27 * s, segments=10, rot_euler=(arm_swing * 1.2, 0, 0))
        else:
            # Relaxed natural side arm
            bmesh_add_cyl(bm, (ax, 0.0, 1.26 * s), 0.046 * s, 0.040 * s, 0.29 * s, segments=10, rot_euler=(0, math.radians(side * 4), 0))
            bmesh_add_cyl(bm, (ax * 1.03, 0.02 * s, 1.00 * s), 0.038 * s, 0.032 * s, 0.27 * s, segments=10, rot_euler=(math.radians(-8), 0, 0))
    return bm

def build_passenger_shuttle_bm():
    """
    24m Orbital Passenger & Crew Transport Shuttle sharing Revatya's architectural language.
    Origin is at center; +Y is forward nose direction.
    """
    bm = bmesh.new()
    # Main blended lifting-body fuselage (tapered forward & aft)
    bmesh_add_cyl(bm, (0, 0.0, 0.0), 2.3, 2.1, 14.0, segments=20, rot_euler=(math.radians(-90), 0, 0))
    # Forward tapered nose cone + International Docking Adapter collar at tip (y = +11.8)
    bmesh_add_cyl(bm, (0, 9.0, -0.15), 2.1, 1.15, 4.2, segments=20, rot_euler=(math.radians(-90), 0, 0))
    bmesh_add_cyl(bm, (0, 11.5, -0.15), 1.15, 1.10, 0.9, segments=20, rot_euler=(math.radians(-90), 0, 0))
    # Aft fuselage taper & dual orbital maneuvering thruster bells
    bmesh_add_cyl(bm, (0, -8.5, 0.1), 2.3, 1.45, 3.2, segments=20, rot_euler=(math.radians(-90), 0, 0))
    for tx in [-0.75, 0.75]:
        bmesh_add_cyl(bm, (tx, -10.6, 0.1), 0.65, 0.42, 1.2, segments=16, rot_euler=(math.radians(-90), 0, 0))
    # Swept Delta / Strake Wings (wingspan 14.4m)
    for side in [-1, 1]:
        bmesh_add_box(bm, (side * 4.2, -1.5, -0.35), (5.8, 7.5, 0.38), rot_euler=(0, side * math.radians(-4), side * math.radians(-22)))
        # Canted twin vertical stabilizers at wingtips
        bmesh_add_box(bm, (side * 6.6, -4.2, 1.1), (0.28, 3.6, 2.8), rot_euler=(0, side * math.radians(18), 0))
    # Dorsal spine & cockpit canopy ridge
    bmesh_add_box(bm, (0, 3.5, 1.65), (2.2, 6.5, 0.95), rot_euler=(math.radians(-8), 0, 0))
    return bm

def build_cargo_freighter_bm():
    """
    42m Heavy Modular Cargo Transfer Freighter with axial truss spine, 6 orbital ISO cargo pods,
    command module, radiator wings, and forward berthing ring. +Y is forward.
    """
    bm = bmesh.new()
    # Axial structural truss spine (36m long)
    bmesh_add_box(bm, (0, 0.0, 0.0), (2.8, 34.0, 2.8))
    for ry in range(-15, 18, 5):
        bmesh_add_box(bm, (0, ry, 0.0), (3.8, 0.7, 3.8))
    # 6 Modular Cargo Container Pods mounted in pairs along spine
    for cy in [-9.0, -1.5, 6.0]:
        for side in [-1, 1]:
            bmesh_add_box(bm, (side * 3.6, cy, 0.0), (3.8, 5.8, 3.8))
            bmesh_add_cyl(bm, (side * 3.6, cy, 2.2), 1.4, 1.4, 0.8, segments=12)
    # Forward Pressurized Command Bridge & Berthing Collar (y = +19.5)
    bmesh_add_cyl(bm, (0, 17.5, 0.6), 2.8, 2.2, 4.5, segments=20, rot_euler=(math.radians(-90), 0, 0))
    bmesh_add_cyl(bm, (0, 20.4, 0.6), 2.1, 1.9, 1.4, segments=24, rot_euler=(math.radians(-90), 0, 0))
    # Aft Propulsion Module, Propellant Spheres & Thermal Radiator Vanes
    bmesh_add_cyl(bm, (0, -18.5, 0.0), 3.4, 2.8, 5.0, segments=20, rot_euler=(math.radians(-90), 0, 0))
    for side in [-1, 1]:
        bmesh_add_box(bm, (side * 7.5, -16.5, 0.0), (8.5, 0.25, 3.6))
        bmesh_add_cyl(bm, (side * 1.6, -21.8, 0.0), 1.2, 0.75, 1.8, segments=16, rot_euler=(math.radians(-90), 0, 0))
    return bm

def build_utility_tug_bm():
    """11.5m Orbital Utility & Servicing Tug with twin articulated grappler arms."""
    bm = bmesh.new()
    bmesh_add_cyl(bm, (0, 0, 0), 2.2, 2.0, 6.2, segments=16, rot_euler=(math.radians(-90), 0, 0))
    bmesh_add_box(bm, (0, 1.2, 1.4), (2.4, 2.8, 1.4))  # Cupola cab
    # Twin lateral propellant tanks
    for side in [-1, 1]:
        bmesh_add_cyl(bm, (side * 2.5, -0.5, 0), 0.95, 0.95, 4.8, segments=14, rot_euler=(math.radians(-90), 0, 0))
        # Forward manipulator grappler arms
        bmesh_add_box(bm, (side * 1.4, 4.6, -0.4), (0.35, 3.6, 0.35), rot_euler=(0, 0, side * math.radians(-10)))
    return bm

def build_maint_drone_bm():
    """3.8m Autonomous Inspection & Maintenance Pod."""
    bm = bmesh.new()
    bmesh_add_cyl(bm, (0, 0, 0), 1.1, 0.95, 2.2, segments=14)
    bmesh_add_box(bm, (0, 0.8, 0.2), (1.6, 1.2, 0.9))
    for side in [-1, 1]:
        bmesh_add_box(bm, (side * 0.9, 1.6, -0.2), (0.22, 1.6, 0.22))
    return bm

def build_iter3():
    col_core = bpy.data.collections["CITY_CORE"]
    col_civic = bpy.data.collections["DISTRICT_CIVIC"]
    col_port = bpy.data.collections["DISTRICT_PORT"]
    col_humans = ensure_collection("HUMAN_FIGURES")
    col_spacecraft = ensure_collection("SPACECRAFT")

    mats = {
        "civic_white": get_or_make_mat("Arch_Civic_Alabaster", (0.94, 0.95, 0.98), roughness=0.30, metallic=0.15),
        "core_dark": get_or_make_mat("Arch_Core_Graphite", (0.20, 0.24, 0.29), roughness=0.45, metallic=0.55),
        "glass_rail": get_or_make_mat("Arch_Promenade_GlassRail", (0.62, 0.84, 0.96), roughness=0.08, metallic=0.05, emission_color=(0.35, 0.68, 0.92), emission_strength=0.18, alpha=0.22),
        "handrail_metal": get_or_make_mat("Arch_Handrail_Titanium", (0.82, 0.86, 0.90), roughness=0.22, metallic=0.80),
        "holo_cyan": get_or_make_mat("Arch_Holo_Wayfinding", (0.25, 0.82, 1.0), roughness=0.15, metallic=0.10, emission_color=(0.20, 0.78, 1.0), emission_strength=2.2, alpha=0.65),
        "human_navy": get_or_make_mat("Human_Civic_Navy", (0.12, 0.18, 0.30), roughness=0.55, metallic=0.05),
        "human_ivory": get_or_make_mat("Human_Civic_Ivory", (0.86, 0.82, 0.76), roughness=0.50, metallic=0.05),
        "human_sci": get_or_make_mat("Human_Research_Coat", (0.88, 0.94, 0.98), roughness=0.40, metallic=0.10),
        "human_amber": get_or_make_mat("Human_Utility_Amber", (0.88, 0.52, 0.12), roughness=0.45, metallic=0.15),
        "sc_hull": get_or_make_mat("SC_Orbital_WhiteHull", (0.92, 0.94, 0.97), roughness=0.26, metallic=0.25),
        "sc_cargo": get_or_make_mat("SC_Cargo_Titanium", (0.72, 0.76, 0.82), roughness=0.36, metallic=0.45),
        "sc_thruster": get_or_make_mat("SC_Ion_Beacon_Cyan", (0.35, 0.85, 1.0), roughness=0.15, metallic=0.10, emission_color=(0.30, 0.82, 1.0), emission_strength=3.5),
        "sc_beacon_amber": get_or_make_mat("SC_Nav_Beacon_Amber", (1.0, 0.65, 0.15), roughness=0.20, metallic=0.10, emission_color=(1.0, 0.60, 0.10), emission_strength=3.0),
    }

    # =========================================================================
    # 1. UPGRADE FOREGROUND OBSERVATION PROMENADE (Open Glass Balustrade + Benches + Wayfinding)
    # =========================================================================
    bm_fg = bmesh.new()
    # Main lower deck & upper promenade terrace (top surface at z = 23.20m)
    bmesh_add_box(bm_fg, (0, -68.0, 21.5), (92.0, 26.0, 2.4))
    bmesh_add_box(bm_fg, (0, -65.0, 22.9), (78.0, 18.0, 0.6))
    # Architectural seating benches & low planter curbs (top at z = 23.68m, height 0.48m above 23.20m deck)
    for px in [-24.0, -12.0, 0.0, 12.0, 24.0]:
        bmesh_add_box(bm_fg, (px, -60.5, 23.44), (5.2, 1.4, 0.48))
    # Slim vertical railing mullions along the observation edge (y = -55.3, top at z = 24.30m)
    for rx in range(-42, 44, 4):
        bmesh_add_box(bm_fg, (rx, -55.3, 23.75), (0.12, 0.16, 1.10))
    # Top brushed-metal handrail bar at z = 24.32m (slim 8cm profile so view through glass is completely open)
    bmesh_add_box(bm_fg, (0, -55.3, 24.32), (86.0, 0.18, 0.08))
    # West & East Architectural Observation Pavilions
    for side, x_c in [(-1, -34.0), (1, 36.0)]:
        bmesh_add_box(bm_fg, (x_c, -69.5, 25.5), (18.0, 14.0, 5.2))
        bmesh_add_box(bm_fg, (x_c, -67.5, 28.5), (21.0, 18.5, 0.9))
        for col_x in [x_c - 8.5, x_c - 3.0, x_c + 3.0, x_c + 8.5]:
            bmesh_add_box(bm_fg, (col_x, -59.5, 25.5), (0.50, 0.50, 5.2))
    create_mesh_obj("Core_FG_Observation_Promenade", bm_fg, col_core, mats["civic_white"])

    # Separate translucent glass balustrade panel object
    bm_glass = bmesh.new()
    bmesh_add_box(bm_glass, (0, -55.3, 23.75), (85.6, 0.06, 1.02))
    # Holographic orbital wayfinding / vista display pylons on promenade
    for kx in [-17.5, 6.5]:
        bmesh_add_box(bm_glass, (kx, -58.2, 24.2), (1.4, 0.12, 1.8))
    create_mesh_obj("Core_FG_Glass_Balustrade", bm_glass, col_core, mats["glass_rail"])

    # Trim the very top antenna tip of Civic_Grand_Rotunda_And_Spire slightly so it frames with breathing room
    # (Re-build Civic_Grand_Rotunda_And_Spire with total height z=114m instead of 140m)
    civic_pos, _ = arc_pos(0.0, 182.0, 10.0)
    bm_civic = bmesh.new()
    cx, cy, cz = civic_pos
    bmesh_add_cyl(bm_civic, (cx, cy, cz + 8.0), 32.0, 29.0, 16.0, segments=48)
    bmesh_add_cyl(bm_civic, (cx, cy, cz + 22.0), 25.0, 22.0, 14.0, segments=48)
    bmesh_add_cyl(bm_civic, (cx, cy, cz + 34.0), 19.0, 17.0, 12.0, segments=40)
    for fin_i in range(24):
        fa = math.radians(fin_i * 15.0)
        fx = cx + 29.5 * math.sin(fa)
        fy = cy - 29.5 * math.cos(fa)
        bmesh_add_box(bm_civic, (fx, fy, cz + 14.0), (1.4, 4.5, 28.0), rot_euler=(0, 0, fa))
    bmesh_add_cyl(bm_civic, (cx, cy, cz + 56.0), 13.5, 10.2, 42.0, segments=32)
    for ring_z in range(42, 76, 7):
        bmesh_add_cyl(bm_civic, (cx, cy, cz + ring_z), 14.2, 14.2, 1.4, segments=32)
    # Panoramic Observation Crown & Spire Tip (top at z = 10 + 98 = 108m)
    bmesh_add_cyl(bm_civic, (cx, cy, cz + 78.0), 18.5, 16.0, 4.2, segments=40)
    bmesh_add_cyl(bm_civic, (cx, cy, cz + 83.5), 15.0, 17.5, 3.8, segments=40)
    bmesh_add_cyl(bm_civic, (cx, cy, cz + 90.0), 7.2, 3.2, 9.0, segments=24)
    bmesh_add_cyl(bm_civic, (cx, cy, cz + 99.0), 1.6, 0.35, 11.0, segments=16)
    create_mesh_obj("Civic_Grand_Rotunda_And_Spire", bm_civic, col_civic, mats["civic_white"])

    # =========================================================================
    # 2. ARTICULATED HUMAN FIGURES (Grounded on Promenade, Skybridges & District Plazas)
    # =========================================================================
    # Foreground Observation Promenade surface is at z = 23.20m
    fg_deck_z = 23.20
    fg_people_specs = [
        # Group 1: Rail observers right in front of CAM_DIAG_05_HUMAN_SCALE & CAM_MAIN_HERO
        ("FG_Observer_01", (-8.8, -56.2, fg_deck_z), 0.12, "OBSERVING", "human_navy", 1.00),
        ("FG_Observer_02", (-7.6, -56.1, fg_deck_z), -0.18, "OBSERVING", "human_sci", 0.97),
        ("FG_Observer_03", (-6.1, -56.3, fg_deck_z), 0.25, "CONVERSING", "human_ivory", 1.02),
        # Group 2: Conversing trio on the central promenade terrace
        ("FG_Converse_01", (-3.2, -58.8, fg_deck_z), -0.85, "CONVERSING", "human_sci", 1.01),
        ("FG_Converse_02", (-2.1, -58.3, fg_deck_z), 2.15, "OBSERVING", "human_navy", 0.96),
        ("FG_Converse_03", (-2.4, -59.5, fg_deck_z), 0.45, "CONVERSING", "human_ivory", 0.99),
        # Group 3: Seated pair on Bench (-12.0, -59.8) + companion standing nearby
        ("FG_Seated_01", (-12.6, -59.7, fg_deck_z), 0.0, "SEATED", "human_ivory", 0.98),
        ("FG_Seated_02", (-11.5, -59.7, fg_deck_z), 0.15, "SEATED", "human_navy", 1.01),
        ("FG_BenchComp_01", (-10.4, -59.2, fg_deck_z), 1.35, "CONVERSING", "human_sci", 0.99),
        # Group 4: Walking pedestrians along promenade
        ("FG_Walker_01", (2.4, -57.6, fg_deck_z), -1.45, "WALKING", "human_navy", 1.02),
        ("FG_Walker_02", (3.3, -57.2, fg_deck_z), -1.42, "WALKING", "human_ivory", 0.96),
        ("FG_Walker_03", (-15.5, -57.5, fg_deck_z), 1.52, "WALKING", "human_amber", 1.00),
        ("FG_Walker_04", (-16.6, -57.9, fg_deck_z), 1.55, "WALKING", "human_sci", 0.98),
        # Group 5: East rail observers & pavilion visitors
        ("FG_EastObs_01", (10.5, -56.1, fg_deck_z), -0.10, "OBSERVING", "human_sci", 1.00),
        ("FG_EastObs_02", (11.6, -56.2, fg_deck_z), 0.22, "CONVERSING", "human_ivory", 0.97),
        ("FG_EastObs_03", (14.2, -56.1, fg_deck_z), -0.05, "OBSERVING", "human_navy", 1.03),
        ("FG_EastSeat_01", (11.6, -59.7, fg_deck_z), 0.0, "SEATED", "human_sci", 0.99),
        # Group 6: West promenade overlooking port approach
        ("FG_WestObs_01", (-20.5, -56.1, fg_deck_z), 0.35, "OBSERVING", "human_amber", 1.01),
        ("FG_WestObs_02", (-19.4, -56.2, fg_deck_z), 0.18, "OBSERVING", "human_navy", 0.98),
        ("FG_WestObs_03", (-22.8, -58.5, fg_deck_z), -0.60, "CONVERSING", "human_ivory", 1.00),
    ]

    for name, loc, rot_z, pose, mat_key, h_scale in fg_people_specs:
        bm_h = build_human_bm(pose=pose, height_scale=h_scale)
        create_mesh_obj(name, bm_h, col_humans, mats[mat_key], loc=loc, rot=(0.0, 0.0, rot_z))

    # Skybridge Pedestrians (walking along the 3 sloped skybridges x = -26, 0, +26)
    # Bridge deck top is at sz_top = (22.0 - t * 18.0) + 0.40 where sy = -54.0 + t * 42.0
    skybridge_walkers = [
        ("Bridge_Center_01", 0.0, -0.6, 0.18, 0.0, "human_navy"),
        ("Bridge_Center_02", 0.0, 0.5, 0.21, 0.05, "human_ivory"),
        ("Bridge_Center_03", 0.0, -1.2, 0.45, 3.14, "human_sci"),
        ("Bridge_Center_04", 0.0, -0.2, 0.47, 3.10, "human_navy"),
        ("Bridge_West_01", -26.0, -0.4, 0.25, 0.0, "human_amber"),
        ("Bridge_West_02", -26.0, 0.5, 0.28, 0.0, "human_navy"),
        ("Bridge_East_01", 26.0, 0.3, 0.32, 3.14, "human_sci"),
        ("Bridge_East_02", 26.0, -0.5, 0.35, 3.14, "human_ivory"),
    ]
    for name, bx, x_off, t_val, rz, mat_key in skybridge_walkers:
        sy = -54.0 + t_val * 42.0
        sz = (22.0 - t_val * 18.0) + 0.40
        bm_h = build_human_bm(pose="WALKING", height_scale=1.0)
        create_mesh_obj(name, bm_h, col_humans, mats[mat_key], loc=(bx + x_off, sy, sz), rot=(0.0, 0.0, rz))

    # Midground Civic Plaza, Biophilic Dome Courtyards & Research Terrace Figures
    # Tier 0 deck top surface is at z_base + thick*0.5 = -2.5 + 2.5 = 0.0m (r = 258..266m)
    # Tier 1 deck top surface is at z_base + thick*0.5 = 1.5 + 3.25 = 4.75m (r = 224..230m)
    rng = random.Random(303)
    mg_clusters = [
        # Central Civic Plaza in front of Grand Rotunda & Central Biodome
        (-2.5, 262.0, 0.0, 6),
        (2.5, 262.0, 0.0, 6),
        (-8.5, 258.0, 0.0, 5),
        (8.5, 258.0, 0.0, 5),
        # Residential & Recreation Promenade Terraces
        (-18.0, 260.0, 0.0, 5),
        (-24.0, 228.0, 4.75, 5),
        # Research Sector Courtyards
        (16.0, 260.0, 0.0, 5),
        (22.0, 228.0, 4.75, 5),
    ]
    for c_idx, (ang_c, rad_c, z_deck, count) in enumerate(mg_clusters):
        bm_crowd = bmesh.new()
        p_center, rz_c = arc_pos(ang_c, rad_c, z_deck)
        for p_i in range(count):
            dx = rng.uniform(-3.8, 3.8)
            dy = rng.uniform(-2.5, 2.5)
            pose_c = "WALKING" if p_i % 2 == 0 else "CONVERSING"
            bm_single = build_human_bm(pose=pose_c, height_scale=rng.uniform(0.96, 1.04))
            yaw = rng.uniform(0, math.tau)
            eul = Euler((0, 0, yaw), 'XYZ')
            for v in bm_single.verts:
                co = v.co.copy()
                co.rotate(eul)
                v.co = co + Vector((dx, dy, 0.0))
            # Merge into cluster bmesh
            mesh_tmp = bpy.data.meshes.new("tmp_h")
            bm_single.to_mesh(mesh_tmp)
            bm_single.free()
            bm_crowd.from_mesh(mesh_tmp)
            bpy.data.meshes.remove(mesh_tmp)
        mat_c = mats["human_navy"] if c_idx % 2 == 0 else mats["human_sci"]
        create_mesh_obj(f"MG_Plaza_CrowdCluster_{c_idx:02d}", bm_crowd, col_humans, mat_c, loc=p_center, rot=(0, 0, rz_c))

    # =========================================================================
    # 3. SPACECRAFT & ORBITAL TRAFFIC (4 Distinct Vehicle Classes + Approach Beacons)
    # =========================================================================
    # A. Passenger / Crew Orbital Shuttles
    # 1. Arriving Shuttle on final approach to Pier 2 of DISTRICT_PORT
    bm_sh1 = build_passenger_shuttle_bm()
    create_mesh_obj(
        "SC_PassengerShuttle_Arriving_01",
        bm_sh1,
        col_spacecraft,
        mats["sc_hull"],
        loc=(-158.0, 38.0, 18.0),
        rot=(math.radians(-4), math.radians(6), math.radians(28)),
    )
    # Subtle cyan RCS/approach beacon on arriving shuttle
    bm_sh1_glow = bmesh.new()
    bmesh_add_cyl(bm_sh1_glow, (0, -11.3, 0.1), 0.55, 0.35, 0.4, segments=12, rot_euler=(math.radians(-90), 0, 0))
    bmesh_add_box(bm_sh1_glow, (0, 4.2, 1.85), (1.8, 3.2, 0.35))  # Illuminated cockpit/cabin strip
    create_mesh_obj(
        "SC_PassengerShuttle_Arriving_01_Lights",
        bm_sh1_glow,
        col_spacecraft,
        mats["sc_thruster"],
        loc=(-158.0, 38.0, 18.0),
        rot=(math.radians(-4), math.radians(6), math.radians(28)),
    )

    # 2. Second Passenger Shuttle on midfield glidepath (visible from Main Hero camera)
    bm_sh2 = build_passenger_shuttle_bm()
    create_mesh_obj(
        "SC_PassengerShuttle_Glidepath_02",
        bm_sh2,
        col_spacecraft,
        mats["sc_hull"],
        loc=(-88.0, -8.0, 36.0),
        rot=(math.radians(-6), math.radians(-8), math.radians(48)),
    )
    bm_sh2_glow = bmesh.new()
    bmesh_add_cyl(bm_sh2_glow, (0, -11.3, 0.1), 0.55, 0.35, 0.4, segments=12, rot_euler=(math.radians(-90), 0, 0))
    bmesh_add_box(bm_sh2_glow, (0, 4.2, 1.85), (1.8, 3.2, 0.35))
    create_mesh_obj(
        "SC_PassengerShuttle_Glidepath_02_Lights",
        bm_sh2_glow,
        col_spacecraft,
        mats["sc_thruster"],
        loc=(-88.0, -8.0, 36.0),
        rot=(math.radians(-6), math.radians(-8), math.radians(48)),
    )

    # B. Heavy Modular Cargo Transfer Freighters
    # 1. Cargo Freighter berthed at Pier 4 of DISTRICT_PORT
    bm_cf1 = build_cargo_freighter_bm()
    create_mesh_obj(
        "SC_CargoFreighter_Berthed_01",
        bm_cf1,
        col_spacecraft,
        mats["sc_cargo"],
        loc=(-224.0, 62.0, 8.0),
        rot=(0.0, 0.0, 0.22),
    )
    # 2. Cargo Freighter on outbound departure trajectory toward Earth orbit
    bm_cf2 = build_cargo_freighter_bm()
    create_mesh_obj(
        "SC_CargoFreighter_Departing_02",
        bm_cf2,
        col_spacecraft,
        mats["sc_cargo"],
        loc=(-212.0, 14.0, 34.0),
        rot=(math.radians(8), math.radians(-10), math.radians(145)),
    )
    # 3. Distant Cargo Convoy Vessel above eastern industrial/port lane
    bm_cf3 = build_cargo_freighter_bm()
    create_mesh_obj(
        "SC_CargoFreighter_Distant_03",
        bm_cf3,
        col_spacecraft,
        mats["sc_cargo"],
        loc=(-132.0, 45.0, 64.0),
        rot=(math.radians(4), math.radians(5), math.radians(-35)),
    )

    # C. Orbital Utility & Servicing Tugs
    for t_idx, (t_loc, t_rot) in enumerate([
        ((-192.0, 86.0, 19.0), (0.0, 0.0, -0.45)),
        ((118.0, 62.0, 26.0), (0.05, -0.05, 2.35)),
    ]):
        bm_tug = build_utility_tug_bm()
        create_mesh_obj(f"SC_UtilityTug_{t_idx + 1:02d}", bm_tug, col_spacecraft, mats["sc_hull"], loc=t_loc, rot=t_rot)

    # D. Autonomous Maintenance & Inspection Craft near Construction Zone, Keel & Solar Arrays
    drone_placements = [
        ((152.0, 118.0, 42.0), (0.0, 0.0, -0.8)),   # Near Construction Zone cranes
        ((166.0, 142.0, 32.0), (0.0, 0.0, -1.2)),   # Near Construction Zone spaceframe
        ((-42.0, 12.0, -6.0), (0.0, 0.0, 0.3)),     # Inspecting underhull keel truss
        ((58.0, 148.0, 74.0), (0.0, 0.0, 1.8)),     # Servicing dorsal solar wing
    ]
    for d_idx, (d_loc, d_rot) in enumerate(drone_placements):
        bm_dr = build_maint_drone_bm()
        create_mesh_obj(f"SC_MaintDrone_{d_idx + 1:02d}", bm_dr, col_spacecraft, mats["sc_beacon_amber"], loc=d_loc, rot=d_rot)

    # E. Port Approach Corridor Alignment Beacons (guiding arriving spacecraft into Pier 2)
    bm_beacons = bmesh.new()
    for b_i in range(4):
        bx = -178.0 + b_i * 11.0
        by = 68.0 - b_i * 16.0
        bz = 11.0 + b_i * 3.5
        # Sleek open octagonal guidance gate frame
        bmesh_add_box(bm_beacons, (bx - 5.5, by, bz), (0.4, 0.4, 5.5))
        bmesh_add_box(bm_beacons, (bx + 5.5, by, bz), (0.4, 0.4, 5.5))
    create_mesh_obj("Port_Approach_Guidance_Beacons", bm_beacons, col_port, mats["sc_thruster"])

    # =========================================================================
    # 4. ELEVATED MAG-LEV COMMUTER TRAINS ON VIADUCT RINGS
    # =========================================================================
    bm_trains = bmesh.new()
    bm_train_lights = bmesh.new()
    train_specs = [
        (238.0, 6.9, -22.0),
        (238.0, 6.9, 14.0),
        (200.0, 13.4, -8.0),
        (200.0, 13.4, 26.0),
    ]
    for r_tr, z_tr, ang_start in train_specs:
        # 3 articulated 8.5m cars per train
        for car_i in range(3):
            c_ang = ang_start + (car_i - 1) * 2.2
            pos, rz = arc_pos(c_ang, r_tr, z_tr)
            bmesh_add_box(bm_trains, pos, (8.2, 2.6, 2.2), rot_euler=(0, 0, rz))
            bmesh_add_box(bm_train_lights, (pos[0], pos[1], pos[2] + 0.15), (7.6, 2.72, 0.65), rot_euler=(0, 0, rz))
    create_mesh_obj("Core_MagLev_Trains", bm_trains, col_core, mats["civic_white"])
    create_mesh_obj("Core_MagLev_Train_Windows", bm_train_lights, col_core, mats["sc_thruster"])

    # =========================================================================
    # 5. CAMERA FRAMING REFINEMENTS (Full Spire Headroom, Port Visibility & Unobstructed Human Scale)
    # =========================================================================
    def update_cam(name, loc, target_pt, lens):
        if name in bpy.data.objects:
            cam = bpy.data.objects[name]
        else:
            bpy.ops.object.camera_add(location=loc)
            cam = bpy.context.active_object
            cam.name = name
            bpy.data.collections["CAMERAS"].objects.link(cam)
        cam.location = loc
        cam.data.lens = lens
        cam.data.clip_start = 0.3
        cam.data.clip_end = 6000.0
        direction = Vector(target_pt) - Vector(loc)
        cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
        return cam

    cam_main = update_cam("CAM_MAIN_HERO", (-14.0, -82.0, 28.5), (-14.0, 105.0, 38.0), lens=18.0)
    update_cam("CAM_MOBILE_HERO", (-8.0, -84.0, 30.0), (-4.0, 105.0, 38.0), lens=17.5)
    update_cam("CAM_DIAG_01_ESTABLISHING", (0.0, -175.0, 86.0), (0.0, 110.0, 22.0), lens=19.0)
    update_cam("CAM_DIAG_02_PORT", (-255.0, -25.0, 44.0), (-175.0, 82.0, 12.0), lens=24.0)
    update_cam("CAM_DIAG_03_RESIDENTIAL_CIVIC", (-95.0, -35.0, 40.0), (-8.0, 92.0, 32.0), lens=24.0)
    update_cam("CAM_DIAG_04_MASTERPLAN", (0.0, -215.0, 235.0), (0.0, 95.0, 0.0), lens=20.5)
    update_cam("CAM_DIAG_05_HUMAN_SCALE", (-9.2, -60.2, 24.85), (-2.0, 98.0, 34.0), lens=24.0)

    bpy.context.scene.camera = cam_main
    bpy.ops.wm.save_as_mainfile(filepath="/home/pandeyaryan28/Documents/revatya/revatya_orbital_city.blend")
    print("Iteration 3 complete. Total objects:", len(bpy.data.objects))

build_iter3()
