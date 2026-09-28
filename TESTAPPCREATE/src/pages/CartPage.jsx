import { Link } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../utils/format'

export default function CartPage() {
  const { cartItems, updateCartQuantity, removeFromCart, cartSubtotal, deliveryFee, tax, grandTotal } = useStore()

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Cart"
        title="Review the items in your bag"
        description="Adjust quantities, compare prices and continue to the mock checkout flow."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          {cartItems.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-10 text-center shadow-card">
              <h3 className="text-2xl font-black text-slate-900">Your cart is feeling lonely</h3>
              <p className="mt-3 text-sm text-slate-500">Add a few items from the catalog to see shipping totals and offers.</p>
              <Link to="/products" className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold text-white">
                Browse products
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <article key={item.id} className="grid gap-4 rounded-[2rem] bg-white p-5 shadow-card sm:grid-cols-[150px_1fr]">
                <img src={item.image} alt={item.title} className="h-36 w-full rounded-[1.5rem] object-cover" />
                <div className="flex flex-col justify-between gap-5">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{item.category}</p>
                        <h3 className="mt-2 text-xl font-bold text-slate-900">{item.title}</h3>
                      </div>
                      <p className="text-2xl font-black text-slate-900">{formatPrice(item.price)}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{item.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 rounded-full bg-slate-100 px-3 py-2">
                      <button onClick={() => updateCartQuantity(item.id, 'decrease')} className="h-9 w-9 rounded-full bg-white text-lg font-bold text-slate-700">-</button>
                      <span className="min-w-10 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, 'increase')} className="h-9 w-9 rounded-full bg-white text-lg font-bold text-slate-700">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-sm font-semibold text-rose-500">
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-card">
          <h3 className="text-xl font-black text-slate-900">Price Summary</h3>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery</span>
              <span className="font-semibold text-slate-900">{formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax</span>
              <span className="font-semibold text-slate-900">{formatPrice(tax)}</span>
            </div>
          </div>
          <div className="mt-6 rounded-3xl bg-slate-900 px-5 py-4 text-white">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Estimated Total</span>
              <span className="text-2xl font-black">{formatPrice(grandTotal)}</span>
            </div>
          </div>
          <Link to="/checkout" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-4 text-sm font-black text-slate-900">
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </div>
  )
}
