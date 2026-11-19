const AUSSCHNITT = { west: -180, ost: 180, nord: 90, sued: -90 };
const ZOOMPUNKT = { lat: 48.8, lon: 9.79 }; // Schwäbisch Gmünd

function lonZuX(lon, breite, ausschnitt) {
  return ((lon - ausschnitt.west) / (ausschnitt.ost - ausschnitt.west)) * breite;
}

function latZuY(lat, hoehe, ausschnitt) {
  return ((ausschnitt.nord - lat) / (ausschnitt.nord - ausschnitt.sued)) * hoehe;
}

function zoomeAusschnitt(ausschnitt, punkt, faktor) {
  return {
    west: punkt.lon - (punkt.lon - ausschnitt.west) / faktor,
    ost: punkt.lon + (ausschnitt.ost - punkt.lon) / faktor,
    nord: punkt.lat + (ausschnitt.nord - punkt.lat) / faktor,
    sued: punkt.lat - (punkt.lat - ausschnitt.sued) / faktor,
  };
}

const response = await fetch("orte.json");
const orte = await response.json();

const sliderBreite = document.querySelector("#breite");
const sliderZoom = document.querySelector("#zoom");
const karte = document.querySelector("#karte");

function zeichnen() {
  const breite = Number(sliderBreite.value);
  const hoehe = breite / 2;
  const faktor = 2 ** Number(sliderZoom.value); // 0 → 1×, 1 → 2×, 7 → 128×
  const ausschnitt = zoomeAusschnitt(AUSSCHNITT, ZOOMPUNKT, faktor);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}">
  <rect width="${breite}" height="${hoehe}" fill="#f4f1ea" stroke="#222"/>`;

  for (const ort of orte) {
    const x = lonZuX(ort.lon, breite, ausschnitt);
    const y = latZuY(ort.lat, hoehe, ausschnitt);
    svg += `
  <circle cx="${x}" cy="${y}" r="4" fill="${ort.farbe}"/>
  <text x="${x + 8}" y="${y + 4}" font-family="sans-serif" font-size="11">${ort.name}</text>`;
  }

  svg += `
</svg>`;

  karte.innerHTML = svg;
}

// Beide Slider rufen dieselbe Funktion auf. zeichnen() liest beide jedes Mal neu.
sliderBreite.addEventListener("input", zeichnen);
sliderZoom.addEventListener("input", zeichnen);

zeichnen();
