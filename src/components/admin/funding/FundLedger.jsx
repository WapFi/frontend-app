import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFundDetails } from "../../../api/fundsApi";

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

function formatCount(value) {
  if (value === undefined || value === null || value === "") return "--";

  return Number(value).toLocaleString();
}

function StatCard({ label, value, description, tone = "default" }) {
  const toneClasses = {
    default: "border-gray-200 bg-white",
    success: "border-green-200 bg-green-50",
    warning: "border-yellow-200 bg-yellow-50",
    danger: "border-red-200 bg-red-50",
    info: "border-teal-200 bg-teal-50",
  };

  return (
    <div className={`rounded-lg border p-4 ${toneClasses[tone]}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-gray-900">{value}</p>
      {description && (
        <p className="mt-2 text-sm leading-5 text-gray-600">{description}</p>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-b-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm leading-5 text-gray-600">{description}</p>
        )}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function FundLedger() {
  const { fundId } = useParams();
  const navigate = useNavigate();
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFund = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getFundDetails(fundId);

        if (response.status) {
          setFund(response.data);
        } else {
          setError(response.message || "Failed to load fund ledger.");
        }
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load fund ledger."));
      } finally {
        setLoading(false);
      }
    };

    loadFund();
  }, [fundId]);

  const ledger = fund?.ledger || {};
  const counters = fund?.counters || {};
  const outstandingBreakdown = fund?.outstanding_breakdown || {};
  const reconciliation = fund?.reconciliation || {};
  const contributions = fund?.contributions || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/funds")}
            className="mb-3 cursor-pointer text-sm font-medium text-[#2D6157] hover:text-[#224c44]"
          >
            Back to Funds
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Fund Ledger</h1>
          <p className="mt-1 text-sm text-gray-600">
            View where the sponsor's money is, what changed it, and whether the
            fund records still match.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 rounded bg-gray-200" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-28 rounded bg-gray-100" />
              ))}
            </div>
            <div className="h-64 rounded bg-gray-100" />
          </div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 cursor-pointer text-sm font-medium text-red-800 hover:text-red-900"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {fund?.fund_id || "--"}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                  {fund?.name || "--"}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Sponsor: {fund?.sponsor?.name || "--"}
                </p>
              </div>
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                  fund?.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : fund?.status === "SUSPENDED"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {fund?.status || "Unknown"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <StatCard
              label="Available"
              value={formatCurrency(ledger.available_capital)}
              description="Cash available to reserve for new approved loans."
              tone="success"
            />
            <StatCard
              label="Out With Borrowers"
              value={formatCurrency(ledger.outstanding_principal)}
              description="Sponsor capital reserved or already lent and not yet fully repaid."
              tone="info"
            />
            <StatCard
              label="Awaiting Sale"
              value={formatCurrency(ledger.recovered_unsettled)}
              description="Value repaid in recyclables but not yet converted back to cash."
              tone="warning"
            />
          </div>

          {reconciliation.balanced === false && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-5">
              <h2 className="text-base font-semibold text-red-800">
                Ledger is not balanced
              </h2>
              <p className="mt-1 text-sm text-red-700">
                The fund records do not currently match. This should be
                investigated before relying on this fund balance.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Section
              title="Why It Differs From Contributions"
              description="These adjustments explain why the fund balance may not equal the sponsor's original deposits."
            >
              <DetailRow
                label="Total Contributed"
                value={formatCurrency(counters.total_contributed)}
              />
              <DetailRow
                label="Written Off"
                value={formatCurrency(counters.written_off)}
              />
              <DetailRow
                label="Restored By WapFi"
                value={formatCurrency(counters.indemnified)}
              />
              <DetailRow
                label="Market Movement"
                value={formatCurrency(counters.net_market_adjustment)}
              />
            </Section>

            <Section
              title="Money Out With Borrowers"
              description="Reserved funds are approved but not confirmed. Performing loans are active. Recovery is capital at risk."
            >
              <DetailRow
                label="Reserved"
                value={formatCurrency(outstandingBreakdown.reserved)}
              />
              <DetailRow
                label="Reserved Loans"
                value={formatCount(outstandingBreakdown.reserved_loans)}
              />
              <DetailRow
                label="Performing"
                value={formatCurrency(outstandingBreakdown.performing)}
              />
              <DetailRow
                label="Disbursed"
                value={formatCurrency(outstandingBreakdown.disbursed)}
              />
              <DetailRow
                label="Disbursed Loans"
                value={formatCount(outstandingBreakdown.disbursed_loans)}
              />
              <DetailRow
                label="In Recovery"
                value={formatCurrency(outstandingBreakdown.in_default_recovery)}
              />
            </Section>
          </div>

          <Section
            title="Reconciliation"
            description="Expected and actual values should match. Any difference means the fund records need review."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Balanced"
                value={
                  reconciliation.balanced === undefined
                    ? "--"
                    : reconciliation.balanced
                      ? "Yes"
                      : "No"
                }
                tone={reconciliation.balanced === false ? "danger" : "success"}
              />
              <StatCard
                label="Expected"
                value={formatCurrency(reconciliation.expected)}
              />
              <StatCard
                label="Actual"
                value={formatCurrency(reconciliation.actual)}
              />
              <StatCard
                label="Drift"
                value={formatCurrency(reconciliation.drift)}
                tone={Number(reconciliation.drift || 0) === 0 ? "success" : "danger"}
              />
            </div>
          </Section>

          <Section
            title="Contribution Summary"
            description="Contribution totals grouped by the type of money added to this fund."
          >
            {contributions.length === 0 ? (
              <p className="text-sm text-gray-500">
                No contribution summary is available for this fund yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Type
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Count
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {contributions.map((contribution) => (
                      <tr key={contribution.type}>
                        <td className="px-3 py-3 text-sm font-medium text-gray-900">
                          {contribution.type || "--"}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-700">
                          {formatCount(contribution.count)}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-700">
                          {formatCurrency(contribution.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        </>
      )}
    </div>
  );
}
