// import { Outlet } from "react-router-dom";
// import { LoanFormProvider } from "../../context/LoanFormContext";
// import LoanFlowStepper from "./LoanFlowStepper";

// export default function LoanFlowWrapper() {
//   return (
//     <LoanFormProvider>
//       <div className="rounded-[12px] lg:w-[85%] lg:mx-auto mb-12 md:mb-18 pb-6 lg:pb-10 lg:mt-12 lg:mr-30 lg:bg-white flex flex-col gap-6">
//         <LoanFlowStepper />
//         <Outlet />
//       </div>
//     </LoanFormProvider>
//   );
// }

// import { Outlet, useBlocker } from "react-router-dom";
// import { useLoanForm } from "../../context/LoanFormContext";
// import LoanFlowStepper from "./LoanFlowStepper";
// import { useEffect, useState, useCallback } from "react"; // Added useCallback import
// import CancelApplicationModal from "./CancelApplicationModal";
// import { createPortal } from 'react-dom'; // Ensure createPortal is imported if you're using it

// export default function LoanFlowWrapper() {
//   const { hasUnsavedChanges, clearLoanFormData } = useLoanForm();
//   const [showModal, setShowModal] = useState(false);

//   // Modern navigation blocking using react-router-dom's official useBlocker hook
//   const blocker = useBlocker(
//     // The predicate function decides if navigation should be blocked.
//     // It runs before navigation proceeds.
//     useCallback(
//       ({ currentLocation, nextLocation }) => {
//         // Block if there are unsaved changes
//         // AND the user is navigating away from the "/take-a-loan/form" path segment.
//         // This allows navigation between form steps without triggering the modal.
//         const isNavigatingAwayFromForm = !nextLocation.pathname.startsWith("/take-a-loan/form");
//         return hasUnsavedChanges && isNavigatingAwayFromForm;
//       },
//       [hasUnsavedChanges] // Dependency for useCallback: only recreate if hasUnsavedChanges changes
//     )
//   );

//   // Effect to manage modal visibility based on the blocker's state
//   useEffect(() => {
//     // If blocker.state becomes 'blocked' and the modal is not already shown, show it.
//     if (blocker.state === "blocked" && !showModal) {
//       setShowModal(true);
//     }
//     // If blocker.state becomes 'unblocked' (meaning navigation proceeded or was reset)
//     // and the modal is currently shown, hide it.
//     else if (blocker.state === "unblocked" && showModal) {
//       setShowModal(false);
//     }
//   }, [blocker.state, showModal]); // Dependencies: react to changes in blocker.state and showModal

//   // Handle browser navigation events (e.g., refreshing, closing tab, browser's back/forward buttons)
//   // This uses the native browser API and will show a browser-native confirmation prompt,
//   // not your custom modal.
//   useEffect(() => {
//     const handleBeforeUnload = (e) => {
//       if (hasUnsavedChanges) {
//         e.preventDefault(); // Standard for preventing unload
//         e.returnValue = ""; // Required for some browsers to display a prompt
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//   }, [hasUnsavedChanges]);

//   // Handler for when the user confirms they want to leave
//   const confirmLeave = () => {
//     setShowModal(false); // Hide the modal immediately
//     clearLoanFormData(); // Discard the form data

//     // If navigation was in a 'blocked' state, tell the blocker to proceed with it.
//     if (blocker.state === "blocked") {
//       blocker.proceed();
//     }
//     // No need for a `nextLocation` state or its call; `blocker.proceed()` handles the navigation.
//   };

//   // Handler for when the user cancels leaving
//   const cancelLeave = () => {
//     setShowModal(false); // Hide the modal immediately

//     // If navigation was in a 'blocked' state, tell the blocker to reset and stay on the current page.
//     if (blocker.state === "blocked") {
//       blocker.reset();
//     }
//   };

//   return (
//     <div className="rounded-[12px] lg:w-[85%] lg:mx-auto mb-12 md:mb-18 pb-6 lg:pb-10 lg:mt-12 lg:mr-30 lg:bg-white flex flex-col gap-6">
//       <LoanFlowStepper />
//       <Outlet />
//       {showModal && (
//         <div className="fixed inset-0 bg-[#222]  bg-opacity-10 flex items-center justify-center z-50">
//           <CancelApplicationModal
//             onConfirm={confirmLeave}
//             onCancel={cancelLeave}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

import { Outlet, useBlocker } from "react-router-dom";
import { useLoanForm } from "../../context/LoanFormContext";
import LoanFlowStepper from "./LoanFlowStepper";
import { useEffect, useState, useCallback } from "react";
import CancelApplicationModal from "./CancelApplicationModal";

export default function LoanFlowWrapper() {
  const { hasUnsavedChanges, clearLoanFormData } = useLoanForm();
  const [showModal, setShowModal] = useState(false);

  // Modern navigation blocking
  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) => {
        // Only block if there are unsaved changes AND
        // user is navigating away from the loan form flow
        const isStillInFormFlow =
          nextLocation.pathname.startsWith("/take-a-loan/form") ||
          nextLocation.pathname.startsWith(
            "/take-a-loan/loan-repayment-overview"
          );

        return hasUnsavedChanges && !isStillInFormFlow;
      },
      [hasUnsavedChanges]
    )
  );

  // Handle blocker state changes
  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowModal(true);
    } else if (blocker.state === "unblocked" && showModal) {
      setShowModal(false);
    }
  }, [blocker.state, showModal]);

  // Handle browser events (refresh/close)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const confirmLeave = () => {
    setShowModal(false);
    clearLoanFormData();
    if (blocker.state === "blocked") {
      blocker.proceed();
    }
  };

  const cancelLeave = () => {
    setShowModal(false);
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  };

  return (
    <div className="rounded-[12px] lg:w-[85%] lg:mx-auto mb-12 md:mb-18 pb-6 lg:pb-10 lg:mt-12 lg:mr-30 lg:bg-white flex flex-col gap-6">
      <LoanFlowStepper />
      <Outlet />
      {showModal && (
        <div className="fixed inset-0 bg-[#222] bg-opacity-10 flex items-center justify-center z-50">
          <CancelApplicationModal
            onConfirm={confirmLeave}
            onCancel={cancelLeave}
          />
        </div>
      )}
    </div>
  );
}
