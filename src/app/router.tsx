import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthStore } from "../modules/auth/store/auth.store";
import AuthPage from "../modules/auth/pages/AuthPage";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import Layout from "../shared/components/Layout";
import PanelEnvios from "../modules/envios/pages/MainItems";
import UnassignedList from "../modules/envios/pages/UnassignedList";
import HistoricShipments from "../modules/envios/pages/CheckpointList";
import TrackingPage from "../modules/envios/pages/Tracking";

function IndexRedirect() {
  const token = useAuthStore((s) => s.token);
  return <Navigate to={token ? "/menu" : "/auth"} replace />;
}

export const router = createBrowserRouter([
  { path: "/auth", element: <AuthPage /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <IndexRedirect /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "menu", element: <PanelEnvios /> },
          { path: "envios/crear", element: <UnassignedList /> },
          { path: "historico/envios", element: <HistoricShipments /> },
          { path: "historico", element: <TrackingPage /> },
        ],
      },
    ],
  },

  // fallback
  { path: "*", element: <Navigate to="/" replace /> },
]);
