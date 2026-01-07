'use client';

import React, { useState } from 'react';
import { Wallet, ChevronDown } from 'lucide-react';
import { useMetaMask } from '@/contexts/MetaMaskContext';
import { ANVIL_WALLETS } from '@/utils/ethers';

export function WalletSelector() {
  const { account, isConnected, connect, disconnect } = useMetaMask();
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = async (index: number) => {
    await connect(index);
    setIsOpen(false);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Wallet className="mr-2 h-5 w-5" />
          Connect Wallet
          <ChevronDown className="ml-2 h-4 w-4" />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-2 max-h-96 overflow-y-auto">
              {ANVIL_WALLETS.map((wallet) => (
                <button
                  key={wallet.index}
                  onClick={() => handleConnect(wallet.index)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Wallet {wallet.index}
                      </p>
                      <p className="text-xs font-mono text-gray-600">
                        {formatAddress(wallet.address)}
                      </p>
                    </div>
                    <Wallet className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        <Wallet className="mr-2 h-5 w-5" />
        {formatAddress(account!)}
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-700">Cuenta actual</p>
            <p className="text-xs font-mono text-gray-600 break-all">{account}</p>
          </div>

          <div className="p-2 max-h-64 overflow-y-auto">
            <p className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
              Cambiar wallet
            </p>
            {ANVIL_WALLETS.map((wallet) => (
              <button
                key={wallet.index}
                onClick={() => handleConnect(wallet.index)}
                disabled={wallet.address.toLowerCase() === account?.toLowerCase()}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  wallet.address.toLowerCase() === account?.toLowerCase()
                    ? 'bg-green-50 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Wallet {wallet.index}</p>
                    <p className="text-xs font-mono text-gray-600">
                      {formatAddress(wallet.address)}
                    </p>
                  </div>
                  {wallet.address.toLowerCase() === account?.toLowerCase() && (
                    <span className="text-green-600 text-xs font-medium">Actual</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-gray-200">
            <button
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
