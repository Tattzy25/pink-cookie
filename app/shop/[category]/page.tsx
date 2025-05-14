import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function CategoryPage({ params }: { params: { category: string } }) {
  // This would normally fetch from a database based on the category
  const categoryName = params.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // Mock products based on category
  const products = Array.from({ length: 8 }).map((_, i) => ({
    id: `prod-${i + 1}`,
    name: `${categoryName} Item ${i + 1}`,
    description: `Delicious custom ${categoryName.toLowerCase()} with your design`,
    price: categoryName.includes("Chocolate") ? "$18.00" : "$10.00",
    image: `/placeholder.svg?height=300&width=300&query=${categoryName.toLowerCase()} item ${i + 1}`,
  }))

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl gradient-heading text-center mb-8">
          {categoryName}
        </h1>
        <p className="max-w-[700px] text-rose-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Browse our selection of customizable {categoryName.toLowerCase()}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]"
          >
            <CardContent className="p-0">
              <div className="relative h-48 w-full">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-rose-600">From {product.price}</p>
                  <Link href={`/shop/product/${product.id}`}>
                    <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/shop">
          <Button variant="outline" className="border-rose-600 text-rose-600 hover:bg-rose-50">
            Back to All Products
          </Button>
        </Link>
      </div>
    </div>
  )
}
