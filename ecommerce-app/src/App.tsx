import { useMemo, useState } from 'react';

type Product = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  prime?: boolean;
  delivery: string;
  stock: number;
};

type CartItem = Product & { quantity: number };

const products: Product[] = [
  { id: 1, name: 'EchoWave ANC Headphones', brand: 'Auralis', category: 'Electronics', price: 14999, rating: 4.8, reviews: 1241, image: '🎧', badge: 'Best Seller', prime: true, delivery: 'Tomorrow', stock: 14 },
  { id: 2, name: 'Nimbus 14" Laptop', brand: 'VoltEdge', category: 'Electronics', price: 68990, rating: 4.7, reviews: 833, image: '💻', badge: 'Deal of the Day', prime: true, delivery: '2 days', stock: 9 },
  { id: 3, name: 'SmartFit Running Shoes', brand: 'Stride', category: 'Fashion', price: 4999, rating: 4.5, reviews: 582, image: '👟', badge: 'Trending', prime: false, delivery: '3 days', stock: 27 },
  { id: 4, name: 'Aurora LED Desk Lamp', brand: 'LumaHome', category: 'Home', price: 2799, rating: 4.6, reviews: 241, image: '💡', prime: true, delivery: 'Tomorrow', stock: 18 },
  { id: 5, name: 'ChefPro Air Fryer', brand: 'KitchenOne', category: 'Home', price: 8390, rating: 4.7, reviews: 1024, image: '🍳', badge: 'Amazon Choice', prime: true, delivery: '2 days', stock: 11 },
  { id: 6, name: 'PixelBook Pro', brand: 'Graphite', category: 'Electronics', price: 124990, rating: 4.9, reviews: 221, image: '📱', badge: 'New Launch', prime: true, delivery: 'Tomorrow', stock: 6 },
  { id: 7, name: 'Heritage Cotton Shirt', brand: 'Threadline', category: 'Fashion', price: 2199, rating: 4.4, reviews: 388, image: '👔', prime: false, delivery: '4 days', stock: 42 },
  { id: 8, name: 'Mystery Box Set', brand: 'ReadMore', category: 'Books', price: 1299, rating: 4.8, reviews: 93, image: '📚', prime: true, delivery: 'Tomorrow', stock: 25 },
];

const categories = ['All', ...new Set(products.map((product) => product.category))];

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const filteredProducts = useMemo(() => {
    const items = products.filter((product) => {
      const matchesSearch = `${product.name} ${product.brand}`.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || product.category === category;
      return matchesSearch && matchesCategory;
    });

    return items.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.rating - a.rating;
    });
  }, [search, category, sortBy]);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((current) => current.flatMap((item) => item.id === id ? (quantity > 0 ? [{ ...item, quantity }] : []) : [item]));
  };

  const toggleWishlist = (id: number) => {
    setWishlist((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 4999 || subtotal === 0 ? 0 : 199;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="app-shell">
      <header className="hero">
        <nav className="topbar">
          <div>
            <p className="eyebrow">Marketplace</p>
            <h1>NovaCart</h1>
          </div>
          <div className="topbar-stats">
            <span>{products.length} products</span>
            <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} in cart</span>
            <span>{wishlist.length} saved</span>
          </div>
        </nav>
        <div className="hero-grid">
          <section className="hero-copy">
            <p className="hero-kicker">Inspired by Amazon + Flipkart</p>
            <h2>Discover premium deals, fast delivery, and curated essentials.</h2>
            <p className="hero-text">Browse electronics, fashion, books, and home picks in a sleek shopping experience built for quick discovery and confident checkout.</p>
            <div className="search-row">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, brands, categories..." />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </section>
          <aside className="promo-card">
            <p>Today’s highlights</p>
            <strong>Free shipping above ₹4,999</strong>
            <span>Prime-style delivery on selected items</span>
            <div className="promo-pill">Secure checkout</div>
          </aside>
        </div>
      </header>

      <main className="content-grid">
        <section className="catalog-panel">
          <div className="filter-row">
            {categories.map((item) => (
              <button key={item} className={item === category ? 'chip active' : 'chip'} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="card-top">
                  <span className="product-art">{product.image}</span>
                  <button className={wishlist.includes(product.id) ? 'wish active' : 'wish'} onClick={() => toggleWishlist(product.id)}>
                    ♥
                  </button>
                </div>
                <div className="card-meta">
                  <span>{product.brand}</span>
                  <span>{product.category}</span>
                </div>
                <h3>{product.name}</h3>
                <div className="rating-row">
                  <span className="rating">★ {product.rating}</span>
                  <span>({product.reviews})</span>
                  {product.prime && <span className="prime">Prime</span>}
                </div>
                <div className="price-row">
                  <strong>{currency.format(product.price)}</strong>
                  <span>{product.delivery}</span>
                </div>
                <p className="stock">Only {product.stock} left in stock</p>
                {product.badge && <span className="badge">{product.badge}</span>}
                <button className="add-btn" onClick={() => addToCart(product)}>Add to Cart</button>
              </article>
            ))}
          </div>
        </section>

        <aside className="cart-panel">
          <div className="panel-header">
            <h3>Your Cart</h3>
            <span>{cart.length} items</span>
          </div>
          <div className="cart-list">
            {cart.length === 0 ? (
              <div className="empty-state">Your cart is empty. Add a few deals to start building your order.</div>
            ) : cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>{currency.format(item.price)}</p>
                </div>
                <div className="qty-controls">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="summary">
            <div><span>Subtotal</span><strong>{currency.format(subtotal)}</strong></div>
            <div><span>Shipping</span><strong>{shipping === 0 ? 'Free' : currency.format(shipping)}</strong></div>
            <div><span>Tax</span><strong>{currency.format(tax)}</strong></div>
            <div className="total"><span>Total</span><strong>{currency.format(total)}</strong></div>
          </div>
          <button className="checkout-btn">Proceed to Checkout</button>
          <p className="checkout-note">Demo storefront with persistent wishlist and live cart calculations.</p>
        </aside>
      </main>
    </div>
  );
}
