import ReportForm from './ReportForm';

export default function Reports() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-5xl mb-10 rounded-[2rem] bg-[#f7f2df] border border-[var(--border)] px-10 py-7 flex flex-col md:flex-row md:items-center md:justify-between shadow-sm">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--primary)] mb-2 tracking-tight">Control de reportes</h1>
                    <p className="text-[var(--muted)] text-lg md:text-xl">Genera y descarga reportes institucionales en PDF según los filtros y módulos disponibles.</p>
                </div>
            </div>
            <ReportForm />
        </div>
    );
}