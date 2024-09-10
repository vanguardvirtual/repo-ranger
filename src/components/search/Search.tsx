import { useState } from 'preact/hooks';
import { JSX } from 'preact';

interface SearchProps {
  handleSearch: (value: string) => void;
}

const Search = ({ handleSearch }: SearchProps) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    setSearchInput(e.currentTarget.value);
  };

  return (
    <>
      <input type="text" placeholder="Search by username" value={searchInput} onChange={handleSearchChange} className="p-2 w-full border" />
      <button onClick={() => handleSearch(searchInput)} className="bg-blue-500 text-white p-2 rounded ml-2">
        Search
      </button>
    </>
  );
};

export default Search;
