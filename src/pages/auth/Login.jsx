import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../services/api";

function Login() {
	const navigate = useNavigate();
	const { login, loading } = useAuth();

	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

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
		<main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_20%_15%,#ffffff_0%,transparent_35%),linear-gradient(145deg,#f3efe6,#dbecd7)] p-6 font-body text-[#143321]">
			<form
				className="grid w-full max-w-xl gap-3.5 rounded-3xl border border-[#1b4f2f1f] bg-white/80 p-8 shadow-[0_20px_60px_rgba(20,51,33,0.16)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-500 max-md:rounded-2xl max-md:p-6"
				onSubmit={onSubmit}
			>
				<h1 className="my-1 font-heading text-4xl leading-tight">Login</h1>
				<p className="m-0 text-[#4d6b5a]">Accede con tus credenciales del backend.</p>

				<label className="grid gap-1.5 font-semibold text-[#2c4f3d]">
					Correo
					<input
						name="email"
						type="email"
						required
						value={form.email}
						onChange={onChange}
						placeholder="admin@invernadero.com"
						className="w-full rounded-xl border border-[#14332133] bg-white px-3 py-2.5 outline-none focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#88bf86]"
					/>
				</label>

				<label className="grid gap-1.5 font-semibold text-[#2c4f3d]">
					Contrasena
					<input
						name="password"
						type="password"
						required
						value={form.password}
						onChange={onChange}
						placeholder="********"
						className="w-full rounded-xl border border-[#14332133] bg-white px-3 py-2.5 outline-none focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#88bf86]"
					/>
				</label>

				{error ? <p className="m-0 font-semibold text-[#b43a2f]">{error}</p> : null}

				<button
					className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#2f7f3c] to-[#1b4f2f] px-4 py-2.5 font-bold text-white shadow-[0_8px_24px_rgba(27,79,47,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
					type="submit"
					disabled={loading}
				>
					{loading ? "Ingresando..." : "Entrar"}
				</button>

				<p className="m-0 text-center text-[#4d6b5a]">
					No tienes cuenta?{" "}
					<Link to="/register" className="font-bold text-[#1b4f2f]">
						Registrate
					</Link>
				</p>
			</form>
		</main>
	);
}

export default Login;
