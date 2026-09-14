const requestLog = new Map<string, number[]>()

const WINDOW_MS = 5 * 60 * 1000
const MAX_REQUESTS = 10

export function isRateLimited(key: string): boolean {
  const now = Date.now()
  const timestamps = requestLog.get(key) || []

  const recent = timestamps.filter((t) => now - t < WINDOW_MS)

  if (recent.length >= MAX_REQUESTS) {
    requestLog.set(key, recent)
    return true
  }

  recent.push(now)
  requestLog.set(key, recent)
  return false
}