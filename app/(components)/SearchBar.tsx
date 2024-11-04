import { useMemo, useState } from "react";

interface SearchBarProps {
  onSearch: (patentId: string, companyName: string) => void;
  isLoading: boolean;
}

const isValidId = (id: string) => {
  return id.length > 0;
};

const isValidName = (name: string) => {
  return name.length > 0;
};

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [patentId, setPatentId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const isButtonDisabled = useMemo(
    () => isLoading || !isValidId(patentId) || !isValidName(companyName),
    [isLoading, patentId, companyName]
  );

  const handleSearch = () => {
    if (!isButtonDisabled) {
      onSearch(patentId, companyName);
    }
  };

  return (
    <div className="bg-primary p-4 rounded-md shadow-md">
      <h2 className="text-lg text-text mb-2">Patent Infringement Check</h2>
      <input
        type="text"
        placeholder="Patent ID"
        value={patentId}
        onChange={(e) => setPatentId(e.target.value)}
        className="bg-secondary p-2 rounded text-text w-full mb-2"
      />
      <input
        type="text"
        placeholder="Company Name
"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="bg-secondary p-2 rounded text-text w-full mb-2"
      />
      <button
        onClick={handleSearch}
        className={`${
          isButtonDisabled
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-accent text-text hover:bg-gray-600"
        } p-2 rounded w-full transition`}
        disabled={isButtonDisabled}
      >
        Check
      </button>
    </div>
  );
};

export default SearchBar;
