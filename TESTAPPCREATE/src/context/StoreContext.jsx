import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { products } from '../data/products'

const StoreContext = createContext(null)

const parseStoredItems = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

const starterUser = {
  name: 'Priya Sharma',
  email: 'priya@example.com',
  city: 'Bengaluru',
  membership: 'Prime Plus',
}

export function StoreProvider({ children }) {
  const [allProducts] = useState(products)
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [searchText, setSearchText] = useState('')
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(starterUser)
  const [profileForm, setProfileForm] = useState(starterUser)
  const [orders] = useState([
    { id: 'OD10234', date: '22 Jun 2026', total: 18999, status: 'Delivered' },
    { id: 'OD10235', date: '07 Jul 2026', total: 6999, status: 'In Transit' },
  ])

  useEffect(() => {
    const storedCart = parseStoredItems('junior-cart')
    const storedWishlist = parseStoredItems('junior-wishlist')
    const storedTheme = localStorage.getItem('junior-theme')

    if (storedCart.length) {
      setCartItems(storedCart)
    }

    if (storedWishlist.length) {
      setWishlistItems(storedWishlist)
    }

    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme)
    }
  }, [])

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  )

  useEffect(() => {
    localStorage.setItem('junior-cart', JSON.stringify(cartItems))
    localStorage.setItem('junior-wishlist', JSON.stringify(wishlistItems))
    localStorage.setItem('junior-theme', theme)
    document.body.className = theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-[#f4f7fb] text-slate-900'
    document.title = cartCount ? `(${cartCount}) ShopNest` : 'ShopNest'
  }, [cartItems, wishlistItems, theme, cartCount])

  const wishlistCount = wishlistItems.length

  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((entry) => entry.id === product.id)

      if (existingItem) {
        return currentItems.map((entry) =>
          entry.id === product.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        )
      }

      return [...currentItems, { ...product, quantity: 1 }]
    })
  }

  const updateCartQuantity = (productId, direction) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.id !== productId) {
            return item
          }

          const quantity = direction === 'decrease' ? item.quantity - 1 : item.quantity + 1
          return { ...item, quantity }
        })
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (productId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId))
  }

  const addToWishlist = (product) => {
    setWishlistItems((currentItems) =>
      currentItems.some((item) => item.id === product.id)
        ? currentItems.filter((item) => item.id !== product.id)
        : [...currentItems, product],
    )
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems((currentItems) => currentItems.filter((item) => item.id !== productId))
  }

  const isInWishlist = (productId) => wishlistItems.some((item) => item.id === productId)

  const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryFee = cartItems.length ? 99 : 0
  const tax = Math.round(cartSubtotal * 0.18)
  const grandTotal = cartSubtotal + deliveryFee + tax

  const saveProfile = () => {
    setUser(profileForm)
  }

  const value = {
    allProducts,
    cartItems,
    wishlistItems,
    cartCount,
    wishlistCount,
    searchText,
    setSearchText,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    cartSubtotal,
    deliveryFee,
    tax,
    grandTotal,
    theme,
    setTheme,
    user,
    profileForm,
    setProfileForm,
    saveProfile,
    orders,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)

  if (!context) {
    throw new Error('useStore must be used inside StoreProvider')
  }

  return context
}
