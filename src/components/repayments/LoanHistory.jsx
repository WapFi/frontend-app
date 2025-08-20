

import searchIcon from "../../assets/search icon.svg";
import calendarIcon from "../../assets/calendar icon.svg";
import { useTranslation } from "react-i18next";
import NairaIcon from "../../assets/naira icon.svg";
import VerifiedIcon from "../../assets/verified icon.svg";
import FailedIcon from "../../assets/failed icon.svg";
import PendingIcon from "../../assets/pending icon.svg";
import OverdueIcon from "../../assets/overdue icon.svg";
import chevronDown from "../../assets/chevron-down.svg";
import PageLoader from "../PageLoader";
import { fetchLoans } from "../../api/apiData";
import plusIcon from "../../assets/plus icon.svg";
import { use_UserData } from "../../context/UserContext";
import { useDashboard } from "../../context/DashboardContext";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import ActiveLoanModal from "../admin/modals/ActiveLoanModal";

export default function LoanHistory() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userData, refreshUserData } = use_UserData();
  const { dashboardData, refreshDashboardData } = useDashboard();
  const [showActiveLoanModal, setShowActiveLoanModal] = useState(false);

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    t("loanHistory.searchPlaceholder")
  );

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLoans, setTotalLoans] = useState(0);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const perPageOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // filters
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Handle responsive change
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // load user/dashboard data
  useEffect(() => {
    refreshUserData();
    refreshDashboardData();
  }, [refreshUserData, refreshDashboardData]);

  const formatDateParam = (date) => {
    if (!date) return undefined;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

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
    return t("loanHistory.selectDate");
  };

  const handleDateChange = ([start, end]) => {
    if (start && !end) {
      setStartDate(start);
      setEndDate(start);
    } else {
      setStartDate(start);
      setEndDate(end);
    }
  };

  const getLoans = async (
    page = currentPage,
    limit = itemsPerPage,
    filters = {}
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLoans(page, limit, filters);
      if (res.status === true) {
        setLoans(res.data?.loans || []);
        setTotalLoans(res.data?.total_loans);
        setTotalPages(res.data?.total_pages);
      } else {
        setError(res.data?.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLoans(currentPage, itemsPerPage, {
      query: searchQuery.trim() || undefined,
      startDate: formatDateParam(startDate),
      endDate: formatDateParam(endDate),
    });
  }, [currentPage, itemsPerPage]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    getLoans(1, itemsPerPage, {
      query: searchQuery.trim() || undefined,
      startDate: formatDateParam(startDate),
      endDate: formatDateParam(endDate),
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
    getLoans(1, itemsPerPage, {});
  };

  const handlePreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setShowPerPageDropdown(false);
  };

  const formatLoanDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  };

  const handleTakeLoanClick = () => {
    // console.log("user data: ", userData);
    if (dashboardData?.active_loan) {
      // User has an existing active loan
      setShowActiveLoanModal(true);
    } else if (
      dashboardData?.pending_loan?.status === "PENDING" &&
      userData.phone_verified === true
    ) {
      navigate("/take-a-loan/loan-repayment-overview");
    } else if (dashboardData.credit_score.current_score === 0) {
      navigate("/take-a-loan/enter-bvn");
    } else if (userData.phone_verified === false) {
      navigate("/take-a-loan/verify-phone");
    } else {
      // User is eligible
      navigate("/take-a-loan/form/loan-amount-purpose");
    }
  };

  // if no loan has ever been taken, show this
  if (!dashboardData.total_loans_taken) {
    return (
      <div className="w-full text-[18px] flex flex-col justify-center items-center gap-6 py-12 lg:py-20">
        <p className="text-[#222] text-center">
          {t("loanHistory.noLoansMessage")}
        </p>
        <button
          onClick={handleTakeLoanClick}
          className="flex justify-center items-center gap-2.5 bg-[#439182] rounded-[40px] py-2.5 px-6 cursor-pointer hover:opacity-80"
        >
          <img src={plusIcon} alt="plus icon" />
          <span className="text-white text-[16px] font-medium">
            {t("loanHistory.takeALoanButton")}
          </span>
        </button>

        {/* Active Loan Modal */}
        <ActiveLoanModal
          visible={showActiveLoanModal}
          onAction={() => {
            setShowActiveLoanModal(false);
            navigate("/dashboard");
          }}
          title={t("layout.activeLoanModal.title")}
          body={t("layout.activeLoanModal.body")}
          buttonLabel={t("layout.activeLoanModal.button")}
        />
      </div>
    );
  }

  if (loading) return <PageLoader />;

  return (
    <div className="w-[95%] mx-auto md:w-[90%] lg:px-6">
      {isMobile ? (
        <div>
          <div className="flex justify-between items-center mb-6 relative">
            <p className="font-raleway font-semibold text-[#222] text-[24px]">
              {t("loanHistory.title")}
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
          <div className="flex items-center justify-between mb-2 gap-2.5 pl-3 flex-1 shrink-0 rounded-[30px] w-full border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
            <input
              type="search"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchPlaceholder("")}
              onBlur={() =>
                setSearchPlaceholder(t("loanHistory.searchPlaceholder"))
              }
              className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
            />

            <button className="cursor-pointer" onClick={handleApplyFilters}>
              <img src={searchIcon} alt="search icon" />
            </button>
          </div>
          <div className="flex gap-4 my-4">
            <button
              onClick={handleApplyFilters}
              className="flex-1 text-[14px] font-semibold text-blue-600"
            >
              {t("loanHistory.applyFilters")}
            </button>
            <button
              onClick={handleClearFilters}
              className="flex-1 text-[14px] font-semibold text-gray-600"
            >
              {t("loanHistory.clearFilters")}
            </button>
          </div>
          {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        </div>
      ) : (
        <div>
          <p className="font-raleway font-semibold md:text-[24px] text-[#222] md:my-7 lg:my-10">
            {t("loanHistory.title")}
          </p>
          <div className="flex items-center gap-6 mb-2">
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              maxDate={new Date()}
              customInput={
                <div className="flex items-center gap-2.5 pl-3 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)] cursor-pointer">
                  <p className="text-[16px] text-[rgba(34,34,34,0.80)] font-medium">
                    {selectedDateText()}
                  </p>
                  <span className="block p-4 rounded-[50%] bg-[#E6E6E6]">
                    <img src={calendarIcon} alt="calendar icon" />
                  </span>
                </div>
              }
            />
            <div className="flex items-center justify-between gap-2.5 pl-3 flex-1 rounded-[30px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.80)]">
              <input
                type="search"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchPlaceholder("")}
                onBlur={() =>
                  setSearchPlaceholder(t("loanHistory.searchPlaceholder"))
                }
                className="text-[14px] w-[90%] md:text-[16px] text-[rgba(34,34,34,0.50)] rounded-full bg-transparent outline-none border-none"
              />

              <button className="cursor-pointer" onClick={handleApplyFilters}>
                <img src={searchIcon} alt="search icon" />
              </button>
            </div>
          </div>
          <div className="flex gap-4 my-4">
            <button
              onClick={handleApplyFilters}
              className="text-[14px] md:text-[16px] font-semibold text-blue-600"
            >
              {t("loanHistory.applyFilters")}
            </button>
            <button
              onClick={handleClearFilters}
              className="text-[14px] md:text-[16px] font-semibold text-gray-600"
            >
              {t("loanHistory.clearFilters")}
            </button>
          </div>
          {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        </div>
      )}

      {/* Loan listing */}
      {totalLoans > 0 ? (
        isMobile ? (
          // Mobile View (Stacked Cards)
          <div className="flex flex-col gap-4">
            {loans.map((loan) => (
              <div
                key={loan._id}
                className="bg-white rounded-[12px] p-4 text-[#222] font-medium"
              >
                <div className="flex justify-between items-center mb-2">
                  <span>{t("loanHistory.loanAmount")}</span>
                  <div className="flex items-center gap-1">
                    <img src={NairaIcon} alt="naira icon" />
                    <span className="text-[#484747] font-normal">
                      {new Intl.NumberFormat("en-NG").format(loan.loan_amount)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span>{t("loanHistory.status")}</span>
                  {loan.status === "DISBURSED" && (
                    <div
                      className="text-[#16A34A] bg-[#F2FDF5] border border-[#D3F3DF]
                              rounded-md text-sm flex gap-0.5 w-fit py-0.5 px-1.5"
                    >
                      <img src={VerifiedIcon} alt="disbursed loan icon" />
                      <span className="capitalize">
                        {t("loanStatus.disbursed")}
                      </span>
                    </div>
                  )}
                  {loan.status === "COMPLETED" && (
                    <div
                      className="text-[#16A34A] bg-[#F2FDF5] border border-[#D3F3DF]
                              rounded-md text-sm flex gap-0.5 w-fit py-0.5 px-1.5"
                    >
                      <img src={VerifiedIcon} alt="loan completed icon" />
                      <span className="capitalize">
                        {t("loanStatus.completed")}
                      </span>
                    </div>
                  )}
                  {loan.status === "OVERDUE" && (
                    <div
                      className="text-[#B91C1C] bg-[rgba(185,28,28,0.14)]
                              border border-[rgba(185,28,28,0.60)] rounded-md text-sm
                              flex gap-0.5 w-fit py-0.5 px-1.5"
                    >
                      <img src={OverdueIcon} alt="overdue loan icon" />
                      <span className="capitalize">
                        {t("loanStatus.overdue")}
                      </span>
                    </div>
                  )}
                  {loan.status === "REJECTED" && (
                    <div
                      className="text-[#EF4444] bg-[rgba(239,68,68,0.08)]
                              border border-[rgba(239,68,68,0.15)] rounded-md text-sm
                              flex gap-0.5 w-fit py-0.5 px-1.5"
                    >
                      <img src={FailedIcon} alt="rejected loan icon" />
                      <span className="capitalize">
                        {t("loanStatus.rejected")}
                      </span>
                    </div>
                  )}
                  {loan.status === "PENDING" && (
                    <div
                      className="text-[#D99100] bg-[rgba(217,145,0,0.14)]
                              border border-[rgba(217,145,0,0.60)] rounded-md text-sm
                              flex gap-0.5 w-fit py-0.5 px-1.5"
                    >
                      <img src={PendingIcon} alt="pending loan icon" />
                      <span>{t("loanStatus.pending")}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span>{t("loanHistory.appliedOn")}</span>
                  <span className="font-normal">
                    {formatLoanDate(loan.application_date)}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span>{t("loanHistory.amountRepaid")}</span>
                  <div className="flex items-center gap-1">
                    <img src={NairaIcon} alt="naira icon" />
                    <span className="font-normal">
                      {new Intl.NumberFormat("en-NG").format(loan.amount_paid)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span>{t("loanHistory.method")}</span>
                  <span className="font-normal">{loan.repayment_method}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop View (Table)
          <div className="bg-white rounded-[18px] py-6 px-4 overflow-x-auto font-medium">
            <table className="min-w-full divide-y">
              <thead className="border-b-[#E6E6E6]">
                <tr>
                  <th className="px-6 py-3 text-left text-[18px] font-medium text-[#222]">
                    {t("loanHistory.loanAmount")}
                  </th>
                  <th className="px-6 py-3 text-left text-[18px] font-medium text-[#222]">
                    {t("loanHistory.status")}
                  </th>
                  <th className="px-6 py-3 text-left text-[18px] font-medium text-[#222]">
                    {t("loanHistory.appliedOn")}
                  </th>
                  <th className="px-6 py-3 text-left text-[18px] font-medium text-[#222]">
                    {t("loanHistory.amountRepaid")}
                  </th>
                  <th className="px-6 py-3 text-left text-[18px] font-medium text-[#222]">
                    {t("loanHistory.method")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y text-[#484747] font-medium text-[18px]">
                {loans.map((loan) => (
                  <tr key={loan._id} className="h-20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <img src={NairaIcon} alt="naira icon" />
                        <span>
                          {new Intl.NumberFormat("en-NG").format(
                            loan.loan_amount
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {loan.status === "OVERDUE" && (
                        <div
                          className="text-[#B91C1C] bg-[rgba(185,28,28,0.14)]
                                  border border-[rgba(185,28,28,0.60)] rounded-md text-sm
                                  flex gap-0.5 w-fit py-0.5 px-1.5"
                        >
                          <img src={OverdueIcon} alt="overdue loan icon" />
                          <span className="capitalize">
                            {t("loanStatus.overdue")}
                          </span>
                        </div>
                      )}
                      {loan.status === "DISBURSED" && (
                        <div
                          className="text-[#16A34A] bg-[#F2FDF5] border border-[#D3F3DF]
                                  rounded-md text-sm flex gap-0.5 w-fit py-0.5 px-1.5"
                        >
                          <img src={VerifiedIcon} alt="disbursed loan icon" />
                          <span className="capitalize">
                            {t("loanStatus.disbursed")}
                          </span>
                        </div>
                      )}
                      {loan.status === "COMPLETED" && (
                        <div
                          className="text-[#16A34A] bg-[#F2FDF5] border border-[#D3F3DF]
                                  rounded-md text-sm flex gap-0.5 w-fit py-0.5 px-1.5"
                        >
                          <img src={VerifiedIcon} alt="loan completed icon" />
                          <span className="capitalize">
                            {t("loanStatus.completed")}
                          </span>
                        </div>
                      )}
                      {loan.status === "REPAID" && (
                        <div
                          className="text-[#16A34A] bg-[#F2FDF5] border border-[#D3F3DF]
                                  rounded-md text-sm flex gap-0.5 w-fit py-0.5 px-1.5"
                        >
                          <img src={VerifiedIcon} alt="repaid loan icon" />
                          <span className="capitalize">
                            {t("loanStatus.repaid")}
                          </span>
                        </div>
                      )}
                      {loan.status === "REJECTED" && (
                        <div
                          className="text-[#EF4444] bg-[rgba(239,68,68,0.08)]
                                  border border-[rgba(239,68,68,0.15)] rounded-md text-sm
                                  flex gap-0.5 w-fit py-0.5 px-1.5"
                        >
                          <img src={FailedIcon} alt="rejected loan icon" />
                          <span className="capitalize">
                            {t("loanStatus.rejected")}
                          </span>
                        </div>
                      )}
                      {loan.status === "PENDING" && (
                        <div
                          className="text-[#D99100] bg-[rgba(217,145,0,0.14)]
                                  border border-[rgba(217,145,0,0.60)] rounded-md text-sm
                                  flex gap-0.5 w-fit py-0.5 px-1.5"
                        >
                          <img src={PendingIcon} alt="pending loan icon" />
                          <span>{t("loanStatus.pending")}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {formatLoanDate(loan.application_date)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <img src={NairaIcon} alt="naira icon" />
                        <span>
                          {new Intl.NumberFormat("en-NG").format(
                            loan.amount_paid
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{loan.repayment_method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        !loading &&
        !error && (
          <div className="w-full text-[18px] flex flex-col justify-center items-center gap-6 py-12 lg:py-20">
            <p className="text-[#222] text-center">No loans matched.</p>
          </div>
        )
      )}

      {/* Pagination */}
      {totalLoans > 0 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || loading}
            className="text-sm border cursor-pointer px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("pagination.previous")}
          </button>
          <div className="relative">
            <div
              className="flex items-center gap-2 rounded-[8px] bg-white border border-[#e5e5e5] px-3 cursor-pointer"
              onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
            >
              <p className="text-[#999] text-sm py-1">
                {t("pagination.perPage")}
              </p>
              <span className="text-[#333] block border-l border-l-[#e5e5e5] pl-2.5 py-1">
                {itemsPerPage}
              </span>
              <img src={chevronDown} alt="dropdown icon" className="ml-1 w-4" />
            </div>
            {showPerPageDropdown && (
              <div className="absolute bg-white border rounded shadow z-10">
                {perPageOptions.map((num) => (
                  <div
                    key={num}
                    onClick={() => handlePerPageChange(num)}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {num}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
            className="text-sm border cursor-pointer px-3 py-1.5 rounded-[8px] bg-white border-[rgba(0,0,0,0.16)] text-[#333] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("pagination.next")}
          </button>
        </div>
      )}
    </div>
  );
}
