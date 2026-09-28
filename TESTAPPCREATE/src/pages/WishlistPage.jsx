import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'
import { useStore } from '../context/StoreContext'

export default function WishlistPage() {
  const { wishlistItems } = useStore()

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Wishlist"
        title="Save products for later"
        description="A dedicated board for products shoppers want to revisit before buying."
      />

      {wishlistItems.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-card">
          <h3 className="text-2xl font-black text-slate-900">No saved items yet</h3>
          <p className="mt-3 text-sm text-slate-500">Tap the heart on any product card to keep it here.</p>
          <Link to="/products" className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold text-white">
            Explore products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
