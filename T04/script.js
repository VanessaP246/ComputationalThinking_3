// ---- Karten-Ausschnitt und Zoom ----
const AUSSCHNITT = { west: 5.8, ost: 15.1, nord: 55.1, sued: 47.2 }; // Deutschland (Basisansicht = Zoom 1)
const ZOOMPUNKT = { lat: 48.80, lon: 9.80 };                        // Schwäbisch Gmünd
const SLIDER_BASIS = 720; // Slider-Wert, bei dem Zoom = 1 ist (= value im HTML)

// SVG-Rahmen: bleibt fix
const BREITE_SVG = 720;
const HOEHE_SVG = 360;

const sliderBreite = document.querySelector("#breite");
// console.log(sliderBreite);


function lonZuX(lon, breite, ausschnitt) {
  return ((lon - ausschnitt.west) / (ausschnitt.ost - ausschnitt.west)) * breite;
}

function latZuY(lat, hoehe, ausschnitt) {
  return ((ausschnitt.nord - lat) / (ausschnitt.nord - ausschnitt.sued)) * hoehe;
}


function zoomAusschnitt(basis, punkt, faktor) {
  // relative Lage des Zoompunkts im Basis-Ausschnitt (0..1)
  const fx = (punkt.lon - basis.west) / (basis.ost - basis.west);
  const fy = (basis.nord - punkt.lat) / (basis.nord - basis.sued);

  // neue Ausdehnung in Grad: Zoom > 1 → kleinerer Ausschnitt
  const breiteGrad = (basis.ost - basis.west) / faktor;
  const hoeheGrad = (basis.nord - basis.sued) / faktor;

  // Ausschnitt so legen, dass der Zoompunkt weiterhin bei fx / fy liegt
  const west = punkt.lon - fx * breiteGrad;
  const nord = punkt.lat + fy * hoeheGrad;

  return { west, ost: west + breiteGrad, nord, sued: nord - hoeheGrad };
}


// Daten laden
const response = await fetch("orte.json"); //await: warte bis die Antwort vom Server kommt
const orte = (await response.json()).map((ort) => ({
  ...ort,
  lat: Number(ort.lat),
  lon: Number(ort.lon),
  niederschlagLProQm: Number(ort.niederschlagLProQm),
}));
console.log(orte);


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
  const x = lonZuX(ort.lon, BREITE_SVG, AUSSCHNITT);
  const y = latZuY(ort.lat, HOEHE_SVG, AUSSCHNITT);
  console.log(ort.name, "→ x:", x, "y:", y);
}


// Zeichnen des SVGs
function zeichnen(){
    const breite = BREITE_SVG;
    const hoehe = HOEHE_SVG;

     // Slider steuert den Zoomfaktor, nicht mehr die SVG-Größe
    const zoom = Number(sliderBreite.value) / SLIDER_BASIS;
    const ausschnitt = zoomAusschnitt(AUSSCHNITT, ZOOMPUNKT, zoom);

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}">
  <rect width="${breite}" height="${hoehe}" fill="#f4f1ea" stroke="#222"/>`;

for (const ort of orte) {
  const x = lonZuX(ort.lon, breite, ausschnitt);
  const y = latZuY(ort.lat, hoehe, ausschnitt);
   if (x < 0 || x > breite || y < 0 || y > hoehe) continue; // außerhalb des Rahmens
  const farbe = niederschlagZuFarbe(ort.niederschlagLProQm);
  svg += `
  <circle cx="${x}" cy="${y}" r="4" fill="${farbe}" stroke="#222" stroke-width="0.5"/>
  <text x="${x + 8}" y="${y + 4}" font-family="sans-serif" font-size="11">${ort.name}</text>`;
}


// ---- Skala unten links ----
const SKALA_X = 15;
const SKALA_BREITE = 160;
const SKALA_HOEHE = 12;
const SKALA_Y = hoehe - 35;   // Oberkante des Farbbalkens

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

document.querySelector('#karte').innerHTML = svg;
}


sliderBreite.addEventListener("input", zeichnen);
zeichnen();