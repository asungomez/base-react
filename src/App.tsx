import { ThemeProvider } from "@mui/material";
import { FC } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider/AuthProvider";
import { AppRoutes } from "./routes/AppRoutes";
import { theme } from "./theme/theme";
import { SWRConfig } from "swr/_internal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

export const App: FC = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SWRConfig>
            <AppRoutes />
          </SWRConfig>
        </LocalizationProvider>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);
