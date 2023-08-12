export function getUserAvatar(wallet: string) {
  const idx = Math.abs(wallet.charCodeAt(0)) % 6
  return `/assets/avatars/avatar_${idx + 1}.jpg`
}
