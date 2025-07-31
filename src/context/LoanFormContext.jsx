import { createContext, useContext, useState, useEffect } from "react";

const LoanFormContext = createContext();

export function useLoanForm() {
  return useContext(LoanFormContext);
}

export function LoanFormProvider({ children }) {
  const [loanFormData, setLoanFormData] = useState({
    loan_amount: "",
    loan_purpose: "",
    other_purpose: "",
    wapan_member: "",
    account_name: "",
    account_number: "",
    bank_name: "",
    repayment_method: "",
    recyclable_drop_off_known: "",
    repayment_schedule: "",
    recyclable_drop_off_location: "",
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // On mount, restore saved loan application data if any
  useEffect(() => {
    try {
      const stored = localStorage.getItem("latestLoanApplicationData");
      if (stored) {
        const restoredData = JSON.parse(stored);

        // Map API response structure to loanFormData shape
        setLoanFormData({
          loan_amount: restoredData.loan_amount ?? "",
          loan_purpose: restoredData.loan_purpose ?? "",
          other_purpose: restoredData.loan_purpose_other ?? "",
          wapan_member: restoredData.wapan_member ?? false,
          account_name: restoredData.bank_account?.account_name ?? "",
          account_number: restoredData.bank_account?.account_number ?? "",
          bank_name: restoredData.bank_account?.bank_name ?? "",
          repayment_method: restoredData.repayment_method ?? "",
          recyclable_drop_off_known: restoredData.recyclable_drop_off_known ?? false,
          recyclable_drop_off_location: restoredData.recyclable_drop_off_location ?? "",
          repayment_schedule: restoredData.repayment_schedule ?? "",
        });
      }
    } catch (e) {
      console.error("Failed to restore loan form data:", e);
      // Clear corrupted data if needed
      localStorage.removeItem("latestLoanApplicationData");
    }
  }, []);

  function updateLoanFormData(newData) {
    setLoanFormData((prev) => {
      const updated = { ...prev, ...newData };
      if (JSON.stringify(prev) !== JSON.stringify(updated)) {
        setHasUnsavedChanges(true);
      }
      console.log("Updated Loan Form Data:", updated);
      return updated;
    });
  }

  function clearLoanFormData() {
    setLoanFormData({
      loan_amount: "",
      loan_purpose: "",
      wapan_member: "",
      account_name: "",
      account_number: "",
      bank_name: "",
      repayment_method: "",
      recyclable_drop_off_known: "",
      repayment_schedule: "",
      recyclable_drop_off_location: "",
    });
    setHasUnsavedChanges(false);
    setFormSubmitted(true);
    localStorage.removeItem("latestLoanApplicationData"); 
  }

  return (
    <LoanFormContext.Provider
      value={{
        loanFormData,
        updateLoanFormData,
        clearLoanFormData,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        formSubmitted,
      }}
    >
      {children}
    </LoanFormContext.Provider>
  );
}
