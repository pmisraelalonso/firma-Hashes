export interface Document {
  hash: string;
  timestamp: number;
  signer: string;
  signature: string;
  exists: boolean;
}

export interface WalletInfo {
  address: string;
  privateKey: string;
  balance?: string;
}

export interface AnvilWallet {
  index: number;
  address: string;
  privateKey: string;
}
