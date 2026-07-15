import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { addRepayment } from "../../../api/repaymentsApi";
import LoanRepaymentSuccessModal from "../modals/LoanRepaymentSuccessModal";

function AddRepayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [repaymentEquivalent, setRepaymentEquivalent] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const schema = yup.object({
    borrowerIdentifier: yup
      .string()
      .trim()
      .required("Borrower email or phone number is required")
      .test(
        "is-email-or-phone",
        "Enter a valid borrower email address or 11-digit phone number",
        (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "") ||
          /^\d{11}$/.test(value || ""),
      ),

    repaymentMethod: yup
      .string()
      .required("Repayment method is required")
      .oneOf(
        ["CASH", "RECYCLABLES", "BOTH"],
        "Select a valid repayment method",
      ),

    cashAmount: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .when("repaymentMethod", {
        is: (method) => method === "CASH" || method === "BOTH",
        then: (schema) =>
          schema
            .typeError("Cash amount must be a number")
            .required("Cash amount is required")
            .positive("Cash amount must be greater than 0"),
        otherwise: (schema) => schema.notRequired(),
      }),

    recyclableQuantity: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .when("repaymentMethod", {
        is: (method) => method === "RECYCLABLES" || method === "BOTH",
        then: (schema) =>
          schema
            .typeError("Recyclable quantity must be a number")
            .required("Recyclable quantity is required")
            .positive("Recyclable quantity must be greater than 0"),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      borrowerIdentifier: "",
      repaymentMethod: "",
      cashAmount: "",
      recyclableQuantity: "",
    },
  });

  const repaymentMethod = watch("repaymentMethod");
  const cashAmount = watch("cashAmount");
  const recyclableQuantity = watch("recyclableQuantity");

  const handleMethodChange = (event) => {
    const selectedMethod = event.target.value;

    setValue("repaymentMethod", selectedMethod, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("cashAmount", "", { shouldValidate: false });
    setValue("recyclableQuantity", "", { shouldValidate: false });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const repaymentData = {
        identifier: data.borrowerIdentifier.trim(),
        repayment_method: data.repaymentMethod,
        plastic_weight_kg: 0,
        cash_amount: 0,
      };

      if (data.repaymentMethod === "RECYCLABLES") {
        repaymentData.plastic_weight_kg = data.recyclableQuantity;
      } else if (data.repaymentMethod === "CASH") {
        repaymentData.cash_amount = data.cashAmount;
      } else if (data.repaymentMethod === "BOTH") {
        repaymentData.plastic_weight_kg = data.recyclableQuantity;
        repaymentData.cash_amount = data.cashAmount;
      }

      const response = await addRepayment(repaymentData);

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
      setError(
        err.response?.data?.message || err.message || "Failed to add repayment",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
    // Reset form
    setError("");
    reset({
      borrowerIdentifier: "",
      repaymentMethod: "",
      cashAmount: "",
      recyclableQuantity: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 text-center pt-6">
            Add Repayment
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
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
              {...register("borrowerIdentifier")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            />
            {errors.borrowerIdentifier && (
              <p className="text-red-600 text-sm mt-1">
                {errors.borrowerIdentifier.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repayment Method
            </label>
            <select
              {...register("repaymentMethod")}
              onChange={handleMethodChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="">Select repayment method</option>
              <option value="CASH">Cash</option>
              <option value="RECYCLABLES">Recyclables</option>
              <option value="BOTH">Both</option>
            </select>
            {errors.repaymentMethod && (
              <p className="text-red-600 text-sm mt-1">
                {errors.repaymentMethod.message}
              </p>
            )}
          </div>

          {/* Conditional Inputs */}
          {(repaymentMethod === "RECYCLABLES" ||
            repaymentMethod === "BOTH") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recyclables Quantity (kg)
              </label>
              <input
                type="number"
                placeholder="Enter quantity in kg"
                {...register("recyclableQuantity")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                min="0.01"
                step="0.01"
              />
              {errors.recyclableQuantity && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.recyclableQuantity.message}
                </p>
              )}
            </div>
          )}

          {(repaymentMethod === "CASH" || repaymentMethod === "BOTH") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cash Amount (₦)
              </label>
              <input
                type="number"
                placeholder="Enter cash amount"
                {...register("cashAmount")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                min="0.01"
                step="0.01"
              />
              {errors.cashAmount && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.cashAmount.message}
                </p>
              )}
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
            repaymentMethod,
            borrowerIdentifier: watch("borrowerIdentifier"),
            totalAmount: repaymentEquivalent, // Total amount from API
          }}
          responseMessage={successMessage}
        />
      )}
    </div>
  );
}

export default AddRepayment;
