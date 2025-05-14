import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import NewsletterSignup from "./newsletter-signup"
import Image from "next/image"

export default function Footer() {
  return (
    <footer
      className="pt-16 pb-8"
      style={{ background: "linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)" }}
    >
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-bold text-lg mb-4 text-black">About Us</h3>
            <p className="text-black mb-4">
              Dessert Print Inc specializes in custom edible image printing on cookies and chocolate bars. We create
              delicious, visually stunning treats for all occasions.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="bg-white p-2 rounded-full text-black hover:text-black hover:bg-gray-100 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="bg-white p-2 rounded-full text-black hover:text-black hover:bg-gray-100 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="bg-white p-2 rounded-full text-black hover:text-black hover:bg-gray-100 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="bg-white p-2 rounded-full text-black hover:text-black hover:bg-gray-100 transition-colors"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-black">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-black hover:text-gray-800 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-black hover:text-gray-800 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/design" className="text-black hover:text-gray-800 transition-colors">
                  Design Tool
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-black hover:text-gray-800 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-black hover:text-gray-800 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-black hover:text-gray-800 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-black hover:text-gray-800 transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-black">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/policies#privacy" className="text-black hover:text-gray-800 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies#terms" className="text-black hover:text-gray-800 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policies#refund" className="text-black hover:text-gray-800 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/policies#shipping" className="text-black hover:text-gray-800 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies#cookies" className="text-black hover:text-gray-800 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-black">Newsletter</h3>
            <NewsletterSignup />
          </div>
        </div>
        <div className="border-t border-black/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-black mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Dessert Print Inc. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <Image src="/paypal-logo.png" alt="PayPal" width={80} height={20} />
              <span className="text-sm text-black">Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
