import Search from 'antd/es/input/Search';

function SearchBar({ setSearch }) {
    function onSearch(value) {
        value &&
            setSearch(
                `https://api.spotify.com/v1/search?q=artist:${value}&type=track&limit=50`
            );
    }

    return (
        <Search
            placeholder='Enter artist name'
            allowClear
            enterButton='Search'
            size='large'
            onSearch={onSearch}
            className='searchBox'
        />
    );
}

export default SearchBar;
