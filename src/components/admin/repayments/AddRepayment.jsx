import { yupResolver } from "@hookform/resolvers/yup";
import { useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { addRepayment } from "../../../api/repaymentsApi";
import LoanRepaymentSuccessModal from "../modals/LoanRepaymentSuccessModal";
import { buildRepaymentPayload, emptyDelivery, emptyRepayment, includesCash, includesDeliveries, materialTypes, repaymentSchema } from "./repaymentForm";

const inputClass = "w-full min-w-0 px-3 py-2.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500";
const labelClass = "block text-sm font-medium text-gray-700 mb-2";
function FieldError({ error }) {
  return error?.message ? <p role="alert" className="text-red-600 text-sm mt-1">{error.message}</p> : null;
}

export default function AddRepayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const inFlight = useRef(false);
  const { register, control, handleSubmit, reset, watch, setValue, clearErrors, formState: { errors } } = useForm({
    mode: "onChange", resolver: yupResolver(repaymentSchema), defaultValues: emptyRepayment(),
  });
  const { fields, append, remove, replace } = useFieldArray({ control, name: "deliveries" });
  const method = watch("repaymentMethod");
  const changeMethod = (event) => {
    const next = event.target.value;
    if (!includesCash(next)) setValue("cashAmount", "", { shouldDirty: true });
    if (!includesDeliveries(next)) replace([]);
    else if (!fields.length) replace([emptyDelivery()]);
    clearErrors();
    setValue("repaymentMethod", next, { shouldDirty: true, shouldValidate: true });
  };
  const submit = async (data) => {
    if (inFlight.current || success) return;
    inFlight.current = true;
    setLoading(true);
    setError("");
    try {
      const response = await addRepayment(buildRepaymentPayload(data));
      if (response.status !== true) throw new Error(response.message || "Failed to add repayment");
      setSuccess({ message: response.message || "Repayment recorded successfully.", identifier: data.borrowerIdentifier });
      reset(emptyRepayment());
    } catch (failure) {
      const body = failure.response?.data;
      setError(body?.errors?.map((item) => item.message).filter(Boolean).join(" ") || body?.message || failure.message || "Failed to add repayment");
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow max-w-3xl mx-auto overflow-hidden">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center px-4 pt-6">Add Repayment</h1>
        <form onSubmit={handleSubmit(submit)} noValidate className="px-4 py-6 sm:p-6">
          {error && <div role="alert" className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded break-words">{error}</div>}
          <fieldset disabled={loading || Boolean(success)} className="min-w-0 space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="repayment-identifier" className={labelClass}>Borrower Email or Phone Number</label>
              <input id="repayment-identifier" type="text" autoComplete="off" {...register("borrowerIdentifier")} className={inputClass} />
              <FieldError error={errors.borrowerIdentifier} />
            </div>
            <div>
              <label htmlFor="repayment-method" className={labelClass}>Repayment Method</label>
              <select id="repayment-method" {...register("repaymentMethod")} onChange={changeMethod} className={`${inputClass} cursor-pointer`}>
                <option value="">Select repayment method</option>
                <option value="CASH">Cash</option><option value="RECYCLABLES">Recyclables</option><option value="BOTH">Both</option>
              </select><FieldError error={errors.repaymentMethod} />
            </div>
            {includesCash(method) && <div>
              <label htmlFor="repayment-cash" className={labelClass}>Cash Amount (NGN)</label>
              <input id="repayment-cash" type="number" step="any" {...register("cashAmount")} className={inputClass} />
              <FieldError error={errors.cashAmount} />
            </div>}
            {includesDeliveries(method) && <section className="space-y-5" aria-labelledby="deliveries-heading">
              <h2 id="deliveries-heading" className="font-semibold text-gray-900">Material Deliveries</h2>
              <FieldError error={errors.deliveries?.root || errors.deliveries} />
              {fields.map((field, index) => {
                const deliveryErrors = errors.deliveries?.[index];
                const id = `delivery-${field.id}`;
                return <fieldset key={field.id} className="min-w-0 border-t border-gray-200 pt-4">
                  <legend className="text-sm font-semibold text-gray-700">Delivery {index + 1}</legend>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`${id}-type`} className={labelClass}>Material Type</label>
                      <select id={`${id}-type`} {...register(`deliveries.${index}.recyclable_type`)} className={`${inputClass} cursor-pointer`}>
                        <option value="">Select material</option>{materialTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                      </select><FieldError error={deliveryErrors?.recyclable_type} />
                    </div>
                    <div>
                      <label htmlFor={`${id}-weight`} className={labelClass}>Weight (kg)</label>
                      <input id={`${id}-weight`} type="number" step="any" {...register(`deliveries.${index}.weight_kg`)} className={inputClass} />
                      <FieldError error={deliveryErrors?.weight_kg} />
                    </div>
                    <div>
                      <label htmlFor={`${id}-rate`} className={labelClass}>Rate per kg (NGN, optional)</label>
                      <input id={`${id}-rate`} type="number" step="any" placeholder="Fund/platform rate" {...register(`deliveries.${index}.rate_per_kg`)} className={inputClass} />
                      <FieldError error={deliveryErrors?.rate_per_kg} />
                    </div>
                    <div>
                      <label htmlFor={`${id}-point`} className={labelClass}>Collection Point (optional)</label>
                      <input id={`${id}-point`} {...register(`deliveries.${index}.collection_point`)} className={inputClass} />
                      <FieldError error={deliveryErrors?.collection_point} />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={`${id}-date`} className={labelClass}>Delivery Date and Time (local, optional)</label>
                      <input id={`${id}-date`} type="datetime-local" {...register(`deliveries.${index}.delivered_at`)} className={inputClass} />
                      <FieldError error={deliveryErrors?.delivered_at} />
                    </div>
                  </div>
                  <button type="button" disabled={fields.length === 1} onClick={() => remove(index)} className="mt-3 cursor-pointer text-sm text-red-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed">Remove delivery {index + 1}</button>
                </fieldset>;
              })}
              <button type="button" onClick={() => append(emptyDelivery())} className="cursor-pointer rounded-md border border-yellow-600 px-4 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-50">Add Delivery</button>
            </section>}
            <div>
              <label htmlFor="repayment-location" className={labelClass}>Drop-off Location (optional)</label>
              <input id="repayment-location" {...register("drop_off_location")} className={inputClass} />
              <FieldError error={errors.drop_off_location} />
            </div>
            <div>
              <label htmlFor="repayment-notes" className={labelClass}>Notes (optional)</label>
              <textarea id="repayment-notes" rows={3} {...register("notes")} className={inputClass} />
              <FieldError error={errors.notes} />
            </div>
            <button type="submit" disabled={loading || Boolean(success)} style={{ background: "#B88E00" }} className="w-full text-white py-3 px-4 rounded-full font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">{loading ? "Processing..." : "Submit Repayment"}</button>
          </fieldset>
        </form>
      </div>
      {success && <LoanRepaymentSuccessModal onClose={() => { setSuccess(null); setError(""); }} responseMessage={success.message} borrowerIdentifier={success.identifier} />}
    </div>
  );
}
