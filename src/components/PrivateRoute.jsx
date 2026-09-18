import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { token, cekSelesai } = useAuth()
  const location = useLocation()
  const [lama, setLama] = useState(false)

  // Kalau verifikasi lebih dari 4 detik, kasih tau kemungkinan penyebabnya --
  // biar nggak kelihatan kayak macet/ngambang tanpa keterangan pas backend-nya
  // (misal Render gratis) lagi "bangun tidur".
  useEffect(() => {
    if (cekSelesai) return
    const timer = setTimeout(() => setLama(true), 4000)
    return () => clearTimeout(timer)
  }, [cekSelesai])

  // Tanpa penantian ini, halaman sempat kelihatan lompat ke login
  // waktu refresh, padahal tokennya valid dan lagi diverifikasi.
  if (!cekSelesai) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="flex flex-col items-center gap-3 text-center text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
            Memverifikasi sesi...
          </div>
          {lama && (
            <p className="max-w-xs text-xs text-slate-400">
              Kelamaan? Server backend-nya mungkin baru "bangun tidur" (khususnya kalau pakai hosting gratis kayak Render), bisa sampai semenit pas pertama kali diakses.
            </p>
          )}
        </div>
      </div>
    )
  }

  // state.dari dipakai biar setelah login user balik ke halaman yang tadi dituju
  if (!token) return <Navigate to="/login" state={{ dari: location.pathname }} replace />

  return children
}
