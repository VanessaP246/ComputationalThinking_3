const fs = require("fs"); // ganz oben

const BREITE_SVG = 720;
const HOEHE_SVG = 360;

function lonZuX(lon, breite) {
  return ((lon + 180) / 360) * breite;
}

// 90 - lat, weil y auf dem Bildschirm nach unten wächst.
function latZuY(lat, hoehe) {
  return ((90 - lat) / 180) * hoehe;
}

const orte = JSON.parse(    //JSON.parse wandelt Text in ein JavaScript-Objekt um
  fs.readFileSync(require("path").join(__dirname, "orte.json"), "utf8")   //require erzeugt den absoluten Pfad zur Datei, Rest liest die Datei synchron ein und gibt den Inhalt als String zurück
).map((ort) => ({   //für jeden Ort wird ein neues Objekt erstellt
  ...ort,   //kopiert alle bisherigen Eigenschaften
  lat: Number(ort.lat),   // durch number werden Werte durch echte Zahlen überschrieben, damit später die Rechnung für lonZuX und latZuY funktioniert
  lon: Number(ort.lon),
  niederschlagLProQm: Number(ort.niederschlagLProQm),
}));


// Farbverlauf im OKLCH-Farbraum (L = Helligkeit, C = Sättigung/Chroma, H = Farbton)
// trocken: hell, blass, türkis-grünlich  →  nass: dunkel, kräftig, tiefes Blau-Violett
const FARBE_TROCKEN = { l: 0.88, c: 0.06, h: 190 };
const FARBE_NASS    = { l: 0.35, c: 0.20, h: 270 };

const werte = orte.map((o) => o.niederschlagLProQm);
const minN = Math.min(...werte);
const maxN = Math.max(...werte);

// t (0..1) → Farbe; Helligkeit, Sättigung und Farbton werden linear interpoliert
function tZuFarbe(t) {
  const l = FARBE_TROCKEN.l + t * (FARBE_NASS.l - FARBE_TROCKEN.l);
  const c = FARBE_TROCKEN.c + t * (FARBE_NASS.c - FARBE_TROCKEN.c);
  const h = FARBE_TROCKEN.h + t * (FARBE_NASS.h - FARBE_TROCKEN.h);
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`;
}

// mapping von hellem Türkis (minimaler Niederschlag) bis dunklem Blau (maximaler Niederschlag)
function niederschlagZuFarbe(n) {
  const t = maxN === minN ? 0 : (n - minN) / (maxN - minN); // 0..1
  return tZuFarbe(t);
}


for (const ort of orte) {
  const x = lonZuX(ort.lon, BREITE_SVG);
  const y = latZuY(ort.lat, HOEHE_SVG);
  console.log(ort.name, "→ x:", x, "y:", y);
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${BREITE_SVG}" height="${HOEHE_SVG}">
  <rect width="${BREITE_SVG}" height="${HOEHE_SVG}" fill="#f4f1ea" stroke="#222"/>`;

for (const ort of orte) {
  const x = lonZuX(ort.lon, BREITE_SVG);
  const y = latZuY(ort.lat, HOEHE_SVG);
  const farbe = niederschlagZuFarbe(ort.niederschlagLProQm);
  svg += `
  <circle cx="${x}" cy="${y}" r="4" fill="${farbe}" stroke="#222" stroke-width="0.5"/>
  <text x="${x + 8}" y="${y + 4}" font-family="sans-serif" font-size="11">${ort.name}</text>`;
}


// ---- Skala unten links ----
const SKALA_X = 15;
const SKALA_BREITE = 160;
const SKALA_HOEHE = 12;
const SKALA_Y = HOEHE_SVG - 35;   // Oberkante des Farbbalkens

// Farbverlauf aus mehreren Stützstellen, damit auch die Farbton-Änderung sichtbar ist
const STUFEN = 10;
let stops = "";
for (let i = 0; i <= STUFEN; i++) {
  const t = i / STUFEN;
  stops += `
      <stop offset="${(t * 100).toFixed(1)}%" stop-color="${tZuFarbe(t)}"/>`;
}

// Beschriftungen: Minimum, Mitte, Maximum
const marken = [0, 0.5, 1].map((t) => ({
  x: SKALA_X + t * SKALA_BREITE,
  wert: Math.round(minN + t * (maxN - minN)),
  anker: t === 0 ? "start" : t === 1 ? "end" : "middle",
}));

svg += `
  <defs>
    <linearGradient id="niederschlagsSkala" x1="0" y1="0" x2="1" y2="0">${stops}
    </linearGradient>
  </defs>
  <text x="${SKALA_X}" y="${SKALA_Y - 6}" font-family="sans-serif" font-size="11" font-weight="bold">Niederschlag (l/m² pro Jahr)</text>
  <rect x="${SKALA_X}" y="${SKALA_Y}" width="${SKALA_BREITE}" height="${SKALA_HOEHE}" fill="url(#niederschlagsSkala)" stroke="#222" stroke-width="0.5"/>`;

for (const m of marken) {
  svg += `
  <line x1="${m.x}" y1="${SKALA_Y + SKALA_HOEHE}" x2="${m.x}" y2="${SKALA_Y + SKALA_HOEHE + 4}" stroke="#222" stroke-width="0.5"/>
  <text x="${m.x}" y="${SKALA_Y + SKALA_HOEHE + 15}" font-family="sans-serif" font-size="10" text-anchor="${m.anker}">${m.wert}</text>`;
}

svg += `
</svg>`;

fs.writeFileSync("karte.svg", svg);