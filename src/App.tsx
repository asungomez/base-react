import { ThemeProvider } from "@mui/material";
import { FC } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider/AuthProvider";
import { AppRoutes } from "./routes/AppRoutes";
import { theme } from "./theme/theme";
import { SWRConfig } from "swr/_internal";

export const App: FC = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <AuthProvider>
        <SWRConfig>
          <AppRoutes />
        </SWRConfig>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);
