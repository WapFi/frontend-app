// import { createContext, useContext, useState } from "react";

// const LoanFormContext = createContext();

// export function useLoanForm() {
//   return useContext(LoanFormContext);
// }

// export function LoanFormProvider({ children }) {
//   const [loanFormData, setLoanFormData] = useState({
//     loan_amount: "",
//     loan_purpose: "",
//     other_purpose: "",
//     wapan_member: "",
//     account_name: "",
//     account_number: "",
//     bank_name: "",
//     repayment_method: "",
//     recyclable_drop_off_known: "",
//     repayment_location: "",
//   });

//   function updateLoanFormData(newData) {
//     setLoanFormData((prev) => {
//       const updated = { ...prev, ...newData };
//       console.log("Updated Loan Form Data:", updated);
//       return updated;
//     });
//   }

//   function clearLoanFormData() {
//     setLoanFormData({
//       loan_amount: "",
//       loan_purpose: "",
//       wapan_member: "",
//       account_name: "",
//       account_number: "",
//       bank_name: "",
//       repayment_method: "",
//       recyclable_drop_off_known: "",
//     });
//   }

//   return (
//     <LoanFormContext.Provider
//       value={{
//         loanFormData,
//         updateLoanFormData,
//         clearLoanFormData,
//       }}
//     >
//       {children}
//     </LoanFormContext.Provider>
//   );
// }
import { createContext, useContext, useState } from "react";

const LoanFormContext = createContext();

export function useLoanForm() {
  return useContext(LoanFormContext);
}

export function LoanFormProvider({ children }) {
  const [loanFormData, setLoanFormData] = useState({
    loan_amount: "",
    loan_purpose: "",
    // other_purpose: "",
    wapan_member: "",
    account_name: "",
    account_number: "",
    bank_name: "",
    repayment_method: "",
    recyclable_drop_off_known: "",
    // repayment_location: "",
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false); // Track final submission

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
      // other_purpose: "",
      wapan_member: "",
      account_name: "",
      account_number: "",
      bank_name: "",
      repayment_method: "",
      recyclable_drop_off_known: "",
      // repayment_location: "",
    });
    setHasUnsavedChanges(false);
    setFormSubmitted(true); // Mark form as fully submitted
  }

  return (
    <LoanFormContext.Provider
      value={{
        loanFormData,
        updateLoanFormData,
        clearLoanFormData,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        formSubmitted, // Expose submission status
      }}
    >
      {children}
    </LoanFormContext.Provider>
  );
}
