import ProductSearch from "@/components/product-search"
import { Products } from "@/components/products"
import { H1Card } from "@/components/h1-card"

export default function ShopPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <H1Card>Shop Our Collection</H1Card>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our selection of customizable cookies and chocolate bars. Perfect for any occasion, our treats are made
          with premium ingredients and can be personalized with your designs.
        </p>
      </div>

      <div className="mb-8">
        <ProductSearch />
      </div>

      <Products />
    </main>
  )
}
