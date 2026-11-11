#!/usr/bin/env node
/**
 * Builds every image the site uses from the client's own photos in assets/client-photos:
 *   - crops each product/category picture listed in scripts/image-crops.json
 *   - writes square responsive WebP files to public/images/<key>-<width>.webp
 *   - writes src/data/image-manifest.json (sizes + dominant colour, used by <Picture>)
 *   - renders the brand assets: Open Graph image, PWA icons, favicon
 *
 *   npm run images
 *
 * The client's catalog photos are small (a phone picture of a printed page), so tiny crops are
 * upscaled 2x with Lanczos. When the client sends real product photos, point a key in
 * image-crops.json at the new file and re-run this script; no component needs to change.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const crops = JSON.parse(await fs.readFile(path.join(root, "scripts/image-crops.json"), "utf8"));
delete crops._help;
const srcDir = path.join(root, "assets/client-photos");
const outDir = path.join(root, "public/images");
const manifestPath = path.join(root, "src/data/image-manifest.json");

// Brand strings for the Open Graph image (keep in sync with src/config/site.ts)
const BRAND = "بازرگانی چسب و شبرنگ استاندارد";
const HEADLINE = "چسب دوطرفه و\nنوار چسب صنعتی";
const SUBLINE = "NANO | QUICK TAPE | تهران";

const FONT = path.join(root, "node_modules/vazirmatn/fonts/ttf/Vazirmatn-Black.ttf");
const FONT_MEDIUM = path.join(root, "node_modules/vazirmatn/fonts/ttf/Vazirmatn-Medium.ttf");

const toHex = ({ r, g, b }) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

/** Mean colour of the outer ring of a region, so letterboxing blends into catalog panels. */
async function edgeColor(buf) {
  const N = 24;
  const { data } = await sharp(buf).resize(N, N, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (x > 1 && x < N - 2 && y > 1 && y < N - 2) continue;
      const i = (y * N + x) * 3;
      r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
    }
  }
  return { r: r / n, g: g / n, b: b / n };
}

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir, { recursive: true });

const manifest = {};
for (const [key, spec] of Object.entries(crops)) {
  const file = path.join(srcDir, spec.src);
  const meta = await sharp(file).metadata();
  let [left, top, width, height] = spec.rect;
  left = Math.max(0, left);
  top = Math.max(0, top);
  width = Math.min(width, meta.width - left);
  height = Math.min(height, meta.height - top);

  const region = await sharp(file).rotate().extract({ left, top, width, height }).toBuffer();
  const side = Math.max(width, height);
  const scale = side >= 400 ? 1 : 2;
  const canvas = Math.min(800, Math.round(side * scale));

  let base;
  if (spec.fit === "cover") {
    base = sharp(region).resize(canvas, canvas, { fit: "cover", kernel: "lanczos3" });
  } else if (spec.fit === "blur") {
    // wide photo in a square frame: the same picture, blurred, fills the empty bands
    const bg = await sharp(region).resize(canvas, canvas, { fit: "cover" }).blur(26).modulate({ brightness: 0.82 }).toBuffer();
    const fg = await sharp(region).resize(canvas, canvas, { fit: "inside", kernel: "lanczos3" }).toBuffer();
    base = sharp(bg).composite([{ input: fg, gravity: "center" }]);
  } else {
    const background = spec.bg && spec.bg !== "auto" ? spec.bg : toHex(await edgeColor(region));
    base = sharp(region).resize(canvas, canvas, { fit: "contain", background, kernel: "lanczos3" });
  }
  if (scale > 1) base = base.sharpen({ sigma: 0.6, m1: 0.8, m2: 1.4 });
  const square = await base.png().toBuffer();

  const widths = [...new Set([400, 800].filter((w) => w < canvas).concat(canvas))].sort((a, b) => a - b);
  await fs.mkdir(path.dirname(path.join(outDir, key)), { recursive: true });
  for (const w of widths) {
    await sharp(square).resize(w, w, { kernel: "lanczos3" }).webp({ quality: 80, effort: 6 }).toFile(path.join(outDir, `${key}-${w}.webp`));
  }
  const { dominant } = await sharp(square).resize(64).stats();
  manifest[key] = { width: canvas, height: canvas, sizes: widths, color: toHex(dominant) };
  console.log("✓", key.padEnd(52), widths.join("/"));
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

/* ───────── brand assets ───────── */
const ink = "#131418";
const tape = "#e5462b";
const paper = "#f5f2eb";
const markSvg = (size, bg, stroke = tape, dot = paper) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  ${bg ? `<rect width="64" height="64" rx="14" fill="${ink}"/>` : ""}
  <g transform="translate(10 14)"><path d="M42 29H17A12 12 0 1 1 29 17" fill="none" stroke="${stroke}" stroke-width="7"/>
  <circle cx="17" cy="17" r="3.4" fill="${dot}"/></g></svg>`);

const publicDir = path.join(root, "public");
await sharp(markSvg(512, true)).png().toFile(path.join(publicDir, "icon-512.png"));
await sharp(markSvg(192, true)).png().toFile(path.join(publicDir, "icon-192.png"));
await sharp(markSvg(180, true)).png().toFile(path.join(root, "src/app/apple-icon.png"));
await fs.writeFile(path.join(root, "src/app/icon.svg"), markSvg(64, true));

const text = (t, font, fontfile, width, color = paper) =>
  sharp({ text: { text: `<span foreground="${color}">${t}</span>`, font, fontfile, rtl: true, width, dpi: 72, rgba: true, align: "right" } })
    .png()
    .toBuffer();

const W = 1200, H = 630;
const shots = ["products/nano-double-sided-foam-tape", "products/nano-acrylic-gel-double-sided-tape", "products/qbono-6665-pet-red-double-sided-tape"];
const tiles = await Promise.all(
  shots.map(async (k, i) => {
    const size = [300, 250, 220][i];
    const img = await sharp(path.join(outDir, `${k}-400.webp`)).resize(size, size).toBuffer();
    const mask = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="28"/></svg>`);
    return { input: await sharp(img).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer(), size };
  }),
);
await fs.mkdir(path.join(publicDir, "og"), { recursive: true });
await sharp({ create: { width: W, height: H, channels: 3, background: ink } })
  .composite([
    { input: Buffer.from(`<svg width="${W}" height="${H}"><rect x="0" y="560" width="${W}" height="70" fill="${tape}"/></svg>`), left: 0, top: 0 },
    { input: tiles[0].input, left: 70, top: 120 },
    { input: tiles[1].input, left: 300, top: 60 },
    { input: tiles[2].input, left: 330, top: 300 },
    { input: await text(BRAND, "Vazirmatn Black 34", FONT, 560, "#f1c84b"), left: 590, top: 110 },
    { input: await text(HEADLINE, "Vazirmatn Black 64", FONT, 560), left: 590, top: 180 },
    { input: await text(SUBLINE, "Vazirmatn Medium 28", FONT_MEDIUM, 560, "#c9c4b8"), left: 590, top: 400 },
    { input: await sharp(markSvg(64, false, paper, ink)).png().toBuffer(), left: 1086, top: 563 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(publicDir, "og/default.jpg"));
console.log("✓ brand assets");
