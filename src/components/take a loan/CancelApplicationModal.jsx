import { useTranslation } from "react-i18next";
import LoadingSpinner from "../LoadingSpinner";

export default function CancelApplicationModal({
  onConfirm,
  onCancel,
  loading,
  error,
  success,
}) {
  const { t } = useTranslation();

  return (
    <div className="w-[90%] mx-auto lg:w-[50%] text-center text-[#222] bg-white rounded-[12px] flex flex-col gap-10 py-7 px-5">
      <p className="text-[18px] md:text-[20px]">
        {t("cancelApplicationModal.title")}
      </p>
      <p className="text-[rgba(68,68,68,0.80)]">
        {t("cancelApplicationModal.body")}
      </p>
      {error && (
        <p className="text-red-500 text-sm" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="text-green-600 text-sm" role="status">
          {success}
        </p>
      )}
      <div className="flex items-center justify-center gap-6">
        <button
          disabled={loading || Boolean(success)}
          onClick={onCancel}
          className={`border border-[rgba(0,0,0,0.08)] font-medium rounded-[40px] bg-white py-2.5 px-6 hover:opacity-60 transition-opacity duration-300 ${
            loading || success
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer"
          }`}
        >
          {t("cancelApplicationModal.noButton")}
        </button>
        <button
          disabled={loading || Boolean(success)}
          onClick={onConfirm}
          className={`text-white bg-[#439182] font-medium border border-[rgba(0,0,0,0.08)] rounded-[40px] py-2.5 px-6 hover:opacity-80 transition-opacity duration-300 ${
            loading || success
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer"
          }`}
        >
          {loading ? <LoadingSpinner /> : t("cancelApplicationModal.yesButton")}
        </button>
      </div>
    </div>
  );
}
