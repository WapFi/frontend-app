

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchRepayments } from "../../api/apiData";

import NairaIcon from "../../assets/naira icon.svg";
import reloadIcon from "../../assets/reload-icon.svg";
import alertIcon from "../../assets/alert-icon.svg";
import VerifiedIcon from "../../assets/verified icon.svg";
import PendingIcon from "../../assets/pending icon.svg";
import FailedIcon from "../../assets/failed icon.svg";
import chevronDown from "../../assets/chevron-down.svg";
import calendarIcon from "../../assets/calendar icon.svg";
import PageLoader from "../PageLoader";

export default function MixedRepaymentsTable() {
  const { t } = useTranslation();
  const { loanID } = useParams();

  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [perPageOpen, setPerPageOpen] = useState(false);

  // Date picker states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Dedicated state for forcing a reload
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const formatDate = (date) => {
    if (!date) return null;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Format date range for placeholder
  const selectedDateText = () => {
    if (startDate && endDate) {
      const startFormatted = startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const endFormatted = endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `${startFormatted} - ${endFormatted}`;
    }
    return t("repaymentsSection.selectDate");
  };

  // Fetch table data
  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      try {
        const filters = { loanID: loanID };

        if (startDate && endDate) {
          filters.startDate = formatDate(startDate);
          filters.endDate = formatDate(endDate);
        }

        const response = await fetchRepayments(currentPage, perPage, filters);

        if (response?.status) {
          setRepayments(response.data.repayments);
          setTotalItems(response.data.total_repayments || 0);
        } else {
          setRepayments([]);
          setTotalItems(0);
          console.error("Error fetching repayments:", response?.message);
        }
      } catch (err) {
        console.error("Error fetching repayments:", err);
        setRepayments([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [currentPage, perPage, startDate, endDate, loanID, reloadTrigger]);

  const totalPages = Math.ceil(totalItems / perPage);

  const handlePerPageChange = (newLimit) => {
    setPerPage(newLimit);
    setPerPageOpen(false);
    setCurrentPage(1);
  };

  const handleReload = () => {
    setReloadTrigger((prev) => prev + 1);
    setCurrentPage(1);
    setPerPage(10);
    setStartDate(null);
    setEndDate(null);
  };

  const handleDateChange = ([start, end]) => {
    if (start && !end) {
      // Single date selected → set both start & end to same
      setStartDate(start);
      setEndDate(start);
    } else {
      setStartDate(start);
      setEndDate(end);
    }
    setCurrentPage(1);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="px-3.5 mb-12 md:px-10">
      {/* Header + Date Picker */}
      <div className="flex justify-between items-center">
        <p className="text-[#222] font-semibold text-[24px] font-raleway md:text-[32px] my-8">
          {t("repaymentsHistoryHeader.title")}
        </p>
        <div className="ml-3.5 relative">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            maxDate={new Date()}
            customInput={
              <div className="flex items-center gap-2.5 pl-3 shrink-0 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] cursor-pointer">
                <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
                  {selectedDateText()}
                </p>
                <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
                  <img src={calendarIcon} alt="calendar icon" />
                </span>
              </div>
            }
          />
        </div>
      </div>

      {/* Info alert */}
      <div className="flex items-start gap-3 rounded-[12px] bg-white p-3 my-6">
        <img src={alertIcon} alt="alert icon" />
        <p className="text-[#333] text-[14px]">
          {t("mixedRepaymentsTable.note")}
        </p>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block bg-white rounded-2xl py-4">
        <div className="flex justify-between items-center py-2.5 px-3 mx-4 mb-4.5">
          <div
            className="border border-[rgba(0,0,0,0.08)] rounded-[8px] px-3 py-2 cursor-pointer"
            onClick={handleReload}
          >
            <img src={reloadIcon} alt="reload icon" className="block" />
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-5 py-3 px-4 border-y border-y-[rgba(0,0,0,0.04)] text-[#333] font-medium bg-[#fafafa]">
          <p>{t("mixedRepaymentsTable.date")}</p>
          <p>{t("mixedRepaymentsTable.type")}</p>
          <p>{t("mixedRepaymentsTable.quantity")}</p>
          <p>{t("mixedRepaymentsTable.amount")}</p>
          <p>{t("mixedRepaymentsTable.status")}</p>
        </div>

        {repayments.length === 0 && (
          <div className="text-center text-[#666] py-6">
            {t("mixedRepaymentsTable.noRepayments")}
          </div>
        )}

        {repayments.map((repayment, index) => (
          <div
            key={index}
            className="grid grid-cols-5 py-4 px-4 items-center border-y border-y-[rgba(0,0,0,0.04)]"
          >
            <p className="text-[#666] text-[14px]">
              {new Date(repayment.repayment_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-[#222]">{repayment.repayment_method}</p>
            <p className="text-[#444]">
              {repayment.repayment_method !== "CASH"
                ? repayment.plastic_weight_kg
                : "-"}
            </p>
            <div className="flex items-center gap-1">
              <img src={NairaIcon} alt="naira icon" />
              <span>
                {new Intl.NumberFormat("en-NG", {
                  style: "decimal",
                  maximumFractionDigits: 2,
                }).format(repayment.amount_paid)}
              </span>
            </div>
            {repayment.status === "COMPLETED" && (
              <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#D3F3DF] bg-[#F2FDF5] w-fit">
                <img src={VerifiedIcon} alt="verified icon" />
                <p className="text-[14px] text-[#16A34A]">
                  {t("mixedRepaymentsTable.completed")}
                </p>
              </div>
            )}
            {repayment.status === "PENDING" && (
              <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[rgba(217,145,0,0.60)] bg-[rgba(217,145,0,0.14)] w-fit">
                <img src={PendingIcon} alt="pending icon" />
                <p className="text-[14px] text-[#D99100]">
                  {t("mixedRepaymentsTable.pending")}
                </p>
              </div>
            )}
            {repayment.status === "FAILED" && (
              <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.08)] w-fit">
                <img src={FailedIcon} alt="failed icon" />
                <p className="text-[14px] text-[#EF4444]">
                  {t("mixedRepaymentsTable.failed")}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 px-4">
          <button
            className="text-sm border px-3 py-1 rounded-[8px] border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            {t("mixedRepaymentsTable.previous")}
          </button>

          {/* Per Page selector */}
          <div className="relative">
            <div
              className="flex items-center gap-2 rounded-[8px] border border-[#e5e5e5] px-3 cursor-pointer"
              onClick={() => setPerPageOpen(!perPageOpen)}
            >
              <p className="text-[#999] text-sm py-0.5">
                {t("mixedRepaymentsTable.perPage")}
              </p>
              <span className="text-[#333] block border-l border-l-[#e5e5e5] pl-2.5 py-0.5">
                {perPage}
              </span>
              <img src={chevronDown} alt="dropdown icon" className="ml-1 w-4 block" />
            </div>
            {perPageOpen && (
              <div className="absolute mt-1 bg-white border rounded shadow z-10">
                {[10, 15, 20, 25, 30, 50, 100].map((num) => (
                  <div
                    key={num}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePerPageChange(num)}
                  >
                    {num}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="text-sm border px-3 py-1 rounded-[8px] border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage >= totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            {t("mixedRepaymentsTable.next")}
          </button>
        </div>
      </div>

      {/* MOBILE TABLE */}
      <div className="block lg:hidden space-y-4 bg-white rounded-2xl py-6 px-4">
        {repayments.length === 0 && (
          <div className="text-center text-[#666] py-6">
            {t("mixedRepaymentsTable.noRepayments")}
          </div>
        )}

        {repayments.map((repayment, index) => (
          <div
            key={index}
            className="flex justify-between items-center pt-4 pb-4 border-b border-b-[rgba(0,0,0,0.04)]"
          >
            <div>
              <p className="text-[#222] font-medium">
                {repayment.repayment_method}
              </p>
              <p className="text-[#666] text-[14px]">
                {new Date(repayment.repayment_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 mt-1">
                <img src={NairaIcon} alt="naira icon" />
                <span>
                  {new Intl.NumberFormat("en-NG", {
                    style: "decimal",
                    maximumFractionDigits: 2,
                  }).format(repayment.amount_paid)}
                </span>
              </div>
              <p className="text-[#444] text-[14px]">
                {repayment.plastic_weight_kg}
              </p>
            </div>

            {repayment.status === "COMPLETED" && (
              <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#D3F3DF] bg-[#F2FDF5] w-fit">
                <img src={VerifiedIcon} alt="verified icon" />
                <p className="text-[14px] text-[#16A34A]">
                  {t("mixedRepaymentsTable.completed")}
                </p>
              </div>
            )}
            {repayment.status === "PENDING" && (
              <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#FEE4C7] bg-[#FFFAF2] w-fit">
                <img src={PendingIcon} alt="pending icon" />
                <p className="text-[14px] text-[#DC6803]">
                  {t("mixedRepaymentsTable.pending")}
                </p>
              </div>
            )}
            {repayment.status === "FAILED" && (
              <div className="flex gap-1 items-center py-[2px] px-1.5 rounded-[6px] border border-[#FEE4E2] bg-[#FFFAF2] w-fit">
                <img src={FailedIcon} alt="failed icon" />
                <p className="text-[14px] text-[#D92D20]">
                  {t("mixedRepaymentsTable.failed")}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Pagination for mobile */}
        <div className="flex items-center justify-between mt-4">
          <button
            className="text-sm border px-3 py-1.5 rounded-[8px] border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            {t("mixedRepaymentsTable.previous")}
          </button>

          {/* Per Page for mobile */}
          <div className="relative">
            <div
              className="flex items-center gap-2 rounded-[8px] border border-[#e5e5e5] px-3 cursor-pointer"
              onClick={() => setPerPageOpen(!perPageOpen)}
            >
              <p className="text-[#999] text-sm py-1">
                {t("mixedRepaymentsTable.perPage")}
              </p>
              <span className="text-[#333] block border-l border-l-[#e5e5e5] pl-2.5 py-1">
                {perPage}
              </span>
              <img src={chevronDown} alt="dropdown icon" className="ml-1 w-4 block" />
            </div>
            {perPageOpen && (
              <div className="absolute mt-1 bg-white border rounded shadow z-10">
                {[10, 15, 20, 25, 30, 50, 100].map((num) => (
                  <div
                    key={num}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePerPageChange(num)}
                  >
                    {num}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="text-sm border px-3 py-1.5 rounded-[8px] border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage >= totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            {t("mixedRepaymentsTable.next")}
          </button>
        </div>
      </div>
    </div>
  );
}
