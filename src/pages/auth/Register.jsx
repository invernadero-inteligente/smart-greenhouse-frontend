import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, User2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../services/api";

const INITIAL_FORM = {
	fullName: "",
	email: "",
	password: "",
	confirmPassword: ""
};

function Register() {
	const navigate = useNavigate();
	const { register, loading } = useAuth();

	const [form, setForm] = useState(INITIAL_FORM);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const onChange = (event) => {
		setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setError("");

		if (form.password !== form.confirmPassword) {
			setError("La confirmacion de contrasena no coincide.");
			return;
		}

		try {
			const auth = await register(form);
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
		       <main className="grid min-h-screen place-items-center bg-[var(--bg)] p-6 text-[var(--fg)]">
			       <motion.form
				       initial={{ opacity: 0, y: 16 }}
				       animate={{ opacity: 1, y: 0 }}
				       transition={{ duration: 0.3 }}
				       className="relative grid w-full max-w-xl gap-4 rounded-3xl border border-[var(--border)] bg-white p-8 max-md:rounded-2xl max-md:p-6"
				       onSubmit={onSubmit}
			       >
				<div>
							   <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary)]">Nuevo operador</p>
							   <h1 className="mt-1 text-4xl font-semibold leading-tight">Registro</h1>
							   <p className="mt-2 text-sm text-[var(--muted)]">Crea una cuenta conectada al backend.</p>
				</div>

				   <label className="grid gap-1.5 text-sm font-medium text-[var(--primary)]">
					Nombre completo
					<div className="relative">
									   <User2 className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--secondary)]" />
						<input
							name="fullName"
							type="text"
							required
							value={form.fullName}
							onChange={onChange}
							placeholder="Ana Perez"
							className="w-full rounded-xl border bg-white px-9 py-2.5 text-[var(--fg)] outline-none focus:ring-2"
							style={{ borderColor: '#0e544b', '--tw-ring-color': '#0e544b' }}
						/>
					</div>
				</label>

				   <label className="grid gap-1.5 text-sm font-medium text-[var(--primary)]">
					Correo
					<div className="relative">
									   <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--secondary)]" />
						<input
							name="email"
							type="email"
							required
							value={form.email}
							onChange={onChange}
							placeholder="ana@invernadero.com"
							className="w-full rounded-xl border bg-white px-9 py-2.5 text-[var(--fg)] outline-none focus:ring-2"
							style={{ borderColor: '#0e544b', '--tw-ring-color': '#0e544b' }}
						/>
					</div>
				</label>

				   <label className="grid gap-1.5 text-sm font-medium text-[var(--primary)]">
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
							className="w-full rounded-xl border bg-white px-9 py-2.5 text-[var(--fg)] outline-none focus:ring-2 pr-10"
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

				   <label className="grid gap-1.5 text-sm font-medium text-[var(--primary)]">
					Confirmar contrasena
					<div className="relative">
						<Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--secondary)]" />
						<input
							name="confirmPassword"
							type={showConfirmPassword ? "text" : "password"}
							required
							value={form.confirmPassword}
							onChange={onChange}
							placeholder="********"
							className="w-full rounded-xl border bg-white px-9 py-2.5 text-[var(--fg)] outline-none focus:ring-2 pr-10"
							style={{ borderColor: '#0e544b', '--tw-ring-color': '#0e544b' }}
						/>
						<button
							type="button"
							aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
							onClick={() => setShowConfirmPassword((v) => !v)}
							className="absolute right-2 top-2.5 p-1 text-[var(--secondary)] focus:outline-none"
							tabIndex={-1}
						>
							{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
					</div>
				   </label>

				   {error ? <p className="m-0 rounded-xl border border-red-500/30 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

					       <button
						       className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
						       style={{ background: '#0e544b' }}
						       type="submit"
						       disabled={loading}
						       onMouseOver={e => e.currentTarget.style.background = '#09332e'}
						       onMouseOut={e => e.currentTarget.style.background = '#0e544b'}
					       >
						       {loading ? "Creando..." : "Crear cuenta"}
					       </button>

				       <p className="m-0 text-center text-sm text-[var(--muted)]">
					       Ya tienes cuenta?{" "}
						       <Link
							       to="/login"
							       className="font-semibold text-white px-3 py-1 rounded-xl transition"
							       style={{ background: '#0e544b' }}
							       onMouseOver={e => e.currentTarget.style.background = '#09332e'}
							       onMouseOut={e => e.currentTarget.style.background = '#0e544b'}
						       >
							       Inicia sesion
						       </Link>
				       </p>
			</motion.form>
		</main>
	);
}

export default Register;
