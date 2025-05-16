export function validateFile(file: File): boolean {
  // Check file type (example: allow only images)
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"]
  if (!allowedTypes.includes(file.type)) {
    return false
  }


  const maxSize = 50 * 1024 * 1024 
  if (file.size > maxSize) {
    return false
  }

  return true
}
