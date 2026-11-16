export default function canCorrectLoanBank(loan) {
  if (!loan?._id) return false;
  const status = loan.status?.toUpperCase();
  const payout = loan.disbursement_status?.toUpperCase();
  // Unknown payout states are not safe to edit without a confirmed contract.
  if (payout && payout !== "FAILED") return false;
  return status === "PENDING" || status === "APPROVED";
}
