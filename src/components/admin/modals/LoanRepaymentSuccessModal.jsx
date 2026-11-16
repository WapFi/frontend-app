import { useEffect, useRef } from "react";
import successGif from "../../../assets/success.gif";

export default function LoanRepaymentSuccessModal({ onClose, borrowerIdentifier, responseMessage }) {
  const buttonRef = useRef(null);
  useEffect(() => { buttonRef.current?.focus(); }, []);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="repayment-success-title"
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
          if (event.key === "Tab") { event.preventDefault(); buttonRef.current?.focus(); }
        }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-8">
        <div className="flex justify-center mb-6"><img src={successGif} alt="" className="w-24 h-24 object-contain" /></div>
        <div className="text-center space-y-4">
          <h2 id="repayment-success-title" className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{responseMessage}</h2>
          <p className="text-gray-600 break-words">{borrowerIdentifier}</p>
          <button ref={buttonRef} type="button" onClick={onClose} style={{ background: "#B88E00" }} className="cursor-pointer w-full text-white py-3 px-6 rounded-full font-medium hover:opacity-90">Continue</button>
        </div>
      </div>
    </div>
  );
}
