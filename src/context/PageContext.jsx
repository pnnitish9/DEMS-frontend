// src/context/PageContext.jsx
import React, { createContext, useContext, useState } from "react";

const PageContext = createContext();
export const usePageContext = () => useContext(PageContext);

export function PageContextProvider({ children }) {
  const [currentPage, setCurrentPage] = useState("landing");
  const [pageData, setPageData] = useState(null);

  const navigate = (page, data = null) => {
    setCurrentPage(page);
    setPageData(data);
  };

  return (
    <PageContext.Provider value={{ currentPage, pageData, navigate }}>
      {children}
    </PageContext.Provider>
  );
}
