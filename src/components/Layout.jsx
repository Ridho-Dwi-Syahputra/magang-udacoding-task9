import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Box, Grid, LogOut } from 'lucide-react'

const menu = [
  { label: 'Barang', path: '/items', icon: Box },
  { label: 'Kategori', path: '/categories', icon: Grid },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function keluar() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center px-6">
          <Link to="/items" className="text-xl font-bold tracking-tight text-indigo-600">
            Inventaris
          </Link>
        </div>

        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-4 py-4">
          <nav className="space-y-1">
            {menu.map((m) => {
              const Icon = m.icon
              return (
                <NavLink
                  key={m.path}
                  to={m.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {m.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-8 border-t border-slate-200 pt-4">
            <div className="mb-4 px-3">
              <p className="text-sm font-semibold text-slate-900">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@inventaris.test'}</p>
            </div>
            <button
              onClick={keluar}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
            >
              <LogOut className="h-5 w-5" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
