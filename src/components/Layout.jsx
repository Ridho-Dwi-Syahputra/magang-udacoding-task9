import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Box, Grid, LogOut, Menu, X } from 'lucide-react'

const menu = [
  { label: 'Barang', path: '/items', icon: Box },
  { label: 'Kategori', path: '/categories', icon: Grid },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [bukaSidebar, setBukaSidebar] = useState(false)

  async function keluar() {
    await logout()
    navigate('/login', { replace: true })
  }

  // Sidebar drawer-nya ditutup otomatis tiap ganti halaman, biar nggak nutupin konten di HP
  function tutupSidebarLaluNavigasi() {
    setBukaSidebar(false)
  }

  const isiSidebar = (
    <>
      <div className="flex h-16 items-center justify-between px-6">
        <Link to="/items" className="text-xl font-bold tracking-tight text-indigo-600">
          Inventaris
        </Link>
        <button
          onClick={() => setBukaSidebar(false)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
          aria-label="Tutup menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-y-auto px-4 py-4">
        <nav className="space-y-1">
          {menu.map((m) => {
            const Icon = m.icon
            return (
              <NavLink
                key={m.path}
                to={m.path}
                onClick={tutupSidebarLaluNavigasi}
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
    </>
  )

  const labelHalaman = menu.find((m) => m.path === location.pathname)?.label || 'Inventaris'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar -- selalu tampil di layar lg ke atas, jadi drawer di layar kecil */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        {isiSidebar}
      </aside>

      {bukaSidebar && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setBukaSidebar(false)}
            aria-hidden="true"
          />
          <aside className="relative flex h-full w-64 max-w-[80vw] flex-col bg-white shadow-xl">
            {isiSidebar}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar -- cuma tampil di layar kecil, buat buka drawer */}
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setBukaSidebar(true)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-slate-900">{labelHalaman}</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
