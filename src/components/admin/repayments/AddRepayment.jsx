
import { useState } from "react";
import { addRepayment } from "../../../api/adminApi";
import LoanRepaymentSuccessModal from "../modals/LoanRepaymentSuccessModal";

function AddRepayment() {
  const [formData, setFormData] = useState({
    borrowerIdentifier: "",
    // loanId: "",
    repaymentMethod: "",
    // repaymentDate: ""
  });
  // NEW: Separate states for cash amount and recyclable quantity
  const [cashAmount, setCashAmount] = useState("");
  const [recyclableQuantity, setRecyclableQuantity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [repaymentEquivalent, setRepaymentEquivalent] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMethodChange = (value) => {
    setFormData((prev) => ({ ...prev, repaymentMethod: value }));
    // Reset cash and quantity inputs when method changes
    setCashAmount("");
    setRecyclableQuantity("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {

      if (!formData.repaymentMethod) {
        throw new Error("Repayment method is required");
      }

      if (formData.repaymentMethod === "CASH" && !cashAmount) {
        throw new Error("Cash amount is required");
      }
      if (formData.repaymentMethod === "RECYCLABLES" && !recyclableQuantity) {
        throw new Error("Recyclable quantity is required");
      }
      if (
        formData.repaymentMethod === "BOTH" &&
        (!cashAmount || !recyclableQuantity)
      ) {
        throw new Error(
          "Both cash amount and recyclable quantity are required"
        );
      }

      // Prepare repayment data based on selected method
      const repaymentData = {
        // loan_id: formData.loanId,
        identifier: formData.borrowerIdentifier,
        repayment_method: formData.repaymentMethod.toUpperCase(),
        // repayment_date: formData.repaymentDate ? new Date(formData.repaymentDate) : new Date(),
        plastic_weight_kg: 0,
        cash_amount: 0,
      };

      if (formData.repaymentMethod === "RECYCLABLES") {
        repaymentData.plastic_weight_kg = parseFloat(recyclableQuantity);
      } else if (formData.repaymentMethod === "CASH") {
        repaymentData.cash_amount = parseFloat(cashAmount);
      } else if (formData.repaymentMethod === "BOTH") {
        repaymentData.plastic_weight_kg = parseFloat(recyclableQuantity);
        repaymentData.cash_amount = parseFloat(cashAmount);
      }

      const response = await addRepayment(repaymentData);

      // Get the calculated equivalent from the API response
      const plasticValue = response.data?.plastic_value_naira || 0;
      const cashPaid = response.data?.cash_amount || 0;
      const totalRepayment = plasticValue + cashPaid;

      if (response.status) {
        setRepaymentEquivalent(totalRepayment);
        setSuccessMessage(response.message);
        setShowSuccessModal(true);
      } else {
        throw new Error(response.message || "Failed to add repayment");
      }
    } catch (err) {
      console.error("Error adding repayment:", err);
      setError(err.response?.data?.message || "Failed to add repayment");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
    // Reset form
    setError("");
    setFormData({
      borrowerIdentifier: "",
      // loanId: "",
      repaymentMethod: "",
      // repaymentDate: ""
    });
    setCashAmount("");
    setRecyclableQuantity("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 text-center pt-6">
            Add Repayment
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Borrower Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Borrower Email or Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter borrower email or phone number"
              value={formData.borrowerIdentifier}
              onChange={(e) =>
                handleInputChange("borrowerIdentifier", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repayment Method
            </label>
            <select
              name="repaymentMethod"
              value={formData.repaymentMethod}
              onChange={(e) => handleMethodChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              required
            >
              <option value="">Select repayment method</option>
              <option value="CASH">Cash</option>
              <option value="RECYCLABLES">Recyclables</option>
              <option value="BOTH">Both</option>
            </select>
          </div>

          {/* Conditional Inputs */}
          {(formData.repaymentMethod === "RECYCLABLES" ||
            formData.repaymentMethod === "BOTH") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recyclables Quantity (kg)
              </label>
              <input
                type="number"
                placeholder="Enter quantity in kg"
                value={recyclableQuantity}
                onChange={(e) => setRecyclableQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                required
                min="0"
              />
            </div>
          )}

          {(formData.repaymentMethod === "CASH" ||
            formData.repaymentMethod === "BOTH") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cash Amount (₦)
              </label>
              <input
                type="number"
                placeholder="Enter cash amount"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                required
                min="0"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ background: "#B88E00" }}
            className="w-full text-white py-3 px-4 rounded-full font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Processing..." : "Submit Payment"}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <LoanRepaymentSuccessModal
          onClose={handleCloseSuccessModal}
          repaymentData={{
            cashAmount, // Pass cash amount
            recyclableQuantity, // Pass quantity
            repaymentMethod: formData.repaymentMethod, // Pass method
            totalAmount: repaymentEquivalent, // Total amount from API
            borrowerIdentifier: formData.borrowerIdentifier,
          }}
         responseMessage={successMessage}
        />
      )}
    </div>
  );
}

export default AddRepayment;
