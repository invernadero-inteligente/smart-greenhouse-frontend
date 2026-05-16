import { useState } from "react";

function InventoryList() {
	const [items, setItems] = useState([
		{
			id: 1,
			name: "Fertilizante NPK",
			category: "FERTILIZER",
			quantity: 25.5,
			unit: "kg",
			minStock: 50,
			updatedAt: new Date()
		},
		{
			id: 2,
			name: "Pesticida Orgánico",
			category: "PESTICIDE",
			quantity: 120,
			unit: "L",
			minStock: 100,
			updatedAt: new Date(Date.now() - 86400000)
		},
		{
			id: 3,
			name: "Semillas de Tomate",
			category: "SEEDS",
			quantity: 500,
			unit: "ud",
			minStock: 200,
			updatedAt: new Date(Date.now() - 172800000)
		}
	]);

	const categoryLabels = {
		FERTILIZER: "Fertilizante",
		PESTICIDE: "Pesticida",
		SEEDS: "Semillas",
		TOOLS: "Herramientas",
		OTHER: "Otro"
	};

	const isLowStock = (item) => item.quantity <= item.minStock;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="font-heading text-3xl font-bold text-[#1b4f2f]">
					Inventario
				</h1>
				<button className="rounded-lg bg-[#2f7f3c] px-4 py-2 font-semibold text-white transition hover:bg-[#1b4f2f]">
					+ Agregar Item
				</button>
			</div>

			{items.length === 0 ? (
				<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-8 text-center">
					<p className="text-[#666]">No hay items en el inventario</p>
				</div>
			) : (
				<div className="overflow-x-auto rounded-2xl border border-[#e9f5e6] shadow-soft">
					<table className="w-full">
						<thead>
							<tr className="border-b border-[#e9f5e6] bg-[#f9fcf8]">
								<th className="px-6 py-4 text-left text-sm font-bold text-[#1b4f2f]">
									Nombre
								</th>
								<th className="px-6 py-4 text-left text-sm font-bold text-[#1b4f2f]">
									Categoría
								</th>
								<th className="px-6 py-4 text-left text-sm font-bold text-[#1b4f2f]">
									Cantidad
								</th>
								<th className="px-6 py-4 text-left text-sm font-bold text-[#1b4f2f]">
									Mínimo Stock
								</th>
								<th className="px-6 py-4 text-left text-sm font-bold text-[#1b4f2f]">
									Estado
								</th>
								<th className="px-6 py-4 text-left text-sm font-bold text-[#1b4f2f]">
									Acciones
								</th>
							</tr>
						</thead>
						<tbody>
							{items.map((item, idx) => (
								<tr
									key={item.id}
									className={`border-b border-[#e9f5e6] transition hover:bg-[#f9fcf8] ${
										idx % 2 === 0 ? "bg-white" : "bg-[#fafaf9]"
									}`}
								>
									<td className="px-6 py-4">
										<p className="font-semibold text-[#1b4f2f]">{item.name}</p>
									</td>
									<td className="px-6 py-4">
										<span className="inline-block rounded-full bg-[#e9f5e6] px-3 py-1 text-xs font-semibold text-[#2f7f3c]">
											{categoryLabels[item.category]}
										</span>
									</td>
									<td className="px-6 py-4">
										<p className="font-semibold text-[#1b4f2f]">
											{item.quantity} {item.unit}
										</p>
									</td>
									<td className="px-6 py-4">
										<p className="text-sm text-[#666]">
											{item.minStock} {item.unit}
										</p>
									</td>
									<td className="px-6 py-4">
										{isLowStock(item) ? (
											<span className="inline-block rounded-full bg-[#fbe8e5] px-3 py-1 text-xs font-bold text-[#b43a2f]">
												⚠️ Stock bajo
											</span>
										) : (
											<span className="inline-block rounded-full bg-[#e9f5e6] px-3 py-1 text-xs font-bold text-[#2f7f3c]">
												✓ Ok
											</span>
										)}
									</td>
									<td className="px-6 py-4">
										<button className="rounded-lg bg-[#f0f4ff] px-3 py-1 text-xs font-semibold text-[#3d5f9f] transition hover:bg-[#dfe8f8]">
											Editar
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default InventoryList;
