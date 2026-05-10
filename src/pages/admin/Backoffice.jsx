import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/user.service";
import { getApiErrorMessage } from "../../services/api";

const ROLES = ["ADMIN", "OPERATOR", "VIEWER"];

const MAIN_SECTIONS = [
  { key: "overview", label: "Dashboard" },
  { key: "users", label: "Usuarios" }
];

const FUTURE_MODULES = [
  { label: "Zonas del invernadero" },
  { label: "Cultivos y estados" },
  { label: "Sensores IoT" },
  { label: "Umbrales y auditoría" },
  { label: "Alertas inteligentes" },
  { label: "Inventario operativo" },
  { label: "Resultados de IA" }
];

const EMPTY_CREATE_FORM = {
  fullName: "",
  email: "",
  password: "",
  role: "VIEWER"
};

function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

function Backoffice() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  const [activeSection, setActiveSection] = useState("overview");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: "", email: "", role: "VIEWER" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingSelectedUser, setLoadingSelectedUser] = useState(false);

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => Number(b.active) - Number(a.active) || a.id - b.id),
    [users]
  );

  const loadUsers = async () => {
    setLoadingUsers(true);
    setError("");
    try {
      const response = await userService.listUsers();
      setUsers(response);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    if (!isStrongPassword(createForm.password)) {
      setSaving(false);
      setError("La contraseña debe tener mínimo 8 caracteres, mayúsculas, minúsculas y números.");
      return;
    }

    try {
      await userService.createUser(createForm);
      setCreateForm(EMPTY_CREATE_FORM);
      await loadUsers();
      setActiveSection("users");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditForm({ fullName: user.fullName, email: user.email, role: user.role });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ fullName: "", email: "", role: "VIEWER" });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    if (Number(editingId) === Number(auth.userId) && editForm.role !== auth.role) {
      setError("No puedes cambiar tu propio rol.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await userService.updateUser(editingId, editForm);
      cancelEdit();
      await loadUsers();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user) => {
    if (Number(user.id) === Number(auth.userId)) {
      setError("No puedes cambiar el estado de tu propia cuenta.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await userService.updateUserStatus(user.id, !user.active);
      await loadUsers();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleViewUser = async (id) => {
    setLoadingSelectedUser(true);
    setError("");
    try {
      const response = await userService.getUser(id);
      setSelectedUser(response);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoadingSelectedUser(false);
    }
  };

  // COLORES
  const colors = isDarkMode ? {
    bg: "#0f1419",
    bgSecondary: "#1a2438",
    bgTertiary: "#252f42",
    border: "#2a3853",
    text: "#dbe4f0",
    textSecondary: "#a9bbd8",
    textTertiary: "#8ba0c3",
    input: "#121a2c",
    hover: "#1a2438",
    accent: "#3a4da8",
    success: "#184f43",
    successText: "#9df2da",
  } : {
    bg: "#f9f7f4",
    bgSecondary: "#ffffff",
    bgTertiary: "#f3efe6",
    border: "#e8ddd0",
    text: "#143321",
    textSecondary: "#4d6b5a",
    textTertiary: "#7a8f80",
    input: "#ffffff",
    hover: "#f3efe6",
    accent: "#2f7f3c",
    success: "#88bf86",
    successText: "#143321",
  };

  return (
    <div className="flex h-screen flex-col" style={{ backgroundColor: colors.bg, color: colors.text }}>
      {/* HEADER */}
      <header className="border-b" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
        <div className="flex items-center justify-between px-8 py-6">
          <h1 className="text-4xl font-bold">Invernadero Inteligente</h1>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold">Hola {auth.email?.split("@")[0]}</p>
              <p className="mt-1 inline-block rounded-lg px-2.5 py-1 text-xs font-bold" 
                 style={{ backgroundColor: colors.accent, color: "white" }}>
                {auth.role}
              </p>
            </div>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-lg p-2 transition hover:opacity-70"
              style={{ backgroundColor: colors.bgTertiary }}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>

            <button
              onClick={() => navigate("/")}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition"
              style={{ backgroundColor: colors.accent }}
            >
              Volver al Home
            </button>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition"
              style={{ backgroundColor: "#b43a2f" }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-56 border-r overflow-y-auto" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
          <div className="p-6">
          </div>

          {/* SECCIONES */}
          <nav className="px-4 pb-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: colors.textTertiary }}>
              Principal
            </p>
            <div className="space-y-2">
              {MAIN_SECTIONS.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className="w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition"
                  style={{
                    backgroundColor: activeSection === section.key ? colors.accent : "transparent",
                    color: activeSection === section.key ? "white" : colors.text,
                  }}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </nav>

          {/* MÓDULOS FUTUROS */}
          <nav className="border-t px-4 py-6" style={{ borderColor: colors.border }}>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: colors.textTertiary }}>
              Próximamente
            </p>
            <div className="space-y-2">
              {FUTURE_MODULES.map((module, idx) => (
                <button
                  key={idx}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg px-4 py-3 text-left text-sm font-semibold transition"
                  style={{ color: colors.textTertiary }}
                >
                  {module.label}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* CONTENIDO */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* DASHBOARD */}
          {activeSection === "overview" && (
            <section className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold">Dashboard</h2>
                <p className="mt-2" style={{ color: colors.textSecondary }}>
                  Monitoreo en tiempo real de sensores y variables ambientales.
                </p>
              </div>

              {/* TARJETAS DE SENSORES */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Sensores Activos</h3>
                  <p className="mb-4 text-sm" style={{ color: colors.textSecondary }}>
                    Nota: estos valores se alimentarán automáticamente cuando lleguen lecturas reales de los sensores.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <article className="rounded-xl border p-6" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
                      <p className="text-xs font-semibold uppercase" style={{ color: colors.textTertiary }}>Temperatura</p>
                      <p className="mt-3 text-4xl font-bold">-- °C</p>
                      <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>Variación 7 días: --</p>
                      <p className="mt-1 text-xs" style={{ color: colors.textTertiary }}>Promedio semanal: --</p>
                      <p className="mt-1 text-xs" style={{ color: colors.textTertiary }}>Rango objetivo (threshold): --</p>
                    </article>

                    <article className="rounded-xl border p-6" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
                      <p className="text-xs font-semibold uppercase" style={{ color: colors.textTertiary }}>Humedad</p>
                      <p className="mt-3 text-4xl font-bold">-- %</p>
                      <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>Variación 7 días: --</p>
                      <p className="mt-1 text-xs" style={{ color: colors.textTertiary }}>Promedio semanal: --</p>
                      <p className="mt-1 text-xs" style={{ color: colors.textTertiary }}>Rango objetivo (threshold): --</p>
                    </article>

                    <article className="rounded-xl border p-6" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
                      <p className="text-xs font-semibold uppercase" style={{ color: colors.textTertiary }}>Humedad del suelo</p>
                      <p className="mt-3 text-4xl font-bold">-- %</p>
                      <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>Variación 7 días: --</p>
                      <p className="mt-1 text-xs" style={{ color: colors.textTertiary }}>Promedio semanal: --</p>
                      <p className="mt-1 text-xs" style={{ color: colors.textTertiary }}>Rango objetivo (threshold): --</p>
                    </article>

                    <article className="rounded-xl border p-6" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
                      <p className="text-xs font-semibold uppercase" style={{ color: colors.textTertiary }}>Nivel de luz</p>
                      <p className="mt-3 text-4xl font-bold">-- lux</p>
                      <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>Variación 7 días: --</p>
                      <p className="mt-1 text-xs" style={{ color: colors.textTertiary }}>Promedio semanal: --</p>
                      <p className="mt-1 text-xs" style={{ color: colors.textTertiary }}>Rango objetivo (threshold): --</p>
                    </article>

                    <article className="rounded-xl border p-6" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
                      <p className="text-xs font-semibold uppercase" style={{ color: colors.textTertiary }}>CO2</p>
                      <p className="mt-3 text-4xl font-bold">-- ppm</p>
                      <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>Variación 7 días: --</p>
                      <p className="mt-1 text-xs" style={{ color: colors.textTertiary }}>Promedio semanal: --</p>
                      <p className="mt-1 text-xs" style={{ color: colors.textTertiary }}>Rango objetivo (threshold): --</p>
                    </article>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">Gráficas (próximamente)</h3>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <article className="rounded-xl border p-5" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
                      <div className="mb-3">
                        <p className="text-xs font-semibold uppercase" style={{ color: colors.textTertiary }}>
                          Tendencia semanal de temperatura
                        </p>
                      </div>
                      <div
                        className="grid h-56 place-items-center rounded-lg border border-dashed"
                        style={{ borderColor: colors.border, backgroundColor: colors.bgTertiary }}
                      >
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          Espacio reservado para gráfica de línea
                        </p>
                      </div>
                    </article>

                    <article className="rounded-xl border p-5" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
                      <div className="mb-3">
                        <p className="text-xs font-semibold uppercase" style={{ color: colors.textTertiary }}>
                          Promedios por día (humedad y CO2)
                        </p>
                      </div>
                      <div
                        className="grid h-56 place-items-center rounded-lg border border-dashed"
                        style={{ borderColor: colors.border, backgroundColor: colors.bgTertiary }}
                      >
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          Espacio reservado para gráfica de barras
                        </p>
                      </div>
                    </article>

                    <article className="rounded-xl border p-5 lg:col-span-2" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
                      <div className="mb-3">
                        <p className="text-xs font-semibold uppercase" style={{ color: colors.textTertiary }}>
                          Comparativa de periodos
                        </p>
                      </div>
                      <div
                        className="grid h-64 place-items-center rounded-lg border border-dashed"
                        style={{ borderColor: colors.border, backgroundColor: colors.bgTertiary }}
                      >
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          Espacio reservado para gráfica combinada (semana vs mes)
                        </p>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* USUARIOS */}
          {activeSection === "users" && (
            <section className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold">Gestión de Usuarios</h2>
                <p className="mt-2" style={{ color: colors.textSecondary }}>
                  Crea, edita y administra usuarios. Controla roles y estados de cuentas.
                </p>
              </div>

              {/* FORMULARIO */}
              <div className="rounded-xl border p-6" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
                <h3 className="mb-4 text-lg font-bold">Crear nuevo usuario</h3>
                <form className="grid gap-3 sm:grid-cols-6" onSubmit={handleCreate}>
                  <input
                    placeholder="Nombre"
                    value={createForm.fullName}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    required
                    className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.input,
                      color: colors.text,
                      focusRingColor: colors.accent,
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.input,
                      color: colors.text,
                    }}
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={createForm.password}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
                    required
                    className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.input,
                      color: colors.text,
                    }}
                  />
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, role: e.target.value }))}
                    className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.input,
                      color: colors.text,
                    }}
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: colors.accent }}
                  >
                    {saving ? "..." : "Crear"}
                  </button>
                </form>
                {error && <p className="mt-3 text-sm font-semibold text-red-500">{error}</p>}
              </div>

              {/* TABLA */}
              {loadingUsers ? (
                <p style={{ color: colors.textSecondary }}>Cargando usuarios...</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border" style={{ borderColor: colors.border }}>
                  <table className="w-full text-sm">
                    <thead style={{ backgroundColor: colors.bgTertiary }}>
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">ID</th>
                        <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                        <th className="px-4 py-3 text-left font-semibold">Email</th>
                        <th className="px-4 py-3 text-left font-semibold">Rol</th>
                        <th className="px-4 py-3 text-left font-semibold">Estado</th>
                        <th className="px-4 py-3 text-left font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedUsers.map((user) => {
                        const isEditing = editingId === user.id;
                        return (
                          <tr
                            key={user.id}
                            style={{ borderTopColor: colors.border, borderTop: `1px solid ${colors.border}` }}
                          >
                            <td className="px-4 py-3">{user.id}</td>
                            <td className="px-4 py-3">
                              {isEditing ? (
                                <input
                                  value={editForm.fullName}
                                  onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
                                  className="w-full rounded-lg border px-2 py-1 text-sm"
                                  style={{
                                    borderColor: colors.border,
                                    backgroundColor: colors.input,
                                    color: colors.text,
                                  }}
                                />
                              ) : (
                                user.fullName
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {isEditing ? (
                                <input
                                  type="email"
                                  value={editForm.email}
                                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                                  className="w-full rounded-lg border px-2 py-1 text-sm"
                                  style={{
                                    borderColor: colors.border,
                                    backgroundColor: colors.input,
                                    color: colors.text,
                                  }}
                                />
                              ) : (
                                user.email
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {isEditing ? (
                                <select
                                  value={editForm.role}
                                  onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
                                  disabled={Number(user.id) === Number(auth.userId)}
                                  className="rounded-lg border px-2 py-1 text-sm"
                                  style={{
                                    borderColor: colors.border,
                                    backgroundColor: colors.input,
                                    color: colors.text,
                                  }}
                                >
                                  {ROLES.map((role) => (
                                    <option key={role} value={role}>
                                      {role}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                user.role
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(user)}
                                disabled={saving || Number(user.id) === Number(auth.userId)}
                                className="rounded-full px-3 py-1 text-xs font-semibold text-white transition"
                                style={{
                                  backgroundColor: user.active ? colors.success : "#b43a2f",
                                  opacity: saving || Number(user.id) === Number(auth.userId) ? 0.5 : 1,
                                  cursor: saving || Number(user.id) === Number(auth.userId) ? "not-allowed" : "pointer",
                                }}
                              >
                                {user.active ? "Activo" : "Inactivo"}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleViewUser(user.id)}
                                  className="rounded-lg px-2 py-1 text-xs font-semibold text-white transition hover:opacity-80"
                                  style={{ backgroundColor: colors.accent }}
                                >
                                  Ver
                                </button>
                                {isEditing ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={handleSaveEdit}
                                      className="rounded-lg px-2 py-1 text-xs font-semibold text-white transition hover:opacity-80"
                                      style={{ backgroundColor: colors.success }}
                                    >
                                      Guardar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={cancelEdit}
                                      className="rounded-lg px-2 py-1 text-xs font-semibold transition"
                                      style={{ backgroundColor: colors.bgTertiary, color: colors.text }}
                                    >
                                      Cancelar
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => startEdit(user)}
                                    className="rounded-lg px-2 py-1 text-xs font-semibold transition"
                                    style={{ backgroundColor: colors.bgTertiary, color: colors.text }}
                                  >
                                    Editar
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* DETALLE */}
              <div className="rounded-xl border p-4" style={{ borderColor: colors.border, backgroundColor: colors.bgSecondary }}>
                <p className="text-xs font-bold uppercase" style={{ color: colors.textTertiary }}>Detalle por ID</p>
                {loadingSelectedUser ? (
                  <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>Consultando...</p>
                ) : selectedUser ? (
                  <div className="mt-3 grid gap-2 text-sm">
                    <p><span style={{ color: colors.textTertiary }}>ID:</span> {selectedUser.id}</p>
                    <p><span style={{ color: colors.textTertiary }}>Nombre:</span> {selectedUser.fullName}</p>
                    <p><span style={{ color: colors.textTertiary }}>Email:</span> {selectedUser.email}</p>
                    <p><span style={{ color: colors.textTertiary }}>Rol:</span> {selectedUser.role}</p>
                    <p><span style={{ color: colors.textTertiary }}>Activo:</span> {selectedUser.active ? "Sí" : "No"}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>Haz clic en "Ver" para consultar detalles</p>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Backoffice;