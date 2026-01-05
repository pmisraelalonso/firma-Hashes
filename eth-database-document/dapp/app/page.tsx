'use client';

import { useState } from 'react';
import { FileText, Shield } from 'lucide-react';
import { WalletSelector } from '@/components/WalletSelector';
import { DocumentSigner } from '@/components/DocumentSigner';
import { DocumentVerifier } from '@/components/DocumentVerifier';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'sign' | 'verify'>('sign');

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-12 w-12 text-blue-600" />
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  ETH Database Document
                </h1>
                <p className="text-gray-600 mt-1">
                  Verificación descentralizada de documentos en Ethereum
                </p>
              </div>
            </div>
            <WalletSelector />
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('sign')}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === 'sign'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileText className="inline-block mr-2 h-5 w-5" />
                Firmar Documento
              </button>
              <button
                onClick={() => setActiveTab('verify')}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === 'verify'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Shield className="inline-block mr-2 h-5 w-5" />
                Verificar Documento
              </button>
            </div>

            <div className="p-8">
              {activeTab === 'sign' ? (
                <DocumentSigner />
              ) : (
                <DocumentVerifier />
              )}
            </div>
          </div>

          <footer className="mt-8 text-center text-gray-600 text-sm">
            <p>
              Desarrollado con Next.js, Ethers.js y Solidity
            </p>
            <p className="mt-2">
              ⚠️ Solo para desarrollo local con Anvil
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
