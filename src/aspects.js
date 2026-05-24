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

export function roundDegree(value) {
  return Number(Number(value).toFixed(4));
}

export function normalizeDegree(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error("Degree must be a finite number.");
  }

  return roundDegree(((number % 360) + 360) % 360);
}

export function calculateAngularDistance(degreeA, degreeB) {
  const a = normalizeDegree(degreeA);
  const b = normalizeDegree(degreeB);

  const directDistance = Math.abs(a - b);
  return roundDegree(Math.min(directDistance, 360 - directDistance));
}

export function identifyAspects(degreeA, degreeB) {
  const normalizedDegreeA = normalizeDegree(degreeA);
  const normalizedDegreeB = normalizeDegree(degreeB);
  const distance = calculateAngularDistance(normalizedDegreeA, normalizedDegreeB);

  const matches = ASPECTS
    .map((aspect) => {
      const difference = roundDegree(Math.abs(distance - aspect.angle));

      return {
        aspect: aspect.name,
        angle: aspect.angle,
        orb: aspect.orb,
        distance,
        difference,
        exact: difference === 0,
        withinOrb: difference <= aspect.orb
      };
    })
    .filter((result) => result.withinOrb)
    .sort((a, b) => a.difference - b.difference);

  return {
    input: {
      degreeA: normalizedDegreeA,
      degreeB: normalizedDegreeB
    },
    distance,
    aspects: matches
  };
}

export function identifyBatchAspects(points) {
  if (!Array.isArray(points)) {
    throw new Error("points must be an array.");
  }

  if (points.length < 2) {
    throw new Error("At least two points are required.");
  }

  const normalizedPoints = points.map((point, index) => {
    if (!point || typeof point !== "object") {
      throw new Error(`Point at index ${index} must be an object.`);
    }

    if (!point.name) {
      throw new Error(`Point at index ${index} must have a name.`);
    }

    if (point.longitude === undefined) {
      throw new Error(`Point ${point.name} must have a longitude.`);
    }

    return {
      ...point,
      longitude: normalizeDegree(point.longitude)
    };
  });

  const results = [];

  for (let i = 0; i < normalizedPoints.length; i += 1) {
    for (let j = i + 1; j < normalizedPoints.length; j += 1) {
      const pointA = normalizedPoints[i];
      const pointB = normalizedPoints[j];

      const calculation = identifyAspects(pointA.longitude, pointB.longitude);

      if (calculation.aspects.length > 0) {
        results.push({
          pointA: {
            name: pointA.name,
            longitude: pointA.longitude,
            sign: pointA.sign ?? null,
            house: pointA.house ?? null,
            type: pointA.type ?? null
          },
          pointB: {
            name: pointB.name,
            longitude: pointB.longitude,
            sign: pointB.sign ?? null,
            house: pointB.house ?? null,
            type: pointB.type ?? null
          },
          distance: calculation.distance,
          aspects: calculation.aspects
        });
      }
    }
  }

  return {
    pointsCount: normalizedPoints.length,
    pairsChecked: (normalizedPoints.length * (normalizedPoints.length - 1)) / 2,
    aspectsFound: results.length,
    results
  };
}
