import successGif from "../../assets/success.gif";

function AuthSuccessModal({ title, message, buttonText, onContinue }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-[12px] bg-white p-6 text-center shadow-xl">
        <div className="mb-5 flex justify-center">
          <img
            src={successGif}
            alt="Success"
            className="h-24 w-24 object-contain"
          />
        </div>

        <h2 className="font-raleway text-2xl font-bold text-[#10172E]">
          {title}
        </h2>
        <p className="mt-3 text-[#656565]">{message}</p>

        <button
          type="button"
          onClick={onContinue}
          className="mt-6 w-full rounded-[50px] bg-[#439182] px-6 py-3 font-medium text-white transition-opacity hover:opacity-80"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default AuthSuccessModal;
