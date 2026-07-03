import { useCallback, useEffect, useState } from "react";
import { Outlet, useBlocker } from "react-router-dom";
import { useLoanForm } from "../../context/LoanFormContext";
import CancelApplicationModal from "./CancelApplicationModal";
import LoanFlowStepper from "./LoanFlowStepper";

export default function LoanFlowWrapper() {
  const { clearLoanFormData, hasLoanFormData, hasUnsavedChanges } =
    useLoanForm();

  const shouldWarnBeforeLeaving = hasLoanFormData || hasUnsavedChanges;
  const [showModal, setShowModal] = useState(false);

  // Paths that are considered "inside" the loan application experience.
  const ALLOWED_PREFIXES = [
    "/take-a-loan/form",
    "/take-a-loan/loan-repayment-overview",
  ];

  // Block ANY navigation that goes outside allowed prefixes.
  const blocker = useBlocker(
    useCallback(
      ({ nextLocation }) => {
        const isStillInFlow = ALLOWED_PREFIXES.some((prefix) =>
          nextLocation.pathname.startsWith(prefix),
        );

        return shouldWarnBeforeLeaving && !isStillInFlow;
      },
      [shouldWarnBeforeLeaving],
    ),
  );

  // Show / hide modal in response to blocker state
  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowModal(true);
    } else if (blocker.state === "unblocked" && showModal) {
      setShowModal(false);
    }
  }, [blocker.state, showModal]);

  // Warn on tab close / reload while in flow
  useEffect(() => {
    if (!shouldWarnBeforeLeaving) {
      return undefined;
    }

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldWarnBeforeLeaving]);

  const confirmLeave = () => {
    setShowModal(false);
    clearLoanFormData(); // cancel application
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
