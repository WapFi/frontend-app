import successGif from "../../../assets/success.gif";

function RepaymentSuccessModal({ onClose, repaymentData }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
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
          <h2 className="text-2xl font-bold text-gray-900">
            Recyclable Repayment Logged
          </h2>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {repaymentData?.quantity || "15"}kg of {repaymentData?.type || "plastic"} (₦{repaymentData?.amount || "5,250"} equivalent) has been recorded for {repaymentData?.borrowerName || "Aisha Bello"}. Loan balance and credit score updated.
          </p>

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

export default RepaymentSuccessModal;