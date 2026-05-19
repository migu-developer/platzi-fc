import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CookieConsent } from '@/components/shared/cookie-consent'
import { CartProvider } from '@/lib/cart/cart-context'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
    </CartProvider>
  )
}
