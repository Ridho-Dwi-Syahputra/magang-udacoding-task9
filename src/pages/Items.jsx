import { useCallback, useEffect, useState } from 'react'
import { Box, Plus, Search, Edit2, Trash2 } from 'lucide-react'
import axiosClient, { pesanError } from '../api/axiosClient'
import Modal from '../components/Modal'

const kosong = { category_id: '', name: '', description: '', stock: 0, price: 0 }

function rupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(angka || 0)
}

export default function Items() {
  const [items, setItems] = useState([])
  const [kategori, setKategori] = useState([])
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [cari, setCari] = useState('')
  const [filterKategori, setFilterKategori] = useState('')
  const [halaman, setHalaman] = useState(1)

  const [buka, setBuka] = useState(false)
  const [sedangEdit, setSedangEdit] = useState(null)
  const [form, setForm] = useState(kosong)
  const [errorForm, setErrorForm] = useState('')
  const [simpan, setSimpan] = useState(false)

  const muat = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const { data } = await axiosClient.get('/items', {
        params: {
          q: cari || undefined,
          category_id: filterKategori || undefined,
          page: halaman,
          per_page: 10,
        },
      })
      setItems(data.data)
      setMeta(data.meta)
    } catch (err) {
      setError(pesanError(err, 'Gagal memuat data barang.'))
    } finally {
      setLoading(false)
    }
  }, [cari, filterKategori, halaman])

  // Search di-debounce 400ms, kalau enggak tiap huruf yang diketik jadi satu request
  useEffect(() => {
    const timer = setTimeout(muat, 400)
    return () => clearTimeout(timer)
  }, [muat])

  useEffect(() => {
    axiosClient
      .get('/categories')
      .then(({ data }) => setKategori(data.data))
      .catch(() => setKategori([]))
  }, [])

  function bukaTambah() {
    setSedangEdit(null)
    setForm({ ...kosong, category_id: kategori[0]?.id || '' })
    setErrorForm('')
    setBuka(true)
  }

  function bukaEdit(item) {
    setSedangEdit(item)
    setForm({
      category_id: item.category_id,
      name: item.name,
      description: item.description || '',
      stock: item.stock,
      price: item.price,
    })
    setErrorForm('')
    setBuka(true)
  }

  async function kirim(e) {
    e.preventDefault()
    setErrorForm('')
    setSimpan(true)

    const payload = {
      ...form,
      category_id: form.category_id,
      stock: Number(form.stock),
      price: Number(form.price),
    }

    try {
      if (sedangEdit) {
        await axiosClient.put(`/items/${sedangEdit.id}`, payload)
      } else {
        await axiosClient.post('/items', payload)
      }

      setBuka(false)
      muat()
    } catch (err) {
      setErrorForm(pesanError(err, 'Gagal menyimpan data barang.'))
    } finally {
      setSimpan(false)
    }
  }

  async function hapus(item) {
    if (!confirm(`Apakah Anda yakin ingin menghapus barang "${item.name}" dari sistem?`)) return

    try {
      await axiosClient.delete(`/items/${item.id}`)
      muat()
    } catch (err) {
      alert(pesanError(err, 'Gagal menghapus data barang.'))
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-indigo-400 focus:bg-white'

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Box className="h-5 w-5 text-indigo-600" />
            Daftar Barang
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">{meta.total} barang terdaftar</p>
        </div>
        <button
          onClick={bukaTambah}
          disabled={kategori.length === 0}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Tambah barang
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={cari}
            onChange={(e) => {
              setCari(e.target.value)
              setHalaman(1)
            }}
            placeholder="Cari nama barang..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-400"
          />
        </div>
        <select
          value={filterKategori}
          onChange={(e) => {
            setFilterKategori(e.target.value)
            setHalaman(1)
          }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-400"
        >
          <option value="">Semua kategori</option>
          {kategori.map((k) => (
            <option key={k.id} value={k.id}>
              {k.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-200/60" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-400">
            Nggak ada barang yang cocok sama pencarian ini.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs tracking-wide text-slate-500 uppercase">
                  <th className="px-5 py-3 font-medium">Barang</th>
                  <th className="px-5 py-3 font-medium">Kategori</th>
                  <th className="px-5 py-3 text-right font-medium">Stok</th>
                  <th className="px-5 py-3 text-right font-medium">Harga</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50 transition-all hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-900">{item.name}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{item.category?.name}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          item.stock < 10 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium whitespace-nowrap text-slate-900">
                      {rupiah(item.price)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => bukaEdit(item)}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => hapus(item)}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-all hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {meta.last_page > 1 && (
        <div className="mt-5 flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-500">
            Halaman {meta.current_page} dari {meta.last_page}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setHalaman((h) => h - 1)}
              disabled={meta.current_page <= 1}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 font-medium text-slate-600 transition-all hover:border-indigo-300 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setHalaman((h) => h + 1)}
              disabled={meta.current_page >= meta.last_page}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 font-medium text-slate-600 transition-all hover:border-indigo-300 disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      <Modal judul={sedangEdit ? 'Edit barang' : 'Tambah barang'} buka={buka} onTutup={() => setBuka(false)}>
        <form onSubmit={kirim} className="space-y-4">
          <div>
            <label htmlFor="kategori-barang" className="mb-1.5 block text-xs font-medium text-slate-600">Kategori</label>
            <select
              id="kategori-barang"
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className={inputClass}
            >
              {kategori.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="nama-barang" className="mb-1.5 block text-xs font-medium text-slate-600">Nama barang</label>
            <input
              id="nama-barang"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="stok-barang" className="mb-1.5 block text-xs font-medium text-slate-600">Stok</label>
              <input
                id="stok-barang"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="harga-barang" className="mb-1.5 block text-xs font-medium text-slate-600">Harga</label>
              <input
                id="harga-barang"
                type="number"
                min="0"
                step="500"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputClass}
              />
            </div>
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
