/**
 * CSV Utilities for import/export operations
 */

// Convert array of objects to CSV string
export function objectsToCSV<T extends Record<string, any>>(data: T[], headers?: Record<string, string>): string {
  if (!data.length) return ""

  // Get all unique keys from the objects
  const allKeys = Array.from(new Set(data.flatMap((item) => Object.keys(item))))

  // Use provided headers or generate from keys
  const headerRow = headers
    ? Object.entries(headers).map(([key, label]) => `"${label}"`)
    : allKeys.map((key) => `"${key}"`)

  // Create CSV header row
  let csv = headerRow.join(",") + "\n"

  // Create data rows
  const rows = data.map((item) => {
    const keysToUse = headers ? Object.keys(headers) : allKeys
    return keysToUse
      .map((key) => {
        const value = item[key]

        // Handle different data types
        if (value === null || value === undefined) return '""'
        if (typeof value === "object") {
          if (Array.isArray(value)) {
            return `"${value.join("; ")}"`
          }
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        }
        return `"${String(value).replace(/"/g, '""')}"`
      })
      .join(",")
  })

  // Join all rows
  csv += rows.join("\n")
  return csv
}

// Parse CSV string to array of objects
export function csvToObjects<T>(csv: string, headerMap?: Record<string, string>): T[] {
  const lines = csv.split("\n")
  if (lines.length < 2) return [] // Need at least header + 1 data row

  // Parse header row
  const headers = parseCSVRow(lines[0])

  // Create reverse mapping if headerMap is provided
  const reverseHeaderMap: Record<string, string> = {}
  if (headerMap) {
    Object.entries(headerMap).forEach(([key, label]) => {
      reverseHeaderMap[label] = key
    })
  }

  // Parse data rows
  return lines
    .slice(1)
    .filter((line) => line.trim()) // Skip empty lines
    .map((line) => {
      const values = parseCSVRow(line)
      const obj: Record<string, any> = {}

      headers.forEach((header, index) => {
        // Use the original property name if we have a mapping
        const key = headerMap ? reverseHeaderMap[header] || header : header
        const value = values[index]

        // Try to parse JSON if the value looks like an object or array
        if (value && (value.startsWith("{") || value.startsWith("["))) {
          try {
            obj[key] = JSON.parse(value)
          } catch {
            obj[key] = value
          }
        } else if (value === "true") {
          obj[key] = true
        } else if (value === "false") {
          obj[key] = false
        } else if (!isNaN(Number(value)) && value.trim() !== "") {
          obj[key] = Number(value)
        } else {
          obj[key] = value
        }
      })

      return obj as T
    })
}

// Helper to parse a CSV row respecting quotes
function parseCSVRow(row: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < row.length; i++) {
    const char = row[i]

    if (char === '"') {
      // Check for escaped quotes
      if (i + 1 < row.length && row[i + 1] === '"') {
        current += '"'
        i++ // Skip the next quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  // Add the last field
  result.push(current)
  return result
}

// Download CSV file in browser
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
