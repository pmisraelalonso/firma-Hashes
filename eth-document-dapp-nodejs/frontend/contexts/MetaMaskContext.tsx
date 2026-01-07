'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';
import { ANVIL_WALLETS, EthersUtils } from '@/utils/ethers';
import { AnvilWallet } from '@/types/ethereum';

interface MetaMaskContextType {
  account: string | null;
  isConnected: boolean;
  selectedWallet: AnvilWallet | null;
  connect: (walletIndex: number) => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
  getBalance: () => Promise<string>;
}

const MetaMaskContext = createContext<MetaMaskContextType | undefined>(undefined);

export function MetaMaskProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<AnvilWallet | null>(null);

  const connect = useCallback(async (walletIndex: number) => {
    try {
      console.log('🔌 Conectando wallet', walletIndex);
      
      const wallet = ANVIL_WALLETS[walletIndex];
      if (!wallet) {
        throw new Error('Wallet no encontrada');
      }

      setAccount(wallet.address);
      setSelectedWallet(wallet);
      setIsConnected(true);

      console.log('✅ Wallet conectada:', wallet.address);
    } catch (error) {
      console.error('❌ Error al conectar wallet:', error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    console.log('🔌 Desconectando wallet');
    setAccount(null);
    setSelectedWallet(null);
    setIsConnected(false);
  }, []);

  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!selectedWallet) {
      throw new Error('No hay wallet conectada');
    }

    console.log('🖊️ Firmando mensaje con wallet:', selectedWallet.address);
    const signature = await EthersUtils.signMessage(selectedWallet.privateKey, message);
    return signature;
  }, [selectedWallet]);

  const getBalance = useCallback(async (): Promise<string> => {
    if (!account) {
      throw new Error('No hay wallet conectada');
    }

    return await EthersUtils.getBalance(account);
  }, [account]);

  const value = {
    account,
    isConnected,
    selectedWallet,
    connect,
    disconnect,
    signMessage,
    getBalance,
  };

  return (
    <MetaMaskContext.Provider value={value}>
      {children}
    </MetaMaskContext.Provider>
  );
}

export function useMetaMask() {
  const context = useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error('useMetaMask debe usarse dentro de MetaMaskProvider');
  }
  return context;
}
