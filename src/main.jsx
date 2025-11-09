// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { PageContextProvider } from "./context/PageContext.jsx";
import { DataContextProvider } from "./context/DataContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthContextProvider>
        <PageContextProvider>
          <DataContextProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </DataContextProvider>
        </PageContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
