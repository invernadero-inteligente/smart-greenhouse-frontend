import { Navigate, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Navbar from "../pages/components/layout/Navbar";
import Backoffice from "../pages/admin/Backoffice";
import NotFound from "../pages/NotFound";
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
	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_20%_15%,#ffffff_0%,transparent_35%),linear-gradient(145deg,#f3efe6,#dbecd7)] font-body text-[#143321]">
			<Navbar />
			<Outlet />
		</div>
	);
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
					}
				]
			},
			{
				element: <AdminRoute />,
				children: [
					{
						path: "/backoffice",
						element: <Backoffice />
					},
					{
						path: "/admin/users",
						element: <Navigate to="/backoffice" replace />
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
