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

export const DEFAULT_BATCH_OPTIONS = {
  includePointToPoint: true,
  includePointToHouse: true,
  includeHouseToHouse: true,
  aspectNames: null,
  sortBy: "input",
  outputFormat: "detailed"
};

export const VALID_SORT_OPTIONS = ["input", "orb", "distance", "aspect", "pairType"];
export const VALID_OUTPUT_FORMATS = ["detailed", "pipe"];

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

export function normalizeSpeed(value) {
  if (value === undefined || value === null || value === "") {
    return 0;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error("Speed must be a finite number.");
  }

  return number;
}

export function calculateAngularDistance(degreeA, degreeB) {
  const a = normalizeDegree(degreeA);
  const b = normalizeDegree(degreeB);

  const directDistance = Math.abs(a - b);
  return roundDegree(Math.min(directDistance, 360 - directDistance));
}

export function normalizeAspectNames(aspectNames) {
  if (aspectNames === undefined || aspectNames === null) {
    return null;
  }

  if (!Array.isArray(aspectNames)) {
    throw new Error("options.aspectNames must be an array.");
  }

  const normalizedNames = aspectNames.map((name) => String(name).trim().toUpperCase());

  const validNames = ASPECTS.map((aspect) => aspect.name);
  const invalidNames = normalizedNames.filter((name) => !validNames.includes(name));

  if (invalidNames.length > 0) {
    throw new Error(`Invalid aspect name(s): ${invalidNames.join(", ")}.`);
  }

  return normalizedNames;
}

export function normalizeSortBy(sortBy) {
  const normalizedSortBy = String(sortBy ?? DEFAULT_BATCH_OPTIONS.sortBy).trim();

  if (!VALID_SORT_OPTIONS.includes(normalizedSortBy)) {
    throw new Error(`options.sortBy must be one of: ${VALID_SORT_OPTIONS.join(", ")}.`);
  }

  return normalizedSortBy;
}

export function normalizeOutputFormat(outputFormat) {
  const normalizedOutputFormat = String(outputFormat ?? DEFAULT_BATCH_OPTIONS.outputFormat).trim();

  if (!VALID_OUTPUT_FORMATS.includes(normalizedOutputFormat)) {
    throw new Error(`options.outputFormat must be one of: ${VALID_OUTPUT_FORMATS.join(", ")}.`);
  }

  return normalizedOutputFormat;
}

export function identifyAspects(degreeA, degreeB, aspectNames = null) {
  const normalizedDegreeA = normalizeDegree(degreeA);
  const normalizedDegreeB = normalizeDegree(degreeB);
  const normalizedAspectNames = normalizeAspectNames(aspectNames);
  const distance = calculateAngularDistance(normalizedDegreeA, normalizedDegreeB);

  const aspectsToCheck = normalizedAspectNames
    ? ASPECTS.filter((aspect) => normalizedAspectNames.includes(aspect.name))
    : ASPECTS;

  const matches = aspectsToCheck
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
    longitude: normalizeDegree(point.longitude),
    speed: normalizeSpeed(point.speed)
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
    throw new Error("House number must be an integer from 1 to 12.");
  }

  return {
    name: HOUSE_NAMES[houseNumber],
    type: "HOUSE",
    house: houseNumber,
    sign: house.sign ?? null,
    longitude: normalizeDegree(house.longitude),
    declination: house.declination ?? null,
    speed: normalizeSpeed(house.speed)
  };
}

export function serializePoint(point) {
  return {
    name: point.name,
    longitude: point.longitude,
    sign: point.sign ?? null,
    house: point.house ?? null,
    type: point.type ?? null,
    speed: point.speed ?? 0
  };
}

export function normalizeBatchOptions(options = {}) {
  if (!options || typeof options !== "object") {
    throw new Error("options must be an object.");
  }

  return {
    includePointToPoint: options.includePointToPoint ?? DEFAULT_BATCH_OPTIONS.includePointToPoint,
    includePointToHouse: options.includePointToHouse ?? DEFAULT_BATCH_OPTIONS.includePointToHouse,
    includeHouseToHouse: options.includeHouseToHouse ?? DEFAULT_BATCH_OPTIONS.includeHouseToHouse,
    aspectNames: normalizeAspectNames(options.aspectNames ?? DEFAULT_BATCH_OPTIONS.aspectNames),
    sortBy: normalizeSortBy(options.sortBy ?? DEFAULT_BATCH_OPTIONS.sortBy),
    outputFormat: normalizeOutputFormat(options.outputFormat ?? DEFAULT_BATCH_OPTIONS.outputFormat)
  };
}

export function getPairType(pointA, pointB) {
  const aIsHouse = pointA.type === "HOUSE";
  const bIsHouse = pointB.type === "HOUSE";

  if (aIsHouse && bIsHouse) {
    return "HOUSE_TO_HOUSE";
  }

  if (aIsHouse || bIsHouse) {
    return "POINT_TO_HOUSE";
  }

  return "POINT_TO_POINT";
}

export function shouldIncludePair(pairType, options) {
  if (pairType === "POINT_TO_POINT") {
    return options.includePointToPoint;
  }

  if (pairType === "POINT_TO_HOUSE") {
    return options.includePointToHouse;
  }

  if (pairType === "HOUSE_TO_HOUSE") {
    return options.includeHouseToHouse;
  }

  return false;
}

export function getBestDifference(result) {
  return result.aspects[0]?.difference ?? Number.POSITIVE_INFINITY;
}

export function getFirstAspectName(result) {
  return result.aspects[0]?.aspect ?? "";
}

export function sortResults(results, sortBy) {
  if (sortBy === "input") {
    return results;
  }

  return [...results].sort((a, b) => {
    if (sortBy === "orb") {
      return getBestDifference(a) - getBestDifference(b);
    }

    if (sortBy === "distance") {
      return a.distance - b.distance;
    }

    if (sortBy === "aspect") {
      return getFirstAspectName(a).localeCompare(getFirstAspectName(b));
    }

    if (sortBy === "pairType") {
      return a.pairType.localeCompare(b.pairType);
    }

    return 0;
  });
}

export function calculateApplyingSeparating(pointA, pointB, aspectAngle) {
  const currentDistance = calculateAngularDistance(pointA.longitude, pointB.longitude);
  const currentDifference = Math.abs(currentDistance - aspectAngle);

  const nextLongitudeA = normalizeDegree(pointA.longitude + pointA.speed);
  const nextLongitudeB = normalizeDegree(pointB.longitude + pointB.speed);
  const nextDistance = calculateAngularDistance(nextLongitudeA, nextLongitudeB);
  const nextDifference = Math.abs(nextDistance - aspectAngle);

  const roundedCurrent = roundDegree(currentDifference);
  const roundedNext = roundDegree(nextDifference);

  if (roundedCurrent === 0) {
    return "EXACT";
  }

  if (roundedNext < roundedCurrent) {
    return "APPLYING";
  }

  if (roundedNext > roundedCurrent) {
    return "SEPARATING";
  }

  return "STATIONARY";
}

export function formatPipeLine(result, aspect) {
  return [
    result.pointA.name,
    aspect.aspect,
    result.pointB.name,
    aspect.difference,
    aspect.applyingSeparating
  ].join("|");
}

export function formatPipeResults(results) {
  const header = "PLANETA_PONTO_EIXO|ASPECTO|PLANETA_PONTO_EIXO|ORBE|APPLYING_SEPARATING";

  const lines = results.flatMap((result) =>
    result.aspects.map((aspect) => formatPipeLine(result, aspect))
  );

  return [header, ...lines];
}

export function identifyBatchAspects(points, houses = [], options = {}) {
  const safePoints = points ?? [];
  const safeHouses = houses ?? [];
  const normalizedOptions = normalizeBatchOptions(options);

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
  let pairsChecked = 0;
  let pairsSkipped = 0;

  for (let i = 0; i < allPoints.length; i += 1) {
    for (let j = i + 1; j < allPoints.length; j += 1) {
      const pointA = allPoints[i];
      const pointB = allPoints[j];
      const pairType = getPairType(pointA, pointB);

      if (!shouldIncludePair(pairType, normalizedOptions)) {
        pairsSkipped += 1;
        continue;
      }

      pairsChecked += 1;

      const calculation = identifyAspects(
        pointA.longitude,
        pointB.longitude,
        normalizedOptions.aspectNames
      );

      if (calculation.aspects.length > 0) {
        const aspectsWithMovement = calculation.aspects.map((aspect) => ({
          ...aspect,
          applyingSeparating: calculateApplyingSeparating(pointA, pointB, aspect.angle)
        }));

        results.push({
          pairType,
          pointA: serializePoint(pointA),
          pointB: serializePoint(pointB),
          distance: calculation.distance,
          aspects: aspectsWithMovement
        });
      }
    }
  }

  const sortedResults = sortResults(results, normalizedOptions.sortBy);

  if (normalizedOptions.outputFormat === "pipe") {
    return {
      pointsCount: normalizedPoints.length,
      housesCount: housePoints.length,
      totalObjectsCount: allPoints.length,
      pairsChecked,
      pairsSkipped,
      aspectsFound: sortedResults.length,
      options: normalizedOptions,
      format: "pipe",
      results: formatPipeResults(sortedResults)
    };
  }

  return {
    pointsCount: normalizedPoints.length,
    housesCount: housePoints.length,
    totalObjectsCount: allPoints.length,
    pairsChecked,
    pairsSkipped,
    aspectsFound: sortedResults.length,
    options: normalizedOptions,
    results: sortedResults
  };
}
