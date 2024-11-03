import type { InfringePatentProduct } from "../(types)/patent";

interface ResultsProps {
  results: InfringePatentProduct[];
}

const Results = ({ results }: ResultsProps) => {
  return (
    <div className="bg-primary px-5 mb-6 rounded-md shadow-md min-h-80 overflow-y-auto">
      <h2 className="text-lg font-semibold text-text mb-2">Check Results</h2>
      {results.length === 0 ? (
        <p className="text-text">No potentially infringing products found.</p>
      ) : (
        results.map((result) => (
          <div key={result.name} className="mb-4">
            <h3 className="text-md font-bold text-text">
              Product Name: {result.name}
            </h3>
            <p className="text-sm text-text mt-1">
              <span className="font-bold">
                Potential Infringement Explanation:{" "}
              </span>
              {result.reason}
            </p>
            <div className="text-sm text-text mt-1">
              <span className="font-bold">Claims at Issue: </span>
              {result.claimsAtIssue && result.claimsAtIssue.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {result.claimsAtIssue.map((claim) => (
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
