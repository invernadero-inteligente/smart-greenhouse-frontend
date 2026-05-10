import { useEffect, useMemo, useState } from "react";
import { userService } from "../../services/user.service";
import { getApiErrorMessage } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const ROLES = ["ADMIN", "OPERATOR", "VIEWER"];

const EMPTY_CREATE_FORM = {
  fullName: "",
  email: "",
  password: "",
  role: "VIEWER"
};

function AdminUsers() {
  const { auth } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: "", email: "", role: "VIEWER" });

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => Number(b.active) - Number(a.active) || a.id - b.id),
    [users]
  );

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await userService.listUsers();
      setUsers(response);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await userService.createUser(createForm);
      setCreateForm(EMPTY_CREATE_FORM);
      await loadUsers();
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
    if (!editingId) {
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

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-5 p-6 font-body text-[#143321]">
      <section className="grid w-full gap-5 rounded-3xl border border-[#1b4f2f1f] bg-white/80 p-7 shadow-[0_20px_60px_rgba(20,51,33,0.16)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-500 max-md:rounded-2xl max-md:p-5">
        <header className="flex flex-wrap justify-between gap-3 max-md:flex-col">
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.08em] text-[#4d6b5a]">Panel de administrador</p>
            <h1 className="my-2 font-heading text-4xl leading-tight">Administracion de usuarios</h1>
            <p className="m-0 text-[#4d6b5a]">Sesion activa: {auth.email}</p>
          </div>
        </header>

        <form className="grid grid-cols-1 gap-2.5 md:grid-cols-5 md:items-end" onSubmit={handleCreate}>
          <h2 className="m-0 font-heading text-2xl md:col-span-5">Crear usuario</h2>
          <input
            placeholder="Nombre completo"
            value={createForm.fullName}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, fullName: event.target.value }))}
            required
            className="w-full rounded-xl border border-[#14332133] bg-white px-3 py-2.5 outline-none focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#88bf86]"
          />
          <input
            type="email"
            placeholder="Correo"
            value={createForm.email}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
            required
            className="w-full rounded-xl border border-[#14332133] bg-white px-3 py-2.5 outline-none focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#88bf86]"
          />
          <input
            type="password"
            placeholder="Contrasena"
            value={createForm.password}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
            required
            className="w-full rounded-xl border border-[#14332133] bg-white px-3 py-2.5 outline-none focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#88bf86]"
          />
          <select
            value={createForm.role}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, role: event.target.value }))}
            className="w-full rounded-xl border border-[#14332133] bg-white px-3 py-2.5 outline-none focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#88bf86]"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#2f7f3c] to-[#1b4f2f] px-4 py-2.5 font-bold text-white shadow-[0_8px_24px_rgba(27,79,47,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={saving}
            type="submit"
          >
            {saving ? "Guardando..." : "Crear"}
          </button>
        </form>

        {error ? <p className="m-0 font-semibold text-[#b43a2f]">{error}</p> : null}

        {loading ? (
          <p className="m-0">Cargando usuarios...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-[#1433211a] px-2.5 py-3 text-left font-heading text-xs uppercase tracking-[0.04em] text-[#2d5440]">ID</th>
                  <th className="border-b border-[#1433211a] px-2.5 py-3 text-left font-heading text-xs uppercase tracking-[0.04em] text-[#2d5440]">Nombre</th>
                  <th className="border-b border-[#1433211a] px-2.5 py-3 text-left font-heading text-xs uppercase tracking-[0.04em] text-[#2d5440]">Correo</th>
                  <th className="border-b border-[#1433211a] px-2.5 py-3 text-left font-heading text-xs uppercase tracking-[0.04em] text-[#2d5440]">Rol</th>
                  <th className="border-b border-[#1433211a] px-2.5 py-3 text-left font-heading text-xs uppercase tracking-[0.04em] text-[#2d5440]">Activo</th>
                  <th className="border-b border-[#1433211a] px-2.5 py-3 text-left font-heading text-xs uppercase tracking-[0.04em] text-[#2d5440]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => {
                  const isEditing = editingId === user.id;
                  return (
                    <tr key={user.id}>
                      <td className="border-b border-[#1433211a] px-2.5 py-3 align-middle">{user.id}</td>
                      <td className="border-b border-[#1433211a] px-2.5 py-3 align-middle">
                        {isEditing ? (
                          <input
                            value={editForm.fullName}
                            onChange={(event) =>
                              setEditForm((prev) => ({ ...prev, fullName: event.target.value }))
                            }
                            className="w-full rounded-xl border border-[#14332133] bg-white px-3 py-2.5 outline-none focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#88bf86]"
                          />
                        ) : (
                          user.fullName
                        )}
                      </td>
                      <td className="border-b border-[#1433211a] px-2.5 py-3 align-middle">
                        {isEditing ? (
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(event) =>
                              setEditForm((prev) => ({ ...prev, email: event.target.value }))
                            }
                            className="w-full rounded-xl border border-[#14332133] bg-white px-3 py-2.5 outline-none focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#88bf86]"
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td className="border-b border-[#1433211a] px-2.5 py-3 align-middle">
                        {isEditing ? (
                          <select
                            value={editForm.role}
                            onChange={(event) =>
                              setEditForm((prev) => ({ ...prev, role: event.target.value }))
                            }
                            className="w-full rounded-xl border border-[#14332133] bg-white px-3 py-2.5 outline-none focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#88bf86]"
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
                      <td className="border-b border-[#1433211a] px-2.5 py-3 align-middle">
                        <button
                          className={`rounded-full px-2.5 py-1.5 font-bold ${
                            user.active ? "bg-[#daf3db] text-[#145328]" : "bg-[#f4dbd8] text-[#8c2820]"
                          }`}
                          onClick={() => handleToggleStatus(user)}
                          type="button"
                          disabled={saving}
                        >
                          {user.active ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td className="border-b border-[#1433211a] px-2.5 py-3 align-middle">
                        <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <button
                              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#2f7f3c] to-[#1b4f2f] px-4 py-2.5 font-bold text-white shadow-[0_8px_24px_rgba(27,79,47,0.25)] transition hover:-translate-y-0.5"
                              type="button"
                              onClick={handleSaveEdit}
                            >
                              Guardar
                            </button>
                            <button
                              className="inline-flex items-center justify-center rounded-xl bg-[#edf4ec] px-4 py-2.5 font-bold text-[#204b35] transition hover:-translate-y-0.5"
                              type="button"
                              onClick={cancelEdit}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button
                            className="inline-flex items-center justify-center rounded-xl bg-[#edf4ec] px-4 py-2.5 font-bold text-[#204b35] transition hover:-translate-y-0.5"
                            type="button"
                            onClick={() => startEdit(user)}
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
      </section>
    </main>
  );
}

export default AdminUsers;