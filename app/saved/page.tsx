"use client";

import { useLayoutEffect, useState } from "react";
import Loader from "../(components)/Loader";

import type { PatentCheckResult } from "../(types)/patent";

const ProductItem = ({
  product,
}: {
  product: PatentCheckResult["products"][number];
}) => (
  <div key={product.name} className="mb-4">
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

const SavedResultItem = ({
  result,
  deleteStatus,
  handleDelete,
}: {
  result: PatentCheckResult;
  deleteStatus: "idle" | "deleting" | "deleted";
  handleDelete: (companyName: string, patentId: string) => void;
}) => {
  const { companyName, patentId, products } = result;

  return (
    <>
      <h2 className="text-lg text-text mb-2">
        Check Results {`${companyName} - ${patentId}`}
        <button
          className={`rounded px-2 ml-4 transition text-text ${
            deleteStatus === "deleting"
              ? "bg-slate-700 cursor-wait"
              : deleteStatus === "deleted"
              ? "bg-slate-800"
              : "bg-red-900 hover:bg-red-500"
          }`}
          onClick={() => handleDelete(companyName, patentId)}
          disabled={deleteStatus === "deleting" || deleteStatus === "deleted"}
        >
          {deleteStatus === "deleting"
            ? "Deleting..."
            : deleteStatus === "deleted"
            ? "Deleted"
            : "Delete"}
        </button>
      </h2>
      {products.map((product) => (
        <ProductItem key={product.name} product={product} />
      ))}
    </>
  );
};

const Saved = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [savedResults, setSavedResults] = useState<PatentCheckResult[]>([]);
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "deleting" | "deleted"
  >("idle");

  useLayoutEffect(() => {
    const results = JSON.parse(localStorage.getItem("savedResults") || "[]");
    setSavedResults(results);
    setIsLoading(false);
  }, []);

  const handleDelete = async (companyName: string, patentId: string) => {
    setDeleteStatus("deleting");

    await new Promise<void>((resolve) =>
      setTimeout(() => {
        const updatedResults = savedResults.filter(
          (result) =>
            !(
              result.companyName === companyName && result.patentId === patentId
            )
        );

        localStorage.setItem("savedResults", JSON.stringify(updatedResults));

        setDeleteStatus("deleted");
        setSavedResults(updatedResults);
        resolve();
      }, 1000)
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-primary flex justify-center">
      <div className="w-full max-w-3xl p-4 flex flex-col gap-4 mt-12 overflow-auto">
        <h2 className="text-lg font-semibold text-text mb-2">Saved Results</h2>
        {isLoading ? (
          <Loader />
        ) : savedResults.length === 0 ? (
          <p className="text-text">No saved results found.</p>
        ) : (
          savedResults.map((result) => (
            <SavedResultItem
              key={result.companyName + result.patentId + Date.now()}
              result={result}
              deleteStatus={deleteStatus}
              handleDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Saved;
