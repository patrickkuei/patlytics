"use server";

import Fuse from "fuse.js";
import MockCompanyAndProducts from "../(mocks)/company_products.json";
import MockPatents from "../(mocks)/patents.json";
import {
  getCachedPatentResult,
  setCachedPatentResult,
} from "./nodeCacheAction";
import { getPatentResult } from "./openAiAction";

import type { PatentResponseType } from "../(types)/patent";

const mockCompanies = MockCompanyAndProducts.companies.map((c) => c.name);
const mockPatentIds = MockPatents.map((p) => p.publication_number);

const FUSSY_SEARCH_THRESHOLD = 0.3;

const companyFuseOptions = {
  keys: ["name"],
  threshold: FUSSY_SEARCH_THRESHOLD,
};
const patentIdFuseOptions = {
  keys: [],
  threshold: FUSSY_SEARCH_THRESHOLD,
};

const _getCompanyName = (rawCompanyName: string) => {
  const companyFuse = new Fuse(mockCompanies, companyFuseOptions);
  const { item: companyName } = companyFuse.search(rawCompanyName)[0];

  return companyName;
};

const _getProductPrompt = (companyName: string): string => {
  const targetCompany = MockCompanyAndProducts.companies.find(
    (company) => company.name === companyName
  );

  if (targetCompany) {
    const productsPrompt = targetCompany.products
      .map(
        (product, index) =>
          `${index + 1} Product Name: ${product.name}\n  Description: ${
            product.description
          }`
      )
      .join("\n\n");

    return productsPrompt;
  } else {
    throw new Error("Invalid Company Name");
  }
};

const _getPatentId = (rawPatentId: string) => {
  const patentIdFuse = new Fuse(mockPatentIds, patentIdFuseOptions);
  const { item: patentId } = patentIdFuse.search(rawPatentId)[0];

  return patentId;
};

const _getClaim = (
  patentId: string
): { text: string; num: string }[] | undefined => {
  const targetPatent = MockPatents.find(
    (patent) => patent.publication_number === patentId
  );

  if (targetPatent) {
    const claim = JSON.parse(targetPatent.claims);

    return claim;
  }
};

const _getClaimPrompt = (claims: { num: string; text: string }[]): string => {
  const claimPrompt = claims
    .map((claim: { text: string }) => claim.text)
    .join(" ");

  return claimPrompt;
};

const _getDetailClaims = (
  claims: { num: string; text: string }[],
  claimsAtIssue: string[]
) => {
  const detailClaims = claimsAtIssue.map((claimNumber) => {
    const detail = claims.find(
      (claim) => Number(claim.num) === Number(claimNumber)
    );

    if (detail) {
      return detail.text;
    } else {
      return "No specific claims identified";
    }
  });

  return detailClaims;
};

const _getResViewModel = (
  res: PatentResponseType,
  claims: {
    text: string;
    num: string;
  }[]
) => {
  const { topInfringingProducts } = res;
  const resViewModel = topInfringingProducts.map((res) => ({
    name: res.productName,
    reason: res.infringementExplanation,
    claimsAtIssue: _getDetailClaims(claims, res.claimsAtIssue),
  }));

  return resViewModel;
};

export const getResult = async (
  rawPatentId: string,
  rawCompanyName: string
) => {
  const companyName = _getCompanyName(rawCompanyName);
  const productsPrompt = _getProductPrompt(companyName);

  const patentId = _getPatentId(rawPatentId);
  const claims = _getClaim(patentId);
  let claimPrompt = null;

  if (claims) {
    claimPrompt = _getClaimPrompt(claims);
  } else {
    throw new Error("Invalid Patent ID");
  }

  const cachedResult = await getCachedPatentResult(patentId, companyName);

  if (cachedResult) {
    return _getResViewModel(cachedResult, claims);
  }

  try {
    if (
      productsPrompt &&
      productsPrompt.length > 0 &&
      claimPrompt &&
      claimPrompt.length > 0
    ) {
      console.log("Start LLM Completion");

      const res = await getPatentResult(productsPrompt, claimPrompt);

      if (res) {
        setCachedPatentResult(patentId, companyName, res);

        const resViewModel = _getResViewModel(res, claims);

        return resViewModel;
      } else {
        throw new Error("Invalid LLM Result");
      }
    } else {
      throw new Error("Invalid Prompt");
    }
  } catch (error) {
    console.error(error);

    throw error;
  }
};
