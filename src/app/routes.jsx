import { Navigate, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Layout from "../pages/components/layout/Layout";
import Backoffice from "../pages/admin/Backoffice";
import AdminUsers from "../pages/admin/AdminUsers";
import ZonesList from "../pages/zones/ZonesList";
import CropsList from "../pages/crops/CropsList";
import Thresholds from "../pages/settings/Thresholds";
import AlertsList from "../pages/alerts/AlertsList";
import Inventory from "../pages/inventory/Inventory";
import ActuatorsList from "../pages/actuators/ActuatorsList";
import NotFound from "../pages/NotFound";
import ActuatorAdmin from "../pages/actuators/ActuatorAdmin";
import Reports from "../pages/reports/Reports";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute() {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function AdminRoute() {
	const { isAuthenticated, isAdmin } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return isAdmin ? <Outlet /> : <Navigate to="/panel" replace />;
}

function ProtectedLayout() {
	return <Layout />;
}

const routes = [
	{
		path: "/",
		element: <Home />
	},
	{
		path: "/login",
		element: <Login />
	},
	{
		path: "/register",
		element: <Register />
	},
	{
		element: <ProtectedRoute />,
		children: [
			{
				element: <ProtectedLayout />,
				children: [
					{
						path: "/panel",
						element: <Dashboard />
					},
					{
						path: "/zonas",
						element: <ZonesList />
					},
					{
						path: "/cultivos",
						element: <CropsList />
					},
					{
						path: "/umbrales",
						element: <Thresholds />
					},
					{
						path: "/alertas",
						element: <AlertsList />
					},
					{
						path: "/inventario",
						element: <Inventory />
					},
					{
						path: "/actuadores",
						element: <ActuatorsList />
					},
					{
						element: <AdminRoute />,
						children: [
							{
								path: "/backoffice",
								element: <Backoffice />
							},
							{
								path: "/admin/usuarios",
								element: <AdminUsers />
							},
							{
								path: "/admin/users",
								element: <Navigate to="/admin/usuarios" replace />
							},
							{
								path: "/admin/actuadores",
								element: <ActuatorAdmin />
							},
							{
								path: "/reports",
								element: <Reports />
							}
						]
					}
				]
			}
		]
	},
	{
		path: "*",
		element: <NotFound />
	}
];

export default routes;
