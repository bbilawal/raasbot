'use client'

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import {
  CartItem,
  CartState,
  CartAction,
  cartReducer,
  cartTotal,
  cartItemCount,
  loadCartFromStorage,
  saveCartToStorage,
} from './store'

type CartContextValue = {
  items: CartItem[]
  total: number
  itemCount: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] } as CartState)
  const [isOpen, setIsOpen] = React.useState(false)
  const [isHydrated, setIsHydrated] = React.useState(false)

  // Hydrate from localStorage once on mount
  useEffect(() => {
    const saved = loadCartFromStorage()
    if (saved.items.length > 0) {
      saved.items.forEach((item) =>
        dispatch({ type: 'ADD_ITEM', payload: item })
      )
    }
    setIsHydrated(true)
  }, [])

  // Persist to localStorage after hydration on every state change
  useEffect(() => {
    if (!isHydrated) return
    saveCartToStorage(state)
  }, [state, isHydrated])

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }, [])

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      total: cartTotal(state.items),
      itemCount: cartItemCount(state.items),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isOpen,
      openCart,
      closeCart,
    }),
    [
      state.items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isOpen,
      openCart,
      closeCart,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
