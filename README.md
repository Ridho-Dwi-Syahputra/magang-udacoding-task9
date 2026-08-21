# Inventaris Client - React + Laravel API

Task 9 magang Udacoding Batch 21. Frontend React yang nyambung ke API Laravel dari Task 8. Login pakai token Sanctum, halaman data dikunci, CRUD kategori dan barang lewat UI.

## Stack

| Bagian | Dipakai |
|---|---|
| Build tool | Vite 8 |
| UI | React 18 |
| Routing | React Router v6 |
| HTTP | Axios |
| Styling | Tailwind CSS v4 |

## Jalanin

API Task 8 harus hidup duluan:

```bash
cd "../Task 8"
php artisan serve
```

Baru client-nya:

```bash
npm install
cp .env.example .env
npm run dev
```

Buka `http://localhost:5173`.

Port 5173 sengaja dikunci di `vite.config.js`, soalnya alamat itu yang diizinkan di `config/cors.php` sisi Laravel. Kalau port-nya beda, request-nya bakal ditolak browser.

Akun demo sudah keisi otomatis di form login:

```
email    : admin@inventaris.test
password : password123
```

## Struktur

```
src/
├── api/
│   └── axiosClient.js      instance axios + interceptor token
├── context/
│   └── AuthContext.jsx     state user, login, register, logout
├── components/
│   ├── PrivateRoute.jsx    penjaga halaman
│   ├── Layout.jsx          navbar dan tombol keluar
│   └── Modal.jsx           dipakai form kategori dan barang
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Items.jsx           tabel barang, search, filter, paginasi, CRUD
│   └── Categories.jsx      kartu kategori, CRUD
└── App.jsx                 routing
```

## Alur autentikasi

1. Login sukses, server balikin token.
2. Token disimpan di `localStorage` dengan key `inventaris-token`.
3. Interceptor request Axios nyisipin `Authorization: Bearer <token>` ke tiap request.
4. Waktu aplikasi dibuka lagi, token diverifikasi ke `GET /api/me`. Kalau ditolak, sesi lokalnya dibersihin.
5. Interceptor response nangkap status 401. Token dihapus dan user dilempar ke halaman login.

Poin 4 itu yang bikin sesi nggak "ngambang". Token di localStorage bisa aja sudah dicabut dari sisi server, dan tanpa verifikasi awal aplikasi bakal nampilin halaman dalam dulu, baru error waktu narik data.

## Fitur halaman Barang

- Tabel dengan nama, SKU, kategori, stok, harga
- Search nama atau SKU, di-debounce 400ms
- Filter per kategori
- Paginasi, 10 baris per halaman
- Stok di bawah 10 dikasih badge merah
- Tambah, edit, hapus lewat modal

## Fitur halaman Kategori

- Kartu kategori dengan jumlah barang di dalamnya
- Tambah, edit, hapus
- Hapus kategori yang masih dipakai barang bakal ditolak server dengan status 409, dan pesannya ditampilkan apa adanya

## Catatan teknis

Token dibaca ulang di dalam interceptor tiap request, bukan dipasang sekali di header default waktu file di-import. Kalau dipasang sekali, token hasil login baru nggak akan kepakai sampai halamannya di-refresh.

Fungsi `pesanError` di [src/api/axiosClient.js](src/api/axiosClient.js) yang nerjemahin format error Laravel (`{ message, errors: { field: [...] } }`) jadi satu string. Jadi tiap halaman nggak perlu ngulang logika yang sama.

`PrivateRoute` dipasang sekali di route induk, bukan dibungkus per halaman. Nambah halaman baru cukup naruh `<Route>` di dalam grup itu.

---

Ridho Dwi Syahputra, Web Developer Intern Udacoding Batch 21
