import Search from 'antd/es/input/Search';

function SearchBar({ setSearch }) {
  function onSearch(value) {
    setSearch(value);
  }

  return (
    <Search
      placeholder='input search text'
      allowClear
      enterButton='Search'
      size='large'
      onSearch={onSearch}
      className='searchBox'
    />
  );
}

export default SearchBar;
