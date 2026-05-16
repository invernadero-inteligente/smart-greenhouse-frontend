import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { canOperate } from "../../utils/permissions";
import { actuatorService } from "../../services/actuator.service";

export default function ActuatorsList() {
const { auth } = useAuth();
const allowOperate = canOperate(auth.role);
const [actuators, setActuators] = useState([]);

useEffect(() => {
	actuatorService.listActuators().then((data) => setActuators(Array.isArray(data) ? data : (data.content ?? []))).catch(() => {});
}, []);

const toggle = (id) =>
setActuators((prev) =>
prev.map((a) =>
a.id === id
? { ...a, currentAction: a.currentAction === "ON" ? "OFF" : "ON", lastUpdate: new Date() }
: a
)
);

const active = actuators.filter((a) => a.currentAction === "ON").length;

return (
<div className="space-y-6">
{/* Header */}
<div className="flex flex-wrap items-center justify-between gap-3">
<div>
<h1 className="font-heading text-3xl font-bold text-[#1b4f2f]">
Control de actuadores
</h1>
{!allowOperate && (
<p className="mt-1 text-xs text-[#9dbaa5]">Solo lectura — no puedes controlar actuadores</p>
)}
</div>
<span className="rounded-full bg-[#e9f5e6] px-3 py-1 text-sm font-bold text-[#2f7f3c]">
{active} / {actuators.length} activos
</span>
</div>

{/* Grid */}
{actuators.length === 0 ? (
<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-10 text-center">
<p className="text-[#666]">No hay actuadores configurados</p>
</div>
) : (
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
{actuators.map((a) => {
const isOn = a.currentAction === "ON";
return (
<div
key={a.id}
className="flex flex-col gap-4 rounded-2xl border border-[#e9f5e6] bg-white p-6"
>
<div>
<h3 className="font-heading text-lg font-bold text-[#1b4f2f]">
{a.name}
</h3>
<p className="mt-1 text-xs text-[#9dbaa5]">{a.zone}</p>
</div>

<div className="flex items-center justify-between rounded-xl bg-[#f4f7f4] px-4 py-3">
<span className="text-sm text-[#6b8f72]">Estado</span>
<span
className={"flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-bold " +
(isOn ? "bg-[#e9f5e6] text-[#2f7f3c]" : "bg-[#f0f0f0] text-[#999]")}
>
<span className={"h-2 w-2 rounded-full " + (isOn ? "bg-[#2f7f3c]" : "bg-[#ccc]")} />
{isOn ? "Encendido" : "Apagado"}
</span>
</div>

<p className="text-xs text-[#9dbaa5]">
Actualizado: {a.lastUpdate instanceof Date
? a.lastUpdate.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })
: new Date(a.lastUpdate).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
</p>

{allowOperate ? (
<button
onClick={() => toggle(a.id)}
className={"w-full rounded-xl py-2.5 font-semibold text-white transition " +
(isOn
? "bg-[#b43a2f] hover:bg-[#8a2817]"
: "bg-[#2f7f3c] hover:bg-[#1b4f2f]")}
>
{isOn ? "Apagar" : "Encender"}
</button>
) : (
<div className="rounded-xl bg-[#f4f7f4] py-2.5 text-center text-sm text-[#9dbaa5]">
Sin permiso de control
</div>
)}
</div>
);
})}
</div>
)}
</div>
);
}
