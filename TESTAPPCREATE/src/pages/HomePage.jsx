import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'
import { useStore } from '../context/StoreContext'

export default function HomePage() {
  const { allProducts } = useStore()
  const featured = allProducts.slice(0, 8)
  const deals = allProducts.slice(8, 16)

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-accent px-6 py-10 text-white sm:px-10 lg:px-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-brand">festive mega sale</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
              Discover daily deals across gadgets, lifestyle and home upgrades.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              Explore a UI-only storefront inspired by popular marketplaces with multiple customer flows,
              admin insights and shopper utilities.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products" className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-slate-900">
                Start Shopping
              </Link>
              <Link to="/admin" className="rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white">
                Open Dashboard
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-slate-200">Categories</p>
              <p className="mt-2 text-3xl font-black">8</p>
              <p className="mt-6 text-sm text-slate-200">Mobiles, laptops, audio, sports and more.</p>
            </div>
            <div className="rounded-3xl bg-white p-5 text-slate-900">
              <p className="text-sm text-slate-500">Mock products</p>
              <p className="mt-2 text-3xl font-black">40</p>
              <p className="mt-6 text-sm text-slate-500">Catalog cards, detail pages, cart and wishlist states.</p>
            </div>
            <div className="rounded-3xl bg-brand p-5 text-slate-900 sm:col-span-2">
              <p className="text-sm font-semibold">Flash Benefit</p>
              <p className="mt-2 text-2xl font-black">Extra mock rewards unlocked on checkout.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Featured"
          title="Trending picks shoppers love"
          description="Hand-picked cards from the catalog to mimic a busy marketplace landing page."
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
        <SectionHeader
          eyebrow="Why ShopNest"
          title="Everything from quick buys to curated collections"
          description="Core shopping journeys are available from a single React application backed by Context API state."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Easy browsing', 'Multi-category listing page with search, filters, badges and sorting.'],
            ['Saved products', 'Wishlist and cart experiences let users store decisions while comparing offers.'],
            ['Admin controls', 'Dashboard widgets showcase storefront metrics, top categories and quick actions.'],
          ].map(([title, description]) => (
            <div key={title} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow="Latest Deals"
          title="Fresh savings across the catalog"
          description="Shop cards rendered with shared reusable components for a consistent UI."
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
