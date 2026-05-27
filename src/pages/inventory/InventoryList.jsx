import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { canEdit } from "../../utils/permissions";
import { inventoryService } from "../../services/inventory.service";

const CATEGORIES = ["SEEDS", "FERTILIZER", "PESTICIDE", "TOOLS", "OTHER"];

const CATEGORY_LABELS = {
    FERTILIZER: "Fertilizante",
    PESTICIDE:  "Pesticida",
    SEEDS:      "Semillas",
    TOOLS:      "Herramientas",
    OTHER:      "Otro",
};

const CATEGORY_COLORS = {
    FERTILIZER: "bg-primary-100 text-primary-700",
    PESTICIDE:  "bg-amber-100 text-amber-700",
    SEEDS:      "bg-[#EFE7D7] text-primary-700",
    TOOLS:      "bg-[#FAF7F2] text-primary-700",
    OTHER:      "bg-[#F6F1E8] text-primary-700",
};

const EMPTY_FORM = { name: "", category: "SEEDS", quantity: "", unit: "", minStock: "" };

function InventoryModal({ item, onClose, onSave }) {
    const [form, setForm] = useState(item
        ? { name: item.name, category: item.category, quantity: item.quantity, unit: item.unit, minStock: item.minStock }
        : EMPTY_FORM
    );
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setSaving(true);
        try {
            const payload = {
                name: form.name.trim(),
                category: form.category,
                quantity: parseFloat(form.quantity),
                unit: form.unit.trim(),
                minStock: form.minStock !== "" ? parseFloat(form.minStock) : 0,
            };
            await onSave(payload);
            onClose();
        } catch (err) {
            setFormError(err?.response?.data?.message || err.message || "Error al guardar");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/10 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-heading text-xl font-bold text-primary-700">
                        {item ? "Editar ítem" : "Nuevo ítem"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-primary-600 hover:bg-[#F6F1E8]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {formError && (
                    <div className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                        {formError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-primary-900">Nombre</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-[#e5e0c3] bg-white px-3 py-2 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-200/40"
                            placeholder="Ej: Abono NPK"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-primary-900">Categoría</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-[#e5e0c3] bg-white px-3 py-2 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-200/40"
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-primary-900">Cantidad</label>
                            <input
                                name="quantity"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.quantity}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-[#e5e0c3] bg-white px-3 py-2 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-primary-900">Unidad</label>
                            <input
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-[#e5e0c3] bg-white px-3 py-2 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                                placeholder="Ej: kg, L, unidades"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-primary-900">Stock mínimo</label>
                        <input
                            name="minStock"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.minStock}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-[#e5e0c3] bg-white px-3 py-2 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                            placeholder="0"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-[#e5e0c3] px-4 py-2 text-sm font-semibold text-primary-900 hover:bg-[#f5f3e7]"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-primary-400 disabled:opacity-60"
                        >
                            {saving ? "Guardando..." : item ? "Guardar cambios" : "Agregar ítem"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function InventoryList() {
    const { auth } = useAuth();
    const allowEdit = canEdit(auth.role);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [lowStockFilter, setLowStockFilter] = useState(false);
    const [modal, setModal] = useState(null); // null | { mode: "create" } | { mode: "edit", item }
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const filters = {};
            if (categoryFilter) filters.category = categoryFilter;
            if (lowStockFilter) filters.lowStock = true;
            const data = await inventoryService.listItems(filters);
            const list = data?.data ?? (Array.isArray(data) ? data : []);
            setItems(list);
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Error al cargar inventario");
        } finally {
            setLoading(false);
        }
    }, [categoryFilter, lowStockFilter]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const filtered = items.filter((item) => {
        if (!search) return true;
        return item.name?.toLowerCase().includes(search.toLowerCase());
    });

    const lowCount = items.filter((i) => i.lowStock).length;

    const handleCreate = async (payload) => {
        await inventoryService.createItem(payload);
        await fetchItems();
    };

    const handleEdit = async (payload) => {
        await inventoryService.updateItem(modal.item.id, payload);
        await fetchItems();
    };

    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            await inventoryService.deleteItem(id);
            setDeleteConfirm(null);
            await fetchItems();
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Error al eliminar");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6 rounded-3xl border border-[#e5e0c3] bg-white/90 p-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e5e0c3] bg-[#f5f3e7] px-5 py-4">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-primary-900">Inventario</h1>
                    <p className="mt-1 text-sm text-primary-700/60">Control de insumos con foco en mínimos y reposición.</p>
                    {!allowEdit && (
                        <p className="mt-1 text-xs text-primary-700/60">Solo lectura</p>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {lowCount > 0 && (
                        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-bold text-amber-400">
                            {lowCount} con stock bajo
                        </span>
                    )}
                    {allowEdit && (
                        <button
                            onClick={() => setModal({ mode: "create" })}
                            className="rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-400"
                        >
                            + Agregar ítem
                        </button>
                    )}
                </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-3 rounded-2xl border border-[#e5e0c3] bg-white/90 p-3">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded-xl border border-[#e5e0c3] bg-white px-3 py-2.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-xl border border-[#e5e0c3] bg-white px-3 py-2.5 text-sm text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                >
                    <option value="">Todas las categorías</option>
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                    ))}
                </select>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#e5e0c3] bg-white px-3 py-2.5 text-sm font-medium text-primary-900">
                    <input
                        type="checkbox"
                        checked={lowStockFilter}
                        onChange={(e) => setLowStockFilter(e.target.checked)}
                        className="accent-primary-500"
                    />
                    Solo stock bajo
                </label>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* Tabla */}
            {loading ? (
                <div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-10 text-center">
                    <p className="text-sm text-primary-700/60">Cargando inventario...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-10 text-center">
                    <p className="font-heading text-lg font-semibold text-primary-900">No hay ítems</p>
                    <p className="mt-1 text-sm text-primary-700/60">
                        {search || categoryFilter || lowStockFilter
                            ? "Prueba cambiando los filtros"
                            : "Comienza agregando el primer ítem al inventario"}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-[#e5e0c3] bg-white/90">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#e9f5e6] bg-[#f9fcf8]">
                                <th className="px-5 py-4 text-left font-bold text-[#1b4f2f]">Nombre</th>
                                <th className="px-5 py-4 text-left font-bold text-[#1b4f2f]">Categoría</th>
                                <th className="px-5 py-4 text-left font-bold text-[#1b4f2f]">Cantidad</th>
                                <th className="px-5 py-4 text-left font-bold text-[#1b4f2f]">Stock mín.</th>
                                <th className="px-5 py-4 text-left font-bold text-[#1b4f2f]">Estado</th>
                                <th className="px-5 py-4 text-left font-bold text-[#1b4f2f]">Última actualización</th>
                                {allowEdit && (
                                    <th className="px-5 py-4 text-left font-bold text-[#1b4f2f]">Acciones</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item, idx) => (
                                <tr
                                    key={item.id}
                                    className={
                                        "border-b border-[#e9f5e6] transition hover:bg-[#f9fcf8] " +
                                        (idx % 2 === 0 ? "bg-white" : "bg-[#fafaf9]")
                                    }
                                >
                                    <td className="px-5 py-4 font-semibold text-[#1b4f2f]">{item.name}</td>
                                    <td className="px-5 py-4">
                                        <span className={
                                            "rounded-full px-3 py-1 text-xs font-semibold " +
                                            (CATEGORY_COLORS[item.category] ?? "bg-[#f5f3e7] text-primary-700")
                                        }>
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
                                        {item.lowStock ? (
                                            <span className="rounded-full bg-[#fbe8e5] px-3 py-1 text-xs font-bold text-[#b43a2f]">
                                                Stock bajo
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-[#e9f5e6] px-3 py-1 text-xs font-bold text-[#2f7f3c]">
                                                OK
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-xs text-[#9dbaa5]">
                                        {item.updatedAt
                                            ? new Date(item.updatedAt).toLocaleString("es", { dateStyle: "short", timeStyle: "short" })
                                            : "-"}
                                    </td>
                                    {allowEdit && (
                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setModal({ mode: "edit", item })}
                                                    className="rounded-lg bg-[#f0f4ff] px-3 py-1.5 text-xs font-semibold text-[#3d5f9f] transition hover:bg-[#dfe8f8]"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(item)}
                                                    className="rounded-lg bg-[#fbe8e5] px-3 py-1.5 text-xs font-semibold text-[#b43a2f] transition hover:bg-[#f5cece]"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal crear/editar */}
            {modal && (
                <InventoryModal
                    item={modal.mode === "edit" ? modal.item : null}
                    onClose={() => setModal(null)}
                    onSave={modal.mode === "edit" ? handleEdit : handleCreate}
                />
            )}

            {/* Confirmación eliminar */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/10 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6">
                        <h2 className="font-heading text-lg font-bold text-primary-900">Eliminar ítem</h2>
                        <p className="mt-2 text-sm text-primary-700/60">
                            ¿Estás seguro que deseas eliminar <strong className="text-primary-900">{deleteConfirm.name}</strong>? Esta acción no se puede deshacer.
                        </p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="rounded-lg border border-[#e5e0c3] px-4 py-2 text-sm font-semibold text-primary-900 hover:bg-[#f5f3e7]"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm.id)}
                                disabled={deleting}
                                className="rounded-lg bg-[#b43a2f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#922e25] disabled:opacity-60"
                            >
                                {deleting ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}