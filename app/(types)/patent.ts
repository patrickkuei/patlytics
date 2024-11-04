import { z } from "zod";

export type InfringePatentProduct = {
  name: string;
  reason: string;
  claimsAtIssue: string[];
};

const ProductSchema = z.object({
  productName: z
    .string()
    .describe(
      "The name of the product that potentially infringes on the patent."
    ),
  infringementExplanation: z
    .string()
    .describe(
      "A detailed explanation of why this product may infringe on the patent, outlining specific similarities or overlaps."
    ),
  claimsAtIssue: z
    .array(z.string())
    .describe(
      "A list of specific patent claims number that the product potentially infringes upon."
    ),
});

export const ResponseSchema = z.object({
  topInfringingProducts: z
    .array(ProductSchema)
    .max(2)
    .describe(
      "A list of products that most likely infringe on the patent, including explanations."
    ),
});

export type PatentResponseType = z.infer<typeof ResponseSchema>;
