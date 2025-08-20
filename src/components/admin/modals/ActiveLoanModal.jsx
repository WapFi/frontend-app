export default function ActiveLoanModal({ visible, onAction, title, body, buttonLabel }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center">
        <h2 className="text-xl font-bold mb-4 text-[#2D6157]">{title}</h2>
        <p className="mb-6 text-[#444]">{body}</p>
        <button
          onClick={onAction}
          className="w-full rounded-[50px] text-white font-medium bg-[#439182] py-2 hover:opacity-80 transition-opacity"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
