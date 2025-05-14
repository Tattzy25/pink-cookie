export function validateFile(file: File): boolean {
  // Check file type (example: allow only images)
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"]
  if (!allowedTypes.includes(file.type)) {
    return false
  }

  // Check file size (example: max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return false
  }

  return true
}
