import { useParams } from "react-router-dom";
import { useRepayments } from "../../context/RepaymentsContext";
import CashRepaymentsTable from "./CashRepaymentsTable";
import MixedRepaymentsTable from "./MixedRepaymentsTable";
import RecyclablesRepaymentTable from "./RecyclabesRepaymentTable";
import PageLoader from "../PageLoader";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function RepaymentsHistoryWrapper() {
  const { t } = useTranslation();

  const { loanID } = useParams();
  const { repaymentsData } = useRepayments();

  const [repaymentMethod, setRepaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const filtered = repaymentsData.filter(
        (repayment) => repayment.loan_id === loanID
      );

      if (filtered.length === 0) {
        setRepaymentMethod(null);
      } else {
        // Pick the first repayment entry for the loanID
        setRepaymentMethod(filtered[0].repayment_method);
      }
    } catch (err) {
      console.error("Error determining repayment method:", err);
      setRepaymentMethod(null);
    } finally {
      setLoading(false);
    }
  }, [loanID, repaymentsData]);

  if (loading) return <PageLoader />;

  if (!repaymentMethod) {
    return (
      <div className="text-center py-8">
        <p className="text-[#666]">
          {t("repaymentsHistoryWrapper.noRepaymentData")}
        </p>
      </div>
    );
  }

  if (repaymentMethod === "CASH") {
    return <CashRepaymentsTable />;
  }

  if (repaymentMethod === "BOTH") {
    return <MixedRepaymentsTable />;
  }

  if (repaymentMethod === "RECYCLABLES") {
    return <RecyclablesRepaymentTable />;
  }

  return null;
}
