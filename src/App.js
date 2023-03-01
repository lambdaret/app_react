import { hot } from 'react-hot-loader/root';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";

import Main from './pages/Main';
import ExchangeRate from './pages/ExchangeRate'


function App() {
  return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route exact path="/" element={<Main />}></Route>
          <Route path="exchange-rate" element={<ExchangeRate />}></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default hot(App);
