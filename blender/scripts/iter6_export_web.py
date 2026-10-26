import bpy
import os
import shutil

EXPORT_DIR = "/home/pandeyaryan28/Documents/revatya/blender/exports"
os.makedirs(EXPORT_DIR, exist_ok=True)

def build_iter6_web_export():
    scene = bpy.context.scene
    scene.frame_set(1)
    scene.camera = bpy.data.objects["CAM_MAIN_HERO"]

    # 1. Populate WEB_EXPORT collection with all web-ready meshes and cameras
    #    (while keeping objects linked in their primary semantic collections)
    web_col = bpy.data.collections.get("WEB_EXPORT")
    if not web_col:
        web_col = bpy.data.collections.new("WEB_EXPORT")
        scene.collection.children.link(web_col)

    for obj in list(web_col.objects):
        web_col.objects.unlink(obj)

    total_verts = 0
    total_polys = 0
    total_tris = 0
    mesh_count = 0

    for obj in bpy.data.objects:
        if obj.type in {'MESH', 'CAMERA'}:
            if obj.name not in web_col.objects:
                web_col.objects.link(obj)
        if obj.type == 'MESH' and obj.data:
            mesh_count += 1
            m = obj.data
            total_verts += len(m.vertices)
            total_polys += len(m.polygons)
            for p in m.polygons:
                total_tris += max(1, len(p.vertices) - 2)

    # 2. Pack external PNG textures into the .blend file so it is 100% self-contained
    for img in bpy.data.images:
        if img.source == 'FILE' and not img.packed_file:
            try:
                img.pack()
            except Exception as e:
                print(f"Warning packing {img.name}: {e}")

    # 3. Export optimized GLB to /home/pandeyaryan28/Documents/revatya/blender/exports/revatya_orbital_city.glb
    glb_path = os.path.join(EXPORT_DIR, "revatya_orbital_city.glb")
    bpy.ops.export_scene.gltf(
        filepath=glb_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_texcoords=True,
        export_normals=True,
        export_materials='EXPORT',
        export_cameras=True,
        export_animations=True,
        export_yup=True,
    )

    # 4. Save final .blend files at both root and blender/ directory
    root_blend = "/home/pandeyaryan28/Documents/revatya/revatya_orbital_city.blend"
    sub_blend = "/home/pandeyaryan28/Documents/revatya/blender/revatya_orbital_city.blend"
    bpy.ops.wm.save_as_mainfile(filepath=root_blend)
    shutil.copy2(root_blend, sub_blend)

    glb_mb = os.path.getsize(glb_path) / (1024 * 1024)
    blend_mb = os.path.getsize(root_blend) / (1024 * 1024)

    print("=== REVATYA ORBITAL CITY — FINAL SCENE METRICS ===")
    print(f"Total Objects: {len(bpy.data.objects)} (Meshes: {mesh_count}, Cameras: {len(bpy.data.cameras)}, Lights: {len(bpy.data.lights)})")
    print(f"Total Vertices: {total_verts:,}")
    print(f"Total Polygons: {total_polys:,}")
    print(f"Total Triangles: {total_tris:,}")
    print(f"Total Materials: {len(bpy.data.materials)}")
    print(f"Exported GLB: {glb_path} ({glb_mb:.2f} MB)")
    print(f"Saved BLEND: {root_blend} ({blend_mb:.2f} MB)")

build_iter6_web_export()
