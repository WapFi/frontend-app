import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import WapfiLogo from "../../WapfiLogo";

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { name: "Add Repayment", href: "/admin/add-repayment", icon: "add" },
    { name: "Loan Applications", href: "/admin/loan-applications", icon: "loan" },
    { name: "Loan Repayment", href: "/admin/loan-repayment", icon: "repayment" },
    { name: "User Management", href: "/admin/user-management", icon: "user" },
    { name: "BVN Verification", href: "/admin/bvn-verification", icon: "bvn" },
    { name: "NIN Verification", href: "/admin/nin-verification", icon: "nin" },
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
                <svg className="ml-3" xmlns="http://www.w3.org/2000/svg" width="19" height="22" viewBox="0 0 19 22" fill="none">
                <path d="M3.26631 20.5628C2.01469 20.5628 1 19.5215 1 18.2359V8.88379C1 8.17723 1.31344 7.50786 1.85 7.06692L8.08369 1.94779C8.48197 1.61798 8.98288 1.4375 9.5 1.4375C10.0171 1.4375 10.518 1.61798 10.9163 1.94779L17.1489 7.06692C17.6866 7.50786 18 8.17723 18 8.88379V18.2359C18 19.5215 16.9853 20.5628 15.7337 20.5628H3.26631Z" stroke="#A0B0AB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.84381 20.563V14.7192C6.84381 14.1557 7.06769 13.6152 7.46621 13.2166C7.86472 12.8181 8.40523 12.5942 8.96881 12.5942H10.0313C10.5949 12.5942 11.1354 12.8181 11.5339 13.2166C11.9324 13.6152 12.1563 14.1557 12.1563 14.7192V20.563" stroke="#A0B0AB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            );
        case "user":
            return (
                <svg className="ml-3" xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22" fill="none">
                <path d="M9 8.99998C11.2091 8.99998 13 7.20912 13 4.99999C13 2.79086 11.2091 1 9 1C6.79086 1 5 2.79086 5 4.99999C5 7.20912 6.79086 8.99998 9 8.99998Z" stroke="#A0B0AB" strokeWidth="1.8"/>
                <path d="M17 16.5C17 18.985 17 21 9 21C1 21 1 18.985 1 16.5C1 14.015 4.582 12 9 12C13.418 12 17 14.015 17 16.5Z" stroke="#A0B0AB" strokeWidth="1.8"/>
              </svg>
            );
        case "loan":
            return (
                <svg className="ml-3" xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
                <path d="M1 9C1 5.229 1 3.343 2.172 2.172C3.344 1.001 5.229 1 9 1H11C14.771 1 16.657 1 17.828 2.172C18.999 3.344 19 5.229 19 9V13C19 16.771 19 18.657 17.828 19.828C16.656 20.999 14.771 21 11 21H9C5.229 21 3.343 21 2.172 19.828C1.001 18.656 1 16.771 1 13V9Z" stroke="#A0B0AB" strokeWidth="1.5"/>
                <path d="M6 9H14M6 13H11" stroke="#A0B0AB" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            );
        case "repayment":
            return (
                <svg className="ml-3" xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                <path d="M0 3.68182C0 2.70534 0.372512 1.76885 1.03559 1.07838C1.69866 0.387905 2.59798 0 3.53571 0H18.4643C19.402 0 20.3013 0.387905 20.9644 1.07838C21.6275 1.76885 22 2.70534 22 3.68182V14.3182C22 15.2947 21.6275 16.2311 20.9644 16.9216C20.3013 17.6121 19.402 18 18.4643 18H3.53571C2.59798 18 1.69866 17.6121 1.03559 16.9216C0.372512 16.2311 0 15.2947 0 14.3182V3.68182ZM3.53571 1.63636C3.01475 1.63636 2.51513 1.85187 2.14675 2.23546C1.77838 2.61906 1.57143 3.13933 1.57143 3.68182V4.90909H20.4286V3.68182C20.4286 3.13933 20.2216 2.61906 19.8532 2.23546C19.4849 1.85187 18.9852 1.63636 18.4643 1.63636H3.53571ZM1.57143 14.3182C1.57143 14.8607 1.77838 15.3809 2.14675 15.7645C2.51513 16.1481 3.01475 16.3636 3.53571 16.3636H18.4643C18.9852 16.3636 19.4849 16.1481 19.8532 15.7645C20.2216 15.3809 20.4286 14.8607 20.4286 14.3182V6.54545H1.57143V14.3182ZM14.9286 11.4545H17.2857C17.4941 11.4545 17.6939 11.5407 17.8413 11.6942C17.9886 11.8476 18.0714 12.0557 18.0714 12.2727C18.0714 12.4897 17.9886 12.6978 17.8413 12.8513C17.6939 13.0047 17.4941 13.0909 17.2857 13.0909H14.9286C14.7202 13.0909 14.5203 13.0047 14.373 12.8513C14.2256 12.6978 14.1429 12.4897 14.1429 12.2727C14.1429 12.0557 14.2256 11.8476 14.373 11.6942C14.5203 11.5407 14.7202 11.4545 14.9286 11.4545Z" fill="#A0B0AB"/>
              </svg>
            );
        case "add":
            return (
                <svg className="ml-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 1V19M1 10H19" stroke="#A0B0AB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            );
        case "bvn":
            return (
                <svg className="ml-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.8429 1.03605C13.1238 0.9715 13.4178 0.996 13.6841 1.10615C13.9504 1.2163 14.1758 1.40663 14.329 1.65072L15.7081 3.8527C15.8193 4.03006 15.9692 4.17995 16.1466 4.29116L18.3486 5.67035C18.5932 5.82343 18.784 6.04897 18.8944 6.31557C19.0048 6.58216 19.0294 6.87655 18.9646 7.15776L18.3819 9.68859C18.3349 9.89312 18.3349 10.1057 18.3819 10.3102L18.9646 12.8424C19.0287 13.1232 19.0039 13.417 18.8935 13.683C18.7831 13.949 18.5927 14.1741 18.3486 14.327L16.1466 15.7076C15.9692 15.8188 15.8193 15.9687 15.7081 16.1461L14.329 18.3481C14.176 18.5924 13.9506 18.783 13.6843 18.8934C13.418 19.0038 13.1239 19.0285 12.8429 18.9641L10.3107 18.3814C10.1066 18.3346 9.89459 18.3346 9.6905 18.3814L7.15828 18.9641C6.87728 19.0285 6.58319 19.0038 6.31688 18.8934C6.05057 18.783 5.82526 18.5924 5.67226 18.3481L4.29307 16.1461C4.18147 15.9686 4.03109 15.8187 3.85323 15.7076L1.65263 14.3284C1.40829 14.1754 1.21767 13.9501 1.10727 13.6838C0.996866 13.4175 0.972156 13.1234 1.03657 12.8424L1.61794 10.3102C1.66495 10.1057 1.66495 9.89312 1.61794 9.68859L1.03519 7.15776C0.970589 6.87641 0.995352 6.58192 1.10603 6.3153C1.2167 6.04869 1.40777 5.82324 1.65263 5.67035L3.85323 4.29116C4.03109 4.18012 4.18147 4.03021 4.29307 3.8527L5.67226 1.65072C5.82537 1.40689 6.05053 1.21674 6.31654 1.1066C6.58256 0.996468 6.87624 0.971811 7.1569 1.03605L9.6905 1.61742C9.89459 1.66422 10.1066 1.66422 10.3107 1.61742L12.8429 1.03605Z" stroke="#A0B0AB" strokeWidth="1.5"/>
                <path d="M6.55209 10.7432L9.37568 13.4475L13.448 6.55151" stroke="#A0B0AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            );

        case "nin":
            return (
                <svg className="ml-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 10.2208L9 12.2573L13 8.18432M18.6179 4.09543C18.4132 4.106 18.2072 4.11135 18 4.11135C14.9265 4.11135 12.123 2.93484 9.9999 1C7.87691 2.93477 5.07339 4.11123 2 4.11123C1.79277 4.11123 1.58678 4.10588 1.38213 4.09531C1.1327 5.07649 1 6.10551 1 7.16609C1 12.8595 4.82432 17.6435 10 19C15.1757 17.6435 19 12.8595 19 7.16609C19 6.10556 18.8673 5.07657 18.6179 4.09543Z" stroke="#A0B0AB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        case "analytics":
            return (
                <svg className="ml-3" xmlns="http://www.w3.org/2000/svg" width="19" height="22" viewBox="0 0 19 22" fill="none">
                <path d="M1.11765 11C0.821229 11 0.536951 11.1159 0.327351 11.3222C0.117752 11.5285 0 11.8083 0 12.1V20.9C0 21.1917 0.117752 21.4715 0.327351 21.6778C0.536951 21.8841 0.821229 22 1.11765 22C1.41407 22 1.69834 21.8841 1.90794 21.6778C2.11754 21.4715 2.23529 21.1917 2.23529 20.9V12.1C2.23529 11.8083 2.11754 11.5285 1.90794 11.3222C1.69834 11.1159 1.41407 11 1.11765 11ZM6.70588 0C6.40946 0 6.12519 0.115892 5.91559 0.322183C5.70599 0.528472 5.58824 0.808262 5.58824 1.1V20.9C5.58824 21.1917 5.70599 21.4715 5.91559 21.6778C6.12519 21.8841 6.40946 22 6.70588 22C7.0023 22 7.28658 21.8841 7.49618 21.6778C7.70578 21.4715 7.82353 21.1917 7.82353 20.9V1.1C7.82353 0.808262 7.70578 0.528472 7.49618 0.322183C7.28658 0.115892 7.0023 0 6.70588 0ZM17.8824 15.4C17.5859 15.4 17.3017 15.5159 17.0921 15.7222C16.8825 15.9285 16.7647 16.2083 16.7647 16.5V20.9C16.7647 21.1917 16.8825 21.4715 17.0921 21.6778C17.3017 21.8841 17.5859 22 17.8824 22C18.1788 22 18.4631 21.8841 18.6726 21.6778C18.8822 21.4715 19 21.1917 19 20.9V16.5C19 16.2083 18.8822 15.9285 18.6726 15.7222C18.4631 15.5159 18.1788 15.4 17.8824 15.4ZM12.2941 6.6C11.9977 6.6 11.7134 6.71589 11.5038 6.92218C11.2942 7.12847 11.1765 7.40826 11.1765 7.7V20.9C11.1765 21.1917 11.2942 21.4715 11.5038 21.6778C11.7134 21.8841 11.9977 22 12.2941 22C12.5905 22 12.8748 21.8841 13.0844 21.6778C13.294 21.4715 13.4118 21.1917 13.4118 20.9V7.7C13.4118 7.40826 13.294 7.12847 13.0844 6.92218C12.8748 6.71589 12.5905 6.6 12.2941 6.6Z" fill="#A0B0AB"/>
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
                    `group flex items-center px-2 py-3 text-md font-medium rounded-lg transition-colors ${
                        isActive
                        ? "text-white theme_bg_color"
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
                style={{color: "#B88E00"}}
                className="group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
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