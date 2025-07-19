import { useState } from "react";

function AdminHeader({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">
          {/* Mobile menu button */}
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50" >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Right side - notifications and profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 relative"
              >
				<svg
					className="w-6 h-6 text-gray-600"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
					/>
				</svg>
                
                {/* Notification dot */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    <p className="text-xs text-gray-500">You have 3 new notifications</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm text-gray-900">New loan request from Aisha Bello for ₦50,000</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                    <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm text-gray-900">Loan of ₦20,000 for John Doe has been approved and disbursed successfully</p>
                      <p className="text-xs text-gray-500">5 minutes ago</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50">
                      <p className="text-sm text-gray-900">User John Doe has been blocked due to multiple failed BVN verifications</p>
                      <p className="text-xs text-gray-500">10 minutes ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AD</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile dropdown */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">AD</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Ademola David</p>
                        <p className="text-xs text-gray-500">ademola@gmail.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                      Profile Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                      Account Settings
                    </button>
                    <div className="border-t border-gray-100 my-2"></div>
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;