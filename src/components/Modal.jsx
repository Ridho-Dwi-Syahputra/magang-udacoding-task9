import { useEffect } from 'react'

export default function Modal({ judul, buka, onTutup, children }) {
  useEffect(() => {
    if (!buka) return

    function tekan(e) {
      if (e.key === 'Escape') onTutup()
    }

    document.addEventListener('keydown', tekan)
    document.body.style.overflow = 'hidden'

    // Cleanup ini yang mastiin listener nggak numpuk tiap modal dibuka tutup
    return () => {
      document.removeEventListener('keydown', tekan)
      document.body.style.overflow = ''
    }
  }, [buka, onTutup])

  if (!buka) return null

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onTutup()}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="font-semibold text-slate-900">{judul}</h2>
          <button
            onClick={onTutup}
            aria-label="Tutup"
            className="rounded-lg p-1 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
