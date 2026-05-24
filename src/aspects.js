export const ASPECTS = [
  { name: "CONJUNCAO", angle: 0.0, orb: 6.0 },
  { name: "OPOSICAO", angle: 180.0, orb: 5.0 },
  { name: "QUADRATURA", angle: 90.0, orb: 4.0 },
  { name: "TRIGONO", angle: 120.0, orb: 4.0 },
  { name: "SEXTIL", angle: 60.0, orb: 3.0 },
  { name: "VIGINTIL", angle: 18.0, orb: 0.5 },
  { name: "DECIL", angle: 36.0, orb: 1.0 },
  { name: "SEMIQUINTIL", angle: 36.0, orb: 1.0 },
  { name: "QUINTIL", angle: 72.0, orb: 2.0 },
  { name: "TRIDECIL", angle: 108.0, orb: 1.0 },
  { name: "BIQUINTIL", angle: 144.0, orb: 2.0 },
  { name: "SEMIQUADRATURA", angle: 45.0, orb: 1.5 },
  { name: "SESQUIQUADRADO", angle: 135.0, orb: 1.5 },
  { name: "QUINQUNCIO", angle: 150.0, orb: 2.0 },
  { name: "SEPTIL", angle: 51.4167, orb: 1.5 },
  { name: "NOVIL", angle: 40.0, orb: 1.0 }
];

export function normalizeDegree(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error("Degree must be a finite number.");
  }

  return ((number % 360) + 360) % 360;
}

export function calculateAngularDistance(degreeA, degreeB) {
  const a = normalizeDegree(degreeA);
  const b = normalizeDegree(degreeB);

  const directDistance = Math.abs(a - b);
  return Math.min(directDistance, 360 - directDistance);
}

export function identifyAspects(degreeA, degreeB) {
  const distance = calculateAngularDistance(degreeA, degreeB);

  const matches = ASPECTS
    .map((aspect) => {
      const difference = Math.abs(distance - aspect.angle);

      return {
        aspect: aspect.name,
        angle: aspect.angle,
        orb: aspect.orb,
        distance,
        difference: Number(difference.toFixed(4)),
        exact: difference === 0,
        withinOrb: difference <= aspect.orb
      };
    })
    .filter((result) => result.withinOrb)
    .sort((a, b) => a.difference - b.difference);

  return {
    input: {
      degreeA: normalizeDegree(degreeA),
      degreeB: normalizeDegree(degreeB)
    },
    distance: Number(distance.toFixed(4)),
    aspects: matches
  };
}
