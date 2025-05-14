import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // This would normally fetch from a database or CMS
  const post = {
    title: "OMG! These Custom Cookie Designs Will Blow Your Mind!",
    excerpt:
      "Check out these incredible custom cookie designs that are taking celebrations to the next level. From photo-realistic images to intricate patterns, these cookies are works of art you can eat!",
    content: `
      <p>If you thought cookies were just simple treats, think again! The world of custom cookie design has exploded with creativity, and we're here to show you some of the most mind-blowing designs we've created at Dessert Print Inc.</p>
      
      <h2>Photo-Realistic Edible Printing</h2>
      
      <p>Our advanced edible printing technology allows us to create cookies with photo-realistic images. From family portraits to pet photos, we can print any image with incredible detail and vibrant colors. Imagine the surprise on someone's face when they see their own image on a delicious cookie!</p>
      
      <h2>Corporate Branding That Tastes Amazing</h2>
      
      <p>Companies are discovering the power of branded cookies for events and client gifts. We've created cookies featuring intricate logos, product images, and even QR codes that actually work! It's a delicious way to make your brand memorable.</p>
      
      <h2>Wedding and Special Event Cookies</h2>
      
      <p>Custom cookies have become a hot trend for weddings and special events. We've designed cookies featuring couples' engagement photos, wedding dates, and even matching the patterns from wedding dresses and invitations. They make perfect favors that guests actually want to take home!</p>
      
      <h2>Holiday and Seasonal Designs</h2>
      
      <p>Each holiday brings new opportunities for creative cookie designs. From spooky Halloween faces to personalized Christmas ornaments, our seasonal cookies add a special touch to any celebration.</p>
      
      <h2>Ready to Create Your Own Custom Cookies?</h2>
      
      <p>Visit our design tool to upload your own images or browse our gallery of designs. With multiple flavors and shapes available, you can create the perfect custom cookies for any occasion!</p>
    `,
    image: "/custom-cookies-collection.png",
    category: "Design Inspiration",
    date: "April 27, 2025",
    author: "Cookie Enthusiast",
    relatedPosts: [
      {
        title: "WTF! You Won't Believe What People Are Printing on Chocolate!",
        slug: "what-people-are-printing-on-chocolate",
        image: "/creative-chocolate-prints.png",
      },
      {
        title: "5 Insane Ways to Surprise Someone with Custom Desserts",
        slug: "insane-ways-surprise-custom-desserts",
        image: "/surprise-desserts.png",
      },
    ],
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <Link href="/blog">
        <Button variant="ghost" className="mb-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="px-3 py-1 bg-rose-600 text-white text-sm font-medium rounded-full">{post.category}</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-rose-800 mb-6">{post.title}</h1>

        <div className="flex items-center text-rose-600 mb-8">
          <span>{post.author}</span>
          <span className="mx-2">•</span>
          <span>{post.date}</span>
        </div>

        <div className="rounded-[49px] overflow-hidden mb-12 relative h-[300px] md:h-[500px]">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>

        <div className="prose prose-rose max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="border-t border-rose-100 pt-12 mt-12">
          <h2 className="text-2xl font-bold text-rose-800 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {post.relatedPosts.map((relatedPost, index) => (
              <Link key={index} href={`/blog/${relatedPost.slug}`}>
                <div className="group rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]">
                  <div className="relative h-48 w-full">
                    <Image
                      src={relatedPost.image || "/placeholder.svg"}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-rose-800 group-hover:text-rose-600 transition-colors">
                      {relatedPost.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[49px] overflow-hidden bg-gradient-to-r from-rose-600 to-amber-500 p-1 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3] mt-12">
          <div className="bg-white rounded-[48px] p-8 text-center">
            <h2 className="text-2xl font-bold text-rose-800 mb-4">Ready to Create Your Own Custom Cookies?</h2>
            <p className="text-rose-600 mb-6">Design your perfect treats with our easy-to-use customization tool.</p>
            <Link href="/design">
              <Button className="bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white px-8 py-6 text-lg font-bold">
                Start Designing Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
