function UserCard({ user, onEdit, onToggleStatus }) {
	const roleConfig = {
		ADMIN: { cls: "bg-emerald-500/10 text-emerald-400", label: "Administrador" },
		MANAGER: { cls: "bg-amber-500/10 text-amber-400", label: "Gestor" },
		TECHNICIAN: { cls: "bg-blue-500/10 text-blue-400", label: "Técnico" },
		VIEWER: { cls: "bg-zinc-200 text-zinc-700", label: "Visualizador" },
	};

	const config = roleConfig[user?.role] || roleConfig.VIEWER;

	return (
		<div className="rounded-2xl border border-zinc-300 bg-white p-6 shadow-soft transition hover:shadow-lg">
			<div className="space-y-3">
				<div>
					<h3 className="font-heading text-lg font-bold text-zinc-900">
						{user.fullName}
					</h3>
					<p className="text-xs text-zinc-500">{user.email}</p>
				</div>

				<div className="flex items-center gap-2">
					<span
						className={`inline-block h-3 w-3 rounded-full ${
							user.active ? "bg-emerald-500" : "bg-zinc-500"
						}`}
					/>
					<span className="text-xs font-semibold text-zinc-500">
						{user.active ? "Activo" : "Inactivo"}
					</span>
				</div>

				<div className={"rounded-lg px-3 py-2 text-center text-xs font-semibold " + config.cls}>
					{config.label}
				</div>
			</div>

			<div className="mt-4 flex gap-2">
				{onEdit && (
					<button
						onClick={() => onEdit(user)}
						className="flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
					>
						Editar
					</button>
				)}
				{onToggleStatus && (
					<button
						onClick={() => onToggleStatus(user.id, !user.active)}
						className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
							user.active
								? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
								: "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
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
