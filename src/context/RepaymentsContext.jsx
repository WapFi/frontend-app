import { createContext, useState, useContext, useEffect } from "react";

const RepaymentsContext = createContext();

export function RepaymentsProvider({ children }) {
  const [repaymentsData, setRepaymentsData] = useState(() => {
    const stored = localStorage.getItem("repaymentsData");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("repaymentsData", JSON.stringify(repaymentsData));
  }, [repaymentsData]);

  return (
    <RepaymentsContext.Provider value={{ repaymentsData, setRepaymentsData }}>
      {children}
    </RepaymentsContext.Provider>
  );
}

export function useRepayments() {
  return useContext(RepaymentsContext);
}
