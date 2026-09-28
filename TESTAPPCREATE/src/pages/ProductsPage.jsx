import { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import SectionHeader from '../components/SectionHeader'
import { useStore } from '../context/StoreContext'
import { categories } from '../utils/format'

const pageSize = 8

export default function ProductsPage() {
  const { allProducts, searchText } = useStore()
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [page, setPage] = useState(1)

  const filteredProducts = useMemo(() => {
    let nextProducts = [...allProducts]

    if (activeCategory !== 'All') {
      nextProducts = nextProducts.filter((product) => product.category === activeCategory)
    }

    if (searchText.trim()) {
      const query = searchText.trim().toLowerCase()

      nextProducts = nextProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query),
      )
    }

    if (sortBy === 'price-low') {
      nextProducts.sort((a, b) => a.price - b.price)
    }

    if (sortBy === 'price-high') {
      nextProducts.sort((a, b) => b.price - a.price)
    }

    if (sortBy === 'rating') {
      nextProducts.sort((a, b) => b.rating - a.rating)
    }

    return nextProducts
  }, [activeCategory, allProducts, searchText, sortBy])

  const totalPages = Math.ceil(filteredProducts.length / pageSize)
  const startIndex = (page - 1) * pageSize
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize)

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Catalog"
        title="Explore the full product collection"
        description="Browse mock inventory across electronics, home, fashion, books and sports."
        action={
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[2rem] bg-white p-5 shadow-card">
          <h3 className="text-lg font-bold text-slate-900">Categories</h3>
          <div className="mt-4 flex flex-wrap gap-3 lg:flex-col">
            <button
              onClick={() => {
                setActiveCategory('All')
                setPage(1)
              }}
              className={`rounded-full px-4 py-2 text-left text-sm font-medium ${
                activeCategory === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category)
                  setPage(1)
                }}
                className={`rounded-full px-4 py-2 text-left text-sm font-medium ${
                  activeCategory === category ? 'bg-brand text-slate-900' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        <section>
          <p className="mb-5 text-sm text-slate-500">Showing {paginatedProducts.length} of {filteredProducts.length} results</p>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Previous
            </button>
            {Array.from({ length: totalPages || 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`h-11 w-11 rounded-full text-sm font-semibold ${
                  page === index + 1 ? 'bg-accent text-white' : 'bg-white text-slate-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((current) => Math.min(current + 1, totalPages || 1))}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
