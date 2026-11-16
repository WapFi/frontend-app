import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { getLoanBanks, updatePendingLoanDetails } from "../../api/loansApi";
import { fetchDashboardData } from "../../api/apiData";
import { useDashboard } from "../../context/DashboardContext";
import canCorrectLoanBank from "../../utils/canCorrectLoanBank";

export default function BankCorrectionForm({ loan, onClose, onSaved, onBusyChange }) {
  const { t } = useTranslation();
  const { setDashboardData } = useDashboard();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bankError, setBankError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const heading = useRef(null);

  useEffect(() => { heading.current?.focus(); }, []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setBankError(false);
    getLoanBanks(controller.signal).then((data) => {
      if (!controller.signal.aborted) setBanks(data);
    }).catch(() => {
      if (!controller.signal.aborted) setBankError(true);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [attempt]);

  const schema = yup.object({
    account_name: yup.string().trim().required(t("bankCorrection.nameRequired")),
    account_number: yup.string().required(t("loanStep2.errors.accountNumberRequired"))
      .matches(/^\d{10}$/, t("loanStep2.errors.accountNumberInvalid")),
    bank: yup.string().required(t("loanStep2.errors.bankSelectionRequired"))
      .test("listed", t("loanStep2.errors.bankSelectionRequired"), (value) =>
        banks.some((bank) => JSON.stringify([bank.code, bank.name]) === value)),
  });
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      account_name: loan.bank_account?.account_name || "",
      account_number: loan.bank_account?.account_number || "",
      bank: loan.bank_account?.bank_code && loan.bank_account?.bank_name
        ? JSON.stringify([loan.bank_account.bank_code, loan.bank_account.bank_name]) : "",
    },
  });
  const selection = watch("bank");
  const filteredBanks = banks.filter((bank) =>
    JSON.stringify([bank.code, bank.name]) === selection ||
    bank.name.toLowerCase().includes(search.trim().toLowerCase()) || bank.code.includes(search.trim()));

  const save = async (values) => {
    if (busy.current || loading || bankError || !canCorrectLoanBank(loan)) return;
    busy.current = true;
    setSaving(true);
    onBusyChange(true);
    setError("");
    try {
      const fresh = await fetchDashboardData();
      if (!fresh.status || !fresh.data) throw new Error("Unable to check loan status");
      const current = fresh.data.pending_loan;
      if (current?._id !== loan._id || !canCorrectLoanBank(current)) {
        setError(t("bankCorrection.unavailable"));
        setDashboardData(fresh.data);
        return;
      }
      const bank = banks.find((item) => JSON.stringify([item.code, item.name]) === values.bank);
      const response = await updatePendingLoanDetails({
        account_name: values.account_name,
        account_number: values.account_number,
        bank_name: bank.name,
        bank_code: bank.code,
      }, loan._id);
      if (response.data?.status !== true) {
        setError(response.data?.message || t("bankCorrection.saveError"));
        return;
      }
      await onSaved(response.data.message || t("bankCorrection.saved"));
    } catch (failure) {
      const body = failure.response?.data;
      setError(body?.errors?.map((item) => item.message).filter(Boolean).join(" ") || body?.message || t("bankCorrection.saveError"));
    } finally {
      busy.current = false;
      setSaving(false);
      onBusyChange(false);
    }
  };
  const fieldClass = "mt-2 w-full min-w-0 rounded-lg border border-gray-300 bg-white p-3 text-[#222]";

  return (
    <form onSubmit={handleSubmit(save)} noValidate className="w-full max-w-xl space-y-4 border-t border-gray-200 pt-5 text-left">
      <h2 ref={heading} tabIndex={-1} className="font-raleway text-xl font-semibold text-[#10172E]">{t("bankCorrection.title")}</h2>
      <fieldset disabled={saving} className="min-w-0 space-y-4">
        <div><label htmlFor="correct-account-name">{t("loanStep2.accountNameLabel")}</label>
          <input id="correct-account-name" {...register("account_name")} className={fieldClass} />
          {errors.account_name && <p className="text-sm text-red-600">{errors.account_name.message}</p>}
        </div>
        <div><label htmlFor="correct-account-number">{t("loanStep2.accountNumberLabel")}</label>
          <input id="correct-account-number" inputMode="numeric" {...register("account_number")} className={fieldClass} />
          {errors.account_number && <p className="text-sm text-red-600">{errors.account_number.message}</p>}
        </div>
        {loading ? <p role="status">{t("loanStep2.banksLoading")}</p> : bankError || !banks.length ? (
          <div role="status"><p className="text-sm text-red-600">{t(bankError ? "loanStep2.banksError" : "loanStep2.banksEmpty")}</p>
            <button type="button" className="cursor-pointer py-2 text-[#2D6157] underline" onClick={() => setAttempt((value) => value + 1)}>{t("loanStep2.retryBanks")}</button>
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="correct-bank-search">{t("loanStep2.searchBanks")}</label>
            <input id="correct-bank-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} className={fieldClass} />
            <label htmlFor="correct-bank" className="block">{t("loanStep2.bankNameLabel")}</label>
            <select id="correct-bank" {...register("bank")} className={`${fieldClass} cursor-pointer`}>
              <option value="">{t("loanStep2.selectBankPlaceholder")}</option>
              {filteredBanks.map((bank) => <option key={`${bank.id}-${bank.code}`} value={JSON.stringify([bank.code, bank.name])}>{bank.name} ({bank.code})</option>)}
            </select>
            {!filteredBanks.length && <p role="status" className="text-sm">{t("loanStep2.noMatchingBanks")}</p>}
            {errors.bank && <p className="text-sm text-red-600">{errors.bank.message}</p>}
          </div>
        )}
        {error && <p role="alert" className="break-words text-sm text-red-600">{error}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={saving || loading || bankError || !banks.length} className="cursor-pointer rounded-[50px] bg-[#439182] px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50">{t(saving ? "bankCorrection.saving" : "bankCorrection.save")}</button>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-[50px] border border-[#439182] px-6 py-3 text-[#2D6157]">{t("bankCorrection.cancel")}</button>
        </div>
      </fieldset>
    </form>
  );
}
