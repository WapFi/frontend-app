import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  getFunds,
  getSettlementQueue,
  getSettlements,
  recordSettlement,
} from "../../../api/fundsApi";

const perPageOptions = [5, 10, 25, 50];
const recyclableTypes = [
  "Plastic",
  "Aluminum",
  "Paper",
  "Carton",
  "Pure Water Sachet",
];

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

function formatNumber(value, suffix = "") {
  if (value === undefined || value === null || value === "") return "--";

  const amount = Number(value);
  if (Number.isNaN(amount)) return "--";

  return `${amount.toLocaleString()}${suffix}`;
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

function getFundId(value) {
  return value?.fund?._id || value?.fund_id || value?.fund;
}

function getFundLabel(value) {
  if (value?.fund?.fund_id && value?.fund?.name) {
    return `${value.fund.fund_id} - ${value.fund.name}`;
  }

  return value?.fund?.name || value?.fund?.fund_id || value?.fund_id || "--";
}

function getDeliveryCreditedValue(delivery) {
  return Number(
    delivery.credited_value ??
      delivery.credited_amount ??
      delivery.value_credited ??
      delivery.plastic_value_naira ??
      delivery.amount_paid ??
      0,
  );
}

function getDeliveryId(delivery) {
  return delivery._id || delivery.delivery_id || delivery.id;
}

function getQueueItems(data) {
  return (
    data?.deliveries ||
    data?.queue ||
    data?.items ||
    data?.settlement_queue ||
    []
  );
}

function getHistoryItems(data) {
  return data?.settlements || data?.items || data?.history || [];
}

function StatCard({ label, value, description }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
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

function FundTotals({ totals }) {
  if (!totals?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {totals.map((item) => (
        <div
          key={item.fund?._id || item.fund_id || item.fund}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <p className="text-sm font-semibold text-gray-900">
            {getFundLabel(item)}
          </p>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between gap-3">
              <span>Awaiting value</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(
                  item.awaiting_value ??
                    item.credited_value ??
                    item.total_credited_value,
                )}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Weight</span>
              <span className="font-medium text-gray-900">
                {formatNumber(item.weight_kg ?? item.total_weight_kg, " kg")}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Deliveries</span>
              <span className="font-medium text-gray-900">
                {formatNumber(item.delivery_count ?? item.count)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Settlements() {
  const [activeTab, setActiveTab] = useState("queue");
  const [funds, setFunds] = useState([]);
  const [fundFilter, setFundFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [queuePage, setQueuePage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [queueData, setQueueData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [queueError, setQueueError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectionError, setSelectionError] = useState("");
  const [formData, setFormData] = useState({
    sale_proceeds: "",
    buyer: "",
    sale_reference: "",
    notes: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const queueItems = useMemo(() => getQueueItems(queueData), [queueData]);
  const historyItems = useMemo(() => getHistoryItems(historyData), [historyData]);
  const byFundTotals = queueData?.by_fund || queueData?.totals_by_fund || [];
  const queueTotalPages = queueData?.total_pages || 1;
  const historyTotalPages = historyData?.total_pages || 1;

  const selectedDeliveries = useMemo(
    () =>
      queueItems.filter((delivery) =>
        selectedIds.includes(getDeliveryId(delivery)),
      ),
    [queueItems, selectedIds],
  );
  const selectedFundId = selectedDeliveries[0]
    ? getFundId(selectedDeliveries[0])
    : "";
  const selectedCreditedTotal = selectedDeliveries.reduce(
    (total, delivery) => total + getDeliveryCreditedValue(delivery),
    0,
  );
  const saleProceeds =
    formData.sale_proceeds === "" ? null : Number(formData.sale_proceeds);
  const marketDifference =
    saleProceeds === null || Number.isNaN(saleProceeds)
      ? null
      : saleProceeds - selectedCreditedTotal;

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

  const loadQueue = async () => {
    try {
      setLoadingQueue(true);
      setQueueError("");
      const params = {
        page: queuePage,
        limit: perPage,
      };

      if (fundFilter) params.fund = fundFilter;
      if (typeFilter) params.recyclable_type = typeFilter;

      const response = await getSettlementQueue(params);

      if (response.status) {
        setQueueData(response.data || {});
      } else {
        setQueueError(response.message || "Failed to load settlement queue.");
      }
    } catch (error) {
      setQueueError(getErrorMessage(error, "Failed to load settlement queue."));
    } finally {
      setLoadingQueue(false);
    }
  };

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      setHistoryError("");
      const params = {
        page: historyPage,
        limit: perPage,
      };

      if (fundFilter) params.fund = fundFilter;

      const response = await getSettlements(params);

      if (response.status) {
        setHistoryData(response.data || {});
      } else {
        setHistoryError(response.message || "Failed to load settlements.");
      }
    } catch (error) {
      setHistoryError(getErrorMessage(error, "Failed to load settlements."));
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadFunds();
  }, []);

  useEffect(() => {
    loadQueue();
  }, [queuePage, perPage, fundFilter, typeFilter]);

  useEffect(() => {
    if (activeTab === "history") loadHistory();
  }, [activeTab, historyPage, perPage, fundFilter]);

  useEffect(() => {
    setSelectedIds([]);
    setSelectionError("");
  }, [queuePage, fundFilter, typeFilter, perPage]);

  const handleDeliveryToggle = (delivery) => {
    const deliveryId = getDeliveryId(delivery);
    const deliveryFundId = getFundId(delivery);
    const isSelected = selectedIds.includes(deliveryId);

    setSelectionError("");

    if (isSelected) {
      setSelectedIds((currentIds) =>
        currentIds.filter((currentId) => currentId !== deliveryId),
      );
      return;
    }

    if (selectedFundId && deliveryFundId !== selectedFundId) {
      setSelectionError("Selected deliveries must belong to the same fund.");
      return;
    }

    setSelectedIds((currentIds) => [...currentIds, deliveryId]);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setFormError("");
  };

  const resetSettlementForm = () => {
    setSelectedIds([]);
    setSelectionError("");
    setFormError("");
    setFormData({
      sale_proceeds: "",
      buyer: "",
      sale_reference: "",
      notes: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedIds.length === 0) {
      setFormError("Select at least one delivery to settle.");
      return;
    }

    if (formData.sale_proceeds === "") {
      setFormError("Enter the actual sale proceeds.");
      return;
    }

    if (Number.isNaN(Number(formData.sale_proceeds)) || Number(formData.sale_proceeds) < 0) {
      setFormError("Sale proceeds cannot be negative.");
      return;
    }

    const payload = {
      delivery_ids: selectedIds,
      sale_proceeds: Number(formData.sale_proceeds),
    };

    if (formData.buyer.trim()) payload.buyer = formData.buyer.trim();
    if (formData.sale_reference.trim()) {
      payload.sale_reference = formData.sale_reference.trim();
    }
    if (formData.notes.trim()) payload.notes = formData.notes.trim();

    try {
      setSubmitting(true);
      setFormError("");
      const response = await recordSettlement(payload);

      if (response.status) {
        toast.success(response.message || "Settlement recorded successfully.");
        resetSettlementForm();
        await loadQueue();
        if (activeTab === "history") await loadHistory();
      } else {
        setFormError(response.message || "Failed to record settlement.");
      }
    } catch (error) {
      const message = getErrorMessage(error, "Failed to record settlement.");
      setFormError(message);

      if (error.response?.status === 409) {
        await loadQueue();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePerPageChange = (event) => {
    setPerPage(Number(event.target.value));
    setQueuePage(1);
    setHistoryPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settlements</h1>
        <p className="mt-1 text-sm text-gray-600">
          Record when recyclable repayments are sold and return the cash value
          to the right fund.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard
          label="Selected Deliveries"
          value={selectedIds.length.toLocaleString()}
          description="Deliveries selected for the next sale record."
        />
        <StatCard
          label="Credited Value"
          value={formatCurrency(selectedCreditedTotal)}
          description="Amount already credited to borrowers for selected deliveries."
        />
        <StatCard
          label="Sale Difference"
          value={marketDifference === null ? "--" : formatCurrency(marketDifference)}
          description="Actual sale proceeds minus credited value."
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("queue")}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium ${
                  activeTab === "queue"
                    ? "bg-[#2D6157] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Settlement Queue
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium ${
                  activeTab === "history"
                    ? "bg-[#2D6157] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                History
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <select
                value={fundFilter}
                onChange={(event) => {
                  setFundFilter(event.target.value);
                  setQueuePage(1);
                  setHistoryPage(1);
                }}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              >
                <option value="">All funds</option>
                {funds.map((fund) => (
                  <option key={fund._id} value={fund._id}>
                    {fund.fund_id || fund.name}
                  </option>
                ))}
              </select>

              {activeTab === "queue" ? (
                <select
                  value={typeFilter}
                  onChange={(event) => {
                    setTypeFilter(event.target.value);
                    setQueuePage(1);
                  }}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                >
                  <option value="">All materials</option>
                  {recyclableTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              ) : (
                <div />
              )}

              <select
                value={perPage}
                onChange={handlePerPageChange}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              >
                {perPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} per page
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {activeTab === "queue" ? (
          <div className="space-y-6 p-4 sm:p-6">
            <FundTotals totals={byFundTotals} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Select
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Delivery
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Fund
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Material
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Weight
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Credited
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Collection Point
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {loadingQueue ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                          Loading settlement queue...
                        </td>
                      </tr>
                    ) : queueError ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-sm text-red-600">
                          {queueError}
                        </td>
                      </tr>
                    ) : queueItems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                          No unsettled recyclable deliveries found.
                        </td>
                      </tr>
                    ) : (
                      queueItems.map((delivery) => {
                        const deliveryId = getDeliveryId(delivery);
                        const deliveryFundId = getFundId(delivery);
                        const isSelected = selectedIds.includes(deliveryId);
                        const isDisabled =
                          Boolean(selectedFundId) &&
                          deliveryFundId !== selectedFundId &&
                          !isSelected;

                        return (
                          <tr key={deliveryId} className={isDisabled ? "bg-gray-50 opacity-60" : ""}>
                            <td className="px-4 py-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={isDisabled}
                                onChange={() => handleDeliveryToggle(delivery)}
                                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#2D6157] focus:ring-[#2D6157] disabled:cursor-not-allowed"
                              />
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                              {delivery.delivery_id || deliveryId || "--"}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                              {getFundLabel(delivery)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                              {delivery.recyclable_type || delivery.material_type || "--"}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                              {formatNumber(delivery.weight_kg, " kg")}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                              {formatCurrency(getDeliveryCreditedValue(delivery))}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                              {delivery.collection_point || delivery.drop_off_location || "--"}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                              {formatDate(delivery.delivered_at || delivery.created_at)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <form
                onSubmit={handleSubmit}
                className="h-fit rounded-lg border border-gray-200 bg-gray-50 p-5"
              >
                <h2 className="text-base font-semibold text-gray-900">
                  Record Sale
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Enter what the selected material actually sold for. The
                  difference is recorded against the fund.
                </p>

                {(selectionError || formError) && (
                  <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                    {selectionError || formError}
                  </p>
                )}

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sale Proceeds
                    </label>
                    <input
                      type="number"
                      name="sale_proceeds"
                      min="0"
                      step="0.01"
                      value={formData.sale_proceeds}
                      onChange={handleFormChange}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      placeholder="May be 0"
                    />
                  </div>

                  <div className="rounded-md bg-white p-3 text-sm text-gray-600">
                    <div className="flex justify-between gap-3">
                      <span>Credited value</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(selectedCreditedTotal)}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between gap-3">
                      <span>Difference</span>
                      <span
                        className={`font-medium ${
                          Number(marketDifference || 0) < 0
                            ? "text-red-700"
                            : "text-green-700"
                        }`}
                      >
                        {marketDifference === null
                          ? "--"
                          : formatCurrency(marketDifference)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Buyer
                    </label>
                    <input
                      type="text"
                      name="buyer"
                      value={formData.buyer}
                      onChange={handleFormChange}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sale Reference
                    </label>
                    <input
                      type="text"
                      name="sale_reference"
                      value={formData.sale_reference}
                      onChange={handleFormChange}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleFormChange}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={resetSettlementForm}
                    className="flex-1 cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || selectedIds.length === 0}
                    className="theme_bg_color flex-1 cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Recording..." : "Record Settlement"}
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <button
                type="button"
                disabled={queuePage <= 1 || loadingQueue}
                onClick={() => setQueuePage((page) => Math.max(page - 1, 1))}
                className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {queuePage} of {queueTotalPages}
              </span>
              <button
                type="button"
                disabled={queuePage >= queueTotalPages || loadingQueue}
                onClick={() => setQueuePage((page) => page + 1)}
                className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-4 sm:p-6">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Reference
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Fund
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Credited Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Sale Proceeds
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Difference
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Buyer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {loadingHistory ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                        Loading settlements...
                      </td>
                    </tr>
                  ) : historyError ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-red-600">
                        {historyError}
                      </td>
                    </tr>
                  ) : historyItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                        No settlements recorded yet.
                      </td>
                    </tr>
                  ) : (
                    historyItems.map((settlement) => (
                      <tr key={settlement._id || settlement.settlement_id}>
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                          {settlement.settlement_id ||
                            settlement.sale_reference ||
                            settlement._id ||
                            "--"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                          {getFundLabel(settlement)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                          {formatCurrency(
                            settlement.credited_value ??
                              settlement.total_credited_value,
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                          {formatCurrency(settlement.sale_proceeds)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                          {formatCurrency(
                            settlement.market_adjustment ??
                              settlement.net_market_adjustment,
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                          {settlement.buyer || "--"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                          {formatDate(
                            settlement.settled_at || settlement.created_at,
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <button
                type="button"
                disabled={historyPage <= 1 || loadingHistory}
                onClick={() => setHistoryPage((page) => Math.max(page - 1, 1))}
                className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {historyPage} of {historyTotalPages}
              </span>
              <button
                type="button"
                disabled={historyPage >= historyTotalPages || loadingHistory}
                onClick={() => setHistoryPage((page) => page + 1)}
                className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
