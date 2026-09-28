import { useMemo, useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../utils/format'

export default function CheckoutPage() {
  const { cartItems, grandTotal, user } = useStore()
  const [form, setForm] = useState({
    fullName: user.name,
    phone: '',
    address: '',
    city: user.city,
    postalCode: '',
    payment: 'upi',
  })

  const eta = useMemo(() => {
    const today = new Date()
    today.setDate(today.getDate() + 4)
    return today.toDateString()
  }, [])

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Checkout"
        title="Finish your purchase"
        description="Collect address details, review items and place a UI-only mock order."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              ['fullName', 'Full Name'],
              ['phone', 'Phone Number'],
              ['city', 'City'],
              ['postalCode', 'Postal Code'],
            ].map(([name, label]) => (
              <label key={name} className="space-y-2 text-sm font-semibold text-slate-700">
                <span>{label}</span>
                <input
                  value={form[name]}
                  onChange={(event) => setForm({ ...form, [name]: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </label>
            ))}
            <label className="space-y-2 text-sm font-semibold text-slate-700 sm:col-span-2">
              <span>Delivery Address</span>
              <textarea
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
                className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
                placeholder="Apartment, street, landmark"
              />
            </label>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-slate-900">Payment Method</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                ['upi', 'UPI'],
                ['card', 'Credit / Debit Card'],
                ['cod', 'Cash on Delivery'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setForm({ ...form, payment: value })}
                  className={`rounded-3xl border px-4 py-4 text-left text-sm font-semibold ${
                    form.payment === value ? 'border-accent bg-blue-50 text-accent' : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button className="mt-8 rounded-full bg-brand px-8 py-4 text-sm font-black text-slate-900">
            Place Order
          </button>
        </section>

        <aside className="space-y-5">
          <div className="rounded-[2rem] bg-white p-6 shadow-card">
            <h3 className="text-xl font-black text-slate-900">Order Review</h3>
            <div className="mt-5 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.title} className="h-16 w-16 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-card">
            <p className="text-sm text-slate-300">Estimated delivery</p>
            <p className="mt-2 text-xl font-black">{eta}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-slate-300">Payable total</span>
              <span className="text-3xl font-black">{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
