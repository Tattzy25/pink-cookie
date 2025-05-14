import dynamic from "next/dynamic"
import { Loading } from "@/components/ui/loading"
import ErrorBoundary from "@/components/error-boundary"

// Above-the-fold components with static imports
import Hero from "@/components/hero"
import WhyUs from "@/components/why-us"
import FeaturedProducts from "@/components/featured-products"
import ShopByOccasion from "@/components/shop-by-occasion"
import CustomTreatCreator from "@/components/custom-treat-creator"

// Below-the-fold components with dynamic imports for lazy loading
const Products = dynamic(() => import("@/components/products"), {
  loading: () => (
    <div className="h-96 flex items-center justify-center">
      <Loading size="large" text="Loading products..." />
    </div>
  ),
})

const CustomerShowcase = dynamic(() => import("@/components/customer-showcase"), {
  loading: () => (
    <div className="h-80 flex items-center justify-center">
      <Loading text="Loading customer showcase..." />
    </div>
  ),
})

const Testimonials = dynamic(() => import("@/components/testimonials"), {
  loading: () => (
    <div className="h-96 flex items-center justify-center">
      <Loading text="Loading testimonials..." />
    </div>
  ),
})

const Subscription = dynamic(() => import("@/components/subscription"), {
  loading: () => (
    <div className="h-64 flex items-center justify-center">
      <Loading text="Loading subscription form..." />
    </div>
  ),
})

const BlogPreview = dynamic(() => import("@/components/blog-preview"), {
  loading: () => (
    <div className="h-80 flex items-center justify-center">
      <Loading text="Loading blog posts..." />
    </div>
  ),
})

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <ErrorBoundary fallback={<div className="p-4">We couldn't load the hero section. Please try again later.</div>}>
        <Hero />
      </ErrorBoundary>
      <ErrorBoundary
        fallback={<div className="p-4">We couldn't load the shop by occasion section. Please try again later.</div>}
      >
        <ShopByOccasion />
      </ErrorBoundary>
      <ErrorBoundary fallback={<div className="p-4">We couldn't load the why us section. Please try again later.</div>}>
        <WhyUs />
      </ErrorBoundary>
      <ErrorBoundary
        fallback={<div className="p-4">We couldn't load the featured products. Please try again later.</div>}
      >
        <FeaturedProducts />
      </ErrorBoundary>
      <ErrorBoundary
        fallback={<div className="p-4">We couldn't load the custom treat creator. Please try again later.</div>}
      >
        <CustomTreatCreator />
      </ErrorBoundary>
      <ErrorBoundary
        fallback={<div className="p-4">We couldn't load the products section. Please try again later.</div>}
      >
        <Products />
      </ErrorBoundary>
      <ErrorBoundary
        fallback={<div className="p-4">We couldn't load the customer showcase. Please try again later.</div>}
      >
        <CustomerShowcase />
      </ErrorBoundary>
      <ErrorBoundary fallback={<div className="p-4">We couldn't load the testimonials. Please try again later.</div>}>
        <Testimonials />
      </ErrorBoundary>
      <ErrorBoundary
        fallback={<div className="p-4">We couldn't load the subscription form. Please try again later.</div>}
      >
        <Subscription />
      </ErrorBoundary>
      <ErrorBoundary fallback={<div className="p-4">We couldn't load the blog preview. Please try again later.</div>}>
        <BlogPreview />
      </ErrorBoundary>
    </div>
  )
}
