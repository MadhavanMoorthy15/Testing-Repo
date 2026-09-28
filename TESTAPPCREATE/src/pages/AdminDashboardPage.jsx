import SectionHeader from '../components/SectionHeader'
import { useStore } from '../context/StoreContext'
import { categories } from '../utils/format'

export default function AdminDashboardPage() {
  const { allProducts, cartItems, wishlistItems } = useStore()
  const lowStock = allProducts.filter((product) => product.stock <= 8)
  const totalValue = allProducts.reduce((sum, product) => sum + product.price * product.stock, 0)
  const categoryCounts = categories.map((category) => ({
    category,
    count: allProducts.filter((product) => product.category === category).length,
  }))
  const maxCategoryCount = Math.max(...categoryCounts.map((item) => item.count), 1)

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Admin"
        title="Storefront control center"
        description="A snapshot dashboard for merchandising, inventory and merchandising campaigns."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total products', allProducts.length, 'Catalog items available in the storefront UI'],
          ['Low stock alerts', lowStock.length, 'Items running below the preferred inventory threshold'],
          ['Cart activity', cartItems.length, 'Products currently added by the active shopper'],
          ['Wishlist saves', wishlistItems.length, 'Saved items that may convert during remarketing'],
        ].map(([label, value, description]) => (
          <div key={label} className="rounded-[2rem] bg-white p-6 shadow-card">
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-3 text-4xl font-black text-slate-900">{value}</p>
            <p className="mt-4 text-sm leading-6 text-slate-500">{description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] bg-white p-6 shadow-card">
          <h3 className="text-xl font-black text-slate-900">Inventory Watchlist</h3>
          <div className="mt-5 overflow-hidden rounded-3xl border border-slate-100">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              <span>Product</span>
              <span>Category</span>
              <span>Stock</span>
              <span>Price</span>
            </div>
            <div className="divide-y divide-slate-100">
              {lowStock.map((product) => (
                <div key={product.id} className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-3 px-4 py-4 text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{product.title}</span>
                  <span>{product.category}</span>
                  <span className="font-bold text-rose-500">{product.stock}</span>
                  <span>₹{product.price.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-card">
            <p className="text-sm text-slate-300">Inventory value</p>
            <p className="mt-3 text-4xl font-black">₹{totalValue.toLocaleString('en-IN')}</p>
            <p className="mt-4 text-sm leading-6 text-slate-300">Calculated from mock stock counts and current selling prices.</p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-card">
            <h3 className="text-xl font-black text-slate-900">Category Coverage</h3>
            <div className="mt-5 space-y-4">
              {categoryCounts.map(({ category, count }) => (
                <div key={category}>
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span>{category}</span>
                    <span>{count} items</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
