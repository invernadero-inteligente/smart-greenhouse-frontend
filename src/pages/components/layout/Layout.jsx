import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_20%_15%,#ffffff_0%,transparent_35%),linear-gradient(145deg,#f3efe6,#dbecd7)] font-body text-[#143321]">
			<Navbar />
			<div className="mx-auto w-full max-w-7xl px-4 py-8">
				<Outlet />
			</div>
		</div>
	);
}

export default Layout;
