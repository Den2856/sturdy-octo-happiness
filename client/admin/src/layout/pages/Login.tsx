import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../auth";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("saakand88@gmail.com");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await adminLogin(email, password);
      nav("/", { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#0D1217] text-white p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-black/20 backdrop-blur rounded-2xl p-6 shadow-xl">
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
        {err && <div className="mb-3 text-red-400 text-sm">{err}</div>}
        <label className="block text-sm mb-1">Email</label>
        <input className="w-full mb-3 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <label className="block text-sm mb-1">Password</label>
        <input type="password"
               className="w-full mb-4 rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
               value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 py-2 font-semibold">Login now</button>
      </form>
    </div>
  );
}
