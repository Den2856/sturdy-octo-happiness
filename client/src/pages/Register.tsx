import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import ThreeBackground from '../components/animations/ThreeBackground'
import GoogleIcon from '/google.svg'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, form, {
        headers: { 'Content-Type': 'application/json' },
      })
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Что-то пошло не так')
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <ThreeBackground className="absolute inset-0 -z-10" density={110} speed={0.007} amplitude={1.4} />
      <div
        className="absolute inset-0 -z-[11] opacity-90"
        style={{
          background:
            'radial-gradient(1200px 800px at 80% -10%, rgba(110,86,207,0.35), transparent 60%), radial-gradient(1000px 600px at 10% 110%, rgba(14,165,233,0.25), transparent 60%), #0B0F15',
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[90vw] sm:max-w-[520px] px-6 sm:px-10 py-8 sm:py-10
                   rounded-2xl border border-outline.default/60 bg-formBlue/80 backdrop-blur
                   shadow-[0_10px_60px_rgba(0,0,0,0.35)]"
      >
        <h2 className="text-[28px] sm:text-[30px] text-foreground-h font-bold mb-6">Create an account</h2>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <label className="block mb-5">
          <span className="text-sm text-foreground-d font-medium">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-2 block w-full rounded-xl bg-[#0F1622] border border-outline.default
                       text-foreground-d placeholder:text-foreground-l px-3 py-2
                       focus:outline-none focus:border-outline.primary focus:ring-4 focus:ring-outline.primary/20 transition"
            placeholder="Иван Иванов"
          />
        </label>

        <label className="block mb-5">
          <span className="text-sm text-foreground-d font-medium">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-2 block w-full rounded-xl bg-[#0F1622] border border-outline.default
                       text-foreground-d placeholder:text-foreground-l px-3 py-2
                       focus:outline-none focus:border-outline.primary focus:ring-4 focus:ring-outline.primary/20 transition"
            placeholder="you@example.com"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm text-foreground-d font-medium">Password</span>
          <div className="relative mt-2">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="block w-full rounded-xl bg-[#0F1622] border border-outline.default
                         text-foreground-d placeholder:text-foreground-l px-3 py-2 pr-10
                         focus:outline-none focus:border-outline.primary focus:ring-4 focus:ring-outline.primary/20 transition"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-d/80 hover:text-foreground-h transition"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide' : 'Show'}
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </label>

        <button
          className="my-6 w-full py-2 bg-btn-default text-foreground-p rounded-lg transition"
          disabled
        >
          <div className="flex justify-center">
            <img src={GoogleIcon} alt="google" className="mr-1" />
            <span>Continue with Google</span>
          </div>
        </button>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl text-foreground-d bg-button.primary hover:bg-button.hover
                     border border-outline.primary/20 shadow-[0_6px_20px_rgba(110,86,207,0.35)]
                     transition-transform duration-200 active:scale-[0.98]"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm text-foreground-l">
          Already have an account?{' '}
          <Link to="/login" className="text-foreground-d underline-offset-4 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
