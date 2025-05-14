import KnowledgeBase from "@/components/knowledge-base"
import { H1Card } from "@/components/h1-card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Knowledge Base | DessertPrint",
  description: "Find answers to common questions about our custom printed cookies and chocolate products.",
}

export default function KnowledgeBasePage() {
  return (
    <>
      <div className="flex justify-center mb-8">
        <H1Card>Knowledge Base</H1Card>
      </div>
      <KnowledgeBase />
    </>
  )
}
