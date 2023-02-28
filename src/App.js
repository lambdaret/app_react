import { hot } from 'react-hot-loader/root';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";

import Main from './pages/Main';
import ExchangeRate from './pages/ExchangeRate'

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//         // suspense: true
//     }
//   }  
// });

function App() {
  return (
    // <QueryClientProvider client={queryClient}>
    //   <ReactQueryDevtools initialIsOpen={true} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/exchange-rate" element={<ExchangeRate />}></Route>
        </Routes>
      </BrowserRouter>
    // </QueryClientProvider>
  );
}

export default hot(App);
