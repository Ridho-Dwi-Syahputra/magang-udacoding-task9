import { createContext, useContext, useEffect, useState } from 'react'
import axiosClient, { TOKEN_KEY, pesanError } from '../api/axiosClient'

const AuthContext = createContext(null)

const USER_KEY = 'inventaris-user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const simpanan = localStorage.getItem(USER_KEY)
    return simpanan ? JSON.parse(simpanan) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [cekSelesai, setCekSelesai] = useState(false)

  // Token di localStorage bisa aja sudah dicabut dari sisi server.
  // Jadi waktu aplikasi dibuka, tokennya diverifikasi dulu sebelum dipercaya.
  useEffect(() => {
    if (!token) {
      setCekSelesai(true)
      return
    }

    axiosClient
      .get('/me')
      .then(({ data }) => {
        setUser(data.user)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      })
      .catch((error) => {
        // Cuma bersihin sesi kalau server EMANG bilang tokennya nggak valid.
        // Kalau gagalnya gara-gara jaringan/timeout (server lagi lambat atau
        // sempat nggak nyala), sesi lokal dibiarin -- request halaman berikutnya
        // masih boleh dicoba, bukan langsung dianggap harus login ulang.
        if (error.response?.status === 401) bersihkan()
      })
      .finally(() => setCekSelesai(true))
    // Sengaja cuma jalan sekali waktu aplikasi dibuka
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function simpanSesi(data) {
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }

  function bersihkan() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }

  async function login(email, password) {
    try {
      const { data } = await axiosClient.post('/login', { email, password })
      simpanSesi(data)
      return { ok: true }
    } catch (error) {
      return { ok: false, pesan: pesanError(error, 'Login gagal.') }
    }
  }

  async function register(form) {
    try {
      const { data } = await axiosClient.post('/register', form)
      simpanSesi(data)
      return { ok: true }
    } catch (error) {
      return { ok: false, pesan: pesanError(error, 'Registrasi gagal.') }
    }
  }

  async function logout() {
    try {
      await axiosClient.post('/logout')
    } catch {
      // Token bisa aja sudah nggak valid di server. Sesi lokal tetap dibersihin.
    }
    bersihkan()
  }

  return (
    <AuthContext.Provider value={{ user, token, cekSelesai, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}
