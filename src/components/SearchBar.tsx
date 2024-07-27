interface SearchBarProps {
    searchInput: string;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  }

const SearchBar: React.FC<SearchBarProps>  = ({setSearchInput, searchInput}: SearchBarProps) => {
    return (
        <div className="flex items-center justify-center px-4">
            <div className="flex sm:w-[20rem] md:w-[24rem] lg:w-[36rem] bg-white rounded-full shadow-md">
                <input
                    onChange={(e) => setSearchInput(e.target.value) }
                    value={searchInput}
                    type="url"
                    className="px-4 py-2 w-full ml-auto sm:w-80 md:w-96 lg:w-full rounded-l-full focus:outline-none"
                    placeholder="Search..."
                />
                <button type="submit" className="px-6 py-2 text-white bg-blue-500 rounded-r-full hover:bg-blue-600 focus:outline-none">
                    Shorten!
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
