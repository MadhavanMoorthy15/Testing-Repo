import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../utils/format'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const { allProducts, addToCart, addToWishlist } = useStore()
  const product = allProducts.find((item) => item.id === Number(id))
  const relatedProducts = allProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4)

  return (
    <div className="space-y-10">
      <Link to="/products" className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-card">
        ← Back to products
      </Link>

      <section className="grid gap-8 rounded-[2rem] bg-white p-6 shadow-card lg:grid-cols-[1fr_1fr] lg:p-8">
        <div className="rounded-[2rem] bg-slate-100 p-6">
          <img src={product.image} alt={product.title} className="h-[380px] w-full rounded-[2rem] object-cover" />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">{product.category}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">{product.title}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-500">{product.description}</p>
          <div className="mt-5 flex items-center gap-3 text-sm text-slate-500">
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-bold text-emerald-700">★ {product.rating}</span>
            <span>{product.reviews} verified ratings</span>
            <span>Brand: {product.brand}</span>
          </div>

          <div className="mt-6 flex items-end gap-4">
            <p className="text-4xl font-black text-slate-900">{formatPrice(product.price)}</p>
            <p className="pb-1 text-lg text-slate-400 line-through">{formatPrice(product.mrp)}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => addToCart(product)} className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white">
              Add to Cart
            </button>
            <button onClick={() => addToWishlist(product)} className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-slate-900">
              Save to Wishlist
            </button>
          </div>

          <div className="mt-8 rounded-[2rem] border border-slate-100 bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-900">Highlights</h2>
            <ul className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              {product.specs.map((spec) => (
                <li key={spec} className="rounded-2xl bg-white px-4 py-3">{spec}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">You may also like</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Related recommendations</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  )
}
