"use server";

import Fuse from "fuse.js";
import MockCompanyAndProducts from "../(mocks)/company_products.json";
import MockPatents from "../(mocks)/patents.json";
import { getPatentResult } from "./openAiAction";

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

const _getProductPrompt = (companyName: string): string | null => {
  const companyFuse = new Fuse(mockCompanies, companyFuseOptions);

  try {
    const { item: targetCompanyName } = companyFuse.search(companyName)[0];
    const targetCompany = MockCompanyAndProducts.companies.find(
      (company) => company.name === targetCompanyName
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
    }
  } catch (error) {
    console.error(error);
  }

  return null;
};

const _getClaim = (
  patentId: string
): { text: string; num: string }[] | null => {
  const patentIdFuse = new Fuse(mockPatentIds, patentIdFuseOptions);

  try {
    const { item: targetPatentId } = patentIdFuse.search(patentId)[0];
    const targetPatent = MockPatents.find(
      (patent) => patent.publication_number === targetPatentId
    );

    if (targetPatent) {
      const claim = JSON.parse(targetPatent.claims);

      return claim;
    }
  } catch (error) {
    console.error(error);
  }

  return null;
};

const _getClaimPrompt = (
  claims: { num: string; text: string }[]
): string | null => {
  try {
    const claimPrompt = claims
      .map((claim: { text: string }) => claim.text)
      .join(" ");

    return claimPrompt;
  } catch (error) {
    console.error(error);
  }

  return null;
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
      return '"No specific claims identified"';
    }
  });

  return detailClaims;
};

export const getResult = async (patentId: string, companyName: string) => {
  const productsPrompt = _getProductPrompt(companyName);
  const claims = _getClaim(patentId);
  let claimPrompt = null;

  if (claims) {
    claimPrompt = _getClaimPrompt(claims);
  } else {
    throw new Error("Invalid Patent ID");
  }

  try {
    if (
      productsPrompt &&
      productsPrompt.length > 0 &&
      claimPrompt &&
      claimPrompt.length > 0
    ) {
      const res = await getPatentResult(productsPrompt, claimPrompt);

      if (res) {
        const { topInfringingProducts } = res;
        const resViewModel = topInfringingProducts.map((res) => ({
          name: res.productName,
          reason: res.infringementExplanation,
          claimsAtIssue: _getDetailClaims(claims, res.claimsAtIssue),
        }));

        return resViewModel;
      } else {
        throw new Error("Invalid LLM Result");
      }
    } else {
      throw new Error("Invalid Prompt");
    }
  } catch (error) {
    console.error(error);
  }
};
