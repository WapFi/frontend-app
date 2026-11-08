import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function RejectedLoanNotice({ loan, onApply }) {
  const { t } = useTranslation();
  const userId = typeof loan.user === "string" ? loan.user : loan.user?._id;
  const storageKey = userId && loan._id
    ? `dismissedLoanRejection:${userId}:${loan._id}`
    : null;
  const [dismissed, setDismissed] = useState(() => {
    try {
      return storageKey ? localStorage.getItem(storageKey) === "true" : false;
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      if (storageKey) localStorage.setItem(storageKey, "true");
    } catch {
      // Dismissal still works for this visit when storage is unavailable.
    }
  };

  return (
    <section aria-labelledby="rejected-loan-title" className="w-full rounded-lg border border-red-200 bg-white p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 space-y-2 break-words">
          <h2 id="rejected-loan-title" className="font-raleway text-[22px] font-bold text-[#10172E]">
            {t("dashboard.rejectedLoan.title")}
          </h2>
          <p className="text-[15px] text-[#656565]">
            {t("dashboard.rejectedLoan.application", { id: loan.loan_id })}
          </p>
          <p className="text-[15px] text-[#656565]">
            {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(loan.loan_amount)}
          </p>
          {loan.rejection_reason && (
            <p className="text-[15px] text-[#656565] whitespace-pre-wrap">
              <span className="font-semibold">{t("dashboard.rejectedLoan.reason")}: </span>
              {loan.rejection_reason}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 md:shrink-0">
          <button type="button" onClick={onApply}
            className="cursor-pointer rounded-[50px] bg-[#439182] px-6 py-3 text-[15px] font-medium text-white hover:opacity-80">
            {t("dashboard.rejectedLoan.apply")}
          </button>
          <button type="button" onClick={dismiss}
            className="cursor-pointer px-6 py-3 text-[15px] font-medium text-[#2D6157] hover:underline">
            {t("dashboard.rejectedLoan.dismiss")}
          </button>
        </div>
      </div>
    </section>
  );
}
