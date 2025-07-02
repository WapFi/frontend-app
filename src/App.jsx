// import AppRoutes from "./routes/AppRoutes";

// function App() {
//   return <AppRoutes />;
// }

// export default App;


// import { RouterProvider } from "react-router-dom";
// import router from "./routes/AppRoutes";

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;


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

