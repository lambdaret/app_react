import { hot } from "react-hot-loader/root";
import { HashRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Main from "./pages/Main";
import ExchangeRate from "./pages/ExchangeRate";

const theme = createTheme({
  typography: {
    fontFamily: `"Consolas", "Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 12,
    //  "fontWeightLight": 300,
    //  "fontWeightRegular": 400,
    //  "fontWeightMedium": 500
  },
});

function App() {
  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/exchange-rate" element={<ExchangeRate />} />
        </Routes>
      </ThemeProvider>
    </HashRouter>
  );
}

export default hot(App);
