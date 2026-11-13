#!/usr/bin/env node
/**
 * Builds every image the site uses from the client's own files:
 *   - crops each product/category picture listed in scripts/image-crops.json (assets/client-photos)
 *   - writes square responsive WebP files to public/images/<key>-<width>.<hash>.webp (the hash changes whenever the
 *     picture or the encoder settings change, so the files can be cached for a year without ever going stale)
 *   - writes src/data/image-manifest.json (sizes + dominant colour, used by <Picture>)
 *   - cuts the CTI logo (assets/brand/cti-logo-color.jpg) out of its dark background and renders the
 *     brand assets: public/brand/*.png, PWA/app icons, favicon and the Open Graph image
 *
 *   npm run images
 *
 * Some of the client's photos are small (a phone picture of a printed catalog page), so tiny crops are
 * upscaled 2x with Lanczos. When the client sends better product photos, point a key in
 * image-crops.json at the new file and re-run this script; no component needs to change.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const crops = JSON.parse(await fs.readFile(path.join(root, "scripts/image-crops.json"), "utf8"));
delete crops._help;
const srcDir = path.join(root, "assets/client-photos");
const outDir = path.join(root, "public/images");
const manifestPath = path.join(root, "src/data/image-manifest.json");

// Strings for the Open Graph image (keep in sync with src/config/site.ts)
const HEADLINE = "چسب دوطرفه و\nنوار چسب صنعتی";
const TAGLINE = "تهیه و عرضه برترین برندهای چسب دوطرفه";
const BRANDS_LINE = "tesa | 3M | NANO | Lohmann | QUICK TAPE";

const FONT = path.join(root, "node_modules/vazirmatn/fonts/ttf/Vazirmatn-Black.ttf");
const FONT_MEDIUM = path.join(root, "node_modules/vazirmatn/fonts/ttf/Vazirmatn-Medium.ttf");

// q82 looks the same as q92 on these soft catalog photos (checked side by side) and is ~25% smaller
const WEBP = { quality: 82, smartSubsample: true, effort: 6 };
// Sizes offered to the browser: a phone downloads the 640px file where a 2x desktop screen needs the 800px one
const LADDER = [360, 480, 640, 800];
const WEBP_SETTINGS = JSON.stringify(WEBP); // part of every file hash
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
    // wide or tall photo in a square frame: the same picture, blurred, fills the empty bands
    const bg = await sharp(region).resize(canvas, canvas, { fit: "cover" }).blur(26).modulate({ brightness: 0.82 }).toBuffer();
    const fg = await sharp(region).resize(canvas, canvas, { fit: "inside", kernel: "lanczos3" }).toBuffer();
    base = sharp(bg).composite([{ input: fg, gravity: "center" }]);
  } else {
    const background = spec.bg && spec.bg !== "auto" ? spec.bg : toHex(await edgeColor(region));
    base = sharp(region).resize(canvas, canvas, { fit: "contain", background, kernel: "lanczos3" });
  }
  if (scale > 1) base = base.sharpen({ sigma: 0.6, m1: 0.8, m2: 1.4 });
  const square = await base.png().toBuffer();

  const widths = [...new Set(LADDER.filter((w) => w < canvas * 0.92).concat(canvas))].sort((a, b) => a - b);
  // content hash: new picture or new encoder settings => new file name => browsers and Google never see a stale copy
  const hash = createHash("sha1").update(square).update(WEBP_SETTINGS).digest("hex").slice(0, 8);
  await fs.mkdir(path.dirname(path.join(outDir, key)), { recursive: true });
  for (const w of widths) {
    await sharp(square).resize(w, w, { kernel: "lanczos3" }).webp(WEBP).toFile(path.join(outDir, `${key}-${w}.${hash}.webp`));
  }
  const { dominant } = await sharp(square).resize(64).stats();
  manifest[key] = { width: canvas, height: canvas, sizes: widths, color: toHex(dominant), hash };
  console.log("✓", key.padEnd(52), widths.join("/"));
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

/* ───────── brand: cut the CTI logo out of its dark background ───────── */
const ink = "#131418";
const tape = "#e5462b";
const paper = "#f5f2eb";
const publicDir = path.join(root, "public");
const brandDir = path.join(publicDir, "brand");
await fs.mkdir(brandDir, { recursive: true });

// Regions of the 1080x1080 logo artwork. Update them if the logo file is ever replaced.
const LOGO_FILE = path.join(root, "assets/brand/cti-logo-color.jpg");
const LETTERS = { x0: 250, y0: 360, x1: 840, y1: 665 };
const WORDMARK = { x0: 400, y0: 668, x1: 740, y1: 750 };

/**
 * The artwork is white-outlined letters on a dark gradient. The white keyline closes every letter,
 * so a flood fill from the border finds the dark background without touching the black letters.
 * Edge pixels become soft keyline-white; the thin Persian wordmark gets its alpha from brightness.
 * Returns { mark: letters only, lockup: letters + white Persian wordmark }, both trimmed PNGs.
 */
async function cutLogo() {
  const { data, info } = await sharp(LOGO_FILE).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const lum = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) lum[i] = 0.299 * data[i * 3] + 0.587 * data[i * 3 + 1] + 0.114 * data[i * 3 + 2];

  const outside = new Uint8Array(W * H);
  const stack = [];
  const push = (x, y) => {
    const i = y * W + x;
    if (!outside[i] && lum[i] < 100) { outside[i] = 1; stack.push(i); }
  };
  for (let x = LETTERS.x0; x < LETTERS.x1; x++) { push(x, LETTERS.y0); push(x, LETTERS.y1 - 1); }
  for (let y = LETTERS.y0; y < LETTERS.y1; y++) { push(LETTERS.x0, y); push(LETTERS.x1 - 1, y); }
  while (stack.length) {
    const i = stack.pop(); const x = i % W, y = (i / W) | 0;
    if (x > LETTERS.x0) push(x - 1, y);
    if (x < LETTERS.x1 - 1) push(x + 1, y);
    if (y > LETTERS.y0) push(x, y - 1);
    if (y < LETTERS.y1 - 1) push(x, y + 1);
  }

  const rgba = Buffer.alloc(W * H * 4); // fully transparent
  for (let y = LETTERS.y0; y < LETTERS.y1; y++) {
    for (let x = LETTERS.x0; x < LETTERS.x1; x++) {
      const i = y * W + x;
      if (outside[i]) continue;
      let nearOutside = false;
      for (let dy = -2; dy <= 2 && !nearOutside; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const xx = x + dx, yy = y + dy;
          if (xx >= LETTERS.x0 && xx < LETTERS.x1 && yy >= LETTERS.y0 && yy < LETTERS.y1 && outside[yy * W + xx]) { nearOutside = true; break; }
        }
      }
      const o = i * 4;
      if (nearOutside) {
        rgba[o] = 255; rgba[o + 1] = 255; rgba[o + 2] = 255;
        rgba[o + 3] = Math.round(Math.max(0, Math.min(1, (lum[i] - 70) / 180)) * 255);
      } else {
        rgba[o] = data[i * 3]; rgba[o + 1] = data[i * 3 + 1]; rgba[o + 2] = data[i * 3 + 2]; rgba[o + 3] = 255;
      }
    }
  }
  const lettersOnly = Buffer.from(rgba);
  for (let y = WORDMARK.y0; y < WORDMARK.y1; y++) {
    for (let x = WORDMARK.x0; x < WORDMARK.x1; x++) {
      const i = y * W + x; const o = i * 4;
      rgba[o] = 255; rgba[o + 1] = 255; rgba[o + 2] = 255;
      rgba[o + 3] = Math.round(Math.max(0, Math.min(1, (lum[i] - 75) / 160)) * 255);
    }
  }
  const trim = (buf) => sharp(buf, { raw: { width: W, height: H, channels: 4 } }).trim({ threshold: 5 }).png({ compressionLevel: 9 }).toBuffer();
  return { mark: await trim(lettersOnly), lockup: await trim(rgba) };
}

const logo = await cutLogo();
// WebP keeps the transparency at a fraction of the PNG size (the header loads the mark on every page)
// The header shows the mark about 70px wide, so two small hashed files (for 1-2x and 3x screens) replace one 320px file.
for (const f of await fs.readdir(brandDir)) if (/^cti-mark/.test(f)) await fs.rm(path.join(brandDir, f));
const markAspect = (await sharp(logo.mark).metadata()).width / (await sharp(logo.mark).metadata()).height;
const markFiles = [];
for (const w of [140, 280]) {
  const buf = await sharp(logo.mark).resize({ width: w }).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toBuffer();
  const name = `cti-mark-${w}.${createHash("sha1").update(buf).digest("hex").slice(0, 8)}.webp`;
  await fs.writeFile(path.join(brandDir, name), buf);
  markFiles.push({ width: w, height: Math.round(w / markAspect), src: `/brand/${name}` });
}
await fs.writeFile(path.join(root, "src/data/brand-manifest.json"), JSON.stringify({ mark: { files: markFiles } }, null, 2) + "\n");
await sharp(logo.lockup).resize({ width: 520 }).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(path.join(brandDir, "cti-lockup.webp"));

/** Dark rounded square with the CTI letters, for app icons and the favicon. */
async function appIcon(size) {
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="${ink}"/></svg>`);
  const mark = await sharp(logo.mark).resize({ width: Math.round(size * 0.74) }).toBuffer();
  const { height } = await sharp(mark).metadata();
  return sharp(bg).composite([{ input: mark, left: Math.round(size * 0.13), top: Math.round((size - height) / 2) }]).png().toBuffer();
}
await fs.writeFile(path.join(publicDir, "icon-512.png"), await appIcon(512));
await fs.writeFile(path.join(publicDir, "icon-192.png"), await appIcon(192));
await fs.writeFile(path.join(root, "src/app/apple-icon.png"), await appIcon(180));
await fs.writeFile(path.join(root, "src/app/icon.png"), await appIcon(192));
await fs.rm(path.join(root, "src/app/icon.svg"), { force: true }); // the old placeholder favicon

/* ───────── Open Graph image ───────── */
const text = (t, font, fontfile, width, color = paper, rtl = true) =>
  sharp({ text: { text: `<span foreground="${color}">${t}</span>`, font, fontfile, rtl, width, dpi: 72, rgba: true, align: "right" } })
    .png()
    .toBuffer();

const W = 1200, H = 630;
const shots = ["products/tesa-red-liner-double-sided-tape", "products/nano-double-sided-foam-tape", "products/tesa-4965-double-sided-tape"];
const tiles = await Promise.all(
  shots.map(async (k, i) => {
    const size = [300, 250, 220][i];
    const w = manifest[k].sizes.find((s) => s >= 400) ?? manifest[k].sizes.at(-1);
    const img = await sharp(path.join(outDir, `${k}-${w}.${manifest[k].hash}.webp`)).resize(size, size).toBuffer();
    const mask = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="28"/></svg>`);
    return { input: await sharp(img).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer(), size };
  }),
);
const lockupW = 330;
const lockup = await sharp(logo.lockup).resize({ width: lockupW }).toBuffer();
await fs.mkdir(path.join(publicDir, "og"), { recursive: true });
await sharp({ create: { width: W, height: H, channels: 3, background: ink } })
  .composite([
    { input: Buffer.from(`<svg width="${W}" height="${H}"><rect x="0" y="560" width="${W}" height="70" fill="${tape}"/></svg>`), left: 0, top: 0 },
    { input: tiles[0].input, left: 70, top: 120 },
    { input: tiles[1].input, left: 300, top: 60 },
    { input: tiles[2].input, left: 330, top: 300 },
    { input: lockup, left: 1130 - lockupW, top: 56 },
    { input: await text(HEADLINE, "Vazirmatn Black 58", FONT, 530), left: 600, top: 305 },
    { input: await text(TAGLINE, "Vazirmatn Medium 26", FONT_MEDIUM, 530, "#c9c4b8"), left: 600, top: 462 },
    { input: await text(BRANDS_LINE, "Vazirmatn Medium 24", FONT_MEDIUM, 530, "#f1c84b", false), left: 600, top: 508 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(publicDir, "og/default.jpg"));
console.log("✓ brand assets (logo cut-out, icons, Open Graph image)");
