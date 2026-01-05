'use client';

import React, { useState } from 'react';
import { FileText, Edit3, CheckCircle } from 'lucide-react';
import { useMetaMask } from '@/contexts/MetaMaskContext';
import { useFileHash } from '@/hooks/useFileHash';
import { useContract } from '@/hooks/useContract';
import { FileUploader } from './FileUploader';

export function DocumentSigner() {
  const { isConnected, account, signMessage } = useMetaMask();
  const { hash, calculateHash } = useFileHash();
  const { storeDocument, loading } = useContract();
  const [signature, setSignature] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setSignature(null);
    setTxHash(null);
    await calculateHash(selectedFile);
  };

  const handleSign = async () => {
    if (!hash) {
      alert('Por favor, primero sube un archivo');
      return;
    }

    try {
      const confirmed = window.confirm(
        `¿Deseas firmar este documento?\n\nHash: ${hash}\n\nCuenta: ${account}`
      );

      if (!confirmed) return;

      console.log('🔐 Firmando hash:', hash);
      const sig = await signMessage(hash);
      setSignature(sig);
      console.log('✅ Firma obtenida:', sig);
      
      alert(`✅ Documento firmado exitosamente!\n\nFirma: ${sig.substring(0, 20)}...`);
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      alert(`❌ Error al firmar: ${error.message}`);
    }
  };

  const handleStore = async () => {
    if (!hash || !signature) {
      alert('Por favor, primero firma el documento');
      return;
    }

    try {
      const confirmed = window.confirm(
        `¿Deseas almacenar este documento en la blockchain?\n\n` +
        `Hash: ${hash}\n` +
        `Firmante: ${account}\n` +
        `Firma: ${signature.substring(0, 20)}...\n\n` +
        `Esta acción es irreversible.`
      );

      if (!confirmed) return;

      const tx = await storeDocument(hash, signature);
      setTxHash(tx);
      
      alert(`✅ Documento almacenado en blockchain!\n\nTransaction Hash: ${tx}`);
    } catch (error: any) {
      alert(`❌ Error al almacenar: ${error.message}`);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Por favor, conecta tu wallet para continuar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Edit3 className="mr-2" />
          Firmar Documento
        </h2>
        <p className="text-gray-600 mb-6">
          Sube un archivo, fírmalo y almacénalo en la blockchain
        </p>
      </div>

      <FileUploader onFileSelect={handleFileSelect} />

      {hash && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 mb-2">Hash del documento:</p>
          <p className="text-xs font-mono text-blue-700 break-all">{hash}</p>
        </div>
      )}

      {signature && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-medium text-green-900 mb-2 flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            Firma generada:
          </p>
          <p className="text-xs font-mono text-green-700 break-all">{signature}</p>
        </div>
      )}

      {txHash && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm font-medium text-purple-900 mb-2 flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            Transaction Hash:
          </p>
          <p className="text-xs font-mono text-purple-700 break-all">{txHash}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleSign}
          disabled={!hash || loading || !!signature}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Procesando...' : signature ? '✓ Firmado' : 'Firmar Documento'}
        </button>

        <button
          onClick={handleStore}
          disabled={!signature || loading || !!txHash}
          className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Almacenando...' : txHash ? '✓ Almacenado' : 'Almacenar en Blockchain'}
        </button>
      </div>
    </div>
  );
}
