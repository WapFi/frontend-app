

import { createContext, useState, useContext, useEffect } from "react";
import { fetchLoans } from "../api/apiData";

const DisbursedLoansContext = createContext();

export function DisbursedLoansProvider({ children }) {
  const [disbursedLoansData, setDisbursedLoansData] = useState(() => {
    const stored = localStorage.getItem("disbursedLoansData");
    let initialData = []; // Start with an empty array by default

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check if 'parsed' is actually an array.
        // If it is, use it. If not (meaning it's the user object or something else),
        // we fallback to an empty array.
        if (Array.isArray(parsed)) {
          initialData = parsed;
        }
      } catch (e) {
        // This handles cases where localStorage has invalid JSON (e.g., "undefined")
        // console.error("Failed to parse localStorage 'disbursedLoansData', resetting to empty.", e);
        initialData = [];
      }
    }
    return initialData;
  });

  useEffect(() => {
    // CRITICAL CHANGE: Only save to localStorage if 'disbursedLoansData' is currently an array.
    // This prevents re-saving a corrupted value if the state somehow temporarily becomes non-array.
    if (Array.isArray(disbursedLoansData)) {
      localStorage.setItem("disbursedLoansData", JSON.stringify(disbursedLoansData));
    }
  }, [disbursedLoansData]);

    const refreshDisbursedLoans = async () => {
    try {
      const response = await fetchLoans(); 
      if (response.status && Array.isArray(response.data)) {
        setDisbursedLoansData(response.data);
      }
    } catch (error) {
      console.error("Error fetching disbursed loans:", error);
    }
  };

   useEffect(() => {
    refreshDisbursedLoans();
  }, []);

  // This part remains the same because the checks are now inside useState and useEffect.
  return (
    <DisbursedLoansContext.Provider value={{ disbursedLoansData, setDisbursedLoansData }}>
      {children}
    </DisbursedLoansContext.Provider>
  );
}

export function useDisbursedLoans() {
  return useContext(DisbursedLoansContext);
}

