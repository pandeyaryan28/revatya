import os
import math
import zlib
import struct
import numpy as np

TEX_DIR = "/home/pandeyaryan28/Documents/revatya/blender/textures"
os.makedirs(TEX_DIR, exist_ok=True)

def save_png_rgba(filepath, arr_uint8):
    h, w, c = arr_uint8.shape
    assert c == 4
    raw_rows = np.hstack([np.zeros((h, 1), dtype=np.uint8), arr_uint8.reshape(h, w * 4)])
    compressed = zlib.compress(raw_rows.tobytes(), level=6)

    def chunk(tag, data):
        crc = zlib.crc32(tag + data) & 0xFFFFFFFF
        return struct.pack("!I", len(data)) + tag + data + struct.pack("!I", crc)

    ihdr = struct.pack("!IIBBBBB", w, h, 8, 6, 0, 0, 0)
    png_bytes = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", compressed)
        + chunk(b"IEND", b"")
    )
    with open(filepath, "wb") as f:
        f.write(png_bytes)
    print(f"Saved texture: {filepath} ({w}x{h})")

def smooth_grid_noise(w, h, gw, gh, rng):
    """Generates smooth bicubic/cosine-interpolated 2D noise from a (gh, gw) random grid (tileable in X)."""
    grid = rng.random((gh + 1, gw), dtype=np.float32)
    # Tile X seamlessly
    grid = np.hstack([grid, grid[:, :1]])

    ys = np.linspace(0, gh, h, endpoint=False)
    xs = np.linspace(0, gw, w, endpoint=False)
    yi = ys.astype(np.int32)
    xi = xs.astype(np.int32)
    yf = ys - yi
    xf = xs - xi
    # Smoothstep weights
    uy = (yf * yf * (3.0 - 2.0 * yf))[:, None]
    ux = (xf * xf * (3.0 - 2.0 * xf))[None, :]

    c00 = grid[yi[:, None], xi[None, :]]
    c10 = grid[yi[:, None], xi[None, :] + 1]
    c01 = grid[yi[:, None] + 1, xi[None, :]]
    c11 = grid[yi[:, None] + 1, xi[None, :] + 1]

    top = c00 * (1.0 - ux) + c10 * ux
    bot = c01 * (1.0 - ux) + c11 * ux
    return top * (1.0 - uy) + bot * uy

def fractal_fbm(w, h, base_gw=6, base_gh=3, octaves=8, persistence=0.54, seed=101):
    rng = np.random.default_rng(seed)
    total = np.zeros((h, w), dtype=np.float32)
    amp = 1.0
    norm = 0.0
    for oc in range(octaves):
        gw = min(w // 2, base_gw * (2 ** oc))
        gh = min(h // 2, base_gh * (2 ** oc))
        total += amp * smooth_grid_noise(w, h, gw, gh, rng)
        norm += amp
        amp *= persistence
    total /= norm
    mn, mx = total.min(), total.max()
    return (total - mn) / max(1e-6, (mx - mn))

def generate_earth_texture():
    """Generates a crisp 2048x1024 Earth orbital texture with 8-octave fractal coastlines, mountain chains, and cyclonic cloud bands."""
    w, h = 2048, 1024
    n_cont = fractal_fbm(w, h, base_gw=6, base_gh=3, octaves=8, persistence=0.55, seed=108)
    n_micro = fractal_fbm(w, h, base_gw=24, base_gh=12, octaves=6, persistence=0.58, seed=209)
    n_clouds = fractal_fbm(w, h, base_gw=8, base_gh=4, octaves=8, persistence=0.56, seed=311)
    n_warp = fractal_fbm(w, h, base_gw=6, base_gh=3, octaves=5, persistence=0.50, seed=419)

    yy = np.linspace(-1.0, 1.0, h)[:, None]
    lat_mask = 1.0 - 0.25 * (yy ** 2)
    elevation = (0.76 * n_cont + 0.24 * n_micro) * lat_mask

    img = np.zeros((h, w, 4), dtype=np.float32)
    img[:, :, 3] = 1.0

    sea_level = 0.50
    ocean_mask = elevation < sea_level
    shallow = np.clip(elevation / sea_level, 0.0, 1.0) ** 4.0

    # Deep orbital sapphire ocean with coastal turquoise reefs
    r_oc = 0.025 + 0.08 * shallow + 0.02 * n_micro
    g_oc = 0.125 + 0.28 * shallow + 0.04 * n_micro
    b_oc = 0.360 + 0.30 * shallow + 0.05 * n_micro

    # Continental landmasses: emerald forests, ochre deserts, rugged mountain chains
    land_h = np.clip((elevation - sea_level) / (1.0 - sea_level), 0.0, 1.0)
    arid = np.clip(n_warp * 1.4 - 0.35, 0.0, 1.0)
    ridge = 1.0 - np.abs(2.0 * n_micro - 1.0)  # Ridged mountain peaks

    r_land = 0.12 + 0.44 * arid + 0.22 * (land_h ** 1.3)
    g_land = 0.30 + 0.18 * arid + 0.14 * (land_h ** 1.5)
    b_land = 0.11 + 0.10 * arid + 0.16 * (land_h ** 1.6)

    # Alpine snow ridges on high mountains
    snow_mask = np.clip((land_h * 0.7 + ridge * 0.3 - 0.66) * 5.0, 0.0, 1.0)
    r_land = r_land * (1.0 - snow_mask) + 0.92 * snow_mask
    g_land = g_land * (1.0 - snow_mask) + 0.95 * snow_mask
    b_land = b_land * (1.0 - snow_mask) + 0.98 * snow_mask

    img[:, :, 0] = np.where(ocean_mask, r_oc, r_land)
    img[:, :, 1] = np.where(ocean_mask, g_oc, g_land)
    img[:, :, 2] = np.where(ocean_mask, b_oc, b_land)

    # Multi-scale orbital cloud filaments & trade-wind bands
    swirl_bands = 0.5 + 0.5 * np.sin(2.0 * math.pi * (yy * 3.5 + (n_warp - 0.5) * 1.6))
    cloud_density = 0.68 * n_clouds + 0.20 * n_micro + 0.12 * swirl_bands
    cloud_alpha = np.clip((cloud_density - 0.48) * 2.6, 0.0, 0.95) ** 1.3

    img[:, :, 0] = img[:, :, 0] * (1.0 - cloud_alpha) + 0.97 * cloud_alpha
    img[:, :, 1] = img[:, :, 1] * (1.0 - cloud_alpha) + 0.98 * cloud_alpha
    img[:, :, 2] = img[:, :, 2] * (1.0 - cloud_alpha) + 1.00 * cloud_alpha

    # Subtle Rayleigh atmospheric blue scattering veil
    img[:, :, 0] = np.clip(img[:, :, 0] * 0.92 + 0.04, 0.0, 1.0)
    img[:, :, 1] = np.clip(img[:, :, 1] * 0.94 + 0.08, 0.0, 1.0)
    img[:, :, 2] = np.clip(img[:, :, 2] * 0.96 + 0.14, 0.0, 1.0)

    save_png_rgba(os.path.join(TEX_DIR, "tex_earth_albedo_clouds.png"), (img * 255).astype(np.uint8))

def build_facade_pair(prefix, base_rgb, n_rows=32, n_cols=16, warm_prob=0.45, cool_prob=0.16, seed=707):
    w, h = 1024, 1024
    rng = np.random.default_rng(seed)
    row_h = h // n_rows
    col_w = w // n_cols

    albedo = np.zeros((h, w, 4), dtype=np.float32)
    emissive = np.zeros((h, w, 4), dtype=np.float32)
    albedo[:, :, 3] = 1.0
    emissive[:, :, 3] = 1.0
    albedo[:, :, 0] = base_rgb[0]
    albedo[:, :, 1] = base_rgb[1]
    albedo[:, :, 2] = base_rgb[2]

    for r in range(n_rows):
        y0 = r * row_h
        win_y0 = y0 + int(row_h * 0.25)
        win_y1 = y0 + int(row_h * 0.82)
        # Architectural floor ledge shadow line
        albedo[y0:y0 + 3, :, :3] = np.array(base_rgb) * 0.38

        for c in range(n_cols):
            x0 = c * col_w
            win_x0 = x0 + int(col_w * 0.14)
            win_x1 = x0 + int(col_w * 0.86)

            # Dark reflective window glass
            albedo[win_y0:win_y1, win_x0:win_x1, :3] = (0.14, 0.20, 0.28)

            roll = rng.random()
            if roll < warm_prob:
                val = rng.uniform(0.68, 1.0)
                emissive[win_y0:win_y1, win_x0:win_x1, :3] = (1.0 * val, 0.78 * val, 0.44 * val)
                albedo[win_y0:win_y1, win_x0:win_x1, :3] = (0.76 * val, 0.62 * val, 0.40 * val)
            elif roll < warm_prob + cool_prob:
                val = rng.uniform(0.60, 0.95)
                emissive[win_y0:win_y1, win_x0:win_x1, :3] = (0.55 * val, 0.86 * val, 1.0 * val)
                albedo[win_y0:win_y1, win_x0:win_x1, :3] = (0.45 * val, 0.68 * val, 0.84 * val)

            mid_x = (win_x0 + win_x1) // 2
            albedo[win_y0:win_y1, mid_x - 1:mid_x + 1, :3] = np.array(base_rgb) * 0.75
            emissive[win_y0:win_y1, mid_x - 1:mid_x + 1, :3] *= 0.15

    save_png_rgba(os.path.join(TEX_DIR, f"{prefix}_albedo.png"), (np.clip(albedo, 0, 1) * 255).astype(np.uint8))
    save_png_rgba(os.path.join(TEX_DIR, f"{prefix}_emissive.png"), (np.clip(emissive, 0, 1) * 255).astype(np.uint8))

build_facade_pair("tex_facade", (0.86, 0.85, 0.83), n_rows=32, n_cols=16, warm_prob=0.48, cool_prob=0.10, seed=707)
build_facade_pair("tex_facade_slate", (0.64, 0.68, 0.74), n_rows=32, n_cols=16, warm_prob=0.42, cool_prob=0.16, seed=808)
build_facade_pair("tex_facade_sci", (0.82, 0.87, 0.92), n_rows=24, n_cols=12, warm_prob=0.20, cool_prob=0.42, seed=909)
generate_earth_texture()
print("Upgraded textures generated successfully.")
