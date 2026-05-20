'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cart/cart-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

export function CartContent() {
  const { cart, removeItem, updateQuantity, clearCart, itemCount, total } = useCart()

  if (itemCount === 0) {
    return (
      <div className="rounded-card border border-dashed border-border p-12 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground/30" />
        <p className="mt-4 text-lg font-semibold">Tu carrito esta vacio</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Explora la tienda y anade productos a tu carrito.
        </p>
        <Button
          render={<Link href="/tienda" />}
          className="mt-6 bg-club-primary text-white hover:bg-club-primary-light"
        >
          Ir a la Tienda
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Items */}
      <div className="lg:col-span-2 space-y-3">
        {cart.items.map((item) => (
          <Card key={`${item.id}-${item.variant}`}>
            <CardContent className="flex items-center gap-4 p-4">
              {/* Image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={item.type === 'product' ? `/tienda/${item.slug}` : '/entradas'}
                  className="text-sm font-semibold hover:text-club-primary"
                >
                  {item.name}
                </Link>
                {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                <p className="mt-1 font-(family-name:--font-heading) text-sm font-bold text-club-primary">
                  {item.price} {item.currency}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label="Reducir cantidad"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Remove */}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-red-600"
                onClick={() => removeItem(item.id)}
                aria-label="Eliminar"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-xs text-muted-foreground"
          >
            Vaciar carrito
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div>
        <Card>
          <CardContent className="p-5">
            <h2 className="font-(family-name:--font-heading) text-lg font-bold">Resumen</h2>
            <Separator className="my-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Productos ({itemCount})</span>
                <span>{total.toFixed(2)} EUR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envio</span>
                <span className="text-club-primary">Gratis</span>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="font-(family-name:--font-heading) text-lg text-club-primary">
                {total.toFixed(2)} EUR
              </span>
            </div>
            <Button className="mt-4 w-full bg-club-primary text-white hover:bg-club-primary-light">
              Proceder al pago
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Seras redirigido al proveedor de pago
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
