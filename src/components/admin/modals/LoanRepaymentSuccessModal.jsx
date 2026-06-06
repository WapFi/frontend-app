

import successGif from "../../../assets/success.gif";

function LoanRepaymentSuccessModal({ onClose, repaymentData, responseMessage }) {
  // Deconstruct the repaymentData prop
  const {
    cashAmount,
    recyclableQuantity,
    repaymentMethod,
    totalAmount,
    borrowerIdentifier,
  } = repaymentData;

  // Construct the dynamic title and message based on the repayment method
  let title = responseMessage;
  let description = "";

  if (repaymentMethod === "RECYCLABLES") {
    title = title || "Recyclable Repayment Logged";
    description = `${recyclableQuantity}kg of recyclables (₦${totalAmount.toLocaleString()} equivalent) has been recorded for ${borrowerIdentifier}. Loan balance updated.`;
  } else if (repaymentMethod === "CASH") {
    title = title || "Cash Repayment Logged";
    description = `A cash payment of ₦${cashAmount.toLocaleString()} has been recorded for ${borrowerIdentifier}. Loan balance updated.`;
  } else if (repaymentMethod === "BOTH") {
    title = title || "Combined Repayment Logged";
    description = `A combined payment of ₦${cashAmount.toLocaleString()} cash and ${recyclableQuantity}kg of recyclables (₦${totalAmount.toLocaleString()} total) has been recorded for ${borrowerIdentifier}. Loan balance updated.`;
  } else {
    // Fallback for an unknown method
    description = `A repayment has been recorded for ${borrowerIdentifier}. Loan balance updated.`;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
        {/* Success Animation */}
        <div className="flex justify-center mb-6">
          <img
            src={successGif}
            alt="Success"
            className="w-24 h-24 object-contain"
          />
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{description}</p>

          {/* Close Button */}
          <div className="pt-4">
            <button
              onClick={onClose}
              style={{ background: "#B88E00" }}
              className="w-full text-white py-3 px-6 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanRepaymentSuccessModal;
