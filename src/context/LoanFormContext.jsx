import { createContext, useContext, useState, useEffect } from "react";

const LoanFormContext = createContext();

export function useLoanForm() {
  return useContext(LoanFormContext);
}

export function LoanFormProvider({ children }) {
  const [loanFormData, setLoanFormData] = useState({
    loan_amount: "",
    loan_purpose: "",
    wapan_member: "",
    account_name: "",
    account_number: "",
    bank_name: "",
    repayment_method: "",
    recyclable_drop_off_known: "",
    repayment_schedule: "",
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
          wapan_member: restoredData.wapan_member ?? false,
          account_name: restoredData.account_name ?? "",
          account_number: restoredData.account_number ?? "",
          bank_name: restoredData.bank_name ?? "",
          repayment_method: restoredData.repayment_method ?? "",
          recyclable_drop_off_known: restoredData.recyclable_drop_off_known ?? false,
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
    });
    setHasUnsavedChanges(false);
    setFormSubmitted(true);
    localStorage.removeItem("latestLoanApplicationData"); // Clear saved data on clear
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


// import { createContext, useContext, useState } from "react";

// const LoanFormContext = createContext();

// export function useLoanForm() {
//   return useContext(LoanFormContext);
// }

// export function LoanFormProvider({ children }) {
//   const [loanFormData, setLoanFormData] = useState({
//     loan_amount: "",
//     loan_purpose: "",
//     // other_purpose: "",
//     wapan_member: "",
//     account_name: "",
//     account_number: "",
//     bank_name: "",
//     repayment_method: "",
//     recyclable_drop_off_known: "",
//     // repayment_location: "",
//   });

//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [formSubmitted, setFormSubmitted] = useState(false); // Track final submission

//   // --- NEW: Modal and navigation logic ---
//   const [showModal, setShowModal] = useState(false);
//   const [pendingNavigation, setPendingNavigation] = useState(null);

//   function updateLoanFormData(newData) {
//     setLoanFormData((prev) => {
//       const updated = { ...prev, ...newData };
//       if (JSON.stringify(prev) !== JSON.stringify(updated)) {
//         setHasUnsavedChanges(true);
//       }
//       console.log("Updated Loan Form Data:", updated);

//       return updated;
//     });
//   }

//   function clearLoanFormData() {
//     setLoanFormData({
//       loan_amount: "",
//       loan_purpose: "",
//       // other_purpose: "",
//       wapan_member: "",
//       account_name: "",
//       account_number: "",
//       bank_name: "",
//       repayment_method: "",
//       recyclable_drop_off_known: "",
//       // repayment_location: "",
//     });
//     setHasUnsavedChanges(false);
//     setFormSubmitted(true); // Mark form as fully submitted
//   }

//   // --- NEW: Attempt navigation handler ---
//   function attemptNavigation(targetPath, navigate) {
//     if (hasUnsavedChanges) {
//       setPendingNavigation(() => () => navigate(targetPath));
//       setShowModal(true);
//     } else {
//       navigate(targetPath);
//     }
//   }

//   // --- NEW: Confirm leave handler for modal ---
//   function confirmLeave() {
//     setShowModal(false);
//     if (pendingNavigation) {
//       pendingNavigation();
//       setPendingNavigation(null);
//     }
//   }

//   return (
//     <LoanFormContext.Provider
//       value={{
//         loanFormData,
//         updateLoanFormData,
//         clearLoanFormData,
//         hasUnsavedChanges,
//         setHasUnsavedChanges,
//         formSubmitted, // Expose submission status
//         showModal,
//         setShowModal,
//         attemptNavigation,
//         confirmLeave,
//       }}
//     >
//       {children}
//     </LoanFormContext.Provider>
//   );
// }
