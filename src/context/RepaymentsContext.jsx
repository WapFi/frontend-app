

import { createContext, useState, useContext, useEffect } from "react";
import { fetchRepayments } from "../api/apiData";

const RepaymentsContext = createContext();

export function RepaymentsProvider({ children }) {
  const [repaymentsData, setRepaymentsData] = useState(() => {
    const stored = localStorage.getItem("repaymentsData");
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
        // console.error("Failed to parse localStorage 'repaymentsData', resetting to empty.", e);
        initialData = [];
      }
    }
    return initialData;
  });

  useEffect(() => {
    // CRITICAL CHANGE: Only save to localStorage if 'repaymentsData' is currently an array.
    // This prevents re-saving a corrupted value if the state somehow temporarily becomes non-array.
    if (Array.isArray(repaymentsData)) {
      localStorage.setItem("repaymentsData", JSON.stringify(repaymentsData));
    }
  }, [repaymentsData]);

    const refreshRepayments = async () => {
    try {
      const response = await fetchRepayments(); 
      if (response.status && Array.isArray(response.data)) {
        setRepaymentsData(response.data);
      }
    } catch (error) {
      console.error("Error fetching repayments:", error);
    }
  };

   useEffect(() => {
    refreshRepayments();
  }, []);

  // This part remains the same because the checks are now inside useState and useEffect.
  return (
    <RepaymentsContext.Provider value={{ repaymentsData, setRepaymentsData }}>
      {children}
    </RepaymentsContext.Provider>
  );
}

export function useRepayments() {
  return useContext(RepaymentsContext);
}

