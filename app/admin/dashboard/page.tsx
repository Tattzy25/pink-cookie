"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    router.push("/admin/products")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
    </div>
  )
}
