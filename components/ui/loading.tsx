import { Loader2 } from "lucide-react"

export function Loading({ size = "default", text = "Loading..." }) {
  const sizeClass = size === "small" ? "h-4 w-4" : size === "large" ? "h-8 w-8" : "h-6 w-6"

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 className={`${sizeClass} animate-spin text-rose-600 mb-2`} />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  )
}
