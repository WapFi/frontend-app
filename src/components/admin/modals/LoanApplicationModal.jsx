function LoanApplicationModal({ loan, onClose }) {
  if (!loan) return null;

  const handleApprove = () => {
    console.log("Approve loan:", loan.id);
    // Add approval logic here
    onClose();
  };

  const handleDecline = () => {
    console.log("Decline loan:", loan.id);
    // Add decline logic here
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Loan Applications</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Avatar and Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xl font-medium text-gray-600">
                {loan.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{loan.name}</h3>
              <p className="text-sm text-gray-500">{loan.email}</p>
              <p className="text-sm text-gray-500">{loan.phone}</p>
            </div>
          </div>

          {/* Loan Information */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-lg font-semibold text-gray-900">{loan.amount}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">3 Months</span>
                <span className="text-sm text-gray-900">{loan.loanTerm}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">School Fees</span>
                <span className="text-sm text-gray-900">{loan.reason}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Date Date</span>
                <span className="text-sm text-gray-900">{loan.date}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {loan.status === 'pending' ? (
            <div className="flex space-x-3">
              <button 
                onClick={handleApprove}
                className="flex-1 bg-yellow-500 text-white py-3 px-4 rounded-md font-medium hover:bg-yellow-600 transition-colors"
              >
                Approve Loan
              </button>
              <button 
                onClick={handleDecline}
                className="flex-1 bg-red-100 text-red-700 py-3 px-4 rounded-md font-medium hover:bg-red-200 transition-colors"
              >
                Decline Loan
              </button>
            </div>
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                This loan has been {loan.status === 'approved' ? 'approved' : 'declined'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoanApplicationModal;