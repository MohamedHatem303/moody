import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout";
import Login from "./Authentication/Login/Login";
import Register from "./Authentication/Register/Register";
import Home from "./Page/Home/Home";
import Notfound from "./components/Notfound/Notfound";
import { HeroUIProvider } from "@heroui/system";
import AuthLayout from "./Layout/AuthLayout";
import { AuthContextProvider } from "./Context/authContext";
import Profile from "./Page/Profile/Profile";
import ProtectRoutes from "./components/ProtectRoutes/ProtectRoutes";
import Setting from "./Page/Setting/Setting";
import SinglePost from "./Page/SinglePost/SinglePost";
import AuthProtect from "./components/AuthProtect/AuthProtect";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import UserProfile from "./Page/UserProfile/UserProfile";
import { Toaster } from "react-hot-toast";

import { ThemeProvider, useTheme } from "./Context/themeContext";
import { darkTheme } from "./theme/darkTheme";

const queryClient = new QueryClient({});

const routers = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <AuthProtect><Login /></AuthProtect> },
      { path: "Register", element: <AuthProtect><Register /></AuthProtect> },
      { path: "*", element: <Notfound /> },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "Home", element: <ProtectRoutes><Home /></ProtectRoutes> },
      { path: "Profile", element: <ProtectRoutes><Profile /></ProtectRoutes> },
      { path: "UserProfile/:id", element: <ProtectRoutes><UserProfile /></ProtectRoutes> },
      { path: "SinglePost/:id", element: <ProtectRoutes><SinglePost /></ProtectRoutes> },
      { path: "Setting", element: <ProtectRoutes><Setting /></ProtectRoutes> },
    ],
  },
]);

/* =========================
   App اللي بيستخدم الثيم
========================= */
function AppContent() {
  const { theme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider theme={theme === "dark" ? darkTheme : undefined}>
        <AuthContextProvider>
          <RouterProvider router={routers} />
          <Toaster />
        </AuthContextProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}

/* =========================
   Wrapper بالـ ThemeProvider
========================= */
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
