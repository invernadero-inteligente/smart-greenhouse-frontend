
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useZones } from "../../hooks/useZones";
import { useCrops } from "../../hooks/useCrops";
import { useThresholds } from "../../hooks/useThresholds";
import { useAlerts } from "../../hooks/useAlerts";
import * as userService from "../../services/user.service";

const ROLES = ["ADMIN", "MANAGER", "TECHNICIAN", "VIEWER"];

const ROLE_LABELS = {
	ADMIN: "Administrador",
	MANAGER: "Gestor",
	TECHNICIAN: "Técnico",
	VIEWER: "Visualizador",
};

const ROLE_COLORS = {
	ADMIN: "bg-[#fff7e0] text-[#b5a16a]",
	MANAGER: "bg-[#f5f3e7] text-emerald-700",
	TECHNICIAN: "bg-emerald-100 text-emerald-700",
	VIEWER: "bg-[#f5f3e7] text-emerald-700",
};

const STATUS_CROP = {
	ACTIVE: {
		label: "Activo",
		cls: "bg-emerald-100 text-emerald-700",
	},
	HARVEST: {
		label: "Cosechando",
		cls: "bg-[#fff7e0] text-[#b5a16a]",
	},
	FINISHED: {
		label: "Finalizado",
		cls: "bg-[#f5f3e7] text-[#b5a16a]",
	},
};

const SEVERITY_COLORS = {
	CRITICAL: "bg-rose-100 text-rose-700",
	WARNING: "bg-[#fff7e0] text-[#b5a16a]",
	INFO: "bg-sky-100 text-sky-700",
};

const VAR_NAMES = {
	TEMPERATURE: "Temperatura",
	AIR_HUMIDITY: "Humedad aire",
	SOIL_MOISTURE: "Humedad suelo",
	PH: "pH",
	LUMINOSITY: "Luminosidad",
};

const SECTIONS = [
	{ key: "resumen", label: "Resumen general" },
	{ key: "zonas", label: "Zonas" },
	{ key: "cultivos", label: "Cultivos" },
	{ key: "umbrales", label: "Umbrales" },
	{ key: "usuarios", label: "Usuarios" },
];

function Badge({ cls, children }) {
	return (
		<span
			className={
				"rounded-full px-2.5 py-0.5 text-xs font-bold " + cls
			}
		>
			{children}
		</span>
	);
}

function SectionTitle({ title, sub }) {
	return (
		<div>
			<h2 className="font-heading text-2xl font-bold text-emerald-900">
				{title}
			</h2>

			{sub && (
				<p className="mt-1 text-base text-emerald-700/80">
					{sub}
				</p>
			)}
		</div>
	);
}

function StatCard({ label, value, sub, valueColor }) {
	return (
		<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-5">
			<p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700/70">
				{label}
			</p>

			<p
				className={
					"mt-1 font-heading text-3xl font-bold " +
					(valueColor ?? "text-emerald-700")
				}
			>
				{value}
			</p>

			{sub && (
				<p className="mt-0.5 text-xs text-emerald-700/60">
					{sub}
				</p>
			)}
		</div>
	);
}

function Th({ children }) {
	return (
		<th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-emerald-700/70">
			{children}
		</th>
	);
}

function Td({ children, className }) {
	return (
		<td className={"px-4 py-3 text-sm " + (className ?? "")}>
			{children}
		</td>
	);
}

function TableWrap({ children }) {
	return (
		<div className="overflow-x-auto rounded-2xl border border-[#e5e0c3] bg-white/90">
			<table className="w-full">{children}</table>
		</div>
	);
}

function isStrongPassword(pw) {
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw);
}

const EMPTY_FORM = {
	fullName: "",
	email: "",
	password: "",
	role: "VIEWER",
};

export default function Backoffice() {
	const { auth } = useAuth();

	const [active, setActive] = useState("resumen");

	const { zones } = useZones();
	const { crops } = useCrops();

	const zoneIds = zones.map((z) => z.id);

	const { thresholds } = useThresholds(zoneIds);
	const { alerts } = useAlerts();

	const [users, setUsers] = useState([]);
	const [loadingUsers, setLoading] = useState(true);
	const [userError, setUserError] = useState("");
	const [saving, setSaving] = useState(false);

	const [createForm, setCreate] = useState(EMPTY_FORM);

	const [editingId, setEditingId] = useState(null);

	const [editForm, setEditForm] = useState({
		fullName: "",
		email: "",
		role: "VIEWER",
	});

	const sortedUsers = useMemo(
		() =>
			[...users].sort(
				(a, b) =>
					Number(b.active) - Number(a.active) ||
					a.id - b.id
			),
		[users]
	);

	const loadUsers = async () => {
		setLoading(true);
		setUserError("");

		try {
			const res = await userService.listUsers();

			setUsers(
				Array.isArray(res)
					? res
					: (res.content ?? [])
			);
		} catch (err) {
			if (!err.response) {
				setUserError("Sin conexión con el servidor");
			} else {
				setUserError(
					err.message ?? "Error al cargar usuarios"
				);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadUsers();
	}, []);

	const handleCreate = async (e) => {
		e.preventDefault();

		if (!isStrongPassword(createForm.password)) {
			setUserError(
				"Contraseña: mínimo 8 caracteres, mayúsculas, minúsculas y números."
			);

			return;
		}

		setSaving(true);
		setUserError("");

		try {
			await userService.createUser(createForm);

			setCreate(EMPTY_FORM);

			await loadUsers();
		} catch (err) {
			if (!err.response) {
				const newU = {
					...createForm,
					id: Date.now(),
					active: true,
				};

				setUsers((prev) => [...prev, newU]);

				setCreate(EMPTY_FORM);
			} else {
				setUserError(
					err.message ?? "Error al crear usuario"
				);
			}
		} finally {
			setSaving(false);
		}
	};

	const startEdit = (u) => {
		setEditingId(u.id);

		setEditForm({
			fullName: u.fullName,
			email: u.email,
			role: u.role,
		});
	};

	const cancelEdit = () => {
		setEditingId(null);
	};

	const saveEdit = async () => {
		if (
			Number(editingId) === Number(auth.userId) &&
			editForm.role !== auth.role
		) {
			setUserError(
				"No puedes cambiar tu propio rol."
			);

			return;
		}

		setSaving(true);
		setUserError("");

		try {
			await userService.updateUser(
				editingId,
				editForm
			);

			setUsers((prev) =>
				prev.map((u) =>
					u.id === editingId
						? { ...u, ...editForm }
						: u
				)
			);

			cancelEdit();
		} catch (err) {
			if (!err.response) {
				setUsers((prev) =>
					prev.map((u) =>
						u.id === editingId
							? { ...u, ...editForm }
							: u
					)
				);

				cancelEdit();
			} else {
				setUserError(
					err.message ?? "Error al guardar"
				);
			}
		} finally {
			setSaving(false);
		}
	};

	const toggleStatus = async (user) => {
		if (
			Number(user.id) === Number(auth.userId)
		) {
			setUserError(
				"No puedes desactivar tu propia cuenta."
			);

			return;
		}

		setSaving(true);

		try {
			await userService.updateUserStatus(
				user.id,
				!user.active
			);

			setUsers((prev) =>
				prev.map((u) =>
					u.id === user.id
						? {
								...u,
								active: !u.active,
						  }
						: u
				)
			);
		} catch (err) {
			if (!err.response) {
				setUsers((prev) =>
					prev.map((u) =>
						u.id === user.id
							? {
									...u,
									active: !u.active,
							  }
							: u
					)
				);
			} else {
				setUserError(err.message ?? "Error");
			}
		} finally {
			setSaving(false);
		}
	};

	const activeZones = zones.filter(
		(z) => z.isActive ?? z.active
	).length;

	const activeCrops = crops.filter(
		(c) => c.status !== "HARVESTED"
	).length;

	const inp =
		"w-full rounded-lg border border-[#e5e0c3] bg-white px-3 py-2 text-emerald-900 text-sm outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200/40";

	return (
		<div className="space-y-6">

			<div className="flex flex-wrap gap-1 border-b border-[#e5e0c3] pb-1">
				{SECTIONS.map((s) => (
					<button
						key={s.key}
						onClick={() =>
							setActive(s.key)
						}
						className={
							"rounded-lg px-4 py-2 text-sm font-medium transition " +
							(active === s.key
								? "bg-emerald-600 text-white hover:bg-emerald-700"
								: "text-emerald-900 hover:bg-[#f5eedc] hover:text-emerald-700")
						}
					>
						{s.label}
					</button>
				))}
			</div>

			<div className="space-y-6">

				{/* RESUMEN */}
				{active === "resumen" && (
					<>
						<SectionTitle
							title="Resumen general"
							sub="Vista general del sistema de invernadero inteligente"
						/>

						<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
							<StatCard
								label="Zonas activas"
								value={activeZones}
								sub={`${zones.length} zonas registradas`}
							/>

							<StatCard
								label="Cultivos activos"
								value={activeCrops}
								sub={`${crops.length} cultivos totales`}
							/>

							<StatCard
								label="Umbrales"
								value={thresholds.length}
								sub="Configuraciones activas"
							/>

							<StatCard
								label="Usuarios"
								value={users.length}
								sub={`${users.filter((u) => u.active).length} activos`}
							/>
						</div>

						<div className="grid gap-6 lg:grid-cols-2">

							<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-5">
								<h3 className="mb-4 font-heading text-lg font-bold text-emerald-900">
									Estado de zonas
								</h3>

								<div className="space-y-3">
									{zones.length === 0 ? (
										<p className="text-sm text-zinc-500">
											No hay zonas registradas.
										</p>
									) : (
										zones
											.slice(0, 5)
											.map((z) => (
												<div
													key={z.id}
													className="flex items-center justify-between rounded-xl border border-[#ece6c9] px-4 py-3"
												>
													<div>
														<p className="font-semibold text-zinc-900">
															{z.name}
														</p>

														<p className="text-xs text-zinc-500">
															{z.description ||
																"Sin descripción"}
														</p>
													</div>

													<Badge
														cls={
															(z.isActive ??
																z.active)
																? "bg-emerald-100 text-emerald-700"
																: "bg-rose-100 text-rose-700"
														}
													>
														{(z.isActive ??
															z.active)
															? "Activa"
															: "Inactiva"}
													</Badge>
												</div>
											))
									)}
								</div>
							</div>

							<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-5">
								<h3 className="mb-4 font-heading text-lg font-bold text-emerald-900">
									Cultivos recientes
								</h3>

								<div className="space-y-3">
									{crops.length === 0 ? (
										<p className="text-sm text-zinc-500">
											No hay cultivos registrados.
										</p>
									) : (
										crops
											.slice(0, 5)
											.map((c) => {
												const st =
													STATUS_CROP[
														c.status
													] ?? {
														label: c.status,
														cls: "bg-gray-100 text-gray-600",
													};

												return (
													<div
														key={c.id}
														className="flex items-center justify-between rounded-xl border border-[#ece6c9] px-4 py-3"
													>
														<div>
															<p className="font-semibold text-zinc-900">
																{c.name}
															</p>

															<p className="text-xs text-zinc-500">
																{c.variety ||
																	"Sin variedad"}
															</p>
														</div>

														<Badge cls={st.cls}>
															{st.label}
														</Badge>
													</div>
												);
											})
									)}
								</div>
							</div>
						</div>

						<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-5">
							<div className="mb-4 flex items-center justify-between">
								<div>
									<h3 className="font-heading text-lg font-bold text-emerald-900">
										Alertas recientes
									</h3>

									<p className="text-sm text-zinc-500">
										Últimos eventos detectados por el sistema
									</p>
								</div>

								<Badge cls="bg-rose-100 text-rose-700">
									{alerts.length} alertas
								</Badge>
							</div>

							{alerts.length === 0 ? (
								<p className="text-sm text-zinc-500">
									No hay alertas registradas.
								</p>
							) : (
								<div className="space-y-3">
									{alerts
										.slice(0, 6)
										.map((a) => (
											<div
												key={a.id}
												className="flex items-center justify-between rounded-xl border border-[#ece6c9] px-4 py-3"
											>
												<div>
													<p className="font-semibold text-zinc-900">
														{a.title ||
															a.message ||
															"Alerta"}
													</p>

													<p className="text-xs text-zinc-500">
														{a.description ||
															"Evento detectado"}
													</p>
												</div>

												<Badge
													cls={
														SEVERITY_COLORS[
															a.severity
														] ??
														"bg-zinc-100 text-zinc-700"
													}
												>
													{a.severity ||
														"INFO"}
												</Badge>
											</div>
										))}
								</div>
							)}
						</div>
					</>
				)}

				{/* ZONAS */}
				{active === "zonas" && (
					<>
						<SectionTitle
							title="Gestión de zonas"
							sub={`Total: ${zones.length} zonas registradas`}
						/>

						<TableWrap>
							<thead className="border-b border-zinc-200 bg-zinc-50">
								<tr>
									<Th>Nombre</Th>
									<Th>Descripción</Th>
									<Th>Estado</Th>
									<Th>Creada</Th>
								</tr>
							</thead>

							<tbody>
								{zones.map((z, i) => (
									<tr
										key={z.id}
										className={
											"border-b border-zinc-200 " +
											(i % 2 === 0
												? "bg-white"
												: "bg-zinc-50")
										}
									>
										<Td>
											<span className="font-semibold text-zinc-900">
												{z.name}
											</span>
										</Td>

										<Td className="text-zinc-600">
											{z.description}
										</Td>

										<Td>
											<Badge
												cls={
													(z.isActive ??
														z.active)
														? "bg-emerald-100 text-emerald-700"
														: "bg-zinc-100 text-zinc-600"
												}
											>
												{(z.isActive ??
													z.active)
													? "Activa"
													: "Inactiva"}
											</Badge>
										</Td>

										<Td className="text-zinc-500">
											{new Date(
												z.createdAt
											).toLocaleDateString(
												"es"
											)}
										</Td>
									</tr>
								))}
							</tbody>
						</TableWrap>
					</>
				)}
			</div>
		</div>
	);
}
