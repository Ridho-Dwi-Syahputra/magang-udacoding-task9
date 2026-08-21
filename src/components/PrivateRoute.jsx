import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { token, cekSelesai } = useAuth()
  const location = useLocation()

  // Tanpa penantian ini, halaman sempat kelihatan lompat ke login
  // waktu refresh, padahal tokennya valid dan lagi diverifikasi.
  if (!cekSelesai) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
          Mengecek sesi...
        </div>
      </div>
    )
  }

  // state.dari dipakai biar setelah login user balik ke halaman yang tadi dituju
  if (!token) return <Navigate to="/login" state={{ dari: location.pathname }} replace />

  return children
}
