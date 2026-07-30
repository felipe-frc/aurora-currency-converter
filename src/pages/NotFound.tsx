import { useLanguage } from "@/contexts/useLanguage";
import { Link } from "wouter";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="text-center">
        <h1 className="mb-3 text-4xl font-bold">404</h1>
        <p className="mb-6 text-slate-300">{t("notFoundMessage")}</p>
        <Link href="/" className="text-cyan-400 hover:text-cyan-300">
          {t("backToHome")}
        </Link>
      </div>
    </div>
  );
}
