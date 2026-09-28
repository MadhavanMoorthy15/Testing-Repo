import { Link, NavLink } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-medium ${isActive ? 'bg-slate-900 text-white' : 'text-slate-600'}`
      }
    >
      {children}
    </NavLink>
  )
}

export default function AppLayout({ children }) {
  const { cartCount, wishlistCount, searchText, setSearchText, theme, setTheme } = useStore()

  return (
    <div className={theme === 'dark' ? 'min-h-screen bg-slate-950 text-white' : 'min-h-screen bg-[#f4f7fb] text-slate-900'}>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-accent">
            <span className="rounded-full bg-brand px-3 py-1 text-slate-900">SN</span>
            ShopNest
          </Link>

          <div className="hidden flex-1 items-center gap-3 rounded-full bg-slate-100 px-4 py-3 md:flex">
            <span className="text-slate-400">🔎</span>
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="w-full bg-transparent outline-none"
              placeholder="Search for products, brands and more"
            />
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            <NavItem to="/products">Products</NavItem>
            <NavItem to="/wishlist">Wishlist</NavItem>
            <NavItem to="/cart">Cart</NavItem>
            <NavItem to="/profile">Profile</NavItem>
            <NavItem to="/admin">Admin</NavItem>
          </nav>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>

          <Link to="/wishlist" className="relative rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            Wish
            <span className="ml-2 rounded-full bg-brand px-2 py-1 text-xs text-slate-900">{wishlistCount}</span>
          </Link>
          <Link to="/cart" className="relative rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
            Cart
            <span className="ml-2 rounded-full bg-white px-2 py-1 text-xs text-accent">{cartCount}</span>
          </Link>
        </div>

        <div className="border-t border-slate-200 px-4 py-3 md:hidden">
          <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-3">
            <span className="text-slate-400">🔎</span>
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="w-full bg-transparent outline-none"
              placeholder="Search products"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>

      <footer className="mt-12 bg-slate-900 px-4 py-10 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-semibold text-white">ShopNest</h3>
            <p className="text-sm leading-6 text-slate-400">
              A marketplace demo with curated categories, flash deals and a dashboard for catalog teams.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
              <li><Link to="/profile">My Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white">Customer Promise</h4>
            <p className="text-sm leading-6 text-slate-400">Fast UI, mock catalog, and a layout inspired by large Indian marketplaces.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}