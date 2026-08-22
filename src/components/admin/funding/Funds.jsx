import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import {
  createFund,
  getFundDetails,
  getFunds,
  recordContribution,
  updateFund,
} from "../../../api/fundsApi";
import { getSponsors } from "../../../api/sponsorsApi";
import chevronDown from "../../../assets/chevron-down.svg";

const currentYear = new Date().getFullYear();
const maxFundYear = currentYear + 10;

const fundCreateInitialState = {
  sponsor: "",
  name: "",
  year: currentYear.toString(),
  loss_bearer: "SPONSOR",
  interest_rate: "",
  plastic_rate_per_kg: "",
  loan_term_months: "",
  max_loan_amount: "",
};

const fundEditInitialState = {
  name: "",
  status: "ACTIVE",
  notes: "",
  loss_bearer: "SPONSOR",
  interest_rate: "",
  plastic_rate_per_kg: "",
  loan_term_months: "",
  max_loan_amount: "",
};

const contributionInitialState = {
  amount: "",
  type: "SPONSOR_DEPOSIT",
  contribution_date: "",
  payment_reference: "",
  notes: "",
};

const optionalPositiveNumber = (message) =>
  yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .positive(message)
    .optional();

const optionalNonNegativeNumber = (message) =>
  yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .min(0, message)
    .optional();

const fundCreateSchema = yup.object({
  sponsor: yup.string().trim().required("Sponsor is required."),
  name: yup.string().trim().required("Fund name is required."),
  year: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .integer("Year must be a whole number.")
    .min(currentYear, "Year cannot be earlier than the current year.")
    .max(maxFundYear, "Year is too far in the future.")
    .optional(),
  loss_bearer: yup.string().oneOf(["SPONSOR", "WAPFI"]).optional(),
  interest_rate: optionalNonNegativeNumber(
    "Interest rate cannot be negative.",
  ),
  plastic_rate_per_kg: optionalNonNegativeNumber(
    "Plastic rate per kg cannot be negative.",
  ),
  loan_term_months: optionalPositiveNumber("Loan term must be positive."),
  max_loan_amount: optionalNonNegativeNumber("Max loan amount cannot be negative."),
});

const fundUpdateSchema = yup.object({
  name: yup.string().trim().required("Fund name is required."),
  status: yup.string().oneOf(["ACTIVE", "SUSPENDED", "CLOSED"]).required(),
  notes: yup.string().trim().optional(),
  loss_bearer: yup.string().oneOf(["SPONSOR", "WAPFI"]).optional(),
  interest_rate: optionalNonNegativeNumber(
    "Interest rate cannot be negative.",
  ),
  plastic_rate_per_kg: optionalNonNegativeNumber(
    "Plastic rate per kg cannot be negative.",
  ),
  loan_term_months: optionalPositiveNumber("Loan term must be positive."),
  max_loan_amount: optionalNonNegativeNumber("Max loan amount cannot be negative."),
});

const contributionSchema = yup.object({
  amount: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .positive("Contribution amount must be positive.")
    .required("Contribution amount is required."),
  type: yup.string().oneOf(["SPONSOR_DEPOSIT", "WAPFI_INDEMNITY"]).required(),
  contribution_date: yup.string().trim().optional(),
  payment_reference: yup.string().trim().optional(),
  notes: yup.string().trim().optional(),
});

function getErrorMessage(error, fallback) {
  const responseData = error.response?.data;

  if (responseData?.errors?.[0]?.message) return responseData.errors[0].message;
  if (responseData?.message) return responseData.message;

  return fallback;
}

function formatDate(dateValue) {
  if (!dateValue) return "--";

  return new Date(dateValue).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(value) {
  const amount = Number(value || 0);
  return `NGN ${amount.toLocaleString()}`;
}

function buildTermsPayload(formData, options = {}) {
  const { clearBlankMaxLoanAmount = false } = options;
  const terms = {};

  if (formData.loss_bearer) terms.loss_bearer = formData.loss_bearer;
  if (formData.interest_rate !== "") {
    terms.interest_rate = Number(formData.interest_rate);
  }
  if (formData.plastic_rate_per_kg !== "") {
    terms.plastic_rate_per_kg = Number(formData.plastic_rate_per_kg);
  }
  if (formData.loan_term_months !== "") {
    terms.loan_term_months = Number(formData.loan_term_months);
  }
  if (formData.max_loan_amount !== "") {
    terms.max_loan_amount = Number(formData.max_loan_amount);
  } else if (clearBlankMaxLoanAmount) {
    terms.max_loan_amount = null;
  }

  return terms;
}

function collectValidationErrors(validationError) {
  const nextFieldErrors = {};

  validationError.inner.forEach((fieldError) => {
    if (fieldError.path && !nextFieldErrors[fieldError.path]) {
      nextFieldErrors[fieldError.path] = fieldError.message;
    }
  });

  return nextFieldErrors;
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function FundModal({ fund, sponsors, onClose, onSaved }) {
  const isEditing = Boolean(fund);
  const [formData, setFormData] = useState(() =>
    isEditing
      ? {
          ...fundEditInitialState,
          name: fund.name || "",
          status: fund.status || "ACTIVE",
          notes: fund.notes || "",
          loss_bearer: fund.terms?.loss_bearer || "SPONSOR",
          interest_rate: fund.terms?.interest_rate ?? "",
          plastic_rate_per_kg: fund.terms?.plastic_rate_per_kg ?? "",
          loan_term_months: fund.terms?.loan_term_months ?? "",
          max_loan_amount: fund.terms?.max_loan_amount ?? "",
        }
      : fundCreateInitialState,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = async (name, nextFormData) => {
    const schema = isEditing ? fundUpdateSchema : fundCreateSchema;

    try {
      await schema.validateAt(name, nextFormData);
      setFieldErrors((current) => ({ ...current, [name]: "" }));
    } catch (validationError) {
      setFieldErrors((current) => ({
        ...current,
        [name]: validationError.message,
      }));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextFormData = { ...formData, [name]: value };

    setFormData(nextFormData);
    setError("");
    validateField(name, nextFormData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    const schema = isEditing ? fundUpdateSchema : fundCreateSchema;

    try {
      await schema.validate(formData, { abortEarly: false });
    } catch (validationError) {
      setFieldErrors(collectValidationErrors(validationError));
      setError("Please fix the highlighted fields.");
      return;
    }

    const terms = buildTermsPayload(formData, {
      clearBlankMaxLoanAmount: isEditing,
    });
    const payload = isEditing
      ? {
          name: formData.name.trim(),
          status: formData.status,
        }
      : {
          sponsor: formData.sponsor,
          name: formData.name.trim(),
        };

    if (!isEditing && formData.year !== "") {
      payload.year = Number(formData.year);
    }

    if (isEditing && formData.notes.trim()) {
      payload.notes = formData.notes.trim();
    }

    if (Object.keys(terms).length > 0) {
      payload.terms = terms;
    }

    try {
      setSaving(true);
      const response = isEditing
        ? await updateFund(fund._id, payload)
        : await createFund(payload);

      toast.success(response.message || "Fund saved successfully.");
      await onSaved(response.data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save fund."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Fund" : "Add Fund"}
            </h2>
            {!isEditing && (
              <p className="mt-1 text-xs text-gray-500">
                Fund ID is auto-generated after creation.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close fund modal"
          >
            <svg
              className="h-5 w-5"
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

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {!isEditing && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Sponsor
              </label>
              <select
                name="sponsor"
                value={formData.sponsor}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.sponsor)}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  fieldErrors.sponsor
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                }`}
              >
                <option value="">Select sponsor</option>
                {sponsors.map((sponsor) => (
                  <option key={sponsor._id} value={sponsor._id}>
                    {sponsor.name} ({sponsor.sponsor_id})
                  </option>
                ))}
              </select>
              {fieldErrors.sponsor && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.sponsor}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Fund Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.name)}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  fieldErrors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                }`}
                placeholder="Enter fund name"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
              )}
            </div>

            {isEditing ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  min={currentYear}
                  max={maxFundYear}
                  value={formData.year}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.year)}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    fieldErrors.year
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  }`}
                  placeholder="2026"
                />
                {fieldErrors.year && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.year}
                  </p>
                )}
              </div>
            )}
          </div>

          {isEditing && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                placeholder="Optional notes"
              />
            </div>
          )}

          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900">Fund Terms</h3>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Loss Bearer
                </label>
                <select
                  name="loss_bearer"
                  value={formData.loss_bearer}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                >
                  <option value="SPONSOR">Sponsor</option>
                  <option value="WAPFI">WapFi</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  name="interest_rate"
                  min="0"
                  step="0.01"
                  value={formData.interest_rate}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.interest_rate)}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    fieldErrors.interest_rate
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  }`}
                  placeholder="e.g. 5"
                />
                {fieldErrors.interest_rate && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.interest_rate}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Plastic Rate Per Kg
                </label>
                <input
                  type="number"
                  name="plastic_rate_per_kg"
                  min="0"
                  step="0.01"
                  value={formData.plastic_rate_per_kg}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.plastic_rate_per_kg)}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    fieldErrors.plastic_rate_per_kg
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  }`}
                  placeholder="Optional"
                />
                {fieldErrors.plastic_rate_per_kg && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.plastic_rate_per_kg}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Loan Term Months
                </label>
                <input
                  type="number"
                  name="loan_term_months"
                  min="1"
                  step="1"
                  value={formData.loan_term_months}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.loan_term_months)}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    fieldErrors.loan_term_months
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  }`}
                  placeholder="Optional"
                />
                {fieldErrors.loan_term_months && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.loan_term_months}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Max Loan Amount
                </label>
                <input
                  type="number"
                  name="max_loan_amount"
                  min="0"
                  step="0.01"
                  value={formData.max_loan_amount}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.max_loan_amount)}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    fieldErrors.max_loan_amount
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  }`}
                  placeholder="Optional"
                />
                {fieldErrors.max_loan_amount && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.max_loan_amount}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="theme_bg_color cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Fund"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ContributionModal({ fund, onClose, onSaved }) {
  const [formData, setFormData] = useState(contributionInitialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = async (name, nextFormData) => {
    try {
      await contributionSchema.validateAt(name, nextFormData);
      setFieldErrors((current) => ({ ...current, [name]: "" }));
    } catch (validationError) {
      setFieldErrors((current) => ({
        ...current,
        [name]: validationError.message,
      }));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextFormData = { ...formData, [name]: value };

    setFormData(nextFormData);
    setError("");
    validateField(name, nextFormData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    try {
      await contributionSchema.validate(formData, { abortEarly: false });
    } catch (validationError) {
      setFieldErrors(collectValidationErrors(validationError));
      setError("Please fix the highlighted fields.");
      return;
    }

    const payload = {
      amount: Number(formData.amount),
      type: formData.type,
    };

    if (formData.contribution_date) {
      payload.contribution_date = new Date(
        formData.contribution_date,
      ).toISOString();
    }
    if (formData.payment_reference.trim()) {
      payload.payment_reference = formData.payment_reference.trim();
    }
    if (formData.notes.trim()) {
      payload.notes = formData.notes.trim();
    }

    try {
      setSaving(true);
      const response = await recordContribution(fund._id, payload);

      toast.success(response.message || "Contribution recorded successfully.");
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to record contribution."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Add Contribution
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {fund.name} ({fund.fund_id})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close contribution modal"
          >
            <svg
              className="h-5 w-5"
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

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                min="0.01"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.amount)}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  fieldErrors.amount
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                }`}
                placeholder="500000"
              />
              {fieldErrors.amount && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.amount}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              >
                <option value="SPONSOR_DEPOSIT">Sponsor Deposit</option>
                <option value="WAPFI_INDEMNITY">WapFi Indemnity</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Contribution Date
              </label>
              <input
                type="date"
                name="contribution_date"
                value={formData.contribution_date}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Payment Reference
              </label>
              <input
                type="text"
                name="payment_reference"
                value={formData.payment_reference}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                placeholder="Optional bank reference"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              placeholder="Optional notes"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="theme_bg_color cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Recording..." : "Record Contribution"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FundDetailsModal({ fund, onClose, onEdit }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getFundDetails(fund._id);

        if (response.status) {
          setDetails(response.data);
        } else {
          setError(response.message || "Failed to load fund details.");
        }
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load fund details."));
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [fund._id]);

  const fundDetails = details || fund;
  const ledger = fundDetails.ledger || {
    available_capital: fundDetails.available_capital,
    outstanding_principal: fundDetails.outstanding_principal,
    recovered_unsettled: fundDetails.recovered_unsettled,
  };
  const counters = fundDetails.counters || {
    total_contributed: fundDetails.total_contributed,
    written_off: fundDetails.written_off,
    indemnified: fundDetails.indemnified,
    net_market_adjustment: fundDetails.net_market_adjustment,
  };
  const outstandingBreakdown = fundDetails.outstanding_breakdown || {};
  const reconciliation = fundDetails.reconciliation || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Fund Details
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {fund.name} ({fund.fund_id || "--"})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close fund details modal"
          >
            <svg
              className="h-5 w-5"
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

        <div className="space-y-5 px-5 py-5">
          {loading ? (
            <p className="text-sm text-gray-500">Loading fund details...</p>
          ) : error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 sm:grid-cols-3">
                <DetailItem label="Fund ID" value={fundDetails.fund_id || "--"} />
                <DetailItem label="Name" value={fundDetails.name || "--"} />
                <DetailItem
                  label="Sponsor"
                  value={fundDetails.sponsor?.name || "--"}
                />
                <DetailItem label="Year" value={fundDetails.year || "--"} />
                <DetailItem label="Status" value={fundDetails.status || "--"} />
                <DetailItem
                  label="Interest Rate"
                  value={`${fundDetails.terms?.interest_rate ?? "--"}%`}
                />
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Fund Terms
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailItem
                    label="Loss Bearer"
                    value={fundDetails.terms?.loss_bearer || "--"}
                  />
                  <DetailItem
                    label="Plastic Rate Per Kg"
                    value={
                      fundDetails.terms?.plastic_rate_per_kg ?? "--"
                    }
                  />
                  <DetailItem
                    label="Loan Term Months"
                    value={fundDetails.terms?.loan_term_months ?? "--"}
                  />
                  <DetailItem
                    label="Max Loan Amount"
                    value={
                      fundDetails.terms?.max_loan_amount !== undefined &&
                      fundDetails.terms?.max_loan_amount !== null
                        ? formatCurrency(fundDetails.terms.max_loan_amount)
                        : "--"
                    }
                  />
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Live Ledger
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <DetailItem
                    label="Available Capital"
                    value={formatCurrency(ledger.available_capital)}
                  />
                  <DetailItem
                    label="Outstanding Principal"
                    value={formatCurrency(ledger.outstanding_principal)}
                  />
                  <DetailItem
                    label="Recovered Unsettled"
                    value={formatCurrency(ledger.recovered_unsettled)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Counters
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DetailItem
                      label="Total Contributed"
                      value={formatCurrency(counters.total_contributed)}
                    />
                    <DetailItem
                      label="Written Off"
                      value={formatCurrency(counters.written_off)}
                    />
                    <DetailItem
                      label="Indemnified"
                      value={formatCurrency(counters.indemnified)}
                    />
                    <DetailItem
                      label="Market Adjustment"
                      value={formatCurrency(counters.net_market_adjustment)}
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Outstanding Breakdown
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <DetailItem
                      label="Reserved"
                      value={formatCurrency(outstandingBreakdown.reserved)}
                    />
                    <DetailItem
                      label="Reserved Loans"
                      value={outstandingBreakdown.reserved_loans ?? "--"}
                    />
                    <DetailItem
                      label="Disbursed"
                      value={formatCurrency(outstandingBreakdown.disbursed)}
                    />
                    <DetailItem
                      label="Disbursed Loans"
                      value={outstandingBreakdown.disbursed_loans ?? "--"}
                    />
                    <DetailItem
                      label="Default Recovery"
                      value={formatCurrency(
                        outstandingBreakdown.in_default_recovery,
                      )}
                    />
                    <DetailItem
                      label="Performing"
                      value={formatCurrency(outstandingBreakdown.performing)}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Reconciliation
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <DetailItem
                    label="Balanced"
                    value={
                      reconciliation.balanced === undefined
                        ? "--"
                        : reconciliation.balanced
                          ? "Yes"
                          : "No"
                    }
                  />
                  <DetailItem
                    label="Expected"
                    value={formatCurrency(reconciliation.expected)}
                  />
                  <DetailItem
                    label="Actual"
                    value={formatCurrency(reconciliation.actual)}
                  />
                  <DetailItem
                    label="Drift"
                    value={formatCurrency(reconciliation.drift)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onEdit(fund)}
              className="theme_bg_color cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
            >
              Edit Fund
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Funds() {
  const navigate = useNavigate();
  const [funds, setFunds] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFunds, setTotalFunds] = useState(0);
  const [selectedFund, setSelectedFund] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const perPageOptions = [5, 10, 25, 50];

  const loadFunds = async () => {
    setLoading(true);
    setError("");

    const params = {
      page: currentPage,
      limit: perPage,
      search: searchTerm,
    };

    if (statusFilter) params.status = statusFilter;

    try {
      const response = await getFunds(params);

      if (response.status) {
        setFunds(response.data?.funds || []);
        setTotalPages(response.data?.total_pages || 1);
        setTotalFunds(response.data?.total_funds || 0);
      } else {
        setError(response.message || "Failed to load funds.");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load funds."));
    } finally {
      setLoading(false);
    }
  };

  const loadSponsors = async () => {
    try {
      const response = await getSponsors({ page: 1, limit: 100, status: "ACTIVE" });

      if (response.status) {
        setSponsors(response.data?.sponsors || []);
      }
    } catch {
      setSponsors([]);
    }
  };

  useEffect(() => {
    loadSponsors();
  }, []);

  useEffect(() => {
    loadFunds();
  }, [currentPage, perPage, searchTerm, statusFilter]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handlePerPageChange = (event) => {
    setPerPage(Number(event.target.value));
    setCurrentPage(1);
    setShowPerPageDropdown(false);
  };

  const handleOpenCreate = () => {
    setSelectedFund(null);
    setModalMode("fund");
  };

  const handleOpenEdit = (fund) => {
    setSelectedFund(fund);
    setModalMode("fund");
  };

  const handleOpenDetails = (fund) => {
    setSelectedFund(fund);
    setModalMode("details");
  };

  const handleOpenLedger = (fund) => {
    navigate(`/admin/funds/${fund._id}/ledger`);
  };

  const handleOpenContribution = (fund) => {
    setSelectedFund(fund);
    setModalMode("contribution");
  };

  const handleEditFromDetails = (fund) => {
    setSelectedFund(fund);
    setModalMode("fund");
  };

  const handleSaved = async (savedFund) => {
    if (savedFund?._id) {
      setFunds((currentFunds) =>
        currentFunds.map((fund) =>
          fund._id === savedFund._id ? { ...fund, ...savedFund } : fund,
        ),
      );
    }

    setModalMode(null);
    setSelectedFund(null);
    await loadFunds();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Funds</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage lending funds, capital balances, and sponsor contributions.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="theme_bg_color inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
        >
          Add Fund
        </button>
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_180px] lg:max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by fund ID or name"
                  className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-3 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
                <svg
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div className="text-sm text-gray-500">
              {totalFunds.toLocaleString()} fund{totalFunds === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        {error && <div className="px-4 py-3 text-sm text-red-600">{error}</div>}

        <div className="hidden overflow-x-auto xl:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Fund
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Sponsor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Outstanding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Unsettled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    Loading funds...
                  </td>
                </tr>
              ) : funds.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No funds found.
                  </td>
                </tr>
              ) : (
                funds.map((fund) => (
                  <tr key={fund._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-900">
                        {fund.fund_id || "--"}
                      </div>
                      <div className="text-gray-500">{fund.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {fund.sponsor?.name || "--"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {formatCurrency(fund.available_capital)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {formatCurrency(fund.outstanding_principal)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {formatCurrency(fund.recovered_unsettled)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {fund.terms?.interest_rate ?? "--"}%
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          fund.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : fund.status === "SUSPENDED"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {fund.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(fund)}
                          className="cursor-pointer font-medium text-gray-700 hover:text-gray-900"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenLedger(fund)}
                          className="cursor-pointer font-medium text-[#2D6157] hover:text-[#224c44]"
                        >
                          View Ledger
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenContribution(fund)}
                          className="cursor-pointer font-medium text-[#B88E00] hover:text-[#8f6f00]"
                        >
                          Add Contribution
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(fund)}
                          className="cursor-pointer font-medium text-[#2D6157] hover:text-[#224c44]"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-gray-200 xl:hidden">
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              Loading funds...
            </div>
          ) : funds.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No funds found.
            </div>
          ) : (
            funds.map((fund) => (
              <div key={fund._id} className="space-y-4 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {fund.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {fund.fund_id || "--"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      fund.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : fund.status === "SUSPENDED"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {fund.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
                  <div>
                    <span className="font-medium text-gray-800">Sponsor: </span>
                    {fund.sponsor?.name || "--"}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">
                      Interest Rate:{" "}
                    </span>
                    {fund.terms?.interest_rate ?? "--"}%
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">
                      Available:{" "}
                    </span>
                    {formatCurrency(fund.available_capital)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">
                      Outstanding:{" "}
                    </span>
                    {formatCurrency(fund.outstanding_principal)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">
                      Unsettled:{" "}
                    </span>
                    {formatCurrency(fund.recovered_unsettled)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Created: </span>
                    {formatDate(fund.created_at)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenDetails(fund)}
                    className="cursor-pointer text-sm font-medium text-gray-700"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenLedger(fund)}
                    className="cursor-pointer text-sm font-medium text-[#2D6157]"
                  >
                    View Ledger
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenContribution(fund)}
                    className="cursor-pointer text-sm font-medium text-[#B88E00]"
                  >
                    Add Contribution
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(fund)}
                    className="cursor-pointer text-sm font-medium text-[#2D6157]"
                  >
                    Edit Fund
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage <= 1 || loading}
            className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <div className="relative flex justify-center">
            <div
              className="flex cursor-pointer items-center gap-2 rounded-[8px] border border-[#e5e5e5] bg-white px-3"
              onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
            >
              <p className="py-1 text-sm text-[#999]">Per page</p>
              <span className="block border-l border-l-[#e5e5e5] py-1 pl-2.5 text-[#333]">
                {perPage}
              </span>
              <img src={chevronDown} alt="dropdown icon" className="ml-1 w-4" />
            </div>
            {showPerPageDropdown && (
              <div className="absolute top-full z-10 mt-1 rounded border bg-white shadow">
                {perPageOptions.map((num) => (
                  <div
                    key={num}
                    onClick={() => handlePerPageChange({ target: { value: num } })}
                    className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {num}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, totalPages))
            }
            disabled={currentPage >= totalPages || loading}
            className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {modalMode === "fund" && (
        <FundModal
          fund={selectedFund}
          sponsors={sponsors}
          onClose={() => setModalMode(null)}
          onSaved={handleSaved}
        />
      )}

      {modalMode === "contribution" && selectedFund && (
        <ContributionModal
          fund={selectedFund}
          onClose={() => setModalMode(null)}
          onSaved={handleSaved}
        />
      )}

      {modalMode === "details" && selectedFund && (
        <FundDetailsModal
          fund={selectedFund}
          onClose={() => setModalMode(null)}
          onEdit={handleEditFromDetails}
        />
      )}
    </div>
  );
}
