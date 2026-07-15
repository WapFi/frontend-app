import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { addAdmin } from "../../../api/adminApi";

function AddAdminModal({ onClose, onAdminAdded }) {
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    identifier: yup
      .string()
      .trim()
      .required("Email address is required")
      .email("Enter a valid email address"),
    fullname: yup
      .string()
      .trim()
      .required("Full name is required")
      .min(2, "Full name must be at least 2 characters"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      identifier: "",
      fullname: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const payload = {
        identifier: data.identifier.trim().toLowerCase(),
        full_name: data.fullname.trim(),
        password: data.password,
      };

      const response = await addAdmin(payload);

      if (response.status) {
        toast.success(response.message || "Admin added successfully");
        reset();

        if (onAdminAdded) {
          onAdminAdded();
        }
      } else {
        const message = response.message || "Failed to add admin.";
        setError("root", { message });
        toast.error(message);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to add admin. Please try again.";

      setError("root", { message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Add New Administrator
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Identifier */}
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Identifier (Email)
            </label>
            <input
              type="email"
              id="identifier"
              {...register("identifier")}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 transition-colors ${
                errors.identifier
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
              }`}
              placeholder="Enter email address"
            />
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-600">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              {...register("fullname")}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 transition-colors ${
                errors.fullname
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
              }`}
              placeholder="Enter full name"
            />
            {errors.fullname && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fullname.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 transition-colors ${
                errors.password
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
              }`}
              placeholder="Enter password (min. 8 characters)"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {errors.root && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {errors.root.message}
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ background: "#B88E00" }}
              className="flex-1 px-4 py-2 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Adding..." : "Add Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAdminModal;
