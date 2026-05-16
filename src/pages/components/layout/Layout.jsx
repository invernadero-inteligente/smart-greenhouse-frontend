import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
const [sidebarOpen, setSidebarOpen] = useState(false);

return (
<div className="flex min-h-screen bg-[#f4f7f4] font-body text-[#143321]">
{/* Mobile overlay */}
{sidebarOpen && (
<div
className="fixed inset-0 z-20 bg-black/30 lg:hidden"
onClick={() => setSidebarOpen(false)}
/>
)}

<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

<div className="flex flex-1 flex-col lg:pl-64">
{/* Mobile top bar */}
<div className="flex items-center gap-3 border-b border-[#d6e8d0] bg-white px-4 py-3 lg:hidden">
<button
onClick={() => setSidebarOpen(true)}
className="rounded-lg p-1.5 text-[#3a5745] hover:bg-[#e9f5e6]"
aria-label="Abrir menu"
>
<svg
xmlns="http://www.w3.org/2000/svg"
fill="none"
viewBox="0 0 24 24"
strokeWidth={1.5}
stroke="currentColor"
className="h-5 w-5"
>
<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
</svg>
</button>
<span className="font-heading text-sm font-bold text-[#1b4f2f]">
Invernadero Inteligente
</span>
</div>

<main className="flex-1 p-6">
<Outlet />
</main>
</div>
</div>
);
}
