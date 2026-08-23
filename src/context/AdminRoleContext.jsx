import { createContext, useContext } from "react";

const AdminRoleContext = createContext({
  adminUser: null,
  isSuperAdmin: false,
});

export function AdminRoleProvider({ adminUser, children }) {
  const isSuperAdmin = adminUser?.role === "WAPFI_SUPER_ADMIN";

  return (
    <AdminRoleContext.Provider value={{ adminUser, isSuperAdmin }}>
      {children}
    </AdminRoleContext.Provider>
  );
}

export function useAdminRole() {
  return useContext(AdminRoleContext);
}
