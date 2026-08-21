import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const kosong = { name: '', email: '', password: '', password_confirmation: '' }

export default function Register() {
  const { register, token } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(kosong)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (token) return <Navigate to="/items" replace />

  function ubah(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submit(e) {
    e.preventDefault()
    setError('')

    // Dicek di sini juga biar user nggak perlu nunggu round trip ke server
    if (form.password !== form.password_confirmation) {
      setError('Konfirmasi password nggak sama.')
      return
    }

    setLoading(true)
    const hasil = await register(form)
    setLoading(false)

    if (!hasil.ok) {
      setError(hasil.pesan)
      return
    }

    navigate('/items', { replace: true })
  }

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-indigo-400 focus:bg-white'

  return (
    <div className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Daftar akun</h1>
          <p className="mt-1 text-sm text-slate-500">Sekali daftar, langsung bisa masuk.</p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-slate-600">Nama</label>
            <input id="name" name="name" value={form.name} onChange={ubah} className={inputClass} />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-600">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={ubah} className={inputClass} />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-600">
              Password <span className="text-slate-400">(min 8 karakter)</span>
            </label>
            <input id="password" name="password" type="password" value={form.password} onChange={ubah} className={inputClass} />
          </div>

          <div>
            <label htmlFor="password_confirmation" className="mb-1.5 block text-xs font-medium text-slate-600">Ulangi password</label>
            <input id="password_confirmation" name="password_confirmation" type="password" value={form.password_confirmation} onChange={ubah} className={inputClass} />
          </div>

          {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>

          <p className="text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:underline">
              Masuk
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
