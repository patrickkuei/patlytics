import type { PatentCheckResult } from "../(types)/patent";

interface ResultsProps {
  results?: PatentCheckResult;
}

const Results = ({ results }: ResultsProps) => {
  const { products = [], companyName, patentId } = results || {};

  return (
    <div className="bg-primary px-5 mb-6 rounded-md shadow-md min-h-80 overflow-y-auto">
      <h2 className="text-lg font-semibold text-text mb-2">
        Check Results{" "}
        {companyName && patentId ? `${companyName} - ${patentId}` : ""}
      </h2>
      {products.length === 0 ? (
        <p className="text-text">No potentially infringing products found.</p>
      ) : (
        products.map((product) => (
          <div key={product.name} className="mb-4">
            <h3 className="text-md font-bold text-text">
              Product Name: {product.name}
            </h3>
            <p className="text-sm text-text mt-1">
              <span className="font-bold">
                Potential Infringement Explanation:{" "}
              </span>
              {product.reason}
            </p>
            <div className="text-sm text-text mt-1">
              <span className="font-bold">Claims at Issue: </span>
              {product.claimsAtIssue && product.claimsAtIssue.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {product.claimsAtIssue.map((claim) => (
                    <li
                      key={claim}
                      className="pl-4 space-x-4 border-l border-gray-600"
                    >
                      <p className="text-sm text-gray-300 mt-1">
                        Claim {claim}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                "No specific claims identified"
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Results;
