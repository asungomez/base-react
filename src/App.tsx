import { ThemeProvider } from "@mui/material";
import { FC } from "react";
import { theme } from "./theme/theme";

export const App: FC = () => <ThemeProvider theme={theme}></ThemeProvider>;
