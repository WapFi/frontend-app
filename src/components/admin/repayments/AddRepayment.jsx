import { useState } from "react";
import { addRepayment } from "../../../api/adminApi";
import LoanRepaymentSuccessModal from "../modals/LoanRepaymentSuccessModal";

function AddRepayment() {
    const [formData, setFormData] = useState({
        borrowerName: "",
        loanId: "",
        repaymentMethod: "",
        quantity: "",
        repaymentDate: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [repaymentEquivalent, setRepaymentEquivalent] = useState(0);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
        ...prev,
        [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Validate required fields
            if (!formData.loanId) {
                throw new Error("Loan ID is required");
            }

            if (!formData.repaymentMethod) {
                throw new Error("Repayment method is required");
            }

            if (!formData.quantity) {
                throw new Error("Quantity is required");
            }

            // Prepare repayment data based on the original form structure
            const repaymentData = {
                loan_id: formData.loanId,
                repayment_method: formData.repaymentMethod.toUpperCase(),
                plastic_weight_kg: formData.repaymentMethod !== "CASH" ? parseFloat(formData.quantity) : 0,
                cash_amount: formData.repaymentMethod === "CASH" ? parseFloat(formData.quantity) * 200 : 0, // Assuming ₦200 per unit
                repayment_date: formData.repaymentDate ? new Date(formData.repaymentDate) : new Date()
            };

            const response = await addRepayment(repaymentData);
            setRepaymentEquivalent(response.data.plastic_value_naira);
            
            if (response.status) {
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
        // Reset form
        setError("");

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
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
                </div>
            )}

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
                <option value="CASH">Cash</option>
                <option value="RECYCLABLES">Recyclables</option>
                <option value="BOTH">Both</option>
                {/* <option value="Plastic">Plastic</option>
                <option value="Aluminum">Aluminum</option>
                <option value="Paper">Paper</option>
                <option value="Carton">Carton</option>
                <option value="Pure Water Sachet">Pure Water Sachet</option> */}
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
                disabled={loading}
                style={{background: "#B88E00"}}
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
                quantity: formData.quantity,
                type: formData.repaymentMethod,
                amount: repaymentEquivalent, // This would typically be calculated based on quantity and type
                borrowerName: formData.borrowerName
            }}
            />
        )}
        </div>
    );
}

export default AddRepayment;