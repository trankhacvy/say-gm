export const Routes = {
  INDEX: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard/nfts",
  SETTINGS: "/dashboard/settings",
  NEW_NFT: "/dashboard/nfts/new",
  NFT_DETAIL: (nftId: string) => `/dashboard/nfts/${nftId}`,
  NFT_DETAIL_EDIT: (nftId: string) => `/dashboard/nfts/${nftId}/edit`,
  NFT_DETAIL_MINT_WEBSITE: (nftId: string) => `/dashboard/nfts/${nftId}/mint-website`,
  DROP_DETAIL: (nftId: string, dropId: string) => `/dashboard/nfts/${nftId}/drop/${dropId}`,
}
