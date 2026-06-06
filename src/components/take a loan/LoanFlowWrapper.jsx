import { Outlet, useBlocker } from "react-router-dom";
import { useLoanForm } from "../../context/LoanFormContext";
import LoanFlowStepper from "./LoanFlowStepper";
import { useEffect, useState, useCallback } from "react";
import CancelApplicationModal from "./CancelApplicationModal";

export default function LoanFlowWrapper() {
  const { clearLoanFormData } = useLoanForm();
  const [showModal, setShowModal] = useState(false);

  // Paths that are considered "inside" the loan application experience.
  const ALLOWED_PREFIXES = [
    "/take-a-loan/form",
    "/take-a-loan/loan-repayment-overview",
  ];

  // Block ANY navigation that goes outside allowed prefixes.
  const blocker = useBlocker(
    useCallback(({ nextLocation }) => {
      const isStillInFlow = ALLOWED_PREFIXES.some((p) =>
        nextLocation.pathname.startsWith(p)
      );
      return !isStillInFlow; // true = block
    }, [])
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
    const handleBeforeUnload = (e) => {
      // Because wrapper only mounts while in-flow, *always* warn.
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

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

