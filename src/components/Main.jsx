/* eslint-disable react/prop-types */
import { Content } from 'antd/es/layout/layout';
import SearchResults from './SearchResults';
function Main({ search }) {
  return (
    <Content id='content'>
      <SearchResults search={search} />
    </Content>
  );
}

export default Main;
