import React from 'react';

const UserAvatar = ({ user, size = "h-15 w-15" }) => {
  // Check if user has a photo
  const hasPhoto = user?.photo || user?.avatar || user?.profile_picture;
  
  // Get user initials
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (hasPhoto) {
    return (
      <div className={`flex-shrink-0 ${size}`}>
        <img
          src={hasPhoto}
          alt={`${user.name || 'User'} avatar`}
          className={`${size} rounded-full object-cover`}
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback initials (hidden by default) */}
        <div className={`${size} rounded-full bg-gray-300 flex items-center justify-center hidden`}>
          <span className="text-xs font-medium text-gray-600">
            {getInitials(user.name)}
          </span>
        </div>
      </div>
    );
  }

  // Show initials when no photo is available
  return (
    <div className={`flex-shrink-0 ${size}`}>
      <div className={`${size} rounded-full bg-gray-300 flex items-center justify-center`}>
        <span className="text-xs font-medium text-gray-600">
          {getInitials(user.name)}
        </span>
      </div>
    </div>
  );
};

export default UserAvatar; 