import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { createTheme } from "@/styles/theme/create-theme";

export interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeConfig = ({ children }: Readonly<ThemeProviderProps>): React.JSX.Element => {
  const theme = createTheme();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeConfig;
