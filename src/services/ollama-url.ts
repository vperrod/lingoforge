// Build-time guard for VITE_OLLAMA_URL, which vite.config.ts templates into the
// CSP connect-src. Only local/LAN hosts are accepted so a tampered build env
// can't widen the policy to an arbitrary origin.
const LAN_V4 = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^169\.254\./,
]

export function isLocalHost(hostname: string): boolean {
  if (hostname === 'localhost' || hostname === '[::1]' || hostname.endsWith('.local')) return true
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) && LAN_V4.some((re) => re.test(hostname))
}

/** Returns the bare origin to put in the CSP, or throws if the URL isn't a local/LAN origin. */
export function toCspOllamaOrigin(raw: string): string {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new Error(`VITE_OLLAMA_URL is not a valid URL: ${JSON.stringify(raw)}`)
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`VITE_OLLAMA_URL must be http(s): ${JSON.stringify(raw)}`)
  }
  if (!isLocalHost(url.hostname)) {
    throw new Error(`VITE_OLLAMA_URL host must be localhost or a LAN address: ${JSON.stringify(raw)}`)
  }
  return url.origin
}
