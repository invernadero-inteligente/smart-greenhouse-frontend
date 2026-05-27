import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../services/api";


function Login() {
const navigate = useNavigate();
const { login, loading } = useAuth();


const [form, setForm] = useState({ email: "", password: "" });
const [error, setError] = useState("");
const [showPassword, setShowPassword] = useState(false);

const onChange = (event) => {
setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
};

const onSubmit = async (event) => {
event.preventDefault();
setError("");

try {
const auth = await login(form);
if (auth.role === "ADMIN") {
navigate("/backoffice");
return;
}
navigate("/panel");
} catch (requestError) {
setError(getApiErrorMessage(requestError));
}
};

return (
<main className="grid min-h-screen place-items-center bg-[#f5f3e7] p-6 text-emerald-900">
<div className="pointer-events-none absolute inset-0" />
<motion.form
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}
className="relative grid w-full max-w-xl gap-4 rounded-3xl border border-[#e5e0c3] bg-white/90 p-8 shadow-sm max-md:rounded-2xl max-md:p-6"
onSubmit={onSubmit}
>
<div>
<p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Acceso seguro</p>
<h1 className="mt-1 text-4xl font-semibold leading-tight text-emerald-900">Login</h1>
<p className="mt-2 text-sm text-emerald-700/70">Ingresa con tus credenciales para acceder al control center.</p>
</div>

<label className="grid gap-1.5 text-sm font-medium text-emerald-900">
Correo
<div className="relative">
<Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--secondary)]" />
<input
	name="email"
	type="email"
	required
	value={form.email}
	onChange={onChange}
	placeholder="admin1@invernadero.com"
	className="w-full rounded-xl border bg-white px-9 py-2.5 text-emerald-900 outline-none focus:ring-2"
	style={{ borderColor: '#0e544b', '--tw-ring-color': '#0e544b' }}
/>
</div>
</label>


<label className="grid gap-1.5 text-sm font-medium text-emerald-900">
	Contrasena
	<div className="relative">
		<Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--secondary)]" />
		<input
			name="password"
			type={showPassword ? "text" : "password"}
			required
			value={form.password}
			onChange={onChange}
			placeholder="********"
			className="w-full rounded-xl border bg-white px-9 py-2.5 text-emerald-900 outline-none focus:ring-2 pr-10"
			style={{ borderColor: '#0e544b', '--tw-ring-color': '#0e544b' }}
		/>
		<button
			type="button"
			aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
			onClick={() => setShowPassword((v) => !v)}
			className="absolute right-2 top-2.5 p-1 text-[var(--secondary)] focus:outline-none"
			tabIndex={-1}
		>
			{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
		</button>
	</div>
</label>

{error ? <p className="m-0 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p> : null}


<p className="m-0 text-center text-sm text-emerald-700/70">
  No tienes cuenta?{" "}
  <Link
    to="/register"
    className="font-semibold text-[#0e544b] hover:underline"
  >
    Regístrate
  </Link>
</p>

<button
  className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 w-full mt-2"
  style={{ background: '#0e544b' }}
  type="submit"
  disabled={loading}
  onMouseOver={e => e.currentTarget.style.background = '#09332e'}
  onMouseOut={e => e.currentTarget.style.background = '#0e544b'}
>
  {loading ? "Ingresando..." : "Entrar"}
</button>

</motion.form>
</main>
);
}

export default Login;
