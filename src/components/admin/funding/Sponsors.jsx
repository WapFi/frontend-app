import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import {
  createSponsor,
  getSponsors,
  updateSponsor,
} from "../../../api/sponsorsApi";
import chevronDown from "../../../assets/chevron-down.svg";

const initialFormState = {
  sponsor_id: "",
  name: "",
  contact_email: "",
  contact_phone: "",
  status: "ACTIVE",
  notes: "",
};

const sponsorFieldsSchema = {
  name: yup.string().trim().required("Sponsor name is required."),
  contact_email: yup
    .string()
    .trim()
    .email("Contact email must be a valid email address.")
    .optional(),
  contact_phone: yup
    .string()
    .trim()
    .matches(
      /^\+?[0-9 ()-]*$/,
      "Contact phone can only include numbers, spaces, hyphens, parentheses, and an optional + at the start.",
    )
    .optional(),
  notes: yup.string().trim().optional(),
};

const sponsorCreateSchema = yup.object({
  ...sponsorFieldsSchema,
  sponsor_id: yup
    .string()
    .trim()
    .required("Sponsor short code is required.")
    .matches(
      /^[A-Za-z][A-Za-z0-9]{1,9}$/,
      "Short code must be 2-10 letters/numbers and start with a letter.",
    ),
});

const sponsorUpdateSchema = yup.object({
  ...sponsorFieldsSchema,
  status: yup.string().oneOf(["ACTIVE", "INACTIVE"]).required(),
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

function SponsorModal({ sponsor, onClose, onSaved }) {
  const isEditing = Boolean(sponsor);
  const [formData, setFormData] = useState(() => ({
    ...initialFormState,
    ...sponsor,
    sponsor_id: sponsor?.sponsor_id || "",
    name: sponsor?.name || "",
    contact_email: sponsor?.contact_email || "",
    contact_phone: sponsor?.contact_phone || "",
    status: sponsor?.status || "ACTIVE",
    notes: sponsor?.notes || "",
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const getPayload = () => ({
    sponsor_id: formData.sponsor_id.trim(),
    name: formData.name.trim(),
    contact_email: formData.contact_email.trim(),
    contact_phone: formData.contact_phone.trim(),
    status: formData.status,
    notes: formData.notes.trim(),
  });

  const validateField = async (name, nextFormData) => {
    if (isEditing && name === "sponsor_id") return;

    const payload = {
      sponsor_id: nextFormData.sponsor_id.trim(),
      name: nextFormData.name.trim(),
      contact_email: nextFormData.contact_email.trim(),
      contact_phone: nextFormData.contact_phone.trim(),
      status: nextFormData.status,
      notes: nextFormData.notes.trim(),
    };

    try {
      const schema = isEditing ? sponsorUpdateSchema : sponsorCreateSchema;
      await schema.validateAt(name, payload);
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

  const handleBlur = async (event) => {
    const { name } = event.target;
    await validateField(name, formData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    const payload = getPayload();

    try {
      const schema = isEditing ? sponsorUpdateSchema : sponsorCreateSchema;
      await schema.validate(payload, { abortEarly: false });
    } catch (validationError) {
      const nextFieldErrors = {};

      validationError.inner.forEach((fieldError) => {
        if (fieldError.path && !nextFieldErrors[fieldError.path]) {
          nextFieldErrors[fieldError.path] = fieldError.message;
        }
      });

      setFieldErrors(nextFieldErrors);
      setError("Please fix the highlighted fields.");
      return;
    }

    if (isEditing) {
      delete payload.sponsor_id;
    } else {
      delete payload.status;
    }

    if (!payload.contact_email) delete payload.contact_email;
    if (!payload.contact_phone) delete payload.contact_phone;
    if (!payload.notes) delete payload.notes;

    try {
      setSaving(true);
      const response = isEditing
        ? await updateSponsor(sponsor._id, payload)
        : await createSponsor(payload);

      toast.success(response.message || "Sponsor saved successfully.");
      onSaved();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save sponsor."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Sponsor" : "Add Sponsor"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close sponsor modal"
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

          <div
            className={`grid grid-cols-1 gap-4 ${
              isEditing ? "sm:grid-cols-2" : ""
            }`}
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Short Code
              </label>
              <input
                type="text"
                name="sponsor_id"
                value={formData.sponsor_id}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isEditing}
                aria-invalid={Boolean(fieldErrors.sponsor_id)}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 disabled:bg-gray-100 ${
                  fieldErrors.sponsor_id
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                }`}
                placeholder="e.g. TEST"
              />
              {fieldErrors.sponsor_id && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.sponsor_id}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Short code cannot be changed after the sponsor is created.
              </p>
            </div>

            {isEditing && (
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
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Sponsor Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(fieldErrors.name)}
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                fieldErrors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
              }`}
              placeholder="Enter sponsor name"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(fieldErrors.contact_email)}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  fieldErrors.contact_email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                }`}
                placeholder="name@example.com"
              />
              {fieldErrors.contact_email && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.contact_email}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(fieldErrors.contact_phone)}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  fieldErrors.contact_phone
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                }`}
                placeholder="Optional phone number"
              />
              {fieldErrors.contact_phone && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.contact_phone}
                </p>
              )}
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
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Sponsor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSponsors, setTotalSponsors] = useState(0);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const perPageOptions = [5, 10, 25, 50];

  const loadSponsors = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSponsors({
        page: currentPage,
        limit: perPage,
        search: searchTerm,
      });

      if (response.status) {
        setSponsors(response.data?.sponsors || []);
        setTotalPages(response.data?.total_pages || 1);
        setTotalSponsors(response.data?.total_sponsors || 0);
      } else {
        setError(response.message || "Failed to load sponsors.");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load sponsors."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSponsors();
  }, [currentPage, perPage, searchTerm]);

  const handleAddSponsor = () => {
    setSelectedSponsor(null);
    setShowModal(true);
  };

  const handleEditSponsor = (sponsor) => {
    setSelectedSponsor(sponsor);
    setShowModal(true);
  };

  const handleSaved = () => {
    setShowModal(false);
    setSelectedSponsor(null);
    loadSponsors();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePerPageChange = (event) => {
    setPerPage(Number(event.target.value));
    setCurrentPage(1);
    setShowPerPageDropdown(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sponsors</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage sponsor profiles used to create and fund loan pools.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddSponsor}
          className="theme_bg_color inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
        >
          Add Sponsor
        </button>
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by name or short code"
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
            </div>
            <div className="text-sm text-gray-500">
              {totalSponsors.toLocaleString()} sponsor
              {totalSponsors === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        {error && <div className="px-4 py-3 text-sm text-red-600">{error}</div>}

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Short Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                    Loading sponsors...
                  </td>
                </tr>
              ) : sponsors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                    No sponsors found.
                  </td>
                </tr>
              ) : (
                sponsors.map((sponsor) => (
                  <tr key={sponsor._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {sponsor.sponsor_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {sponsor.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {sponsor.contact_email || "--"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {sponsor.contact_phone || "--"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          sponsor.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sponsor.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {formatDate(sponsor.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() => handleEditSponsor(sponsor)}
                        className="cursor-pointer font-medium text-[#2D6157] hover:text-[#224c44]"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-gray-200 md:hidden">
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              Loading sponsors...
            </div>
          ) : sponsors.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No sponsors found.
            </div>
          ) : (
            sponsors.map((sponsor) => (
              <div key={sponsor._id} className="space-y-3 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {sponsor.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {sponsor.sponsor_id}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      sponsor.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sponsor.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium text-gray-800">Email: </span>
                    {sponsor.contact_email || "--"}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Phone: </span>
                    {sponsor.contact_phone || "--"}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Created: </span>
                    {formatDate(sponsor.created_at)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleEditSponsor(sponsor)}
                  className="cursor-pointer text-sm font-medium text-[#2D6157]"
                >
                  Edit Sponsor
                </button>
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

      {showModal && (
        <SponsorModal
          sponsor={selectedSponsor}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
