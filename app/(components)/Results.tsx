"use client";

import { useState } from "react";

import type { PatentCheckResult } from "../(types)/patent";

const ProductItem = ({
  product,
}: {
  product: PatentCheckResult["products"][number];
}) => (
  <div className="mb-4">
    <h3 className="text-md font-bold text-text">
      Product Name: {product.name}
    </h3>
    <p className="text-sm text-text mt-1">
      <span className="font-bold">Potential Infringement Explanation: </span>
      {product.reason}
    </p>
    <div className="text-sm text-text mt-1">
      <span className="font-bold">Claims at Issue: </span>
      {product.claimsAtIssue && product.claimsAtIssue.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {product.claimsAtIssue.map((claim) => (
            <li key={claim} className="pl-4 space-x-4 border-l border-gray-600">
              <p className="text-sm text-gray-300 mt-1">Claim {claim}</p>
            </li>
          ))}
        </ul>
      ) : (
        "No specific claims identified"
      )}
    </div>
  </div>
);

const SaveButton = ({ results }: { results: PatentCheckResult }) => {
  const { companyName, patentId } = results;

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    () => {
      const savedResults: PatentCheckResult[] = JSON.parse(
        localStorage.getItem("savedResults") || "[]"
      );

      if (
        savedResults.some(
          (result) =>
            result.companyName === companyName && result.patentId === patentId
        )
      ) {
        return "saved";
      }
      return "idle";
    }
  );

  const handleSaveClick = async () => {
    setSaveStatus("saving");

    await new Promise<void>((resolve) =>
      setTimeout(() => {
        const savedResults: PatentCheckResult[] = JSON.parse(
          localStorage.getItem("savedResults") || "[]"
        );

        savedResults.unshift(results);
        localStorage.setItem("savedResults", JSON.stringify(savedResults));
        resolve();
      }, 1000)
    );

    setSaveStatus("saved");
  };

  return (
    <button
      className={`rounded px-2 ml-4 transition text-text ${
        saveStatus === "saving"
          ? "bg-slate-700 cursor-wait"
          : saveStatus === "saved"
          ? "bg-slate-800"
          : "bg-red-900 hover:bg-red-500"
      }`}
      onClick={handleSaveClick}
      disabled={saveStatus === "saving" || saveStatus === "saved"}
    >
      {saveStatus === "saving"
        ? "Saving..."
        : saveStatus === "saved"
        ? "Saved"
        : "Save"}
    </button>
  );
};

const ResultsHeader = ({ results }: { results: PatentCheckResult }) => {
  const { companyName, patentId } = results;

  return (
    <h2 className="text-lg text-text mb-2">
      Check Results{" "}
      {companyName.length > 0 && patentId.length > 0 ? (
        <>
          {`${companyName} - ${patentId}`}
          <SaveButton results={results} />
        </>
      ) : null}
    </h2>
  );
};

interface ResultsProps {
  results?: PatentCheckResult;
}

const Results = ({
  results = {
    products: [],
    companyName: "",
    patentId: "",
  },
}: ResultsProps) => {
  return (
    <div className="bg-primary px-5 mb-6 rounded-md shadow-md min-h-80 overflow-y-auto">
      <ResultsHeader results={results} />
      {results.products.length === 0 ? (
        <p className="text-text">No potentially infringing products found.</p>
      ) : (
        results.products.map((product) => (
          <ProductItem key={product.name} product={product} />
        ))
      )}
    </div>
  );
};

export default Results;
