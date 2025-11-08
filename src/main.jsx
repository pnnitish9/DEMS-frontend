import React from "react";
import ReactDOM from "react-dom/client";

// ✅ MAIN APP
import App from "./App.jsx";

// ✅ GLOBAL STYLES (your custom CSS)
import "./index.css";

// ✅ CONTEXT PROVIDERS
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { DataContextProvider } from "./context/DataContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { PageContextProvider } from "./context/PageContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <NotificationProvider>
        <AuthContextProvider>
          <DataContextProvider>
            <PageContextProvider>
              <App />
            </PageContextProvider>
          </DataContextProvider>
        </AuthContextProvider>
      </NotificationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
