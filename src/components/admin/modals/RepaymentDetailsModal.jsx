function RepaymentDetailsModal({ repayment, onClose, onViewUser }) {
  if (!repayment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Repayment</h2>
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
                {repayment.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{repayment.name}</h3>
              <p className="text-sm text-gray-500">{repayment.email}</p>
            </div>
          </div>

          {/* Repayment Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Loan Amount</p>
                <p className="text-lg font-semibold text-gray-900">{repayment.loanAmount}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Outstanding</p>
                <p className="text-lg font-semibold text-gray-900">{repayment.outstandingLoan}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Repayment Progress</h4>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ 
                    width: `${((parseFloat(repayment.loanAmount.replace(/[₦,]/g, '')) - parseFloat(repayment.outstandingLoan.replace(/[₦,]/g, ''))) / parseFloat(repayment.loanAmount.replace(/[₦,]/g, ''))) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Paid: {repayment.amountRepaid}</span>
                <span>Remaining: {repayment.outstandingLoan}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Payment Date</span>
                <span className="text-sm text-gray-900">{repayment.datePaid}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-sm text-green-600 font-medium">Plastic</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button 
              onClick={onViewUser}
              className="flex-1 bg-yellow-500 text-white py-3 px-4 rounded-md font-medium hover:bg-yellow-600 transition-colors"
            >
              View Statement
            </button>
            <button className="flex-1 bg-red-100 text-red-700 py-3 px-4 rounded-md font-medium hover:bg-red-200 transition-colors">
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepaymentDetailsModal;