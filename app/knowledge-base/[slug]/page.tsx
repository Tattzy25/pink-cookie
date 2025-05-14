import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { H1Card } from "@/components/h1-card"
import { ArrowLeft, Clock, Tag, User } from "lucide-react"
import Link from "next/link"

// This would typically come from a database or CMS
const articles = [
  {
    slug: "how-to-upload-custom-design",
    title: "How to Upload Your Custom Design",
    content: `
      <h2>Getting Started with Custom Designs</h2>
      <p>Uploading your own designs for cookies and chocolate bars is easy with our intuitive design tool. Follow these simple steps to create your perfect custom treats.</p>
      
      <h3>Step 1: Prepare Your Design</h3>
      <p>Before uploading, make sure your design meets these requirements:</p>
      <ul>
        <li>File formats: JPG, PNG, SVG, or PDF</li>
        <li>Resolution: At least 300 DPI for best results</li>
        <li>Size: Maximum file size of 10MB</li>
        <li>Design: Clear, bold designs work best on cookies and chocolate</li>
      </ul>
      
      <h3>Step 2: Access the Design Tool</h3>
      <p>Navigate to the product page of your choice and click the "Customize Now" button. This will take you to our design tool interface.</p>
      
      <h3>Step 3: Upload Your Design</h3>
      <p>Click the "Upload" tab in the design tool. You can either drag and drop your file into the designated area or click "Browse Files" to select it from your device.</p>
      
      <h3>Step 4: Adjust and Preview</h3>
      <p>Once uploaded, you can:</p>
      <ul>
        <li>Resize your design using the scaling tools</li>
        <li>Rotate or flip the image as needed</li>
        <li>Position it precisely on the cookie or chocolate template</li>
        <li>Preview how it will look on the final product</li>
      </ul>
      
      <h3>Step 5: Finalize and Add to Cart</h3>
      <p>When you're satisfied with how your design looks, click "Add to Cart" to proceed with your order. You'll be able to specify quantity and other options before checkout.</p>
      
      <h2>Tips for Great Results</h2>
      <p>For the best outcome with your custom designs:</p>
      <ul>
        <li>Use high-contrast images for better visibility</li>
        <li>Avoid very fine details that might not print clearly</li>
        <li>Consider the shape of the cookie or chocolate bar when designing</li>
        <li>Text should be at least 12pt for readability</li>
      </ul>
      
      <h2>Need Help?</h2>
      <p>If you're having trouble with the design tool or have questions about what will work best, our customer service team is happy to assist. Contact us at support@dessertprint.com or call us at (555) 123-4567.</p>
    `,
    author: "Design Team",
    date: "2023-09-15",
    category: "design",
    readTime: "5 min read",
  },
  {
    slug: "custom-order-process",
    title: "Custom Order Process",
    content: `
      <h2>Custom Order Process</h2>
      <p>Looking for something special that's not in our standard catalog? Our custom order process makes it easy to get exactly what you want.</p>
      
      <h3>Step 1: Contact Us</h3>
      <p>Start by reaching out through our custom order form or by emailing orders@dessertprint.com with your requirements.</p>
      
      <h3>Step 2: Consultation</h3>
      <p>Our design team will schedule a brief consultation to understand your needs, timeline, and budget.</p>
      
      <h3>Step 3: Design Proposal</h3>
      <p>We'll create a custom proposal with design mockups and pricing options.</p>
      
      <h3>Step 4: Approval & Production</h3>
      <p>Once you approve the design and place your order, we'll begin production.</p>
      
      <h3>Step 5: Delivery</h3>
      <p>Your custom treats will be carefully packaged and delivered to your specified address.</p>
    `,
    author: "Order Team",
    date: "2023-10-20",
    category: "orders",
    readTime: "3 min read",
  },
]

export default function KnowledgeBaseArticle({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug)

  if (!article) {
    return (
      <div className="container px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <H1Card>Article Not Found</H1Card>
          <p className="mt-4 text-muted-foreground">The article you're looking for doesn't exist or has been moved.</p>
          <Link href="/knowledge-base">
            <Button className="mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Base
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/knowledge-base">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Knowledge Base
          </Button>
        </Link>

        <Card>
          <CardContent className="p-6 md:p-10">
            <div className="flex justify-center mb-6">
              <H1Card>{article.title}</H1Card>
            </div>

            <div className="flex flex-wrap gap-4 items-center mt-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                {article.author}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {article.readTime}
              </div>
              <div className="flex items-center">
                <Tag className="mr-1 h-4 w-4" />
                <span className="capitalize">{article.category}</span>
              </div>
            </div>

            <div className="mt-8 prose prose-rose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />

            <div className="mt-12 pt-6 border-t">
              <h3 className="text-lg font-medium">Was this article helpful?</h3>
              <div className="flex gap-2 mt-2">
                <Button variant="outline">Yes</Button>
                <Button variant="outline">No</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
