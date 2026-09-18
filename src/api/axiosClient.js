import axios from 'axios'

export const TOKEN_KEY = 'inventaris-token'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  // Backend gratis (Render dkk) bisa "tidur" dan butuh puluhan detik buat
  // bangun pas request pertama. Tanpa timeout, request nyangkut tanpa batas
  // kalau server-nya beneran nggak nyala -- 30 detik cukup buat nutup cold
  // start yang wajar, tapi tetap kasih kepastian kalau server memang mati.
  timeout: 30_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Token dibaca ulang tiap request, bukan dipasang sekali waktu file ini di-import.
// Kalau dipasang sekali, token hasil login baru nggak ikut sampai halamannya di-refresh.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token kedaluwarsa atau sudah dicabut dari sisi server.
    // Dibersihin di sini sekali, jadi tiap halaman nggak perlu ngecek sendiri.
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

// Laravel balikin error validasi dalam bentuk { message, errors: { field: [pesan] } }.
// Fungsi ini yang bikin komponen cukup nampilin satu string.
export function pesanError(error, fallback = 'Terjadi kesalahan sistem, silakan coba beberapa saat lagi.') {
  const data = error.response?.data

  if (data?.errors) return Object.values(data.errors).flat().join(' ')
  if (data?.message) return data.message
  if (error.code === 'ERR_NETWORK') return 'Gagal terhubung ke server. Pastikan koneksi dan server backend sedang aktif.'
  if (error.code === 'ECONNABORTED') return 'Server kelamaan merespons. Kalau backend-nya baru "bangun tidur" (misal Render gratis), coba lagi sebentar.'

  return fallback
}

export default axiosClient
