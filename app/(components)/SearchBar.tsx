import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (patentId: string, companyName: string) => void;
}

const isValidId = (id: string) => {
  console.log(id);

  return true;
};

const isValidName = (name: string) => {
  console.log(name);
  return true;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [patentId, setPatentId] = useState("");
  const [companyName, setCompanyName] = useState("");

  const handleSearch = () => {
    if (isValidId(patentId) && isValidName(companyName)) {
      onSearch(patentId, companyName);
    }
  };

  return (
    <div className="bg-primary p-4 rounded-md shadow-md">
      <h2 className="text-lg font-semibold text-text mb-2">
        Patent Infringement Check
      </h2>
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
        className="bg-accent text-text font-semibold p-2 rounded w-full hover:bg-gray-600 transition"
      >
        Check
      </button>
    </div>
  );
};

export default SearchBar;
