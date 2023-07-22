import { Header } from 'antd/es/layout/layout';
import SearchBar from './SearchBar';

function MainHeader({ search, setSearch }) {
  return (
    <Header id='mainHeader'>
      <SearchBar search={search} setSearch={setSearch} />
    </Header>
  );
}

export default MainHeader;
