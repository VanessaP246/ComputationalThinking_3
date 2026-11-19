const ERDRADIUS_KM = 6371;

function gradZuBogenmass(grad) {
  return (grad * Math.PI) / 180;
}

function entfernung(a, b) {
  const dLat = gradZuBogenmass(b.lat - a.lat);
  const dLon = gradZuBogenmass(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(gradZuBogenmass(a.lat)) *
      Math.cos(gradZuBogenmass(b.lat)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * ERDRADIUS_KM * Math.asin(Math.sqrt(h));
}