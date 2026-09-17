import { useEffect, useState } from 'react'
import axiosClient, { pesanError } from '../api/axiosClient'
import Modal from '../components/Modal'

const kosong = { name: '', description: '' }

export default function Categories() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [buka, setBuka] = useState(false)
  const [sedangEdit, setSedangEdit] = useState(null)
  const [form, setForm] = useState(kosong)
  const [errorForm, setErrorForm] = useState('')
  const [simpan, setSimpan] = useState(false)

  async function muat() {
    setLoading(true)
    setError('')

    try {
      const { data: res } = await axiosClient.get('/categories')
      setData(res.data)
    } catch (err) {
      setError(pesanError(err, 'Gagal memuat data kategori.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    muat()
  }, [])

  function bukaTambah() {
    setSedangEdit(null)
    setForm(kosong)
    setErrorForm('')
    setBuka(true)
  }

  function bukaEdit(kategori) {
    setSedangEdit(kategori)
    setForm({ name: kategori.name, description: kategori.description || '' })
    setErrorForm('')
    setBuka(true)
  }

  async function kirim(e) {
    e.preventDefault()
    setErrorForm('')
    setSimpan(true)

    try {
      if (sedangEdit) {
        await axiosClient.put(`/categories/${sedangEdit.id}`, form)
      } else {
        await axiosClient.post('/categories', form)
      }

      setBuka(false)
      muat()
    } catch (err) {
      setErrorForm(pesanError(err, 'Gagal menyimpan data kategori.'))
    } finally {
      setSimpan(false)
    }
  }

  async function hapus(kategori) {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${kategori.name}"?`)) return

    try {
      await axiosClient.delete(`/categories/${kategori.id}`)
      muat()
    } catch (err) {
      // Server balikin 409 kalau kategorinya masih dipakai barang
      alert(pesanError(err, 'Gagal menghapus data kategori.'))
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-indigo-400 focus:bg-white'

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Kategori</h1>
          <p className="mt-0.5 text-sm text-slate-500">{data.length} kategori terdaftar</p>
        </div>
        <button
          onClick={bukaTambah}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700"
        >
          Tambah kategori
        </button>
      </div>

      {error && <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200/60" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
          Belum ada kategori.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.map((k) => (
            <div key={k.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900">{k.name}</h3>
                  <p className="mt-0.5 text-xs text-slate-400">{k.slug}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                  {k.items_count} barang
                </span>
              </div>

              {k.description && (
                <p className="mt-2.5 text-sm text-slate-500">{k.description}</p>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => bukaEdit(k)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-indigo-300 hover:text-indigo-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => hapus(k)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-rose-300 hover:text-rose-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal judul={sedangEdit ? 'Edit kategori' : 'Tambah kategori'} buka={buka} onTutup={() => setBuka(false)}>
        <form onSubmit={kirim} className="space-y-4">
          <div>
            <label htmlFor="nama-kategori" className="mb-1.5 block text-xs font-medium text-slate-600">Nama</label>
            <input
              id="nama-kategori"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="Misalnya Sembako"
            />
          </div>

          <div>
            <label htmlFor="deskripsi-kategori" className="mb-1.5 block text-xs font-medium text-slate-600">
              Deskripsi <span className="text-slate-400">(opsional)</span>
            </label>
            <textarea
              id="deskripsi-kategori"
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
            />
          </div>

          {errorForm && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{errorForm}</p>}

          <button
            type="submit"
            disabled={simpan}
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white transition-all hover:bg-indigo-700 disabled:opacity-60"
          >
            {simpan ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </Modal>
    </>
  )
}
