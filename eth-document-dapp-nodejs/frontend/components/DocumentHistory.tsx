'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, FileCheck, AlertCircle, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { useContract } from '@/hooks/useContract';
import { ethers } from 'ethers';

interface DocumentEvent {
  hash: string;
  signer: string;
  timestamp: number;
  signature: string;
  blockNumber: number;
  transactionHash: string;
  type: 'stored';
}

interface VerificationRecord {
  hash: string;
  signer: string;
  isValid: boolean;
  timestamp: number;
}

export function DocumentHistory() {
  const { contract } = useContract();
  const [storedDocuments, setStoredDocuments] = useState<DocumentEvent[]>([]);
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'stored' | 'verified'>('all');

  const loadHistory = useCallback(async () => {
    if (!contract) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Obtener eventos de documentos almacenados
      const filter = contract.filters.DocumentStored();
      const events = await contract.queryFilter(filter, 0, 'latest');

      const documents: DocumentEvent[] = events.map((event: any) => ({
        hash: event.args.hash,
        signer: event.args.signer,
        timestamp: Number(event.args.timestamp),
        signature: event.args.signature,
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        type: 'stored' as const,
      }));

      setStoredDocuments(documents.reverse()); // Más recientes primero

      // Cargar verificaciones del localStorage
      const savedVerifications = localStorage.getItem('documentVerifications');
      if (savedVerifications) {
        setVerifications(JSON.parse(savedVerifications));
      }
    } catch (err: any) {
      console.error('Error loading history:', err);
      setError(err.message || 'Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredDocuments = (() => {
    if (activeFilter === 'stored') return storedDocuments;
    if (activeFilter === 'verified') return [];
    return storedDocuments;
  })();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900">Error al cargar historial</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={loadHistory}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Historial de Documentos
          </h2>
        </div>
        <button
          onClick={loadHistory}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex space-x-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Todos ({storedDocuments.length})
        </button>
        <button
          onClick={() => setActiveFilter('stored')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'stored'
              ? 'bg-green-100 text-green-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Almacenados ({storedDocuments.length})
        </button>
        <button
          onClick={() => setActiveFilter('verified')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'verified'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Verificados ({verifications.length})
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-900">{storedDocuments.length}</p>
            </div>
            <FileCheck className="h-8 w-8 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Almacenados</p>
              <p className="text-2xl font-bold text-green-900">{storedDocuments.length}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Verificados</p>
              <p className="text-2xl font-bold text-purple-900">{verifications.length}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Lista de documentos */}
      {storedDocuments.length === 0 && verifications.length === 0 ? (
        <div className="text-center py-12">
          <FileCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay documentos en el historial
          </h3>
          <p className="text-gray-600">
            Los documentos firmados y verificados aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeFilter !== 'verified' && storedDocuments.map((doc, index) => (
            <div
              key={`${doc.transactionHash}-${index}`}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Documento Almacenado</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Block #{doc.blockNumber}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-500 w-32 flex-shrink-0">Hash:</span>
                      <button
                        onClick={() => copyToClipboard(doc.hash)}
                        className="font-mono text-blue-600 hover:text-blue-700 break-all text-left"
                        title="Click para copiar"
                      >
                        {formatHash(doc.hash)}
                      </button>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32 flex-shrink-0">Firmante:</span>
                      <button
                        onClick={() => copyToClipboard(doc.signer)}
                        className="font-mono text-blue-600 hover:text-blue-700"
                        title="Click para copiar"
                      >
                        {formatAddress(doc.signer)}
                      </button>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32 flex-shrink-0">Fecha:</span>
                      <span className="text-gray-900">{formatDate(doc.timestamp)}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <span className="text-gray-500 w-32 flex-shrink-0">TX Hash:</span>
                      <button
                        onClick={() => copyToClipboard(doc.transactionHash)}
                        className="font-mono text-blue-600 hover:text-blue-700 text-xs"
                        title="Click para copiar"
                      >
                        {formatHash(doc.transactionHash)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {activeFilter !== 'stored' && verifications.map((verification, index) => (
            <div
              key={`verification-${index}`}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {verification.isValid ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-gray-900">Verificación Exitosa</span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          Válido
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="font-semibold text-gray-900">Verificación Fallida</span>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          Inválido
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-500 w-32 flex-shrink-0">Hash:</span>
                      <span className="font-mono text-gray-900 break-all">
                        {formatHash(verification.hash)}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32 flex-shrink-0">Firmante:</span>
                      <span className="font-mono text-gray-900">
                        {formatAddress(verification.signer)}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32 flex-shrink-0">Verificado:</span>
                      <span className="text-gray-900">
                        {new Date(verification.timestamp).toLocaleString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
