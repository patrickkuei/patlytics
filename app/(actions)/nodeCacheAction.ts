import NodeCache from "node-cache";

import type { PatentResponseType } from "../(types)/patent";

const TTL = 3600;

const cache = new NodeCache({ stdTTL: TTL });

export const getCachedPatentResult = async (
  patentId: string,
  companyName: string
) => {
  const cacheKey = `${patentId}-${companyName}`;
  const cachedResult = cache.get(cacheKey);

  if (cachedResult) {
    return cachedResult as PatentResponseType;
  }

  return null;
};

export const setCachedPatentResult = (
  patentId: string,
  companyName: string,
  result: PatentResponseType
) => {
  const cacheKey = `${patentId}-${companyName}`;
  cache.set(cacheKey, result);
};
