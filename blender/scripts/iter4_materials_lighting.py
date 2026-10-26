import bpy
import bmesh
import math
import os
from mathutils import Vector, Euler

TEX_DIR = "/home/pandeyaryan28/Documents/revatya/blender/textures"

def load_image(filename, colorspace="sRGB"):
    path = os.path.join(TEX_DIR, filename)
    for img in bpy.data.images:
        if img.filepath == path or img.name == filename:
            img.reload()
            return img
    img = bpy.data.images.load(path)
    img.name = filename
    if hasattr(img, "colorspace_settings"):
        img.colorspace_settings.name = colorspace
    return img

def assign_architectural_box_uvs(obj, tile_w=26.0, tile_h=52.0):
    """
    Assigns box-projected UVs to a mesh:
    - Vertical / sloped facade faces (|normal.z| <= 0.72) map horizontally by (x or y)/tile_w and vertically by z/tile_h
      (without modulo wrapping per-vertex so GPU REPEAT wraps seamlessly) and use material_index = 0.
    - Horizontal roof / ledge faces (|normal.z| > 0.72) use material_index = 1 (solid architectural roof material)
      so roofs never show stretched window grids.
    """
    mesh = obj.data
    if not isinstance(mesh, bpy.types.Mesh):
        return
    if not mesh.uv_layers:
        mesh.uv_layers.new(name="UVMap")
    uv_layer = mesh.uv_layers.active.data

    roof_mat = bpy.data.materials.get("Arch_Civic_Alabaster")
    if roof_mat and len(mesh.materials) == 1:
        mesh.materials.append(roof_mat)

    verts = mesh.vertices
    for poly in mesh.polygons:
        nz = abs(poly.normal.z)
        nx = abs(poly.normal.x)
        ny = abs(poly.normal.y)
        if nz > 0.72:
            if len(mesh.materials) > 1:
                poly.material_index = 1
            for loop_idx in poly.loop_indices:
                v_co = verts[mesh.loops[loop_idx].vertex_index].co
                uv_layer[loop_idx].uv = (v_co.x * 0.02, v_co.y * 0.02)
        else:
            poly.material_index = 0
            for loop_idx in poly.loop_indices:
                v_co = verts[mesh.loops[loop_idx].vertex_index].co
                horiz = v_co.y if nx > ny else v_co.x
                u = (horiz / tile_w) + 0.5
                v = v_co.z / tile_h
                uv_layer[loop_idx].uv = (u, v)

def assign_planar_uvs(obj, scale_x=0.05, scale_z=0.05):
    mesh = obj.data
    if not isinstance(mesh, bpy.types.Mesh):
        return
    if not mesh.uv_layers:
        mesh.uv_layers.new(name="UVMap")
    uv_layer = mesh.uv_layers.active.data
    verts = mesh.vertices
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            v_co = verts[mesh.loops[loop_idx].vertex_index].co
            uv_layer[loop_idx].uv = (v_co.x * scale_x, v_co.z * scale_z)

def make_textured_facade_mat(name, albedo_file, emissive_file, roughness=0.35, metallic=0.20, emission_strength=1.65):
    if name in bpy.data.materials:
        mat = bpy.data.materials[name]
    else:
        mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()

    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic

    tex_alb = nt.nodes.new("ShaderNodeTexImage")
    tex_alb.image = load_image(albedo_file, "sRGB")

    tex_emi = nt.nodes.new("ShaderNodeTexImage")
    tex_emi.image = load_image(emissive_file, "sRGB")

    nt.links.new(tex_alb.outputs["Color"], bsdf.inputs["Base Color"])
    if "Emission Color" in bsdf.inputs:
        nt.links.new(tex_emi.outputs["Color"], bsdf.inputs["Emission Color"])
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat

def make_textured_pbr_mat(name, albedo_file, roughness=0.35, metallic=0.45, tint=(1.0, 1.0, 1.0)):
    if name in bpy.data.materials:
        mat = bpy.data.materials[name]
    else:
        mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()

    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic

    tex_alb = nt.nodes.new("ShaderNodeTexImage")
    tex_alb.image = load_image(albedo_file, "sRGB")

    if tint != (1.0, 1.0, 1.0):
        mix = nt.nodes.new("ShaderNodeMix")
        mix.data_type = 'RGBA'
        mix.blend_type = 'MULTIPLY'
        mix.inputs["Factor"].default_value = 1.0
        mix.inputs["B"].default_value = (*tint, 1.0)
        nt.links.new(tex_alb.outputs["Color"], mix.inputs["A"])
        nt.links.new(mix.outputs["Result"], bsdf.inputs["Base Color"])
    else:
        nt.links.new(tex_alb.outputs["Color"], bsdf.inputs["Base Color"])

    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat

def make_earth_textured_mat(name, earth_file):
    """
    Planet Earth shader combining the 2048x1024 continent/ocean/cloud texture with a
    Layer Weight cyan Rayleigh atmospheric limb glow, driven via Emission so city geometry
    never casts tabletop shadows onto the planet below.
    """
    if name in bpy.data.materials:
        mat = bpy.data.materials[name]
    else:
        mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()

    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Roughness"].default_value = 0.85
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = 0.0

    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = load_image(earth_file, "sRGB")

    lw = nt.nodes.new("ShaderNodeLayerWeight")
    lw.inputs["Blend"].default_value = 0.28

    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = 'RGBA'
    mix.inputs["B"].default_value = (0.32, 0.78, 1.0, 1.0)  # Cyan Rayleigh horizon limb
    nt.links.new(lw.outputs["Facing"], mix.inputs["Factor"])
    nt.links.new(tex.outputs["Color"], mix.inputs["A"])

    nt.links.new(mix.outputs["Result"], bsdf.inputs["Base Color"])
    if "Emission Color" in bsdf.inputs:
        nt.links.new(mix.outputs["Result"], bsdf.inputs["Emission Color"])
        bsdf.inputs["Emission Strength"].default_value = 1.18

    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat

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

def replace_mesh_data(obj_name, bm, smooth=False):
    obj = bpy.data.objects[obj_name]
    mesh = obj.data
    mesh.clear_geometry()
    bm.to_mesh(mesh)
    bm.free()
    if smooth:
        for p in mesh.polygons:
            p.use_smooth = True
    return obj

def rebuild_sleek_shuttle_bm(scale=0.68):
    """
    Correctly tapered orbital passenger shuttle (+Y is nose forward).
    With rot_euler=(-90 deg, 0, 0), local -Z maps to -Y (aft) and +Z maps to +Y (forward).
    So radius1 is AFT radius and radius2 is FORWARD radius!
    """
    bm = bmesh.new()
    s = scale
    # Main fuselage: aft radius 2.1, forward radius 2.0
    bmesh_add_cyl(bm, (0, 0.0, 0.0), 2.1 * s, 2.0 * s, 13.5 * s, segments=24, rot_euler=(math.radians(-90), 0, 0))
    # Forward tapered nose cone (y = +8.8*s): aft radius 2.0*s, forward tip radius 1.05*s
    bmesh_add_cyl(bm, (0, 8.8 * s, -0.1 * s), 2.0 * s, 1.05 * s, 4.2 * s, segments=24, rot_euler=(math.radians(-90), 0, 0))
    # Forward International Docking Adapter ring (y = +11.3*s)
    bmesh_add_cyl(bm, (0, 11.3 * s, -0.1 * s), 1.05 * s, 0.98 * s, 0.8 * s, segments=24, rot_euler=(math.radians(-90), 0, 0))
    # Aft fuselage taper (y = -8.2*s): aft radius 1.35*s, forward radius 2.1*s (joins seamlessly!)
    bmesh_add_cyl(bm, (0, -8.2 * s, 0.05 * s), 1.35 * s, 2.1 * s, 3.0 * s, segments=24, rot_euler=(math.radians(-90), 0, 0))
    # Dual aft orbital maneuvering thruster bells (narrow at front, flared nozzle at back)
    for tx in [-0.68 * s, 0.68 * s]:
        bmesh_add_cyl(bm, (tx, -10.3 * s, 0.05 * s), 0.58 * s, 0.35 * s, 1.2 * s, segments=16, rot_euler=(math.radians(-90), 0, 0))
    # Swept delta wings & canted twin vertical stabilizers
    for side in [-1, 1]:
        bmesh_add_box(bm, (side * 4.0 * s, -1.2 * s, -0.3 * s), (5.6 * s, 7.2 * s, 0.32 * s), rot_euler=(0, side * math.radians(-3), side * math.radians(-22)))
        bmesh_add_box(bm, (side * 6.4 * s, -3.8 * s, 1.0 * s), (0.24 * s, 3.4 * s, 2.6 * s), rot_euler=(0, side * math.radians(16), 0))
    # Dorsal cabin spine & cockpit canopy
    bmesh_add_box(bm, (0, 3.2 * s, 1.55 * s), (2.1 * s, 6.8 * s, 0.85 * s), rot_euler=(math.radians(-6), 0, 0))
    return bm

def rebuild_sleek_freighter_bm(scale=0.72):
    """Correctly tapered heavy modular cargo transfer freighter (+Y is forward)."""
    bm = bmesh.new()
    s = scale
    # Axial structural spine
    bmesh_add_box(bm, (0, 0.0, 0.0), (2.6 * s, 34.0 * s, 2.6 * s))
    for ry in range(-15, 18, 5):
        bmesh_add_box(bm, (0, ry * s, 0.0), (3.6 * s, 0.65 * s, 3.6 * s))
    # 6 Modular Cargo Container Pods
    for cy in [-9.0, -1.5, 6.0]:
        for side in [-1, 1]:
            bmesh_add_box(bm, (side * 3.4 * s, cy * s, 0.0), (3.6 * s, 5.6 * s, 3.6 * s))
            bmesh_add_cyl(bm, (side * 3.4 * s, cy * s, 2.0 * s), 1.3 * s, 1.3 * s, 0.7 * s, segments=12)
    # Forward Pressurized Command Module (aft radius 2.6*s, forward radius 2.0*s)
    bmesh_add_cyl(bm, (0, 17.5 * s, 0.5 * s), 2.6 * s, 2.0 * s, 4.4 * s, segments=20, rot_euler=(math.radians(-90), 0, 0))
    bmesh_add_cyl(bm, (0, 20.2 * s, 0.5 * s), 1.85 * s, 1.75 * s, 1.2 * s, segments=24, rot_euler=(math.radians(-90), 0, 0))
    # Aft Propulsion Drive Unit (aft radius 2.4*s, forward radius 3.2*s)
    bmesh_add_cyl(bm, (0, -18.5 * s, 0.0), 2.4 * s, 3.2 * s, 4.8 * s, segments=20, rot_euler=(math.radians(-90), 0, 0))
    for side in [-1, 1]:
        bmesh_add_box(bm, (side * 7.2 * s, -16.5 * s, 0.0), (8.2 * s, 0.22 * s, 3.4 * s))
        bmesh_add_cyl(bm, (side * 1.4 * s, -21.6 * s, 0.0), 1.05 * s, 0.65 * s, 1.6 * s, segments=16, rot_euler=(math.radians(-90), 0, 0))
    return bm

def build_iter4():
    # =========================================================================
    # 1. REFINE FOREGROUND PROMENADE PAVILIONS & SPACECRAFT GEOMETRY
    # =========================================================================
    # Move West/East Observation Pavilions slightly outward (x_c = -41.5, +41.5) with open colonnades
    # so the left view toward DISTRICT_PORT in CAM_MAIN_HERO is completely unobstructed and unshadowed.
    bm_fg = bmesh.new()
    bmesh_add_box(bm_fg, (0, -68.0, 21.5), (96.0, 26.0, 2.4))
    bmesh_add_box(bm_fg, (0, -65.0, 22.9), (82.0, 18.0, 0.6))
    for px in [-24.0, -12.0, 0.0, 12.0, 24.0]:
        bmesh_add_box(bm_fg, (px, -60.5, 23.44), (5.2, 1.4, 0.48))
    for rx in range(-44, 46, 4):
        bmesh_add_box(bm_fg, (rx, -55.3, 23.75), (0.12, 0.16, 1.10))
    bmesh_add_box(bm_fg, (0, -55.3, 24.32), (88.0, 0.18, 0.08))
    for side, x_c in [(-1, -41.5), (1, 41.5)]:
        bmesh_add_box(bm_fg, (x_c, -71.5, 25.2), (12.0, 10.0, 4.4))
        bmesh_add_box(bm_fg, (x_c, -68.5, 27.6), (15.0, 14.5, 0.65))
        for col_x in [x_c - 5.5, x_c, x_c + 5.5]:
            bmesh_add_box(bm_fg, (col_x, -62.0, 25.2), (0.42, 0.42, 4.4))
    replace_mesh_data("Core_FG_Observation_Promenade", bm_fg)

    # Update spacecraft meshes & positions
    for sh_name, glow_name, loc, rot in [
        ("SC_PassengerShuttle_Arriving_01", "SC_PassengerShuttle_Arriving_01_Lights", (-156.0, 42.0, 17.5), (math.radians(-4), math.radians(5), math.radians(26))),
        ("SC_PassengerShuttle_Glidepath_02", "SC_PassengerShuttle_Glidepath_02_Lights", (-126.0, 18.0, 28.0), (math.radians(-5), math.radians(-6), math.radians(38))),
    ]:
        if sh_name in bpy.data.objects:
            obj_sh = replace_mesh_data(sh_name, rebuild_sleek_shuttle_bm(0.68), smooth=True)
            obj_sh.location = loc
            obj_sh.rotation_euler = rot
        if glow_name in bpy.data.objects:
            bm_g = bmesh.new()
            s = 0.68
            for tx in [-0.68 * s, 0.68 * s]:
                bmesh_add_cyl(bm_g, (tx, -10.95 * s, 0.05 * s), 0.50 * s, 0.35 * s, 0.25 * s, segments=12, rot_euler=(math.radians(-90), 0, 0))
            bmesh_add_box(bm_g, (0, 3.5 * s, 1.70 * s), (1.6 * s, 3.6 * s, 0.30 * s))
            obj_gl = replace_mesh_data(glow_name, bm_g)
            obj_gl.location = loc
            obj_gl.rotation_euler = rot

    for cf_name, loc, rot in [
        ("SC_CargoFreighter_Berthed_01", (-222.0, 60.0, 8.0), (0.0, 0.0, 0.22)),
        ("SC_CargoFreighter_Departing_02", (-238.0, 8.0, 26.0), (math.radians(6), math.radians(-8), math.radians(148))),
        ("SC_CargoFreighter_Distant_03", (-138.0, 42.0, 62.0), (math.radians(4), math.radians(5), math.radians(-35))),
    ]:
        if cf_name in bpy.data.objects:
            obj_cf = replace_mesh_data(cf_name, rebuild_sleek_freighter_bm(0.72))
            obj_cf.location = loc
            obj_cf.rotation_euler = rot

    # =========================================================================
    # 2. CREATE & ASSIGN HIGH-RES PBR + EMISSIVE TEXTURED MATERIALS
    # =========================================================================
    mat_res_warm = make_textured_facade_mat("Arch_Res_Satin", "tex_facade_albedo.png", "tex_facade_emissive.png", roughness=0.36, metallic=0.16, emission_strength=1.70)
    mat_res_slate = make_textured_facade_mat("Arch_Res_Slate", "tex_facade_slate_albedo.png", "tex_facade_slate_emissive.png", roughness=0.38, metallic=0.28, emission_strength=1.60)
    mat_sci_tower = make_textured_facade_mat("Arch_Sci_Titanium", "tex_facade_sci_albedo.png", "tex_facade_sci_emissive.png", roughness=0.25, metallic=0.45, emission_strength=1.65)
    mat_civic_tower = make_textured_facade_mat("Arch_Civic_Tower_Mat", "tex_facade_albedo.png", "tex_facade_emissive.png", roughness=0.28, metallic=0.22, emission_strength=1.80)

    mat_solar = make_textured_pbr_mat("Arch_Solar_Array", "tex_solar_cells.png", roughness=0.18, metallic=0.72)
    mat_ind = make_textured_pbr_mat("Arch_Ind_HeavySteel", "tex_hull_panels.png", roughness=0.46, metallic=0.58, tint=(0.82, 0.85, 0.90))
    mat_port = make_textured_pbr_mat("Arch_Port_Module", "tex_hull_panels.png", roughness=0.38, metallic=0.42, tint=(0.95, 0.97, 1.0))
    mat_earth = make_earth_textured_mat("Arch_Earth_Surface", "tex_earth_albedo_clouds.png")

    # Assign box UVs to all Civic, Residential, Research, Industrial, and Port structures
    for obj in bpy.data.objects:
        if obj.type != 'MESH':
            continue
        if obj.name.startswith("Civic_"):
            assign_architectural_box_uvs(obj, tile_w=28.0, tile_h=56.0)
            obj.data.materials.clear()
            obj.data.materials.append(mat_civic_tower)
        elif obj.name.startswith("Res_Building_"):
            assign_architectural_box_uvs(obj, tile_w=24.0, tile_h=48.0)
        elif obj.name.startswith("Sci_Facility_"):
            assign_architectural_box_uvs(obj, tile_w=22.0, tile_h=44.0)
        elif obj.name.startswith("Ind_ManufacturingComplex_"):
            assign_architectural_box_uvs(obj, tile_w=32.0, tile_h=32.0)
        elif obj.name.startswith("Port_"):
            assign_architectural_box_uvs(obj, tile_w=36.0, tile_h=36.0)
        elif obj.name.startswith("Util_SolarWings_"):
            assign_planar_uvs(obj, scale_x=0.08, scale_z=0.08)

    # Rotate Earth sphere so rich continents & cloud swirls are prominently visible in camera frame
    if "Earth_Surface_Sphere" in bpy.data.objects:
        earth_obj = bpy.data.objects["Earth_Surface_Sphere"]
        earth_obj.rotation_euler = (math.radians(62), math.radians(-18), math.radians(32))

    # Add translucent outer Atmospheric Rayleigh Halo Shell around Earth
    col_earth = bpy.data.collections["PLANET_EARTH"]
    if "Earth_Atmosphere_Halo" in bpy.data.objects:
        bpy.data.objects.remove(bpy.data.objects["Earth_Atmosphere_Halo"], do_unlink=True)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=48, radius=2822.0, location=(380.0, 2150.0, -2220.0))
    atmo_obj = bpy.context.active_object
    atmo_obj.name = "Earth_Atmosphere_Halo"
    for p in atmo_obj.data.polygons:
        p.use_smooth = True
    for c in list(atmo_obj.users_collection):
        c.objects.unlink(atmo_obj)
    col_earth.objects.link(atmo_obj)

    if "Arch_Earth_Atmo_Halo" in bpy.data.materials:
        mat_atmo = bpy.data.materials["Arch_Earth_Atmo_Halo"]
    else:
        mat_atmo = bpy.data.materials.new("Arch_Earth_Atmo_Halo")
    mat_atmo.use_nodes = True
    if hasattr(mat_atmo, "blend_method"):
        mat_atmo.blend_method = 'BLEND'
    nt_a = mat_atmo.node_tree
    nt_a.nodes.clear()
    out_a = nt_a.nodes.new("ShaderNodeOutputMaterial")
    bsdf_a = nt_a.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf_a.inputs["Base Color"].default_value = (0.30, 0.76, 1.0, 1.0)
    if "Emission Color" in bsdf_a.inputs:
        bsdf_a.inputs["Emission Color"].default_value = (0.28, 0.75, 1.0, 1.0)
        bsdf_a.inputs["Emission Strength"].default_value = 1.8
    lw_a = nt_a.nodes.new("ShaderNodeLayerWeight")
    lw_a.inputs["Blend"].default_value = 0.55
    ramp = nt_a.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.55
    ramp.color_ramp.elements[0].color = (0.0, 0.0, 0.0, 1.0)
    ramp.color_ramp.elements[1].position = 0.92
    ramp.color_ramp.elements[1].color = (0.38, 0.38, 0.38, 1.0)
    nt_a.links.new(lw_a.outputs["Facing"], ramp.inputs["Fac"])
    nt_a.links.new(ramp.outputs["Color"], bsdf_a.inputs["Alpha"])
    nt_a.links.new(bsdf_a.outputs["BSDF"], out_a.inputs["Surface"])
    atmo_obj.data.materials.append(mat_atmo)

    # =========================================================================
    # 3. DEEP SPACE WORLD SHADER WITH RESTRAINED PINPOINT STARFIELD & LIGHTING
    # =========================================================================
    world = bpy.context.scene.world
    world.use_nodes = True
    w_nt = world.node_tree
    w_nt.nodes.clear()
    w_out = w_nt.nodes.new("ShaderNodeOutputWorld")
    w_bg = w_nt.nodes.new("ShaderNodeBackground")
    w_bg.inputs["Strength"].default_value = 1.0

    # Procedural restrained pinpoint stars in World background
    tex_coord = w_nt.nodes.new("ShaderNodeTexCoord")
    vor = w_nt.nodes.new("ShaderNodeTexVoronoi")
    vor.voronoi_dimensions = '3D'
    vor.inputs["Scale"].default_value = 185.0
    s_ramp = w_nt.nodes.new("ShaderNodeValToRGB")
    s_ramp.color_ramp.elements[0].position = 0.0
    s_ramp.color_ramp.elements[0].color = (0.92, 0.95, 1.0, 1.0)
    s_ramp.color_ramp.elements[1].position = 0.032
    s_ramp.color_ramp.elements[1].color = (0.003, 0.006, 0.014, 1.0)

    w_nt.links.new(tex_coord.outputs["Generated"], vor.inputs["Vector"])
    w_nt.links.new(vor.outputs["Distance"], s_ramp.inputs["Fac"])
    w_nt.links.new(s_ramp.outputs["Color"], w_bg.inputs["Color"])
    w_nt.links.new(w_bg.outputs["Background"], w_out.inputs["Surface"])

    # Add Warm Architectural Plaza & Promenade Fill Lights in LIGHTING collection
    col_lights = bpy.data.collections["LIGHTING"]
    for obj in list(col_lights.objects):
        if obj.name.startswith("LIGHT_WARM_"):
            bpy.data.objects.remove(obj, do_unlink=True)

    warm_lights = [
        ("LIGHT_WARM_PROMENADE", (0.0, -60.0, 27.5), 450.0, (1.0, 0.84, 0.62), 25.0),
        ("LIGHT_WARM_CIVIC_ROTUNDA", (0.0, 72.0, 26.0), 3500.0, (1.0, 0.82, 0.58), 45.0),
        ("LIGHT_WARM_PORT_PIERS", (-195.0, 82.0, 24.0), 2500.0, (0.75, 0.90, 1.0), 40.0),
    ]
    for l_name, l_loc, energy, col_rgb, size in warm_lights:
        bpy.ops.object.light_add(type='POINT', location=l_loc)
        pt = bpy.context.active_object
        pt.name = l_name
        pt.data.energy = energy
        pt.data.color = col_rgb
        pt.data.shadow_soft_size = size
        pt.data.use_shadow = False
        for c in list(pt.users_collection):
            c.objects.unlink(pt)
        col_lights.objects.link(pt)

    for obj in col_lights.objects:
        if obj.type == 'LIGHT':
            obj.data.use_shadow = (obj.name == "SUN_PRIMARY_ORBITAL")

    bpy.ops.wm.save_as_mainfile(filepath="/home/pandeyaryan28/Documents/revatya/revatya_orbital_city.blend")
    print("Iteration 4 Materials, UVs, Earth & Lighting complete.")

build_iter4()
