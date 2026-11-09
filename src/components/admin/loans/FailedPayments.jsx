import { useEffect, useState } from "react";
import { getDisbursements } from "../../../api/adminApi";
import LoanApplicationModal from "../modals/LoanApplicationModal";

export default function FailedPayments() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState({ disbursements: [], total_pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    getDisbursements({ status: "FAILED", page, limit }, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return;
        if (!response.status || !Array.isArray(response.data?.disbursements)) {
          throw new Error(response.message || "Unable to load failed payments.");
        }
        if (page > Math.max(1, response.data.total_pages)) {
          setPage(Math.max(1, response.data.total_pages));
          return;
        }
        setResult(response.data);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setError(error.response?.data?.message || error.message || "Unable to load failed payments.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [page, limit, revision]);

  const refreshAfterAction = async () => {
    // The mutation is complete. Fetch again before closing the review modal.
    const response = await getDisbursements({ status: "FAILED", page, limit });
    if (!response.status || !Array.isArray(response.data?.disbursements)) {
      throw new Error("Unable to refresh failed payments.");
    }
    setResult(response.data);
    if (page > Math.max(1, response.data.total_pages)) {
      setPage(Math.max(1, response.data.total_pages));
    }
  };

  const review = (loan) => setSelectedLoan({
    id: loan._id,
    name: loan.user?.full_name || "Unknown User",
    email: loan.user?.identifier || "--",
    phone: loan.user?.phone || "--",
    amount: new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(loan.loan_amount),
    loanAmountValue: loan.loan_amount,
    loanTerm: "--",
    reason: "--",
    date: "--",
    status: loan.status,
    disbursementStatus: loan.disbursement_status,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" disabled={loading} onClick={() => setRevision((value) => value + 1)}
          className="cursor-pointer text-sm font-medium text-yellow-700 hover:text-yellow-800 disabled:opacity-50">Refresh</button>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-red-600">{error}</p>
      ) : loading ? (
        <p role="status" className="py-8 text-center text-gray-500">Loading failed payments...</p>
      ) : (
        <div className="overflow-x-auto bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead><tr>
              {["Borrower", "Loan ID", "Amount", "Bank account", "Disbursement", "Action"].map((title) => (
                <th key={title} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase sm:px-6">{title}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-200">
              {result.disbursements.map((loan) => (
                <tr key={loan._id}>
                  <td className="px-3 py-4 text-sm sm:px-6"><p>{loan.user?.full_name || "Unknown User"}</p></td>
                  <td className="px-3 py-4 text-sm whitespace-nowrap sm:px-6">{loan.loan_id}</td>
                  <td className="px-3 py-4 text-sm whitespace-nowrap sm:px-6">{new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(loan.loan_amount)}</td>
                  <td className="px-3 py-4 text-sm sm:px-6"><p>{loan.bank_account?.bank_name || "--"}</p><p>{loan.bank_account?.account_number || "--"}</p></td>
                  <td className="px-3 py-4 sm:px-6"><span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">{loan.disbursement_status}</span></td>
                  <td className="px-3 py-4 sm:px-6"><button type="button" onClick={() => review(loan)} className="cursor-pointer text-sm font-medium text-yellow-700 hover:text-yellow-800">Review</button></td>
                </tr>
              ))}
              {result.disbursements.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">No failed payments found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 py-3">
        <button type="button" disabled={loading || Boolean(error) || page <= 1} onClick={() => setPage(page - 1)} className="cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
        <label className="flex items-center gap-2 text-sm">Per page
          <select value={limit} disabled={loading} onChange={(event) => { setLimit(Number(event.target.value)); setPage(1); }} className="cursor-pointer rounded-md border border-gray-300 px-3 py-2">
            {[5, 10, 25, 50].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <button type="button" disabled={loading || Boolean(error) || page >= result.total_pages} onClick={() => setPage(page + 1)} className="cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
      </div>
      {selectedLoan && <LoanApplicationModal key={selectedLoan.id} loan={selectedLoan} onClose={() => setSelectedLoan(null)} onUpdated={refreshAfterAction} />}
    </div>
  );
}
