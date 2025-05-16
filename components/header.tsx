"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md"
      style={{
        backgroundColor: "rgba(231, 131, 189, 0.8)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span
              className="font-great-vibes text-2xl md:text-3xl bg-gradient-to-r from-[#000000] to-[#444444] text-transparent bg-clip-text whitespace-nowrap"
              style={{
                fontFamily: "'Great Vibes', cursive",
              }}
            >
              Dessert Print
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-medium transition-colors ${
                pathname === "/" ? "bg-[#e43a9d] text-white px-3 py-1 rounded-md" : "text-black hover:text-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className={`font-medium transition-colors ${
                pathname === "/shop" || pathname.startsWith("/shop/")
                  ? "bg-[#e43a9d] text-white px-3 py-1 rounded-md"
                  : "text-black hover:text-gray-700"
              }`}
            >
              Shop
            </Link>
            <Link
              href="/shop/occasions"
              className={`font-medium transition-colors ${
                pathname === "/shop/occasions"
                  ? "bg-[#e43a9d] text-white px-3 py-1 rounded-md"
                  : "text-black hover:text-gray-700"
              }`}
            >
              Occasions
            </Link>
            <Link
              href="/about"
              className={`font-medium transition-colors ${
                pathname === "/about"
                  ? "bg-[#e43a9d] text-white px-3 py-1 rounded-md"
                  : "text-black hover:text-gray-700"
              }`}
            >
              About
            </Link>
            <Link
              href="/blog"
              className={`font-medium transition-colors ${
                pathname === "/blog" || pathname.startsWith("/blog/")
                  ? "bg-[#e43a9d] text-white px-3 py-1 rounded-md"
                  : "text-black hover:text-gray-700"
              }`}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className={`font-medium transition-colors ${
                pathname === "/contact"
                  ? "bg-[#e43a9d] text-white px-3 py-1 rounded-md"
                  : "text-black hover:text-gray-700"
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className={`hover:bg-gray-50 ${
                  pathname === "/cart" ? "bg-[#e43a9d] text-white" : "text-black hover:text-gray-700"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="icon"
                className={`hover:bg-gray-50 ${
                  pathname === "/dashboard" ? "bg-[#e43a9d] text-white" : "text-black hover:text-gray-700"
                }`}
                title="My Dashboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
              </Button>
            </Link>
            <Link href="/account">
              <Button
                variant="ghost"
                size="icon"
                className={`hover:bg-gray-50 ${
                  pathname === "/account" ? "bg-[#e43a9d] text-white" : "text-black hover:text-gray-700"
                }`}
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link href="/cart" className="mr-2">
              <Button
                variant="ghost"
                size="icon"
                className={`${pathname === "/cart" ? "bg-[#e43a9d] text-white" : "text-black"}`}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-black">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          className="md:hidden bg-white border-t border-gray-100"
          style={{
            backgroundColor: "#e783bd",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-4 py-4">
              <Link
                href="/"
                className={`font-medium py-2 transition-colors ${
                  pathname === "/" ? "bg-[#e43a9d] text-white px-3 py-2 rounded-md" : "text-black hover:text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className={`font-medium py-2 transition-colors ${
                  pathname === "/shop" || pathname.startsWith("/shop/")
                    ? "bg-[#e43a9d] text-white px-3 py-2 rounded-md"
                    : "text-black hover:text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/shop/occasions"
                className={`font-medium py-2 transition-colors ${
                  pathname === "/shop/occasions"
                    ? "bg-[#e43a9d] text-white px-3 py-2 rounded-md"
                    : "text-black hover:text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Occasions
              </Link>
              <Link
                href="/about"
                className={`font-medium py-2 transition-colors ${
                  pathname === "/about"
                    ? "bg-[#e43a9d] text-white px-3 py-2 rounded-md"
                    : "text-black hover:text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/blog"
                className={`font-medium py-2 transition-colors ${
                  pathname === "/blog" || pathname.startsWith("/blog/")
                    ? "bg-[#e43a9d] text-white px-3 py-2 rounded-md"
                    : "text-black hover:text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className={`font-medium py-2 transition-colors ${
                  pathname === "/contact"
                    ? "bg-[#e43a9d] text-white px-3 py-2 rounded-md"
                    : "text-black hover:text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/dashboard"
                className={`font-medium py-2 transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-[#e43a9d] text-white px-3 py-2 rounded-md"
                    : "text-black hover:text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                My Dashboard
              </Link>
              <Link
                href="/account"
                className={`font-medium py-2 transition-colors ${
                  pathname === "/account"
                    ? "bg-[#e43a9d] text-white px-3 py-2 rounded-md"
                    : "text-black hover:text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                My Account
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
