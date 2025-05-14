import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { H1Card } from "@/components/h1-card"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BlogPage() {
  const blogPosts = [
    {
      title: "OMG! These Custom Cookie Designs Will Blow Your Mind!",
      excerpt:
        "Check out these incredible custom cookie designs that are taking celebrations to the next level. From photo-realistic images to intricate patterns, these cookies are works of art you can eat!",
      image: "/placeholder.svg?key=s6t28",
      category: "Design Inspiration",
      slug: "custom-cookie-designs-will-blow-your-mind",
    },
    {
      title: "WTF! You Won't Believe What People Are Printing on Chocolate!",
      excerpt:
        "From family photos to NFT art, people are getting creative with edible printing technology. Discover the wildest and most creative designs we've seen on our chocolate bars.",
      image: "/placeholder.svg?key=x8knu",
      category: "Trends",
      slug: "what-people-are-printing-on-chocolate",
    },
    {
      title: "The Secret Ingredient That Makes Our Cookies So Damn Good",
      excerpt:
        "Discover the special techniques and ingredients that make our custom cookies stand out from the rest. We're spilling some of our baking secrets in this exclusive behind-the-scenes look.",
      image: "/placeholder.svg?key=5kps0",
      category: "Behind the Scenes",
      slug: "secret-ingredient-cookies-so-good",
    },
    {
      title: "5 Insane Ways to Surprise Someone with Custom Desserts",
      excerpt:
        "Looking to create an unforgettable moment? Here are five creative ways to surprise your loved ones with personalized cookies and chocolate bars that will leave them speechless.",
      image: "/placeholder.svg?key=tpf7w",
      category: "Gift Ideas",
      slug: "insane-ways-surprise-custom-desserts",
    },
    {
      title: "How to Create the Perfect Corporate Gift That Won't Get Tossed",
      excerpt:
        "Corporate gifts often end up forgotten or discarded. Learn how custom cookies and chocolate bars with your company logo can create a lasting impression that clients and partners will remember.",
      image: "/placeholder.svg?key=um36q",
      category: "Business",
      slug: "perfect-corporate-gift-wont-get-tossed",
    },
    {
      title: "The Ultimate Guide to Wedding Dessert Tables That Pop",
      excerpt:
        "Planning a wedding? Discover how to create a stunning dessert table featuring custom cookies and chocolate bars that match your wedding theme and wow your guests.",
      image: "/placeholder.svg?key=x1nxf",
      category: "Weddings",
      slug: "ultimate-guide-wedding-dessert-tables",
    },
  ]

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <H1Card>Dessert Print Blog</H1Card>
        <p className="max-w-[700px] text-rose-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Tips, inspiration, and stories about our delicious treats
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <Card
            key={index}
            className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]"
          >
            <CardContent className="p-0">
              <div className="relative h-56 w-full">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-rose-600 text-white text-sm font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-rose-800 line-clamp-2">{post.title}</h2>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`}>
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center gap-2">
                    Read Full Article <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
