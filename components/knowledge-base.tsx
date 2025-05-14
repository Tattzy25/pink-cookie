"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ChevronRight, Book, HelpCircle, FileText } from "lucide-react"
import Link from "next/link"

interface KnowledgeBaseArticle {
  id: string
  title: string
  excerpt: string
  category: string
  slug: string
}

interface KnowledgeBaseFAQ {
  id: string
  question: string
  answer: string
  category: string
}

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample knowledge base articles
  const articles: KnowledgeBaseArticle[] = [
    {
      id: "1",
      title: "How to Upload Your Custom Design",
      excerpt: "Learn how to upload and customize your own designs for cookies and chocolate bars.",
      category: "design",
      slug: "how-to-upload-custom-design",
    },
    {
      id: "2",
      title: "Ordering Process Explained",
      excerpt: "A step-by-step guide to placing and tracking your order.",
      category: "orders",
      slug: "ordering-process-explained",
    },
    {
      id: "3",
      title: "Shipping and Delivery Information",
      excerpt: "Everything you need to know about shipping times, costs, and delivery options.",
      category: "shipping",
      slug: "shipping-delivery-information",
    },
    {
      id: "4",
      title: "Bulk Order Discounts",
      excerpt: "Learn about our volume discounts for large orders and corporate events.",
      category: "pricing",
      slug: "bulk-order-discounts",
    },
    {
      id: "5",
      title: "Allergen Information",
      excerpt: "Important information about ingredients and potential allergens in our products.",
      category: "products",
      slug: "allergen-information",
    },
    {
      id: "6",
      title: "Subscription Box Details",
      excerpt: "Everything you need to know about our monthly subscription boxes.",
      category: "subscriptions",
      slug: "subscription-box-details",
    },
  ]

  // Sample FAQs
  const faqs: KnowledgeBaseFAQ[] = [
    {
      id: "1",
      question: "How long do the cookies and chocolates stay fresh?",
      answer:
        "Our cookies stay fresh for up to 3 weeks when stored in an airtight container at room temperature. Chocolate bars can last up to 6 months if stored in a cool, dry place away from direct sunlight.",
      category: "products",
    },
    {
      id: "2",
      question: "Can I change or cancel my order after it's been placed?",
      answer:
        "Orders can be modified or canceled within 24 hours of placement. After that, we begin production and cannot make changes. Please contact customer service immediately if you need to make changes.",
      category: "orders",
    },
    {
      id: "3",
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to select international destinations. International shipping costs and delivery times vary by location. Please check our shipping page for more details.",
      category: "shipping",
    },
    {
      id: "4",
      question: "What file formats do you accept for custom designs?",
      answer:
        "We accept JPG, PNG, SVG, and PDF files for custom designs. For best results, please upload high-resolution images (at least 300 DPI) with clear, bold designs.",
      category: "design",
    },
    {
      id: "5",
      question: "How do I pause or cancel my subscription?",
      answer:
        "You can manage your subscription from your account dashboard. Log in, go to 'My Subscriptions', and select the option to pause or cancel. Changes must be made at least 5 days before your next billing date.",
      category: "subscriptions",
    },
    {
      id: "6",
      question: "Do you offer rush orders or expedited shipping?",
      answer:
        "Yes, we offer rush processing and expedited shipping options at checkout for an additional fee. Rush orders are typically processed within 1-2 business days instead of our standard 3-5 business days.",
      category: "shipping",
    },
  ]

  // Filter articles and FAQs based on search query
  const filteredArticles = articles.filter(
    (article) =>
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredFAQs = faqs.filter(
    (faq) =>
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Group articles by category
  const articlesByCategory = filteredArticles.reduce(
    (acc, article) => {
      if (!acc[article.category]) {
        acc[article.category] = []
      }
      acc[article.category].push(article)
      return acc
    },
    {} as Record<string, KnowledgeBaseArticle[]>,
  )

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Knowledge Base</h1>
        <p className="mt-4 text-muted-foreground">
          Find answers to common questions and learn more about our products and services
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search for articles, FAQs, and more..."
            className="pl-10 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="articles" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="articles">
            <Book className="mr-2 h-4 w-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="faqs">
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="mt-6">
          {Object.keys(articlesByCategory).length > 0 ? (
            <div className="grid gap-6">
              {Object.entries(articlesByCategory).map(([category, articles]) => (
                <div key={category}>
                  <h2 className="text-xl font-semibold mb-4 capitalize">{category}</h2>
                  <div className="grid gap-4">
                    {articles.map((article) => (
                      <Card key={article.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium">{article.title}</h3>
                              <p className="text-muted-foreground mt-1">{article.excerpt}</p>
                            </div>
                            <Link href={`/knowledge-base/${article.slug}`}>
                              <Button variant="ghost" size="sm" className="mt-1">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No articles found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search query</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="faqs" className="mt-6">
          {filteredFAQs.length > 0 ? (
            <div className="grid gap-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium">{faq.question}</h3>
                    <p className="text-muted-foreground mt-2">{faq.answer}</p>
                    <div className="mt-2">
                      <span className="inline-block bg-muted text-muted-foreground text-xs px-2 py-1 rounded capitalize">
                        {faq.category}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No FAQs found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search query</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
