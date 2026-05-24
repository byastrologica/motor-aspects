export const ASPECTS = [
  { name: "CONJUNCAO", angle: 0.0, orb: 6.0, family: "ptolemaico", harmonic: 1, isMinor: false, isStructural: true, isKarmic: false },
  { name: "OPOSICAO", angle: 180.0, orb: 5.0, family: "ptolemaico", harmonic: 2, isMinor: false, isStructural: true, isKarmic: false },
  { name: "QUADRATURA", angle: 90.0, orb: 4.0, family: "ptolemaico", harmonic: 4, isMinor: false, isStructural: true, isKarmic: false },
  { name: "TRIGONO", angle: 120.0, orb: 4.0, family: "ptolemaico", harmonic: 3, isMinor: false, isStructural: true, isKarmic: false },
  { name: "SEXTIL", angle: 60.0, orb: 3.0, family: "ptolemaico", harmonic: 6, isMinor: false, isStructural: true, isKarmic: false },
  { name: "VIGINTIL", angle: 18.0, orb: 0.5, family: "kepleriano", harmonic: 20, isMinor: true, isStructural: false, isKarmic: false },
  { name: "DECIL", angle: 36.0, orb: 1.0, family: "kepleriano", harmonic: 10, isMinor: true, isStructural: false, isKarmic: false },
  { name: "QUINTIL", angle: 72.0, orb: 2.0, family: "kepleriano", harmonic: 5, isMinor: true, isStructural: false, isKarmic: false },
  { name: "TRIDECIL", angle: 108.0, orb: 1.0, family: "kepleriano", harmonic: 10, isMinor: true, isStructural: false, isKarmic: false },
  { name: "BIQUINTIL", angle: 144.0, orb: 2.0, family: "kepleriano", harmonic: 5, isMinor: true, isStructural: false, isKarmic: false },
  { name: "SEMIQUADRATURA", angle: 45.0, orb: 1.5, family: "octil", harmonic: 8, isMinor: true, isStructural: false, isKarmic: false },
  { name: "SESQUIQUADRADO", angle: 135.0, orb: 1.5, family: "octil", harmonic: 8, isMinor: true, isStructural: false, isKarmic: false },
  { name: "QUINCUNCIO", angle: 150.0, orb: 2.0, family: "inconjunto", harmonic: 12, isMinor: true, isStructural: false, isKarmic: false },
  { name: "SEPTIL", angle: 51.4167, orb: 1.5, family: "septenario", harmonic: 7, isMinor: true, isStructural: false, isKarmic: true },
  { name: "NOVIL", angle: 40.0, orb: 1.0, family: "novil", harmonic: 9, isMinor: true, isStructural: false, isKarmic: true }
];

export const HOUSE_NAMES = {
  1: "ASCENDENTE",
  4: "FUNDO_DO_CEU",
  7: "DESCENDENTE",
  10: "MEIO_DO_CEU"
};

export const ANGULAR_HOUSES = [1, 4, 7, 10];
export const MAJOR_ASPECTS = ["CONJUNCAO", "OPOSICAO", "QUADRATURA", "TRIGONO", "SEXTIL"];
export const FIXED_STAR_ALLOWED_ASPECTS = ["CONJUNCAO", "OPOSICAO"];
export const ECLIPSE_ALLOWED_ASPECTS = ["CONJUNCAO", "OPOSICAO", "QUADRATURA"];

export const LUMINARIES = ["SOL", "LUA"];
export const PERSONAL_PLANETS = ["SOL", "LUA", "MERCURIO", "VENUS", "MARTE"];
export const SOCIAL_PLANETS = ["JUPITER", "SATURNO"];
export const TRANSPERSONAL_PLANETS = ["URANO", "NETUNO", "PLUTAO"];
export const NODES = ["NODO NORTE", "NODO SUL"];

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

export function normalizeToken(value) {
  return String(value)
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

export function normalizeObjectType(type) {
  const normalizedType = normalizeToken(type ?? "POINT");

  const aliases = {
    FIXED_STAR: "ESTRELA_FIXA",
    ESTRELA: "ESTRELA_FIXA",
    ESTRELA_FIXA: "ESTRELA_FIXA",
    ECLIPSE: "ECLIPSE",
    PLANETA: "PLANETA",
    ASTEROIDE: "ASTEROIDE",
    PONTO: "PONTO",
    POINT: "PONTO",
    HOUSE: "HOUSE"
  };

  return aliases[normalizedType] ?? normalizedType;
}

export function normalizeAspectName(name) {
  const normalizedName = normalizeToken(name);

  const aliases = {
    SEMIQUINTIL: "DECIL",
    QUINQUNCIO: "QUINCUNCIO",
    QUINCUNCIO: "QUINCUNCIO"
  };

  return aliases[normalizedName] ?? normalizedName;
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

  const normalizedNames = aspectNames.map((name) => normalizeAspectName(name));
  const validNames = ASPECTS.map((aspect) => aspect.name);
  const invalidNames = normalizedNames.filter((name) => !validNames.includes(name));

  if (invalidNames.length > 0) {
    throw new Error(`Invalid aspect name(s): ${invalidNames.join(", ")}.`);
  }

  return [...new Set(normalizedNames)];
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

export function isMajorAspectName(aspectName) {
  return MAJOR_ASPECTS.includes(aspectName);
}

export function isFixedStar(point) {
  return point.type === "ESTRELA_FIXA";
}

export function isEclipse(point) {
  return point.type === "ECLIPSE";
}

export function isAsteroid(point) {
  return point.type === "ASTEROIDE";
}

export function isHouse(point) {
  return point.type === "HOUSE";
}

export function isPlanet(point) {
  return point.type === "PLANETA";
}

export function isLuminary(point) {
  return LUMINARIES.includes(normalizeToken(point.name));
}

export function isNode(point) {
  return NODES.includes(normalizeToken(point.name));
}

export function isLilithMedia(point) {
  return normalizeToken(point.name) === "LILITH MEDIA";
}

export function isPartOfFortune(point) {
  return normalizeToken(point.name) === "PARTE DA FORTUNA";
}

export function isPersonalPlanet(point) {
  return PERSONAL_PLANETS.includes(normalizeToken(point.name));
}

export function isSocialPlanet(point) {
  return SOCIAL_PLANETS.includes(normalizeToken(point.name));
}

export function isTranspersonalPlanet(point) {
  return TRANSPERSONAL_PLANETS.includes(normalizeToken(point.name));
}

export function hasFixedStar(pointA, pointB) {
  return isFixedStar(pointA) || isFixedStar(pointB);
}

export function hasEclipse(pointA, pointB) {
  return isEclipse(pointA) || isEclipse(pointB);
}

export function hasAsteroid(pointA, pointB) {
  return isAsteroid(pointA) || isAsteroid(pointB);
}

export function hasLuminary(pointA, pointB) {
  return isLuminary(pointA) || isLuminary(pointB);
}

export function hasLilithMedia(pointA, pointB) {
  return isLilithMedia(pointA) || isLilithMedia(pointB);
}

export function hasPartOfFortune(pointA, pointB) {
  return isPartOfFortune(pointA) || isPartOfFortune(pointB);
}

export function isTranspersonalPersonalPair(pointA, pointB) {
  return (
    (isTranspersonalPlanet(pointA) && isPersonalPlanet(pointB)) ||
    (isTranspersonalPlanet(pointB) && isPersonalPlanet(pointA))
  );
}

export function getOtherPoint(pointA, pointB, predicate) {
  if (predicate(pointA)) return pointB;
  if (predicate(pointB)) return pointA;

  return null;
}

export function isAllowedFixedStarTarget(point) {
  return isPlanet(point) || isNode(point);
}

export function isAllowedAngleTarget(point) {
  return isPlanet(point) || isNode(point);
}

export function getRuleInvalidReason(pointA, pointB, aspectName, pairType) {
  if (pairType === "POINT_TO_HOUSE") {
    const nonHousePoint = isHouse(pointA) ? pointB : pointA;

    if (!isAllowedAngleTarget(nonHousePoint)) {
      return "ANGLE_TARGET_NOT_ALLOWED";
    }

    if (!isMajorAspectName(aspectName)) {
      return "ANGLE_MINOR_ASPECT_NOT_ALLOWED";
    }
  }

  if (isFixedStar(pointA) && isFixedStar(pointB)) {
    return "FIXED_STAR_TO_FIXED_STAR";
  }

  if (hasFixedStar(pointA, pointB)) {
    const otherPoint = getOtherPoint(pointA, pointB, isFixedStar);

    if (!isAllowedFixedStarTarget(otherPoint)) {
      return "FIXED_STAR_TARGET_NOT_ALLOWED";
    }

    if (!FIXED_STAR_ALLOWED_ASPECTS.includes(aspectName)) {
      return "FIXED_STAR_ASPECT_NOT_ALLOWED";
    }
  }

  if (hasEclipse(pointA, pointB) && !ECLIPSE_ALLOWED_ASPECTS.includes(aspectName)) {
    return "ECLIPSE_ASPECT_NOT_ALLOWED";
  }

  return null;
}

export function calculateEclipseOrb(pointA, pointB, aspectName) {
  if (!ECLIPSE_ALLOWED_ASPECTS.includes(aspectName)) {
    return 0;
  }

  return hasLuminary(pointA, pointB) ? 3.0 : 2.0;
}

export function calculateLilithOrb(pointA, pointB) {
  const otherPoint = getOtherPoint(pointA, pointB, isLilithMedia);

  if (!otherPoint) {
    return 1.0;
  }

  if (isTranspersonalPlanet(otherPoint)) {
    return 1.5;
  }

  if (isPersonalPlanet(otherPoint) || isSocialPlanet(otherPoint)) {
    return 2.0;
  }

  if (isAsteroid(otherPoint)) {
    return 1.0;
  }

  return 1.0;
}

export function applyPartOfFortuneReducers(effectiveOrb, pointA, pointB, aspect) {
  if (!hasPartOfFortune(pointA, pointB)) {
    return effectiveOrb;
  }

  const otherPoint = getOtherPoint(pointA, pointB, isPartOfFortune);
  let adjustedOrb = effectiveOrb;

  if (otherPoint && isPlanet(otherPoint)) {
    adjustedOrb -= 0.5;
  }

  if (otherPoint && isAsteroid(otherPoint)) {
    adjustedOrb -= 1.0;
  }

  if (aspect.isMinor) {
    adjustedOrb -= 1.0;
  }

  if (otherPoint && isTranspersonalPlanet(otherPoint)) {
    adjustedOrb -= 1.0;
  }

  return adjustedOrb;
}

export function calculateEffectiveOrb(pointA, pointB, aspect) {
  const aspectName = aspect.name;
  let effectiveOrb = aspect.orb;

  if (hasEclipse(pointA, pointB)) {
    return calculateEclipseOrb(pointA, pointB, aspectName);
  }

  if (hasFixedStar(pointA, pointB)) {
    return 1.0;
  }

  if (hasLilithMedia(pointA, pointB)) {
    return calculateLilithOrb(pointA, pointB);
  }

  if (hasLuminary(pointA, pointB) && isMajorAspectName(aspectName)) {
    effectiveOrb += 1.0;
  }

  if (hasAsteroid(pointA, pointB)) {
    effectiveOrb -= 0.5;
  }

  if (isTranspersonalPersonalPair(pointA, pointB)) {
    const cap = isMajorAspectName(aspectName) ? 3.0 : 1.0;
    effectiveOrb = Math.min(effectiveOrb, cap);
  }

  effectiveOrb = applyPartOfFortuneReducers(effectiveOrb, pointA, pointB, aspect);

  return Math.max(0, roundDegree(effectiveOrb));
}

export function calculateResonanceBaseScore(difference, effectiveOrb) {
  if (effectiveOrb <= 0) {
    return difference === 0 ? 1 : 0;
  }

  if (difference > effectiveOrb) {
    return 0;
  }

  const ratio = Math.abs(difference) / effectiveOrb;
  const score = Math.cos((Math.PI / 2) * ratio) ** 2;

  return Number(score.toFixed(4));
}

export function getCompositionMultiplier(pointA, pointB) {
  const aIsPlanet = isPlanet(pointA);
  const bIsPlanet = isPlanet(pointB);
  const aIsAsteroid = isAsteroid(pointA);
  const bIsAsteroid = isAsteroid(pointB);

  if (aIsAsteroid && bIsAsteroid) {
    return 0.7;
  }

  if ((aIsPlanet && bIsAsteroid) || (bIsPlanet && aIsAsteroid)) {
    return 0.85;
  }

  return 1.0;
}

export function getConjunctionFalloffMultiplier(aspectName, difference, effectiveOrb) {
  if (aspectName !== "CONJUNCAO") {
    return 1.0;
  }

  if (difference <= 2 || effectiveOrb <= 0) {
    return 1.0;
  }

  const multiplier = 1 - ((Math.abs(difference) - 2) / effectiveOrb);

  return Number(Math.max(0, Math.min(1, multiplier)).toFixed(4));
}

export function getFamilyPriorityMultiplier(aspect) {
  if (aspect.isStructural) {
    return 1.0;
  }

  if (aspect.family === "kepleriano") {
    return 0.85;
  }

  if (aspect.family === "octil" || aspect.family === "inconjunto") {
    return 0.8;
  }

  if (aspect.family === "septenario" || aspect.family === "novil") {
    return 0.78;
  }

  return 0.8;
}

export function calculateResonanceScore(difference, effectiveOrb, compositionMultiplier = 1, conjunctionFalloffMultiplier = 1) {
  const baseScore = calculateResonanceBaseScore(difference, effectiveOrb);

  return Number((baseScore * compositionMultiplier * conjunctionFalloffMultiplier).toFixed(4));
}

export function classifyResonance(score) {
  if (score >= 0.9) return "dominante";
  if (score >= 0.75) return "muito_forte";
  if (score >= 0.6) return "forte";
  if (score >= 0.45) return "moderado";
  if (score >= 0.3) return "fraco";

  return "residual";
}

export function getBaseMinimumResonance(aspect) {
  if (aspect.isStructural) {
    return 0.15;
  }

  if (aspect.family === "septenario" || aspect.family === "novil") {
    return 0.4;
  }

  if (aspect.family === "kepleriano") {
    return 0.35;
  }

  return 0.35;
}

export function getPartOfFortuneMinimumResonance(aspect) {
  if (aspect.isStructural) {
    return 0.2;
  }

  if (aspect.family === "kepleriano") {
    return 0.45;
  }

  return 0.4;
}

export function getMinimumResonance(aspect, pointA, pointB, pairType) {
  let minimumResonance = getBaseMinimumResonance(aspect);

  if (hasPartOfFortune(pointA, pointB)) {
    minimumResonance = Math.max(minimumResonance, getPartOfFortuneMinimumResonance(aspect));
  }

  if (pairType === "POINT_TO_HOUSE") {
    minimumResonance += 0.1;
  }

  if (pairType === "POINT_TO_HOUSE" && hasFixedStar(pointA, pointB)) {
    minimumResonance += 0.2;
  }

  return Number(minimumResonance.toFixed(4));
}

export function buildAspectResult(aspect, difference, distance, effectiveOrb, invalidReason, pointA = null, pointB = null, pairType = null) {
  const compositionMultiplier = pointA && pointB ? getCompositionMultiplier(pointA, pointB) : 1;
  const conjunctionFalloffMultiplier = getConjunctionFalloffMultiplier(aspect.name, difference, effectiveOrb);
  const familyPriorityMultiplier = getFamilyPriorityMultiplier(aspect);
  const resonanceBaseScore = calculateResonanceBaseScore(difference, effectiveOrb);
  const resonanceScore = calculateResonanceScore(
    difference,
    effectiveOrb,
    compositionMultiplier,
    conjunctionFalloffMultiplier
  );
  const finalPhenomenologicalWeight = Number((resonanceScore * familyPriorityMultiplier).toFixed(4));
  const minimumResonance = pointA && pointB
    ? getMinimumResonance(aspect, pointA, pointB, pairType)
    : getBaseMinimumResonance(aspect);
  const isRelevant = resonanceScore >= minimumResonance;

  return {
    aspect: aspect.name,
    angle: aspect.angle,
    orb: aspect.orb,
    effectiveOrb,
    distance,
    difference,
    exact: difference === 0,
    withinOrb: difference <= effectiveOrb,
    validGeometry: difference <= effectiveOrb,
    validAstrologica: difference <= effectiveOrb && invalidReason === null,
    invalidReason,
    family: aspect.family,
    harmonic: aspect.harmonic,
    isMinor: aspect.isMinor,
    isStructural: aspect.isStructural,
    isKarmic: aspect.isKarmic,
    resonanceBaseScore,
    compositionMultiplier,
    conjunctionFalloffMultiplier,
    resonanceScore,
    resonanceClass: classifyResonance(resonanceScore),
    minimumResonance,
    isRelevant,
    relevanceReason: isRelevant ? null : "LOW_RESONANCE",
    familyPriorityMultiplier,
    finalPhenomenologicalWeight
  };
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

      return buildAspectResult(aspect, difference, distance, aspect.orb, null);
    })
    .filter((result) => result.withinOrb && result.isRelevant)
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

export function identifyAspectsForPair(pointA, pointB, aspectNames = null, pairType = null) {
  const normalizedAspectNames = normalizeAspectNames(aspectNames);
  const distance = calculateAngularDistance(pointA.longitude, pointB.longitude);
  const aspectsToCheck = normalizedAspectNames
    ? ASPECTS.filter((aspect) => normalizedAspectNames.includes(aspect.name))
    : ASPECTS;

  const matches = aspectsToCheck
    .map((aspect) => {
      const difference = roundDegree(Math.abs(distance - aspect.angle));
      const invalidReason = getRuleInvalidReason(pointA, pointB, aspect.name, pairType);
      const effectiveOrb = calculateEffectiveOrb(pointA, pointB, aspect);

      return buildAspectResult(aspect, difference, distance, effectiveOrb, invalidReason, pointA, pointB, pairType);
    })
    .filter((result) => result.validGeometry)
    .sort((a, b) => a.difference - b.difference);

  return {
    input: {
      degreeA: pointA.longitude,
      degreeB: pointB.longitude
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
    type: normalizeObjectType(point.type),
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

  if (!ANGULAR_HOUSES.includes(houseNumber)) {
    return null;
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
  const lines = results.flatMap((result) => result.aspects.map((aspect) => formatPipeLine(result, aspect)));

  return [header, ...lines];
}

export function formatPipeText(pipeResults) {
  return pipeResults.join("\n");
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
  const housePoints = safeHouses.map((house, index) => houseToPoint(house, index)).filter(Boolean);
  const allPoints = [...normalizedPoints, ...housePoints];

  if (allPoints.length < 2) {
    throw new Error("At least two points or angular houses are required.");
  }

  const results = [];
  let pairsChecked = 0;
  let pairsSkipped = 0;
  let astrologicaInvalidAspects = 0;
  let lowResonanceAspects = 0;
  const ignoredHousesCount = safeHouses.length - housePoints.length;

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

      const calculation = identifyAspectsForPair(pointA, pointB, normalizedOptions.aspectNames, pairType);

      if (calculation.aspects.length > 0) {
        const validAspects = calculation.aspects
          .map((aspect) => ({
            ...aspect,
            applyingSeparating: calculateApplyingSeparating(pointA, pointB, aspect.angle)
          }))
          .filter((aspect) => {
            if (!aspect.validAstrologica) {
              astrologicaInvalidAspects += 1;
              return false;
            }

            if (!aspect.isRelevant) {
              lowResonanceAspects += 1;
              return false;
            }

            return true;
          });

        if (validAspects.length > 0) {
          results.push({
            pairType,
            pointA: serializePoint(pointA),
            pointB: serializePoint(pointB),
            distance: calculation.distance,
            aspects: validAspects
          });
        }
      }
    }
  }

  const sortedResults = sortResults(results, normalizedOptions.sortBy);

  if (normalizedOptions.outputFormat === "pipe") {
    const pipeResults = formatPipeResults(sortedResults);

    return {
      pointsCount: normalizedPoints.length,
      housesCount: housePoints.length,
      ignoredHousesCount,
      totalObjectsCount: allPoints.length,
      pairsChecked,
      pairsSkipped,
      astrologicaInvalidAspects,
      lowResonanceAspects,
      aspectsFound: sortedResults.length,
      options: normalizedOptions,
      format: "pipe",
      results: pipeResults,
      resultsText: formatPipeText(pipeResults)
    };
  }

  return {
    pointsCount: normalizedPoints.length,
    housesCount: housePoints.length,
    ignoredHousesCount,
    totalObjectsCount: allPoints.length,
    pairsChecked,
    pairsSkipped,
    astrologicaInvalidAspects,
    lowResonanceAspects,
    aspectsFound: sortedResults.length,
    options: normalizedOptions,
    results: sortedResults
  };
}
