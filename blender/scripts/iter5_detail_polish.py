import bpy
import bmesh
import math
from mathutils import Vector, Euler

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

def create_or_replace_mesh(name, bm, col_name, mat_name, smooth=False):
    col = bpy.data.collections[col_name]
    if name in bpy.data.objects:
        obj = bpy.data.objects[name]
        mesh = obj.data
        mesh.clear_geometry()
    else:
        mesh = bpy.data.meshes.new(f"{name}_Mesh")
        obj = bpy.data.objects.new(name, mesh)
        col.objects.link(obj)
    bm.to_mesh(mesh)
    bm.free()
    if smooth:
        for p in mesh.polygons:
            p.use_smooth = True
    if mat_name and mat_name in bpy.data.materials:
        mat = bpy.data.materials[mat_name]
        mesh.materials.clear()
        mesh.materials.append(mat)
    return obj

def fix_earth_tangent_cap_uvs():
    """
    Projects Earth_Surface_Sphere UVs onto the orthonormal tangent plane (T_u, T_v)
    of the visible planetary cap facing the orbital city and cameras:
    N_cap = (-0.12, -0.69, 0.71).normalized().
    This eliminates any radial horizon stretching or pole pinching across all 7 cameras.
    """
    if "Earth_Surface_Sphere" not in bpy.data.objects:
        return
    earth_obj = bpy.data.objects["Earth_Surface_Sphere"]
    earth_obj.rotation_euler = (0.0, 0.0, 0.0)
    mesh = earth_obj.data
    if not mesh.uv_layers:
        mesh.uv_layers.new(name="UVMap")
    uv_layer = mesh.uv_layers.active.data

    n_cap = Vector((-0.12, -0.69, 0.71)).normalized()
    up_ref = Vector((0.0, 0.0, 1.0))
    t_u = up_ref.cross(n_cap).normalized()
    t_v = n_cap.cross(t_u).normalized()

    verts = mesh.vertices
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            v_norm = verts[mesh.loops[loop_idx].vertex_index].co.normalized()
            u = 0.48 + v_norm.dot(t_u) * 0.62
            v = 0.52 + v_norm.dot(t_v) * 0.78
            uv_layer[loop_idx].uv = (u, v)

def add_secondary_architectural_details():
    # 1. Foreground Observation Promenade Architectural Light Bollards
    bm_bol = bmesh.new()
    bm_bol_glow = bmesh.new()
    bollard_coords = []
    for bx in [-36.0, -24.0, -12.0, 0.0, 12.0, 24.0, 36.0]:
        bollard_coords.append((bx, -56.2, 23.20))
    for bx in [-30.0, -18.0, -6.0, 6.0, 18.0, 30.0]:
        bollard_coords.append((bx, -63.5, 23.20))

    for bx, by, bz in bollard_coords:
        # Brushed metal bollard post + cap (0.96m tall)
        bmesh_add_cyl(bm_bol, (bx, by, bz + 0.36), 0.11, 0.10, 0.72, segments=12)
        bmesh_add_cyl(bm_bol, (bx, by, bz + 0.92), 0.13, 0.11, 0.08, segments=12)
        # Warm glowing lantern ring at z + 0.80m
        bmesh_add_cyl(bm_bol_glow, (bx, by, bz + 0.80), 0.095, 0.095, 0.16, segments=12)

    create_or_replace_mesh("Core_FG_Light_Bollards", bm_bol, "CITY_CORE", "Arch_Dark_Steel", smooth=True)
    create_or_replace_mesh("Core_FG_Light_Bollards_Glow", bm_bol_glow, "CITY_CORE", "Arch_Emissive_WarmGold", smooth=False)

    # 2. Civic Spire, Senate & Port Control Rooftop Telemetry Masts & Navigation Beacons
    bm_masts = bmesh.new()
    bm_beacons = bmesh.new()

    # Civic Spire crown array (0, 148, 114..128)
    bmesh_add_cyl(bm_masts, (0.0, 148.0, 118.0), 0.35, 0.12, 12.0, segments=12)
    for ring_z in [115.0, 118.5, 122.0]:
        bmesh_add_cyl(bm_masts, (0.0, 148.0, ring_z), 1.4, 1.4, 0.18, segments=16)
    bmesh_add_box(bm_beacons, (0.0, 148.0, 124.5), (0.55, 0.55, 0.55))

    # Flanking Civic Towers rooftop masts
    for tx, ty, tz in [(-46.0, 115.0, 62.5), (46.0, 115.0, 62.5), (-76.0, 78.0, 44.5), (76.0, 78.0, 44.5)]:
        bmesh_add_cyl(bm_masts, (tx, ty, tz + 3.5), 0.22, 0.08, 7.0, segments=10)
        bmesh_add_cyl(bm_masts, (tx, ty, tz + 2.2), 1.1, 0.2, 0.6, segments=12, rot_euler=(math.radians(35), 0, 0))
        bmesh_add_box(bm_beacons, (tx, ty, tz + 7.2), (0.42, 0.42, 0.42))

    # Port Control Tower & Research Lab rooftop sensor dishes
    for tx, ty, tz in [(-195.0, 68.0, 50.0), (146.0, 62.0, 55.0), (168.0, 108.0, 62.0)]:
        bmesh_add_cyl(bm_masts, (tx, ty, tz + 3.0), 0.25, 0.10, 6.0, segments=10)
        bmesh_add_box(bm_beacons, (tx, ty, tz + 6.2), (0.48, 0.48, 0.48))

    create_or_replace_mesh("Civic_Roof_Telemetry_Arrays", bm_masts, "DISTRICT_CIVIC", "Arch_Hull_Titanium", smooth=True)
    create_or_replace_mesh("Civic_Roof_Navigation_Beacons", bm_beacons, "DISTRICT_CIVIC", "Arch_Emissive_Amber", smooth=False)

    # 3. Port Logistics Pier Container Stacks & Handling Gantries
    bm_pods = bmesh.new()
    for row_y in [48.0, 56.0, 64.0, 72.0]:
        for col_x in [-192.0, -184.0]:
            bmesh_add_box(bm_pods, (col_x, row_y, 7.2), (3.2, 5.2, 2.4))
            bmesh_add_box(bm_pods, (col_x, row_y, 9.8), (3.2, 5.2, 2.4))
    create_or_replace_mesh("Port_Logistics_Container_Stacks", bm_pods, "DISTRICT_PORT", "Arch_Ind_Copper", smooth=False)

def animate_orbital_traffic():
    """
    Sets deterministic linear keyframe animations across frames 1-240 (10s @ 24fps)
    for arriving passenger shuttles, departing cargo freighter, and maintenance drones.
    Frame 1 is preserved as the exact hero still composition.
    """
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 240
    scene.render.fps = 24

    tracks = [
        ("SC_PassengerShuttle_Arriving_01", (-156.0, 42.0, 17.5), (-174.0, 60.0, 13.0)),
        ("SC_PassengerShuttle_Arriving_01_Lights", (-156.0, 42.0, 17.5), (-174.0, 60.0, 13.0)),
        ("SC_PassengerShuttle_Glidepath_02", (-126.0, 18.0, 28.0), (-150.0, 38.0, 19.5)),
        ("SC_PassengerShuttle_Glidepath_02_Lights", (-126.0, 18.0, 28.0), (-150.0, 38.0, 19.5)),
        ("SC_CargoFreighter_Departing_02", (-238.0, 8.0, 26.0), (-262.0, -24.0, 33.0)),
        ("SC_MaintDrone_01", (-172.0, 18.0, 28.0), (-178.0, 32.0, 25.0)),
        ("SC_MaintDrone_02", (-188.0, 118.0, 34.0), (-196.0, 104.0, 31.0)),
    ]

    for obj_name, start_loc, end_loc in tracks:
        if obj_name not in bpy.data.objects:
            continue
        obj = bpy.data.objects[obj_name]
        obj.animation_data_clear()
        scene.frame_set(1)
        obj.location = start_loc
        obj.keyframe_insert(data_path="location", frame=1)
        scene.frame_set(240)
        obj.location = end_loc
        obj.keyframe_insert(data_path="location", frame=240)

        if obj.animation_data and obj.animation_data.action:
            act = obj.animation_data.action
            if hasattr(act, "fcurves"):
                for fc in act.fcurves:
                    for kp in fc.keyframe_points:
                        kp.interpolation = 'LINEAR'

    scene.frame_set(1)

def build_iter5():
    fix_earth_tangent_cap_uvs()
    add_secondary_architectural_details()
    animate_orbital_traffic()
    bpy.ops.wm.save_as_mainfile(filepath="/home/pandeyaryan28/Documents/revatya/revatya_orbital_city.blend")
    print("Iteration 5 Detail, Polish, Earth Tangent-Cap UVs & Keyframe Animation complete.")

build_iter5()
