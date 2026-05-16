function UserCard({ user, onEdit, onToggleStatus }) {
	const roleConfig = {
		ADMIN: { bg: "#e9f5e6", text: "#2f7f3c", label: "Administrador" },
		MANAGER: { bg: "#fff4e6", text: "#9f6b3d", label: "Gestor" },
		TECHNICIAN: { bg: "#f0f4ff", text: "#3d5f9f", label: "Técnico" },
		VIEWER: { bg: "#f5f5f5", text: "#666", label: "Visualizador" }
	};

	const config = roleConfig[user.role] || roleConfig.VIEWER;

	return (
		<div className="rounded-2xl border border-[#e9f5e6] bg-white p-6 shadow-soft transition hover:shadow-lg">
			<div className="space-y-3">
				<div>
					<h3 className="font-heading text-lg font-bold text-[#1b4f2f]">
						{user.fullName}
					</h3>
					<p className="text-xs text-[#999]">{user.email}</p>
				</div>

				<div className="flex items-center gap-2">
					<span
						className={`inline-block h-3 w-3 rounded-full ${
							user.active ? "bg-[#2f7f3c]" : "bg-[#999]"
						}`}
					/>
					<span className="text-xs font-semibold text-[#666]">
						{user.active ? "Activo" : "Inactivo"}
					</span>
				</div>

				<div
					className="rounded-lg px-3 py-2 text-xs font-semibold text-center"
					style={{ backgroundColor: config.bg, color: config.text }}
				>
					{config.label}
				</div>
			</div>

			<div className="mt-4 flex gap-2">
				{onEdit && (
					<button
						onClick={() => onEdit(user)}
						className="flex-1 rounded-lg bg-[#2f7f3c] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1b4f2f]"
					>
						Editar
					</button>
				)}
				{onToggleStatus && (
					<button
						onClick={() => onToggleStatus(user.id, !user.active)}
						className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
							user.active
								? "bg-[#fbe8e5] text-[#b43a2f] hover:bg-[#f5d9d5]"
								: "bg-[#e9f5e6] text-[#2f7f3c] hover:bg-[#d0e5c9]"
						}`}
					>
						{user.active ? "Desactivar" : "Activar"}
					</button>
				)}
			</div>
		</div>
	);
}

export default UserCard;
