// Palette Forge: 60/30/10 colours, zero dependencies.
// node tools/palette.mjs 262 brutal
const clamp = (n, lo = 0, hi = 360) => Math.min(hi, Math.max(lo, Number(n) || 0));

export function makePalette(hue, mood = "museum") {
  const pop = mood === "brutal" ? 18 : 8;
  const sat = mood === "pastel" ? 52 : 84;
  return {
    base: `hsl(${hue} 26% 96%)`,
    surface: `hsl(${hue} 22% 90%)`,
    ink: `hsl(${hue} 24% 12%)`,
    accent: `hsl(${(hue + pop) % 360} ${sat}% 54%)`,
    accent2: `hsl(${(hue + 180) % 360} 62% 62%)`,
    ratio: { base: 60, surface: 30, accent: 10 },
  };
}

const hue = clamp(process.argv[2] ?? 262);
const palette = makePalette(hue, process.argv[3]);
console.log(JSON.stringify(palette, null, 2));
