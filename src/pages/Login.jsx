import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: 'admin@inventaris.test', password: 'password123' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Sudah punya token tapi buka halaman login, langsung lempar ke dalam
  if (token) return <Navigate to="/items" replace />

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const hasil = await login(form.email, form.password)
    setLoading(false)

    if (!hasil.ok) {
      setError(hasil.pesan)
      return
    }

    navigate(location.state?.dari || '/items', { replace: true })
  }

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-indigo-400 focus:bg-white'

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Inventaris</h1>
          <p className="mt-1 text-sm text-slate-500">Masuk buat ngelola stok barang.</p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-600">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          <p className="text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:underline">
              Daftar
            </Link>
          </p>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Akun demo sudah terisi otomatis di form ini.
        </p>
      </div>
    </div>
  )
}
