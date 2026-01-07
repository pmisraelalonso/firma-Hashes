'use client';

import { useState, useEffect, useCallback } from 'react';
import { Code, ChevronDown, ChevronUp, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { useContract } from '@/hooks/useContract';
import { useMetaMask } from '@/contexts/MetaMaskContext';
import { ethers } from 'ethers';

interface ContractInfo {
  address: string;
  rpcUrl: string;
  chainId: string;
  totalDocuments: number;
  latestBlock: number;
  networkStatus: 'connected' | 'disconnected';
}

export function ContractDebug() {
  const { contract } = useContract();
  const { selectedWallet } = useMetaMask();
  const [isExpanded, setIsExpanded] = useState(false);
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadContractInfo = useCallback(async () => {
    setLoading(true);
    try {
      const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'Not configured';
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'Not configured';
      const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || 'Not configured';

      let totalDocuments = 0;
      let latestBlock = 0;
      let networkStatus: 'connected' | 'disconnected' = 'disconnected';

      if (contract) {
        try {
          // Intentar obtener eventos para contar documentos
          const filter = contract.filters.DocumentStored();
          const events = await contract.queryFilter(filter, 0, 'latest');
          totalDocuments = events.length;

          // Obtener el bloque más reciente usando ethers.js
          const rpcUrlEnv = process.env.NEXT_PUBLIC_RPC_URL;
          if (rpcUrlEnv) {
            const provider = new ethers.JsonRpcProvider(rpcUrlEnv);
            latestBlock = await provider.getBlockNumber();
            networkStatus = 'connected';
          }
        } catch (err) {
          console.error('Error fetching contract data:', err);
        }
      }

      setContractInfo({
        address,
        rpcUrl,
        chainId,
        totalDocuments,
        latestBlock,
        networkStatus,
      });
    } catch (error) {
      console.error('Error loading contract info:', error);
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    loadContractInfo();
  }, [loadContractInfo]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (address: string) => {
    if (address.length < 42) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="w-full px-4 py-3 flex items-center justify-between text-white">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <Code className="h-5 w-5 text-emerald-400" />
            <span className="font-semibold text-sm">Contract Debug Info</span>
            {contractInfo && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                contractInfo.networkStatus === 'connected'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {contractInfo.networkStatus === 'connected' ? '● Online' : '● Offline'}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 ml-2" />
            ) : (
              <ChevronDown className="h-5 w-5 ml-2" />
            )}
          </button>
          <button
            onClick={loadContractInfo}
            className="p-1 hover:bg-slate-600 rounded transition-colors"
            title="Actualizar"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Content */}
        {isExpanded && contractInfo && (
          <div className="px-4 pb-4 space-y-3 text-sm">
            {/* Contract Address */}
            <div className="bg-slate-700/50 rounded p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400 text-xs font-medium">Contract Address</span>
                <button
                  onClick={() => copyToClipboard(contractInfo.address)}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  title="Copiar"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <span className="text-white font-mono text-xs">
                {formatAddress(contractInfo.address)}
              </span>
            </div>

            {/* Network Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-700/50 rounded p-3">
                <div className="text-slate-400 text-xs font-medium mb-1">RPC URL</div>
                <div className="text-white font-mono text-xs truncate">
                  {contractInfo.rpcUrl}
                </div>
              </div>
              <div className="bg-slate-700/50 rounded p-3">
                <div className="text-slate-400 text-xs font-medium mb-1">Chain ID</div>
                <div className="text-white font-mono text-xs">
                  {contractInfo.chainId}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-700/50 rounded p-3">
                <div className="text-slate-400 text-xs font-medium mb-1">Total Documents</div>
                <div className="text-emerald-400 font-bold text-lg">
                  {contractInfo.totalDocuments}
                </div>
              </div>
              <div className="bg-slate-700/50 rounded p-3">
                <div className="text-slate-400 text-xs font-medium mb-1">Latest Block</div>
                <div className="text-blue-400 font-bold text-lg">
                  #{contractInfo.latestBlock}
                </div>
              </div>
            </div>

            {/* Connected Wallet */}
            {selectedWallet && (
              <div className="bg-slate-700/50 rounded p-3">
                <div className="text-slate-400 text-xs font-medium mb-1">Connected Wallet</div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-mono text-xs">
                    {formatAddress(selectedWallet.address)}
                  </span>
                  <span className="text-emerald-400 text-xs bg-emerald-500/20 px-2 py-1 rounded">
                    Wallet #{selectedWallet.index}
                  </span>
                </div>
              </div>
            )}

            {/* Contract ABI Info */}
            <div className="bg-slate-700/50 rounded p-3">
              <div className="text-slate-400 text-xs font-medium mb-2">Available Functions</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <span className="text-emerald-400">●</span>
                  <span className="text-slate-300">storeDocumentHash</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-blue-400">●</span>
                  <span className="text-slate-300">verifyDocument</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-purple-400">●</span>
                  <span className="text-slate-300">getDocumentInfo</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-amber-400">●</span>
                  <span className="text-slate-300">isDocumentStored</span>
                </div>
              </div>
            </div>

            {/* Events */}
            <div className="bg-slate-700/50 rounded p-3">
              <div className="text-slate-400 text-xs font-medium mb-2">Contract Events</div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-pink-400">●</span>
                <span className="text-slate-300">DocumentStored</span>
                <span className="text-slate-500 text-xs">
                  ({contractInfo.totalDocuments} emitted)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
