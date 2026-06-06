import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRoutes";
import { DashboardProvider } from "./context/DashboardContext";

function App() {
  return (
    <DashboardProvider>
      <RouterProvider router={router} />
    </DashboardProvider>
  );
}

export default App;
