const topUsers = [
  {
    id: 1,
    name: "Aisha Bello",
    email: "aisha@example.com",
    phone: "+234 812 345 6789",
    score: 850,
    amount: "₦ 50,000",
    type: "Cash",
    totalLoanTaken: "₦ 50,000",
    outstandingLoan: "₦ 5,000",
    amountRepaid: "₦ 45,000",
    lastLoanDate: "July 15, 2025"
  },
  {
    id: 2,
    name: "John Bello",
    email: "john@example.com",
    phone: "+234 812 345 6789",
    score: 820,
    amount: "₦ 40,000",
    type: "Plastic",
    totalLoanTaken: "₦ 40,000",
    outstandingLoan: "₦ 8,000",
    amountRepaid: "₦ 32,000",
    lastLoanDate: "July 14, 2025"
  },
  {
    id: 3,
    name: "Amina Bello",
    email: "amina@example.com",
    phone: "+234 812 345 6789",
    score: 800,
    amount: "₦ 35,000",
    type: "Recyclables",
    totalLoanTaken: "₦ 35,000",
    outstandingLoan: "₦ 3,500",
    amountRepaid: "₦ 31,500",
    lastLoanDate: "July 13, 2025"
  },
  {
    id: 4,
    name: "Kemi Adeniran",
    email: "kemi@example.com",
    phone: "+234 812 345 6789",
    score: 780,
    amount: "₦ 30,000",
    type: "Cash",
    totalLoanTaken: "₦ 30,000",
    outstandingLoan: "₦ 6,000",
    amountRepaid: "₦ 24,000",
    lastLoanDate: "July 12, 2025"
  }
];

function TopPerformingUsersChart({ onUserClick }) {
  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'cash':
        return 'bg-green-100 text-green-800';
      case 'plastic':
        return 'bg-yellow-100 text-yellow-800';
      case 'recyclables':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {topUsers.map((user) => (
        <div 
          key={user.id} 
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => onUserClick(user)}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">Score: {user.score}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user.amount}</p>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(user.type)}`}>
              {user.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TopPerformingUsersChart;