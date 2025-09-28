import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { adminMe, adminLogout } from "../auth";

export default function Layout() {
  const [me, setMe] = useState<{ email: string; name?: string } | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    adminMe().then(setMe).catch(() => nav("/login", { replace: true }));
  }, [nav]);

  if (!me) return null;

  const linkCls = ({ isActive }: any) =>
    `block rounded-lg px-3 py-2 ${isActive ? "bg-emerald-100 text-emerald-900" : "hover:bg-white/5"}`;

  return (
    <div className="min-h-screen bg-[#0D1217] text-white grid grid-cols-[220px_1fr]">
      <aside className="border-r border-white/10 p-4">
        <Link to="/" className="block mb-6 text-xl font-semibold">admin<span className="text-emerald-400">.panel</span></Link>
        <nav className="space-y-1">
          <NavLink to="/movies" className={linkCls}>Movies</NavLink>
          <NavLink to="/theaters" className={linkCls}>Theaters</NavLink>
          <NavLink to="/users" className={linkCls}>Users</NavLink>
          <NavLink to="/orders" className={linkCls}>Orders</NavLink>
        </nav>
      </aside>

      <div className="p-6">
        <header className="mb-6 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm opacity-80">{me.email}</span>
            <button
              onClick={() => { adminLogout(); nav("/login", { replace: true }); }}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:brightness-110"
            >
              Logout
            </button>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
