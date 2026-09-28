import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../utils/format'

export default function ProductCard({ product }) {
  const { addToCart, addToWishlist, isInWishlist } = useStore()

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-card transition hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden bg-slate-100 p-4">
        <img
          src={product.thumbnail || product.image}
          alt={product.title}
          className="h-full w-full rounded-2xl object-cover transition duration-300 group-hover:scale-105"
        />
        <button
          onClick={() => addToWishlist(product)}
          className={`absolute right-6 top-6 rounded-full px-3 py-2 text-sm font-semibold ${
            isInWishlist(product.id) ? 'bg-rose-500 text-white' : 'bg-white text-slate-800'
          }`}
        >
          ♥
        </button>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-brand/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-800">
            {product.category}
          </span>
          <span className="text-xs font-semibold text-emerald-600">{product.badge}</span>
        </div>

        <Link to={`/products/${product.id}`} className="block text-lg font-semibold text-slate-900 transition hover:text-accent">
          {product.title}
        </Link>

        <p className="line-clamp-2 text-sm leading-6 text-slate-500">{product.description}</p>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">★ {product.rating}</span>
          <span>({product.reviews} reviews)</span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-slate-900">{formatPrice(product.price)}</p>
            <p className="text-sm text-slate-400 line-through">{formatPrice(product.mrp)}</p>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}
