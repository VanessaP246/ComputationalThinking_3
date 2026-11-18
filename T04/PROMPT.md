Aufgabe 1:
Der Code erzeugt eine svg-Karte, die im Browser gerendert wird & Orte aus einer JSON-Datei anzeigt.
Die beiden folgenden Funktionen rechnen die geografische Lage in eine Position auf dem svg um:
function lonZuX(lon, breite) {
  return ((lon + 180) / 360) * breite;
}

function latZuY(lat, hoehe) {
  return ((90 - lat) / 180) * hoehe;
}

Ergänze bei beiden Funktionen den Parameter ausschnitt:
const AUSSCHNITT = { west: …, ost: …, nord: …, sued: … };


Aufgabe 2:
Zu der Karte gehört ein Slider: <input type="range" id="breite" min="200" max="1400" value="720">
Damit soll auf einen definierten Zoompunkt (Schwäbisch Gmünd) gezoomt werden. Der Zoompunkt bleibt dabei an einer Stelle: const ZOOMPUNKT = { lat: …, lon: … };