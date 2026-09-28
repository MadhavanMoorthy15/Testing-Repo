import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { products } from '../data/products'

const StoreContext = createContext(null)

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
    const storedCart = JSON.parse(localStorage.getItem('junior-cart') || '[]')
    const storedWishlist = JSON.parse(localStorage.getItem('junior-wishlist') || '[]')
    const storedTheme = localStorage.getItem('junior-theme')

    if (storedCart.length) {
      setCartItems(storedCart)
    }

    if (storedWishlist.length) {
      setWishlistItems(storedWishlist)
    }

    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('junior-cart', JSON.stringify(cartItems))
    localStorage.setItem('junior-wishlist', JSON.stringify(wishlistItems))
    localStorage.setItem('junior-theme', theme)
    document.body.className = theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-[#f4f7fb] text-slate-900'

    const timer = setInterval(() => {
      document.title = cartItems.length ? `(${cartItems.length}) ShopNest` : 'ShopNest'
    }, 1200)
  }, [cartItems, wishlistItems, theme])

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  )

  const wishlistCount = wishlistItems.length

  const addToCart = (product) => {
    const item = cartItems.find((entry) => entry.id === product.id)

    if (item) {
      item.quantity += 1
      setCartItems([...cartItems])
      return
    }

    setCartItems([...cartItems, { ...product, quantity: 1 }])
  }

  const updateCartQuantity = (productId, direction) => {
    const nextItems = cartItems.map((item) => {
      if (item.id !== productId) {
        return item
      }

      if (direction === 'decrease') {
        return { ...item, quantity: item.quantity - 1 }
      }

      return { ...item, quantity: item.quantity + 1 }
    })

    setCartItems(nextItems.filter((item) => item.quantity >= 0))
  }

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId))
  }

  const addToWishlist = (product) => {
    setWishlistItems([...wishlistItems, product])
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== productId))
  }

  const isInWishlist = (productId) => wishlistItems.some((item) => item.id === productId)

  const cartSubtotal = cartItems.reduce((total, item) => total + item.price, 0)
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
