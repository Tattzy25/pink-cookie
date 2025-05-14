import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { H1Card } from "@/components/h1-card"

export default function BlogPreview() {
  const blogPosts = [
    {
      title: "OMG! These Custom Cookie Designs Will Blow Your Mind!",
      excerpt: "Check out these incredible custom cookie designs that are taking celebrations to the next level...",
      image: "/whimsical-cookie-collection.png",
    },
    {
      title: "WTF! You Won't Believe What People Are Printing on Chocolate!",
      excerpt: "From family photos to NFT art, people are getting creative with edible printing technology...",
      image: "/whimsical-chocolate-creations.png",
    },
    {
      title: "The Secret Ingredient That Makes Our Cookies So Damn Good",
      excerpt:
        "Discover the special techniques and ingredients that make our custom cookies stand out from the rest...",
      image: "/baking-ingredients-secrets.png",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 bg-[#e783bd]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-center items-center mb-12 w-full">
          <div className="text-center">
            <div className="flex justify-center">
              <H1Card>Bite into our stories</H1Card>
            </div>
          </div>
          {/* Remove the Link button that was here */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]"
            >
              <CardContent className="p-0">
                <div className="relative h-48 w-full">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-rose-800">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.title
                      .toLowerCase()
                      .replace(/[^\w\s]/g, "")
                      .replace(/\s+/g, "-")}`}
                  >
                    <Button variant="link" className="text-rose-600 hover:text-rose-700 p-0">
                      Read More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
