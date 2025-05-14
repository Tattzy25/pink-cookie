/**
 * Geographic utility functions for distance calculations
 */

// Convert degrees to radians
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Calculate the distance between two points on Earth using the Haversine formula
 * @param lat1 Latitude of first point in degrees
 * @param lon1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lon2 Longitude of second point in degrees
 * @returns Distance in miles
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Earth's radius in miles
  const earthRadius = 3958.8

  // Convert all coordinates to radians
  const lat1Rad = toRadians(lat1)
  const lon1Rad = toRadians(lon1)
  const lat2Rad = toRadians(lat2)
  const lon2Rad = toRadians(lon2)

  // Calculate differences
  const latDiff = lat2Rad - lat1Rad
  const lonDiff = lon2Rad - lon1Rad

  // Haversine formula
  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = earthRadius * c

  return distance
}

/**
 * Check if a point is within a specified radius of another point
 * @param lat1 Latitude of center point in degrees
 * @param lon1 Longitude of center point in degrees
 * @param lat2 Latitude of point to check in degrees
 * @param lon2 Longitude of point to check in degrees
 * @param radiusMiles Radius in miles
 * @returns Boolean indicating if point is within radius
 */
export function isWithinRadius(lat1: number, lon1: number, lat2: number, lon2: number, radiusMiles: number): boolean {
  const distance = calculateDistance(lat1, lon1, lat2, lon2)
  return distance <= radiusMiles
}
