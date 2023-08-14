export function getUserAvatar(wallet?: string) {
  const idx = Math.abs((wallet ?? "A").charCodeAt(0)) % 6
  return `/assets/avatars/avatar_${idx + 1}.jpg`
}
