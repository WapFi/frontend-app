export default function Toast({ message, type }) {
  if (!message) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const textColor = "text-white";

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg ${bgColor} ${textColor} z-[9999] animate-fade-in-out`}
    >
      <p>{message}</p>
    </div>
  );
}
