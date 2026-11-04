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

const orte = [
  { name: "Nullinsel", lat: 0, lon: 0 },
  { name: "Prüfpunkt Ost", lat: 0, lon: 10 },
  { name: "Schwäbisch Gmünd", lat: 48.8, lon: 9.79 },
  { name: "Stuttgart", lat: 48.7758, lon: 9.1829 },
  { name: "Kapstadt", lat: -33.92, lon: 18.42 },
  { name: "Spitzbergen", lat: 78.22, lon: 15.63 },
  { name: "Prüfpunkt Nord", lat: 78.22, lon: 25.63 },
  { name: "NYC", lat: 40.69, lon: -74.1443092 },
];

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
  svg += `
  <circle cx="${x}" cy="${y}" r="4" fill="#c0392b"/>
  <text x="${x + 8}" y="${y + 4}" font-family="sans-serif" font-size="11">${ort.name}</text>`;
}

svg += `
</svg>`;

fs.writeFileSync("karte.svg", svg);