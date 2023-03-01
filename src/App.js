import { hot } from 'react-hot-loader/root';
import { HashRouter,  Routes, Route } from 'react-router-dom';

import Main from './pages/Main';
import ExchangeRate from './pages/ExchangeRate'


function App() {
  
  return (
      <HashRouter >
        <div>
          <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/exchange-rate" element={<ExchangeRate />} />
          </Routes>
        </div>
      </HashRouter>
  );
}

export default hot(App);
