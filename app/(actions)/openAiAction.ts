import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  apiKey: process.env.API_KEY,
});

const _getPatentPrompt = async (
  productsPrompt: string,
  claimPrompt: string
) => {
  const promptTemplate = PromptTemplate.fromTemplate(
    "You are an expert in patent law and technology evaluation. Below is a list of products, their descriptions, and a patent claim. Your task is to evaluate each product to determine if it potentially infringes on the patent claim. For any product that potentially infringes, rank the products by the likelihood of infringement and return only the top two infringing products. For each, provide an explanation detailing why the product potentially infringes on the patent, specifically identifying the relevant claims that are at issue.\n\n### Products and Descriptions:\n\n{products}\n\n### Patent Claim:\n\n{claim}"
  );

  const { value } = await promptTemplate.invoke({
    products: productsPrompt,
    claim: claimPrompt,
  });

  return value;
};

export const getPatentResult = async (
  productsPrompt: string,
  claimPrompt: string
) => {
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

  const ResponseSchema = z.object({
    topInfringingProducts: z
      .array(ProductSchema)
      .max(2)
      .describe(
        "A list of products that most likely infringe on the patent, including explanations."
      ),
  });

  const structuredLlm = model.withStructuredOutput(ResponseSchema);

  try {
    const prompt = await _getPatentPrompt(productsPrompt, claimPrompt);
    const res = await structuredLlm.invoke(prompt);

    return res;
  } catch (error) {
    console.error(error);
  }
};
