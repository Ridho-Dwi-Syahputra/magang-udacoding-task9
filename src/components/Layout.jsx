import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const menu = [
  { label: 'Barang', path: '/items' },
  { label: 'Kategori', path: '/categories' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function keluar() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-6">
            <Link to="/items" className="font-bold text-slate-900">
              Inventaris
            </Link>
            <nav className="flex gap-1">
              {menu.map((m) => (
                <NavLink
                  key={m.path}
                  to={m.path}
                  className={({ isActive }) =>
                    `rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                      isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'
                    }`
                  }
                >
                  {m.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline">{user?.name}</span>
            <button
              onClick={keluar}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 transition-all hover:border-rose-300 hover:text-rose-600"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-7">
        <Outlet />
      </main>
    </div>
  )
}
