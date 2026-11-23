// PROTOTYPE, throwaway. Generated the favicon outlines from dist/_astro/fonts (Noto Sans KR 700 ttf).
// Scratch: turn monogram letters into SVG path data (no font needed at render time).
// Usage: node glyphs.mjs <font.ttf> <out.json> <text>...
import { readFileSync, writeFileSync } from "node:fs";
import { create } from "../../node_modules/.pnpm/fontkitten@1.0.3/node_modules/fontkitten/dist/index.js";

const [fontPath, outPath, ...texts] = process.argv.slice(2);
const font = create(readFileSync(fontPath));

const out = {};
for (const text of texts) {
  let x = 0;
  const parts = [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const ch of text) {
    const g = font.glyphForCodePoint(ch.codePointAt(0));
    // font units are y-up; flip to SVG y-down, then shift by pen position
    const p = g.path.transform(1, 0, 0, -1, x, 0);
    const b = p.bbox;
    minX = Math.min(minX, b.minX); minY = Math.min(minY, b.minY);
    maxX = Math.max(maxX, b.maxX); maxY = Math.max(maxY, b.maxY);
    parts.push(p);
    x += g.advanceWidth;
  }
  // normalise so the ink box starts at (0,0)
  const d = parts.map(p => p.translate(-minX, -minY).toSVG()).join("");
  out[text] = { d, w: maxX - minX, h: maxY - minY, unitsPerEm: font.unitsPerEm };
}
writeFileSync(outPath, JSON.stringify(out));
console.log(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, { w: Math.round(v.w), h: Math.round(v.h), dLen: v.d.length }])));
