const fs = require("fs"); // ganz oben

const roh = fs.readFileSync("orte.json", "utf8");
const orte = JSON.parse(roh);
console.log(roh);
console.log(orte);

const ERDRADIUS_KM = 6371; // mittlerer Erdradius

// Grad in Bogenmaß umrechnen
function inRad(grad) {
  return (grad * Math.PI) / 180;
}

// Haversine-Formel: Entfernung zweier Punkte auf der Erdkugel in km
function haversine(lat1, lon1, lat2, lon2) {
  const dLat = inRad(lat2 - lat1);
  const dLon = inRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(inRad(lat1)) * Math.cos(inRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return ERDRADIUS_KM * c;
}

// Entfernung zwischen zwei Orten aus orte.json anhand ihres Namens
function entfernung(nameA, nameB) {
  const a = orte.find((o) => o.name === nameA);
  const b = orte.find((o) => o.name === nameB);

  if (!a) throw new Error(`Ort "${nameA}" nicht in orte.json gefunden`);
  if (!b) throw new Error(`Ort "${nameB}" nicht in orte.json gefunden`);

  return haversine(a.lat, a.lon, b.lat, b.lon);
}

// Beispiele
const paare = [
    ["Schwäbisch Gmünd", "Schwäbisch Gmünd"],
    ["Stuttgart", "Schwäbisch Gmünd"],
    ["Schwäbisch Gmünd", "Stuttgart"],
//   ["Nullinsel", "Prüfpunkt Ost"],
//   ["Spitzbergen", "Prüfpunkt Nord"],
//   ["Schwäbisch Gmünd", "Stuttgart"],
//   ["Stuttgart", "Kapstadt"],
//   ["Stuttgart", "NYC"],
];

for (const [a, b] of paare) {
  console.log(`${a} → ${b}: ${entfernung(a, b).toFixed(2)} km`);
}