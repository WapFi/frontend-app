import test from "node:test";
import assert from "node:assert/strict";
import { repaymentSchema, buildRepaymentPayload, emptyDelivery, emptyRepayment, materialTypes } from "./repaymentForm.js";

const base = (method) => ({ ...emptyRepayment(), borrowerIdentifier: " test@example.com ", repaymentMethod: method });
const delivery = (overrides = {}) => ({ ...emptyDelivery(), recyclable_type: "Plastic", weight_kg: "20", ...overrides });
const payload = async (data) => buildRepaymentPayload(await repaymentSchema.validate(data, { abortEarly: false }));

test("cash sends only relevant numeric fields", async () => {
  assert.deepEqual(await payload({ ...base("CASH"), cashAmount: "5000", deliveries: [delivery({ weight_kg: "bad" })] }), {
    identifier: "test@example.com", repayment_method: "CASH", cash_amount: 5000,
  });
});
test("recyclables omit cash and blank optional delivery fields", async () => {
  assert.deepEqual(await payload({ ...base("RECYCLABLES"), cashAmount: "bad", deliveries: [delivery()] }), {
    identifier: "test@example.com", repayment_method: "RECYCLABLES", deliveries: [{ recyclable_type: "Plastic", weight_kg: 20 }],
  });
});
test("mixed payment supports all documented materials", async () => {
  const result = await payload({ ...base("BOTH"), cashAmount: "50.5", notes: " Note ", drop_off_location: " Hub ", deliveries: materialTypes.map((type) => delivery({ recyclable_type: type })) });
  assert.equal(result.cash_amount, 50.5);
  assert.equal(result.deliveries.length, 5);
  assert.equal(result.notes, "Note");
  assert.equal(result.drop_off_location, "Hub");
  assert.equal("plastic_weight_kg" in result, false);
});
test("explicit rates and ISO timestamps are retained", async () => {
  const result = await payload({ ...base("RECYCLABLES"), deliveries: [delivery({ rate_per_kg: "12.5", delivered_at: "2026-11-09T10:30:00Z", collection_point: " Kano Hub " })] });
  assert.deepEqual(result.deliveries[0], { recyclable_type: "Plastic", weight_kg: 20, rate_per_kg: 12.5, delivered_at: "2026-11-09T10:30:00.000Z", collection_point: "Kano Hub" });
});
test("explicit zero rate is not treated as omitted", async () => {
  const result = await payload({ ...base("RECYCLABLES"), deliveries: [delivery({ rate_per_kg: "0" })] });
  assert.equal(result.deliveries[0].rate_per_kg, 0);
});
test("invalid amounts and weights fail", async () => {
  for (const value of ["", "0", "-1", "abc", "Infinity"]) {
    await assert.rejects(payload({ ...base("CASH"), cashAmount: value }));
    await assert.rejects(payload({ ...base("RECYCLABLES"), deliveries: [delivery({ weight_kg: value })] }));
  }
});
test("invalid delivery types, rates, dates and empty arrays fail", async () => {
  for (const changes of [{ recyclable_type: "Glass" }, { rate_per_kg: "-1" }, { rate_per_kg: "abc" }, { delivered_at: "invalid" }]) {
    await assert.rejects(payload({ ...base("RECYCLABLES"), deliveries: [delivery(changes)] }));
  }
  await assert.rejects(payload({ ...base("BOTH"), cashAmount: "50", deliveries: [] }));
});
test("both requires cash as well as deliveries", async () => {
  await assert.rejects(payload({ ...base("BOTH"), deliveries: [delivery()] }));
});
test("identifiers accept local and international Nigerian phone formats", async () => {
  for (const identifier of ["08012345678", "+2348012345678"]) {
    assert.equal((await payload({ ...base("CASH"), cashAmount: "1", borrowerIdentifier: identifier })).identifier, identifier);
  }
  await assert.rejects(payload({ ...base("CASH"), cashAmount: "1", borrowerIdentifier: "wrong" }));
});
test("unknown payment methods fail", async () => {
  await assert.rejects(payload(base("OTHER")));
});
