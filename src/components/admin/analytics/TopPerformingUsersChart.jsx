function TopPerformingUsersChart({ users = [], onUserClick }) {
  const getTypeColor = (type) => {
    switch ((type || '').toLowerCase()) {
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

  if (!users || users.length === 0) {
    return <div className="text-gray-500">No top performing users available</div>;
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div 
          key={user.id || user._id} 
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => onUserClick(user)}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {(user.name || user.full_name || '').split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name || user.full_name}</p>
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