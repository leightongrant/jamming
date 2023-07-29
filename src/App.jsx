import MainHeader from './components/MainHeader';
import Main from './components/Main';
import Layout from 'antd/es/layout/layout';
import { useState } from 'react';

function App() {
    const [search, setSearch] = useState('');

    return (
        <Layout id='layout'>
            <MainHeader search={search} setSearch={setSearch} />
            <Main search={search} />
        </Layout>
    );
}

export default App;
