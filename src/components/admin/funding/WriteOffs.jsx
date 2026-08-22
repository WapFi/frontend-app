import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  getFunds,
  getWriteOffCandidates,
  writeOffLoan,
} from "../../../api/fundsApi";

const perPageOptions = [5, 10, 25, 50];

function getErrorMessage(error, fallback) {
  const responseData = error.response?.data;

  if (responseData?.errors?.[0]?.message) return responseData.errors[0].message;
  if (responseData?.message) return responseData.message;

  return fallback;
}

function formatCurrency(value) {
  if (value === undefined || value === null || value === "") return "--";

  const amount = Number(value);
  if (Number.isNaN(amount)) return "--";

  return `NGN ${amount.toLocaleString()}`;
}

function formatDate(value) {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getCandidates(data) {
  return (
    data?.candidates ||
    data?.loans ||
    data?.items ||
    data?.write_off_candidates ||
    []
  );
}

function getLoanRecordId(loan) {
  return loan?._id || loan?.id || loan?.loan?._id;
}

function getLoanDisplayId(loan) {
  return loan?.loan_id || loan?.loan?.loan_id || getLoanRecordId(loan) || "--";
}

function getBorrowerName(loan) {
  return (
    loan?.user?.full_name ||
    loan?.borrower?.full_name ||
    loan?.user?.identifier ||
    loan?.borrower?.identifier ||
    loan?.borrower_name ||
    "--"
  );
}

function getFundLabel(loan) {
  const fund = loan?.fund || loan?.allocation?.fund;

  if (fund?.fund_id && fund?.name) return `${fund.fund_id} - ${fund.name}`;
  return fund?.name || fund?.fund_id || loan?.fund_id || "--";
}

function getRemainingPrincipal(loan) {
  return (
    loan?.remaining_principal ??
    loan?.principal_remaining ??
    loan?.outstanding_principal ??
    loan?.outstanding_loan ??
    loan?.loan?.remaining_principal
  );
}

function getTotalPages(data) {
  return data?.total_pages || data?.pagination?.total_pages || 1;
}

function ResultSummary({ result }) {
  if (!result) return null;

  const resultData = result.data || {};
  const lossBearer = resultData.loss_bearer;
  const restoredByWapfi = resultData.fund_restored_by_wapfi;

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
      <p className="text-sm font-semibold text-green-800">
        {result.message || "Loan written off successfully."}
      </p>
      {(lossBearer || restoredByWapfi !== undefined) && (
        <div className="mt-3 space-y-2 text-sm text-green-800">
          {lossBearer && (
            <p>
              Loss bearer: <span className="font-semibold">{lossBearer}</span>
            </p>
          )}
          {restoredByWapfi !== undefined && (
            <p>
              WapFi restored the fund:{" "}
              <span className="font-semibold">
                {restoredByWapfi ? "Yes" : "No"}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function WriteOffs() {
  const [funds, setFunds] = useState([]);
  const [fundFilter, setFundFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [writeOffResult, setWriteOffResult] = useState(null);

  const candidates = useMemo(
    () => getCandidates(candidateData),
    [candidateData],
  );
  const totalPages = getTotalPages(candidateData);

  const loadFunds = async () => {
    try {
      const response = await getFunds({ page: 1, limit: 100, status: "ACTIVE" });
      if (response.status) {
        setFunds(response.data?.funds || []);
      }
    } catch {
      setFunds([]);
    }
  };

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: perPage,
      };

      if (fundFilter) params.fund = fundFilter;

      const response = await getWriteOffCandidates(params);

      if (response.status) {
        setCandidateData(response.data || {});
      } else {
        setError(response.message || "Failed to load write-off candidates.");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load write-off candidates."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFunds();
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [page, perPage, fundFilter]);

  const openWriteOffModal = (loan) => {
    setSelectedLoan(loan);
    setReason("");
    setFormError("");
    setWriteOffResult(null);
  };

  const closeWriteOffModal = () => {
    if (submitting) return;

    setSelectedLoan(null);
    setReason("");
    setFormError("");
    setWriteOffResult(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loanId = getLoanRecordId(selectedLoan);

    if (!loanId) {
      setFormError("This loan is missing the record ID needed for write-off.");
      return;
    }

    if (reason.trim().length < 5) {
      setFormError("Enter a reason with at least 5 characters.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      const response = await writeOffLoan(loanId, { reason: reason.trim() });

      if (response.status) {
        setWriteOffResult(response);
        toast.success(response.message || "Loan written off successfully.");
        await loadCandidates();
      } else {
        setFormError(response.message || "Failed to write off this loan.");
      }
    } catch (err) {
      setFormError(getErrorMessage(err, "Failed to write off this loan."));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePerPageChange = (event) => {
    setPerPage(Number(event.target.value));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Write-offs</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-600">
          Review overdue or defaulted loans that still have principal
          outstanding. A write-off is a deliberate decision that removes the
          remaining principal from the fund.
        </p>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm leading-6 text-yellow-900">
          A defaulted loan is not automatically written off. Use this page only
          after recovery attempts have been reviewed and the remaining principal
          should be treated as unrecoverable.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
            <select
              value={fundFilter}
              onChange={(event) => {
                setFundFilter(event.target.value);
                setPage(1);
              }}
              className="cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            >
              <option value="">All funds</option>
              {funds.map((fund) => (
                <option key={fund._id} value={fund._id}>
                  {fund.fund_id || fund.name}
                </option>
              ))}
            </select>

            <select
              value={perPage}
              onChange={handlePerPageChange}
              className="cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            >
              {perPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Borrower
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Loan ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Fund
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Remaining Principal
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    Loading write-off candidates...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              ) : candidates.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No overdue or defaulted loans are ready for write-off.
                  </td>
                </tr>
              ) : (
                candidates.map((loan) => (
                  <tr key={getLoanRecordId(loan) || getLoanDisplayId(loan)}>
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                      {getBorrowerName(loan)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                      {getLoanDisplayId(loan)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                      {getFundLabel(loan)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                      {formatCurrency(getRemainingPrincipal(loan))}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                      {formatDate(loan.due_date || loan.loan?.due_date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                        {loan.status || loan.loan?.status || "Unknown"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() => openWriteOffModal(loan)}
                        className="cursor-pointer font-medium text-[#2D6157] hover:text-[#224c44]"
                      >
                        Review Write-off
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-4 sm:px-6">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
            className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Review Write-off
                </h2>
                <p className="mt-1 text-sm leading-5 text-gray-600">
                  Confirm the loan and give a clear reason before writing off
                  the remaining principal.
                </p>
              </div>
              <button
                type="button"
                onClick={closeWriteOffModal}
                disabled={submitting}
                className="cursor-pointer rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>

            <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
              <div className="flex justify-between gap-4 py-1">
                <span className="text-gray-500">Borrower</span>
                <span className="text-right font-medium text-gray-900">
                  {getBorrowerName(selectedLoan)}
                </span>
              </div>
              <div className="flex justify-between gap-4 py-1">
                <span className="text-gray-500">Loan ID</span>
                <span className="text-right font-medium text-gray-900">
                  {getLoanDisplayId(selectedLoan)}
                </span>
              </div>
              <div className="flex justify-between gap-4 py-1">
                <span className="text-gray-500">Fund</span>
                <span className="text-right font-medium text-gray-900">
                  {getFundLabel(selectedLoan)}
                </span>
              </div>
              <div className="flex justify-between gap-4 py-1">
                <span className="text-gray-500">Remaining principal</span>
                <span className="text-right font-medium text-gray-900">
                  {formatCurrency(getRemainingPrincipal(selectedLoan))}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm leading-5 text-red-700">
                This action removes the remaining principal from the fund's
                outstanding balance. Only continue after recovery has been
                reviewed.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Write-off Reason
                </label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(event) => {
                    setReason(event.target.value);
                    setFormError("");
                  }}
                  disabled={Boolean(writeOffResult)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 disabled:bg-gray-100"
                  placeholder="Example: Recovery attempts completed; borrower unreachable."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 5 characters.
                </p>
              </div>

              {formError && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                  {formError}
                </p>
              )}

              <ResultSummary result={writeOffResult} />

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeWriteOffModal}
                  disabled={submitting}
                  className="cursor-pointer rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {writeOffResult ? "Close" : "Cancel"}
                </button>
                {!writeOffResult && (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="cursor-pointer rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Writing off..." : "Write Off Loan"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
