import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-[2rem] bg-white p-10 text-center shadow-card">
      <p className="text-sm font-bold uppercase tracking-[0.4em] text-accent">404</p>
      <h1 className="mt-4 text-4xl font-black text-slate-900">Page not found</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
        The page you are looking for is unavailable in this storefront preview.
      </p>
      <Link to="/" className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white">
        Return home
      </Link>
    </div>
  )
}
