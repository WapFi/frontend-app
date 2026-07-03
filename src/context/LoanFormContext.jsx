import { createContext, useContext, useEffect, useState } from "react";

const LoanFormContext = createContext();

export function useLoanForm() {
  return useContext(LoanFormContext);
}

const emptyLoanFormData = {
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
};

export function LoanFormProvider({ children }) {
  const [loanFormData, setLoanFormData] = useState(() => {
    try {
      const storedDraft = localStorage.getItem("loanApplicationDraft");

      if (storedDraft) {
        const parsedDraft = JSON.parse(storedDraft);

        if (parsedDraft && typeof parsedDraft === "object") {
          return { ...emptyLoanFormData, ...parsedDraft };
        }
      }
    } catch {
      localStorage.removeItem("loanApplicationDraft");
    }

    return { ...emptyLoanFormData };
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // On mount, restore saved loan application data if any
  useEffect(() => {
    const storedDraft = localStorage.getItem("loanApplicationDraft");

    if (storedDraft) {
      return;
    }

    try {
      const stored = localStorage.getItem("latestLoanApplicationData");
      if (stored) {
        const restoredData = JSON.parse(stored);

        // Map API response structure to loanFormData shape
        setLoanFormData({
          loan_amount: restoredData.loan_amount ?? "",
          loan_purpose: restoredData.loan_purpose ?? "",
          other_purpose: restoredData.loan_purpose_other ?? "",
          wapan_member: restoredData.wapan_member ?? "",
          account_name: restoredData.bank_account?.account_name ?? "",
          account_number: restoredData.bank_account?.account_number ?? "",
          bank_name: restoredData.bank_account?.bank_name ?? "",
          repayment_method: restoredData.repayment_method ?? "",
          recyclable_drop_off_known:
            restoredData.recyclable_drop_off_known ?? false,
          recyclable_drop_off_location:
            restoredData.recyclable_drop_off_location ?? "",
          repayment_schedule: restoredData.repayment_schedule ?? "",
        });
      }
    } catch {
      // Clear corrupted data if needed
      localStorage.removeItem("latestLoanApplicationData");
    }
  }, []);

  function updateLoanFormData(newData) {
    setLoanFormData((prev) => {
      const updated = { ...prev, ...newData };

      if (JSON.stringify(prev) !== JSON.stringify(updated)) {
        setHasUnsavedChanges(true);
        localStorage.setItem("loanApplicationDraft", JSON.stringify(updated));
      }

      return updated;
    });
  }

  function clearLoanFormData() {
    setLoanFormData({ ...emptyLoanFormData });
    setHasUnsavedChanges(false);
    setFormSubmitted(true);
    localStorage.removeItem("loanApplicationDraft");
    localStorage.removeItem("latestLoanApplicationData");
  }

  const hasLoanFormData = Object.values(loanFormData).some(
    (value) => value !== "" && value !== null && value !== undefined,
  );

  return (
    <LoanFormContext.Provider
      value={{
        loanFormData,
        updateLoanFormData,
        clearLoanFormData,
        hasLoanFormData,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        formSubmitted,
      }}
    >
      {children}
    </LoanFormContext.Provider>
  );
}
