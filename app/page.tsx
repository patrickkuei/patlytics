"use client";

import { useState } from "react";
import { getResult } from "./(actions)/searchAction";
import Loader from "./(components)/Loader";
import Results from "./(components)/Results";
import SearchBar from "./(components)/SearchBar";

import type { PatentCheckResult } from "./(types)/patent";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PatentCheckResult>();

  const handleSearch = async (patentId: string, companyName: string) => {
    setLoading(true);

    const savedResults: PatentCheckResult[] = JSON.parse(
      localStorage.getItem("savedResults") || "[]"
    );

    const savedResult = savedResults.find(
      (result) =>
        result.companyName === companyName && result.patentId === patentId
    );

    if (savedResult) {
      setResults(savedResult);
      setLoading(false);

      return;
    }

    try {
      const result = await getResult(patentId, companyName);
      if (result) {
        setResults(result);
      }
    } catch (error) {
      setResults(undefined);

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-primary flex justify-center">
      <div className="w-full max-w-3xl pt-10 pb-4 px-4 flex flex-col gap-4">
        <SearchBar onSearch={handleSearch} isLoading={loading} />
        {loading ? <Loader /> : <Results results={results} />}
      </div>
    </div>
  );
}
