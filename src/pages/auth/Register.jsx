import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, User2 } from "lucide-react";
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
									   className="w-full rounded-xl border border-[var(--border)] bg-white px-9 py-2.5 text-[var(--fg)] outline-none focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]"
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
									   className="w-full rounded-xl border border-[var(--border)] bg-white px-9 py-2.5 text-[var(--fg)] outline-none focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]"
						/>
					</div>
				</label>

				   <label className="grid gap-1.5 text-sm font-medium text-[var(--primary)]">
					Contrasena
					<div className="relative">
									   <Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--secondary)]" />
						<input
							name="password"
							type="password"
							required
							value={form.password}
							onChange={onChange}
							placeholder="********"
									   className="w-full rounded-xl border border-[var(--border)] bg-white px-9 py-2.5 text-[var(--fg)] outline-none focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]"
						/>
					</div>
				</label>

				   <label className="grid gap-1.5 text-sm font-medium text-[var(--primary)]">
					Confirmar contrasena
					<div className="relative">
									   <Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--secondary)]" />
						<input
							name="confirmPassword"
							type="password"
							required
							value={form.confirmPassword}
							onChange={onChange}
							placeholder="********"
									   className="w-full rounded-xl border border-[var(--border)] bg-white px-9 py-2.5 text-[var(--fg)] outline-none focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]"
						/>
					</div>
				</label>

				   {error ? <p className="m-0 rounded-xl border border-red-500/30 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

				       <button
					       className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--secondary)] disabled:cursor-not-allowed disabled:opacity-70"
					       type="submit"
					       disabled={loading}
				       >
					       {loading ? "Creando..." : "Crear cuenta"}
				       </button>

				       <p className="m-0 text-center text-sm text-[var(--muted)]">
					       Ya tienes cuenta?{" "}
					       <Link to="/login" className="font-semibold text-[var(--secondary)]">
						       Inicia sesion
					       </Link>
				       </p>
			</motion.form>
		</main>
	);
}

export default Register;
