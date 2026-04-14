import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">404</h1>
        <p className="text-slate-300 mb-6">Página não encontrada.</p>
        <Link href="/" className="text-cyan-400 hover:text-cyan-300">
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}