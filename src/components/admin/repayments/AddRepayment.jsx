import { useState } from "react";
import LoanRepaymentSuccessModal from "../modals/LoanRepaymentSuccessModal";

function AddRepayment() {
  const [formData, setFormData] = useState({
    borrowerName: "",
    loanId: "",
    repaymentMethod: "",
    quantity: "",
    repaymentDate: ""
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Add repayment:", formData);
    // Add submission logic here
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Reset form
    setFormData({
      borrowerName: "",
      loanId: "",
      repaymentMethod: "",
      quantity: "",
      repaymentDate: ""
    });
  };

  return (
    <div className="space-y-6">

      {/* Form */}
      <div className="bg-white rounded-lg shadow max-w-6xl mx-auto">
        {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 text-center pt-6">Add Repayment</h1>
      </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
             {/* Borrower Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Borrower Name
            </label>
            <input
              type="text"
              placeholder="Enter borrower name"
              value={formData.borrowerName}
              onChange={(e) => handleInputChange("borrowerName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>

          {/* Loan ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan ID
            </label>
            <input
              type="text"
              placeholder="Enter loan ID"
              value={formData.loanId}
              onChange={(e) => handleInputChange("loanId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>

          {/* Repayment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repayment Method
            </label>
            <select
              name="repaymentMethod"
              value={formData.repaymentMethod}
              onChange={(e) => handleInputChange("repaymentMethod", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              required
            >
              <option value="">Select repayment method</option>
              <option value="cash">Cash</option>
              <option value="plastic">Plastic</option>
              <option value="recyclables">Recyclables</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (kg)
            </label>
            <input
              type="text"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>

          {/* Repayment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repayment Date
            </label>
            <input
              type="date"
              value={formData.repaymentDate}
              onChange={(e) => handleInputChange("repaymentDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{background: "#B88E00"}}
            className="w-full text-white py-3 px-4 rounded-full font-medium hover:bg-yellow-600 transition-colors"
          >
            Submit Payment
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <LoanRepaymentSuccessModal 
          onClose={handleCloseSuccessModal} 
          repaymentData={{
            quantity: formData.quantity,
            type: formData.repaymentMethod,
            amount: "5,250", // This would typically be calculated based on quantity and type
            borrowerName: formData.borrowerName
          }}
        />
      )}
    </div>
  );
}

export default AddRepayment;