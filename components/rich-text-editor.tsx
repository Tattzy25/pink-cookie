"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="h-64 border rounded-md bg-gray-50"></div>,
})

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
}

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "align",
]

export default function RichTextEditor({ value, onChange }) {
  const [mounted, setMounted] = useState(false)
  const [editorValue, setEditorValue] = useState(value || "")

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update editor value when prop changes
  useEffect(() => {
    if (value !== undefined) {
      setEditorValue(value)
    }
  }, [value])

  const handleChange = (content) => {
    setEditorValue(content)
    if (onChange) {
      onChange(content)
    }
  }

  if (!mounted) {
    return <div className="h-64 border rounded-md bg-gray-50"></div>
  }

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="min-h-[200px]"
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 200px;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
      `}</style>
    </div>
  )
}
