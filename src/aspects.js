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

export const HOUSE_NAMES = {
  1: "ASCENDENTE",
  2: "CASA_2",
  3: "CASA_3",
  4: "FUNDO_DO_CEU",
  5: "CASA_5",
  6: "CASA_6",
  7: "DESCENDENTE",
  8: "CASA_8",
  9: "CASA_9",
  10: "MEIO_DO_CEU",
  11: "CASA_11",
  12: "CASA_12"
};

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

export function normalizePoint(point, index) {
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
    type: point.type ?? "POINT",
    longitude: normalizeDegree(point.longitude)
  };
}

export function houseToPoint(house, index) {
  if (!house || typeof house !== "object") {
    throw new Error(`House at index ${index} must be an object.`);
  }

  if (house.house === undefined) {
    throw new Error(`House at index ${index} must have a house number.`);
  }

  if (house.longitude === undefined) {
    throw new Error(`House ${house.house} must have a longitude.`);
  }

  const houseNumber = Number(house.house);

  if (!Number.isInteger(houseNumber) || houseNumber < 1 || houseNumber > 12) {
    throw new Error(`House number must be an integer from 1 to 12.`);
  }

  return {
    name: HOUSE_NAMES[houseNumber],
    type: "HOUSE",
    house: houseNumber,
    sign: house.sign ?? null,
    longitude: normalizeDegree(house.longitude),
    declination: house.declination ?? null
  };
}

export function serializePoint(point) {
  return {
    name: point.name,
    longitude: point.longitude,
    sign: point.sign ?? null,
    house: point.house ?? null,
    type: point.type ?? null
  };
}

export function identifyBatchAspects(points, houses = []) {
  const safePoints = points ?? [];
  const safeHouses = houses ?? [];

  if (!Array.isArray(safePoints)) {
    throw new Error("points must be an array.");
  }

  if (!Array.isArray(safeHouses)) {
    throw new Error("houses must be an array.");
  }

  const normalizedPoints = safePoints.map((point, index) => normalizePoint(point, index));
  const housePoints = safeHouses.map((house, index) => houseToPoint(house, index));
  const allPoints = [...normalizedPoints, ...housePoints];

  if (allPoints.length < 2) {
    throw new Error("At least two points or houses are required.");
  }

  const results = [];

  for (let i = 0; i < allPoints.length; i += 1) {
    for (let j = i + 1; j < allPoints.length; j += 1) {
      const pointA = allPoints[i];
      const pointB = allPoints[j];

      const calculation = identifyAspects(pointA.longitude, pointB.longitude);

      if (calculation.aspects.length > 0) {
        results.push({
          pointA: serializePoint(pointA),
          pointB: serializePoint(pointB),
          distance: calculation.distance,
          aspects: calculation.aspects
        });
      }
    }
  }

  return {
    pointsCount: normalizedPoints.length,
    housesCount: housePoints.length,
    totalObjectsCount: allPoints.length,
    pairsChecked: (allPoints.length * (allPoints.length - 1)) / 2,
    aspectsFound: results.length,
    results
  };
}
