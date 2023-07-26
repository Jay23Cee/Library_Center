import React, { useState } from 'react';

// Import the bookCategories array
import { bookCategories } from './Newbook'; // Replace 'path/to/your/bookCategories' with the actual path to the file containing the bookCategories array.

interface SearchBarProps {
  onSearch: (value: string, category: string, year: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');

  const search = () => {
    console.log(searchTerm, 'search term')
    onSearch(searchTerm, category, year);
  };

  return (
    <div className="flex bg-transparent">
      <input
        type="text"
        placeholder="Search Title"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
      />

      {/* Use the bookCategories array to populate the select options */}
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        className="ml-3 h-10 rounded-full text-sm focus:outline-none"
      >
        <option value="">Select Category</option>
        {bookCategories.map((categoryOption) => (
          <option key={categoryOption} value={categoryOption}>
            {categoryOption}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Year"
        value={year}
        onChange={(event) => setYear(event.target.value)}
        className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none ml-3"
      />

      <button onClick={search} className="bg-green rad ml-3 h-10 px-5 pr-10 rounded-full text-sm focus:outline-none">
        Search
      </button>
    </div>
  );
};

interface BookMenuProps {
  onSearchTermChange: (newSearchTerm: string) => void;
  onCategoryChange: (newCategory: string) => void;
  onYearChange: (newYear: string) => void;
}

export const Bookmenu: React.FC<BookMenuProps> = ({ onSearchTermChange, onCategoryChange, onYearChange }) => {
  const handleSearch = (value: string, category: string, year: string) => {
   console.log(value)
    onSearchTermChange(value);
    onCategoryChange(category);
    onYearChange(year);
  };

  return (
    <div className="flex items-center justify-between bg-transparent text-white p-4 mt-20">
      <SearchBar onSearch={handleSearch} />
    </div>
  );
};

