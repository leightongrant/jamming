import { useState, useEffect } from 'react';
function SearchResults({ search }) {
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    setSearchResults(['results', 'results2', search]);
  }, [search]);

  return <>{searchResults}</>;
}

export default SearchResults;
