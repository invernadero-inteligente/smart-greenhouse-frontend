import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { canEdit } from "../../utils/permissions";
import { inventoryService } from "../../services/inventory.service";

const CATEGORY_LABELS = {
FERTILIZER: "Fertilizante",
PESTICIDE:  "Pesticida",
SEEDS:      "Semillas",
TOOLS:      "Herramientas",
OTHER:      "Otro",
};

const CATEGORY_COLORS = {
FERTILIZER: "bg-[#e9f5e6] text-[#2f7f3c]",
PESTICIDE:  "bg-[#fff4e6] text-[#9f6b3d]",
SEEDS:      "bg-[#f0f4ff] text-[#3d5f9f]",
TOOLS:      "bg-[#f5f0ff] text-[#7b5ea7]",
OTHER:      "bg-[#f0f0f0] text-[#666]",
};

export default function InventoryList() {
const { auth } = useAuth();
const allowEdit = canEdit(auth.role);
const [items, setItems] = useState([]);

useEffect(() => {
	inventoryService.listItems().then((data) => setItems(Array.isArray(data) ? data : (data.content ?? []))).catch(() => {});
}, []);

const lowCount = items.filter((i) => i.quantity <= i.minStock).length;

return (
<div className="space-y-6">
{/* Header */}
<div className="flex flex-wrap items-center justify-between gap-3">
<div>
<h1 className="font-heading text-3xl font-bold text-[#1b4f2f]">Inventario</h1>
{!allowEdit && (
<p className="mt-1 text-xs text-[#9dbaa5]">Solo lectura — no puedes agregar ni editar items</p>
)}
</div>
<div className="flex items-center gap-2">
{lowCount > 0 && (
<span className="rounded-full bg-[#fff4e6] px-3 py-1 text-sm font-bold text-[#9f6b3d]">
{lowCount} con stock bajo
</span>
)}
{allowEdit && (
<button className="rounded-lg bg-[#2f7f3c] px-4 py-2 font-semibold text-white transition hover:bg-[#1b4f2f]">
+ Agregar item
</button>
)}
</div>
</div>

{/* Table */}
{items.length === 0 ? (
<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-10 text-center">
<p className="text-[#666]">No hay items en el inventario</p>
</div>
) : (
<div className="overflow-x-auto rounded-2xl border border-[#e9f5e6] shadow-soft">
<table className="w-full text-sm">
<thead>
<tr className="border-b border-[#e9f5e6] bg-[#f9fcf8]">
<th className="px-5 py-4 text-left font-bold text-[#1b4f2f]">Nombre</th>
<th className="px-5 py-4 text-left font-bold text-[#1b4f2f]">Categoria</th>
<th className="px-5 py-4 text-left font-bold text-[#1b4f2f]">Cantidad</th>
<th className="px-5 py-4 text-left font-bold text-[#1b4f2f]">Stock min.</th>
<th className="px-5 py-4 text-left font-bold text-[#1b4f2f]">Estado</th>
{allowEdit && (
<th className="px-5 py-4 text-left font-bold text-[#1b4f2f]">Acciones</th>
)}
</tr>
</thead>
<tbody>
{items.map((item, idx) => {
const isLow = item.quantity <= item.minStock;
return (
<tr
key={item.id}
className={"border-b border-[#e9f5e6] transition hover:bg-[#f9fcf8] " +
(idx % 2 === 0 ? "bg-white" : "bg-[#fafaf9]")}
>
<td className="px-5 py-4 font-semibold text-[#1b4f2f]">{item.name}</td>
<td className="px-5 py-4">
<span className={"rounded-full px-3 py-1 text-xs font-semibold " +
(CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600")}>
{CATEGORY_LABELS[item.category] ?? item.category}
</span>
</td>
<td className="px-5 py-4 font-semibold text-[#1b4f2f]">
{item.quantity} {item.unit}
</td>
<td className="px-5 py-4 text-[#6b8f72]">
{item.minStock} {item.unit}
</td>
<td className="px-5 py-4">
{isLow ? (
<span className="rounded-full bg-[#fbe8e5] px-3 py-1 text-xs font-bold text-[#b43a2f]">
Stock bajo
</span>
) : (
<span className="rounded-full bg-[#e9f5e6] px-3 py-1 text-xs font-bold text-[#2f7f3c]">
OK
</span>
)}
</td>
{allowEdit && (
<td className="px-5 py-4">
<button className="rounded-lg bg-[#f0f4ff] px-3 py-1.5 text-xs font-semibold text-[#3d5f9f] transition hover:bg-[#dfe8f8]">
Editar
</button>
</td>
)}
</tr>
);
})}
</tbody>
</table>
</div>
)}
</div>
);
}
