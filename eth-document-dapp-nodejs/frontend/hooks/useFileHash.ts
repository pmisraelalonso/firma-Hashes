import { useState, useCallback } from 'react';
import { HashUtils } from '@/utils/hash';

export function useFileHash() {
  const [hash, setHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateHash = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setHash(null);

    try {
      console.log('🔐 Iniciando cálculo de hash...');
      const fileHash = await HashUtils.calculateFileHash(file);
      setHash(fileHash);
      console.log('✅ Hash calculado exitosamente');
      return fileHash;
    } catch (err: any) {
      console.error('❌ Error al calcular hash:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setHash(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    hash,
    loading,
    error,
    calculateHash,
    reset
  };
}
