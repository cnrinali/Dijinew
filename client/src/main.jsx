import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";
import "./index.css";
import "./i18n";
import { NotificationProvider } from "./context/NotificationContext.jsx";

// MUI imports
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Basit bir varsayılan tema oluşturalım (eğer ayrı bir theme.js yoksa)
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Örnek birincil renk
    },
    secondary: {
      main: "#dc004e", // Örnek ikincil renk
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {" "}
        {/* ThemeProvider ile sarıldı */}
        <AuthProvider>
          <NotificationProvider>
            {" "}
            {/* NotificationProvider ile sarıldı */}
            <CssBaseline /> {/* MUI CSS Sıfırlama ve Temel Stiller */}
            <App />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
