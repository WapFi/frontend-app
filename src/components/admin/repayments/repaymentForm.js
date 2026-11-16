import * as yup from "yup";

export const materialTypes = ["Plastic", "Aluminum", "Paper", "Carton", "Pure Water Sachet"];
export const emptyDelivery = () => ({ recyclable_type: "", weight_kg: "", rate_per_kg: "", collection_point: "", delivered_at: "" });
export const emptyRepayment = () => ({ borrowerIdentifier: "", repaymentMethod: "", cashAmount: "", deliveries: [], drop_off_location: "", notes: "" });
export const includesCash = (method) => ["CASH", "BOTH"].includes(method);
export const includesDeliveries = (method) => ["RECYCLABLES", "BOTH"].includes(method);
const numberField = (label) => yup.number()
  .transform((value, original) => original === "" ? undefined : value)
  .typeError(`${label} must be a number`)
  .test("finite", `${label} must be finite`, (value) => value === undefined || Number.isFinite(value));

export const repaymentSchema = yup.object({
  borrowerIdentifier: yup.string().trim().required("Borrower email or phone number is required")
    .test("identifier", "Enter a valid email or Nigerian phone number", (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "") || /^(?:0\d{10}|\+234\d{10})$/.test(value || "")),
  repaymentMethod: yup.string().required("Repayment method is required")
    .oneOf(["CASH", "RECYCLABLES", "BOTH"], "Select a valid repayment method"),
  cashAmount: numberField("Cash amount").when("repaymentMethod", {
    is: includesCash,
    then: (schema) => schema.required("Cash amount is required").positive("Cash amount must be greater than 0"),
    otherwise: (schema) => schema.strip(),
  }),
  deliveries: yup.array().when("repaymentMethod", {
    is: includesDeliveries,
    then: (schema) => schema.required().min(1, "Add at least one delivery").of(yup.object({
      recyclable_type: yup.string().required("Material type is required").oneOf(materialTypes, "Select a valid material type"),
      weight_kg: numberField("Weight").required("Weight is required").positive("Weight must be greater than 0"),
      rate_per_kg: numberField("Rate").min(0, "Rate cannot be negative").optional(),
      collection_point: yup.string().trim(),
      delivered_at: yup.string().test("date", "Enter a valid delivery date and time", (value) => !value || Number.isFinite(new Date(value).getTime())),
    })),
    otherwise: (schema) => schema.strip(),
  }),
  drop_off_location: yup.string().trim(),
  notes: yup.string().trim(),
});

// Accept validated values: Yup has already converted numeric inputs.
export function buildRepaymentPayload(data) {
  const payload = { identifier: data.borrowerIdentifier, repayment_method: data.repaymentMethod };
  if (includesCash(data.repaymentMethod)) payload.cash_amount = data.cashAmount;
  if (includesDeliveries(data.repaymentMethod)) {
    payload.deliveries = data.deliveries.map((delivery) => {
      const item = { recyclable_type: delivery.recyclable_type, weight_kg: delivery.weight_kg };
      if (delivery.rate_per_kg !== undefined) item.rate_per_kg = delivery.rate_per_kg;
      if (delivery.collection_point) item.collection_point = delivery.collection_point;
      if (delivery.delivered_at) item.delivered_at = new Date(delivery.delivered_at).toISOString();
      return item;
    });
  }
  if (data.drop_off_location) payload.drop_off_location = data.drop_off_location;
  if (data.notes) payload.notes = data.notes;
  return payload;
}
