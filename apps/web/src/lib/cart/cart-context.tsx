'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Cart, CartItem } from './types'

type CartContextType = {
  cart: Cart
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const STORAGE_KEY = 'platzi-fc-cart'

const emptyCart: Cart = { items: [], updatedAt: new Date().toISOString() }

function loadCart(): Cart {
  if (typeof window === 'undefined') return emptyCart
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : emptyCart
  } catch {
    return emptyCart
  }
}

function saveCart(cart: Cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  } catch {
    // localStorage full or unavailable
  }
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setCart(loadCart())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) saveCart(cart)
  }, [cart, mounted])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.id === item.id && i.variant === item.variant)
      const items = existing
        ? prev.items.map((i) =>
            i.id === item.id && i.variant === item.variant
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          )
        : [...prev.items, { ...item, quantity: 1 }]
      return { items, updatedAt: new Date().toISOString() }
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setCart((prev) => ({
      items: prev.items.filter((i) => i.id !== id),
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setCart((prev) => ({
      items: prev.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      updatedAt: new Date().toISOString(),
    }))
  }, [removeItem])

  const clearCart = useCallback(() => {
    setCart({ items: [], updatedAt: new Date().toISOString() })
  }, [])

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)
  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
