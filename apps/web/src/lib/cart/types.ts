export type CartItemType = 'product' | 'ticket'

export type CartItem = {
  id: string
  type: CartItemType
  name: string
  variant?: string
  price: number
  currency: string
  quantity: number
  image?: string
  slug: string
}

export type Cart = {
  items: CartItem[]
  updatedAt: string
}
