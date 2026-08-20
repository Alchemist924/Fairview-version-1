import type { Property } from "./mock-data";

/** Stop words to ignore during natural language search */
const STOP_WORDS = new Set([
  "for", "in", "near", "at", "the", "a", "an", "with", "of", "and", "to", "is", "available", "property", "properties", "buy", "find"
]);

/** Common term synonyms and normalizations */
const SYNONYMS: Record<string, string[]> = {
  "selfcontain": ["self contain", "self-contain", "selfcontained", "self-contained", "selfcon", "studio"],
  "bungalow": ["bungalow", "bungalw", "bungalo"],
  "apartment": ["apartment", "apartmnt", "flat", "flats", "suite"],
  "land": ["land", "lands", "plot", "plots"],
  "shop": ["shop", "shops", "store", "stores", "commercial"],
  "ipetumodu": ["ipetumodu", "ipetumod", "ipet"],
  "fasina": ["fasina", "fasna"],
  "moremi": ["moremi", "mormi"],
  "sale": ["sale", "for sale", "buy"],
  "rent": ["rent", "for rent", "rental"],
  "lease": ["lease", "for lease"]
};

/** Calculate Levenshtein distance between two strings */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/** Normalize string for comparison (removes hyphens/punctuation, lowercases) */
export function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[-_/,.:;()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Check if query token matches a target word (exact, prefix, synonym, or typo-tolerant) */
function matchToken(queryToken: string, targetWords: string[]): { matched: boolean; isTypo: boolean; score: number } {
  const normQuery = normalizeText(queryToken);
  if (!normQuery) return { matched: false, isTypo: false, score: 0 };

  // 1. Direct or substring match
  for (const word of targetWords) {
    const normWord = normalizeText(word);
    if (!normWord) continue;

    if (normWord === normQuery) {
      return { matched: true, isTypo: false, score: 1.0 };
    }
    if (normWord.includes(normQuery) || normQuery.includes(normWord)) {
      return { matched: true, isTypo: false, score: 0.8 };
    }
  }

  // 2. Check synonyms
  for (const [key, synList] of Object.entries(SYNONYMS)) {
    const isQueryInSyn = synList.some((s) => normalizeText(s) === normQuery) || key === normQuery;
    if (isQueryInSyn) {
      for (const word of targetWords) {
        const normWord = normalizeText(word);
        if (normWord.includes(key) || synList.some((s) => normWord.includes(normalizeText(s)))) {
          return { matched: true, isTypo: false, score: 0.9 };
        }
      }
    }
  }

  // 3. Typo tolerance (Levenshtein distance)
  if (normQuery.length >= 4) {
    const maxDist = normQuery.length >= 7 ? 2 : 1;
    for (const word of targetWords) {
      const normWord = normalizeText(word);
      const parts = normWord.split(" ");
      for (const part of parts) {
        if (part.length >= 3 && Math.abs(part.length - normQuery.length) <= 2) {
          const dist = levenshteinDistance(normQuery, part);
          if (dist <= maxDist) {
            return { matched: true, isTypo: true, score: 0.7 };
          }
        }
      }
    }
  }

  return { matched: false, isTypo: false, score: 0 };
}

export interface SearchResultItem {
  property: Property;
  score: number;
  matchReasons: string[];
}

export interface SearchEngineResult {
  exactMatches: Property[];
  closeMatches: Property[];
  totalMatches: number;
  query: string;
}

/** Score a single property against search query */
export function scoreProperty(property: Property, rawQuery: string): SearchResultItem {
  const normQuery = normalizeText(rawQuery);
  if (!normQuery) {
    return { property, score: 0, matchReasons: [] };
  }

  let totalScore = 0;
  const matchReasons: string[] = [];

  const normTitle = normalizeText(property.title);
  const normLocation = normalizeText(property.location);
  const normDescription = normalizeText(property.description);
  const normCategory = normalizeText(property.category);
  const normListingType = normalizeText(property.listingType);
  const normSize = normalizeText(property.size);
  const normPrice = normalizeText(property.price);
  const normFeatures = (property.features || []).map(normalizeText).join(" ");

  // Full exact phrase match in title or location
  if (normTitle.includes(normQuery)) {
    totalScore += 100;
    matchReasons.push("Title phrase match");
  }
  if (normLocation.includes(normQuery)) {
    totalScore += 120;
    matchReasons.push("Location phrase match");
  }

  // Tokenized search
  const rawTokens = normQuery.split(" ").filter(Boolean);
  const searchTokens = rawTokens.filter((t) => !STOP_WORDS.has(t) || rawTokens.length === 1);

  if (searchTokens.length === 0) {
    return { property, score: totalScore, matchReasons };
  }

  let tokensMatched = 0;

  for (const token of searchTokens) {
    let tokenMatched = false;

    // Location check
    const locResult = matchToken(token, [normLocation]);
    if (locResult.matched) {
      totalScore += 60 * locResult.score;
      tokenMatched = true;
      matchReasons.push(`Location match (${token})`);
    }

    // Title check
    const titleResult = matchToken(token, [normTitle]);
    if (titleResult.matched) {
      totalScore += 50 * titleResult.score;
      tokenMatched = true;
      matchReasons.push(`Title match (${token})`);
    }

    // Category / Listing Type check
    const catResult = matchToken(token, [normCategory, normListingType]);
    if (catResult.matched) {
      totalScore += 45 * catResult.score;
      tokenMatched = true;
      matchReasons.push(`Category/Type match (${token})`);
    }

    // Size / Price check
    const sizeResult = matchToken(token, [normSize, normPrice]);
    if (sizeResult.matched) {
      totalScore += 35 * sizeResult.score;
      tokenMatched = true;
      matchReasons.push(`Size/Price match (${token})`);
    }

    // Features check
    const featResult = matchToken(token, [normFeatures]);
    if (featResult.matched) {
      totalScore += 30 * featResult.score;
      tokenMatched = true;
      matchReasons.push(`Features match (${token})`);
    }

    // Description check
    const descResult = matchToken(token, [normDescription]);
    if (descResult.matched) {
      totalScore += 15 * descResult.score;
      tokenMatched = true;
      matchReasons.push(`Description match (${token})`);
    }

    if (tokenMatched) {
      tokensMatched++;
    }
  }

  // Multi-token coverage multiplier
  if (searchTokens.length > 1) {
    const coverageRatio = tokensMatched / searchTokens.length;
    if (coverageRatio === 1) {
      totalScore *= 1.6; // All query concepts matched!
    } else if (coverageRatio >= 0.5) {
      totalScore *= 1.2;
    }
  }

  return {
    property,
    score: Math.round(totalScore),
    matchReasons: Array.from(new Set(matchReasons)),
  };
}

/** Filter and rank properties using the search engine */
export function searchProperties(
  properties: Property[],
  query: string
): SearchEngineResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      exactMatches: properties,
      closeMatches: [],
      totalMatches: properties.length,
      query: "",
    };
  }

  const scored = properties
    .map((p) => scoreProperty(p, trimmed))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const exactMatches = scored.filter((item) => item.score >= 35).map((item) => item.property);
  const closeMatches = scored.filter((item) => item.score < 35 && item.score >= 10).map((item) => item.property);

  return {
    exactMatches,
    closeMatches: exactMatches.length > 0 ? [] : closeMatches,
    totalMatches: exactMatches.length > 0 ? exactMatches.length : closeMatches.length,
    query: trimmed,
  };
}

export interface AutocompleteSuggestion {
  text: string;
  type: "location" | "category" | "feature" | "property";
  subtext?: string;
  /** For property suggestions: the property slug used to build /property/<slug> */
  slug?: string;
  /** For category suggestions: the canonical route, e.g. /lands-for-sale */
  route?: string;
}

/** Generate dynamic autocomplete suggestions based on properties dataset */
export function getSearchSuggestions(
  properties: Property[],
  query: string
): AutocompleteSuggestion[] {
  const normQuery = normalizeText(query);
  if (!normQuery || normQuery.length < 2) return [];

  const suggestions: AutocompleteSuggestion[] = [];
  const seen = new Set<string>();

  // 1. Check locations
  const locations = Array.from(new Set(properties.map((p) => p.location.trim())));
  for (const loc of locations) {
    const normLoc = normalizeText(loc);
    if (normLoc.includes(normQuery) || matchToken(normQuery, [normLoc]).matched) {
      const key = `loc:${loc}`;
      if (!seen.has(key)) {
        seen.add(key);
        suggestions.push({
          text: loc,
          type: "location",
          subtext: "Location",
        });
      }
    }
  }

  // 2. Check property categories & listing types
  const categories: { name: string; query: string; route: string }[] = [
    { name: "Lands for Sale", query: "Land", route: "/lands-for-sale" },
    { name: "Properties for Sale", query: "Properties for Sale", route: "/properties-for-sale" },
    { name: "Apartments for Rent", query: "Apartment", route: "/apartments-for-rent" },
    { name: "Shops for Lease", query: "Shop for Lease", route: "/shops-for-lease" },
    { name: "Bungalows", query: "Bungalow", route: "/properties-for-sale" },
    { name: "Self Contain", query: "Self Contain", route: "/apartments-for-rent" },
  ];

  for (const cat of categories) {
    if (normalizeText(cat.name).includes(normQuery) || normalizeText(cat.query).includes(normQuery)) {
      const key = `cat:${cat.name}`;
      if (!seen.has(key)) {
        seen.add(key);
        suggestions.push({
          text: cat.name,
          type: "category",
          subtext: "Category / Type",
          route: cat.route,
        });
      }
    }
  }

  // 3. Property title matches
  for (const p of properties) {
    if (normalizeText(p.title).includes(normQuery)) {
      const key = `prop:${p.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        suggestions.push({
          text: p.title,
          type: "property",
          subtext: p.location,
          slug: p.slug,
        });
      }
    }
  }

  return suggestions.slice(0, 6);
}

export interface SearchRouteResolution {
  path: string;
  category?: string;
  isPropertyDetail?: boolean;
}

/**
 * Determines the most appropriate destination route for a search query.
 * Distinguishes between specific property matches, category-specific queries
 * (Lands for Sale, Shops for Lease, Apartments for Rent, Properties for Sale),
 * and generic location/feature keyword searches.
 */
export function resolveSearchRoute(
  query: string,
  properties: Property[] = []
): SearchRouteResolution {
  const trimmed = query.trim();
  if (!trimmed) {
    return { path: "/properties-for-sale" };
  }

  const norm = normalizeText(trimmed);

  // 1. Direct property title match
  if (properties.length > 0) {
    const exactProp = properties.find((p) => normalizeText(p.title) === norm);
    if (exactProp) {
      return {
        path: `/property/${exactProp.slug}`,
        category: exactProp.category,
        isPropertyDetail: true,
      };
    }
  }

  const encodedQuery = encodeURIComponent(trimmed);

  // 2. Category intent matching
  // Lands for Sale
  const landRegex = /\b(lands?|plots?|acres?|hectares?|farmlands?)\b/i;
  if (landRegex.test(norm)) {
    return {
      path: `/lands-for-sale?search=${encodedQuery}`,
      category: "land",
    };
  }

  // Shops for Lease / Commercial
  const shopRegex = /\b(shops?|stores?|commercial|lease|for lease|offices?|warehouses?|plazas?|stalls?)\b/i;
  if (shopRegex.test(norm)) {
    return {
      path: `/shops-for-lease?search=${encodedQuery}`,
      category: "shop",
    };
  }

  // Apartments for Rent
  const apartmentRegex = /\b(apartm(e|n)?ts?|flats?|rent(al|als)?|for rent|to let|self[\s-]?con(tain(ed)?)?|studio|mini[\s-]?flat|room\s+(and|&)\s+parlo(u)?r|hostels?)\b/i;
  if (apartmentRegex.test(norm)) {
    return {
      path: `/apartments-for-rent?search=${encodedQuery}`,
      category: "apartment",
    };
  }

  // Properties / Houses for Sale
  const propertySaleRegex = /\b(hous(e|es)|duplex(es)?|bungal(ow|w|o)s?|mansions?|buildings?|terraces?|propert(y|ies)|for sale|sale|buy)\b/i;
  if (propertySaleRegex.test(norm)) {
    return {
      path: `/properties-for-sale?search=${encodedQuery}`,
      category: "property",
    };
  }

  // 3. Generic Location / Feature Search
  // If properties are loaded, check if all matching properties belong to a single category
  if (properties.length > 0) {
    const searchResult = searchProperties(properties, trimmed);
    const matches = searchResult.exactMatches.length > 0 ? searchResult.exactMatches : searchResult.closeMatches;
    if (matches.length > 0) {
      const categories = Array.from(new Set(matches.map((p) => p.category)));
      if (categories.length === 1) {
        const cat = categories[0];
        const categoryRouteMap: Record<string, string> = {
          land: "/lands-for-sale",
          shop: "/shops-for-lease",
          apartment: "/apartments-for-rent",
          property: "/properties-for-sale",
        };
        const baseRoute = categoryRouteMap[cat] || "/properties-for-sale";
        return {
          path: `${baseRoute}?search=${encodedQuery}`,
          category: cat,
        };
      }
    }
  }

  // Default fallback preserving user query
  return {
    path: `/properties-for-sale?search=${encodedQuery}`,
  };
}
