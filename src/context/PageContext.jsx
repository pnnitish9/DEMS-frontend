// src/context/PageContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const PageContext = createContext();
export const usePageContext = () => useContext(PageContext);

export function PageContextProvider({ children }) {
  const [currentPage, setCurrentPage] = useState("landing");
  const [pageData, setPageData] = useState(null);

  // ✅ Search used only for participant dashboard
  const [searchQuery, setSearchQuery] = useState("");

  /* ✅ Clear search when page changes (except participant-dashboard) */
  useEffect(() => {
    if (currentPage !== "participant-dashboard") {
      setSearchQuery("");
    }
  }, [currentPage]);

  /* ✅ Navigation (with pageData support) */
  const navigate = (page, data = null) => {
    setCurrentPage(page);
    setPageData(data);
  };

  return (
    <PageContext.Provider
      value={{
        currentPage,
        pageData,
        navigate,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PageContext.Provider>
  );
}
