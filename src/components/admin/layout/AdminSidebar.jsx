import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import WapfiLogo from "../../WapfiLogo";

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { name: "Add Repayment", href: "/admin/add-repayment", icon: "add" },
    { name: "Loan Applications", href: "/admin/loan-applications", icon: "loan" },
    { name: "Loan Repayment", href: "/admin/loan-repayment", icon: "repayment" },
    { name: "User Management", href: "/admin/user-management", icon: "user" },
    { name: "BVN Verification", href: "/admin/bvn-verification", icon: "verification" },
    { name: "NIN Verification", href: "/admin/nin-verification", icon: "verification" },
    { name: "Analytics", href: "/admin/analytics", icon: "analytics" },
];

function AdminSidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
        // Add logout API call here
        navigate("/sign-in");
        } catch (error) {
        console.error("Logout failed:", error);
        }
        setIsLoggingOut(false);
    };

    const IconComponent = ({ type }) => {
        const iconClass = "w-5 h-5";
        
        switch (type) {
        case "dashboard":
            return (
                <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="19" height="22" viewBox="0 0 19 22" fill="currentColor">
                <path d="M3.26631 20.5627C2.01469 20.5627 1 19.5214 1 18.2358V8.88367C1 8.17711 1.31344 7.50773 1.85 7.0668L8.08369 1.94767C8.48197 1.61785 8.98288 1.43738 9.5 1.43738C10.0171 1.43738 10.518 1.61785 10.9163 1.94767L17.1489 7.0668C17.6866 7.50773 18 8.17711 18 8.88367V18.2358C18 19.5214 16.9853 20.5627 15.7337 20.5627H3.26631Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.84381 20.5626V14.7189C6.84381 14.1553 7.06769 13.6148 7.46621 13.2163C7.86472 12.8178 8.40523 12.5939 8.96881 12.5939H10.0313C10.5949 12.5939 11.1354 12.8178 11.5339 13.2163C11.9324 13.6148 12.1563 14.1553 12.1563 14.7189V20.5626" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            );
        case "user":
            return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
            </svg>
            );
        case "loan":
            return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
            );
        case "repayment":
            return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
            );
        case "add":
            return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            );
        case "verification":
            return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            );
        case "analytics":
            return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
            );
        default:
            return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
            );
        }
    };

    return (
        <>
        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
            <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4 py-6">
                <WapfiLogo />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                        ? "bg-yellow-500 text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                    }
                >
                    <IconComponent type={item.icon} />
                    <span className="ml-3">{item.name}</span>
                </NavLink>
                ))}
            </nav>

            {/* Logout button */}
            <div className="flex-shrink-0 p-4">
                <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="group flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                </svg>
                {isLoggingOut ? "Logging out..." : "Log Out"}
                </button>
            </div>
            </div>
        </div>

        {/* Mobile sidebar */}
        <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
            <div className="flex flex-col h-full">
            {/* Logo and close button */}
            <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
                <WapfiLogo />
                <button
                onClick={onClose}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600"
                >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                        ? "bg-yellow-500 text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                    }
                >
                    <IconComponent type={item.icon} />
                    <span className="ml-3">{item.name}</span>
                </NavLink>
                ))}
            </nav>

            {/* Logout button */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200">
                <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="group flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                </svg>
                {isLoggingOut ? "Logging out..." : "Log Out"}
                </button>
            </div>
            </div>
        </div>
        </>
    );
}

export default AdminSidebar;