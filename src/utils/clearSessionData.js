const sessionStorageKeys = [
  "dashboardData",
  "loanConfirmationData",
  "repaymentsData",
  "disbursedLoansData",
  "userData",
  "loanApplicationDraft",
  "latestLoanApplicationData",
  "pendingLoanID",
];

export default function clearSessionData() {
  sessionStorageKeys.forEach((key) => {
    localStorage.removeItem(key);
  });
}