'use client';

import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useFileHash } from '@/hooks/useFileHash';
import { useContract } from '@/hooks/useContract';
import { FileUploader } from './FileUploader';

export function DocumentVerifier() {
  const { hash, calculateHash } = useFileHash();
  const { getDocumentInfo, loading } = useContract();
  const [signerAddress, setSignerAddress] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const handleFileSelect = async (file: File) => {
    setVerificationResult(null);
    await calculateHash(file);
  };

  const handleVerify = async () => {
    if (!hash) {
      alert('Por favor, primero sube un archivo');
      return;
    }

    if (!signerAddress || !/^0x[a-fA-F0-9]{40}$/.test(signerAddress)) {
      alert('Por favor, ingresa una dirección Ethereum válida');
      return;
    }

    try {
      console.log('🔍 Verificando documento...');
      const info = await getDocumentInfo(hash);

      if (!info.exists) {
        setVerificationResult({
          isValid: false,
          message: 'Este documento no está registrado en la blockchain',
        });
        return;
      }

      const isValid = info.signer.toLowerCase() === signerAddress.toLowerCase();

      setVerificationResult({
        isValid,
        message: isValid
          ? '✅ Documento válido y verificado'
          : '❌ La firma no coincide con el firmante especificado',
        details: {
          hash: info.hash,
          timestamp: new Date(info.timestamp * 1000).toLocaleString(),
          signer: info.signer,
          signature: info.signature,
        },
      });
    } catch (error: any) {
      setVerificationResult({
        isValid: false,
        message: `Error al verificar: ${error.message}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Search className="mr-2" />
          Verificar Documento
        </h2>
        <p className="text-gray-600 mb-6">
          Sube un archivo y verifica su autenticidad en la blockchain
        </p>
      </div>

      <FileUploader onFileSelect={handleFileSelect} />

      {hash && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 mb-2">Hash calculado:</p>
          <p className="text-xs font-mono text-blue-700 break-all">{hash}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dirección del firmante
        </label>
        <input
          type="text"
          value={signerAddress}
          onChange={(e) => setSignerAddress(e.target.value)}
          placeholder="0x..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        onClick={handleVerify}
        disabled={!hash || !signerAddress || loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Verificando...' : 'Verificar Documento'}
      </button>

      {verificationResult && (
        <div
          className={`border-2 rounded-lg p-6 ${
            verificationResult.isValid
              ? 'bg-green-50 border-green-500'
              : 'bg-red-50 border-red-500'
          }`}
        >
          <div className="flex items-center mb-4">
            {verificationResult.isValid ? (
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600 mr-3" />
            )}
            <p className="text-lg font-bold">{verificationResult.message}</p>
          </div>

          {verificationResult.details && (
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Hash:</span>
                <p className="font-mono text-xs break-all">{verificationResult.details.hash}</p>
              </div>
              <div>
                <span className="font-medium">Timestamp:</span> {verificationResult.details.timestamp}
              </div>
              <div>
                <span className="font-medium">Firmante:</span>
                <p className="font-mono text-xs break-all">{verificationResult.details.signer}</p>
              </div>
              <div>
                <span className="font-medium">Firma:</span>
                <p className="font-mono text-xs break-all">{verificationResult.details.signature}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
