import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { EthersUtils } from '@/utils/ethers';
import { useMetaMask } from '@/contexts/MetaMaskContext';

const CONTRACT_ABI = [
  'function storeDocumentHash(bytes32 hash, uint256 timestamp, bytes signature) external',
  'function verifyDocument(bytes32 hash, address signer, bytes signature) external view returns (bool)',
  'function getDocumentInfo(bytes32 hash) external view returns (bytes32, uint256, address, bytes, bool)',
  'function isDocumentStored(bytes32 hash) external view returns (bool)',
  'function getDocumentSignature(bytes32 hash) external view returns (bytes)',
  'event DocumentStored(bytes32 indexed hash, address indexed signer, uint256 timestamp, bytes signature)'
];

export function useContract() {
  const { selectedWallet } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContract = useCallback(() => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error('CONTRACT_ADDRESS no configurado');
    }

    const provider = EthersUtils.getProvider();
    return new ethers.Contract(contractAddress, CONTRACT_ABI, provider);
  }, []);

  const storeDocument = useCallback(async (
    hash: string,
    signature: string
  ): Promise<string> => {
    if (!selectedWallet) {
      throw new Error('No hay wallet conectada');
    }

    setLoading(true);
    setError(null);

    try {
      console.log('💾 Almacenando documento en blockchain...');
      
      const contract = getContract();
      const wallet = EthersUtils.getWallet(selectedWallet.privateKey);
      const contractWithSigner = contract.connect(wallet) as any;

      const timestamp = Math.floor(Date.now() / 1000);
      
      const tx = await contractWithSigner.storeDocumentHash(
        hash,
        timestamp,
        signature
      );

      console.log('⏳ Esperando confirmación de transacción...');
      const receipt = await tx.wait();
      
      if (!receipt) {
        throw new Error('No se recibió confirmación de la transacción');
      }
      
      console.log('✅ Documento almacenado! TX:', receipt.hash);
      return receipt.hash;
    } catch (err: any) {
      console.error('❌ Error al almacenar documento:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedWallet, getContract]);

  const verifyDocument = useCallback(async (
    hash: string,
    signerAddress: string,
    signature: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Verificando documento...');
      
      // Verificar usando ethers.js directamente (más confiable)
      const recoveredAddress = EthersUtils.verifyMessage(hash, signature);
      const isValid = recoveredAddress.toLowerCase() === signerAddress.toLowerCase();
      
      console.log('✅ Resultado de verificación:', isValid);
      console.log('📍 Dirección esperada:', signerAddress);
      console.log('📍 Dirección recuperada:', recoveredAddress);
      
      return isValid;
    } catch (err: any) {
      console.error('❌ Error al verificar documento:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getContract]);

  const getDocumentInfo = useCallback(async (hash: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('📋 Obteniendo información del documento...');
      
      const contract = getContract();
      const info = await contract.getDocumentInfo(hash);
      
      const [docHash, timestamp, signer, signature, exists] = info;
      
      console.log('✅ Información obtenida:', {
        hash: docHash,
        timestamp: timestamp.toString(),
        signer,
        exists
      });

      return {
        hash: docHash,
        timestamp: Number(timestamp),
        signer,
        signature,
        exists
      };
    } catch (err: any) {
      console.error('❌ Error al obtener información:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getContract]);

  const isDocumentStored = useCallback(async (hash: string): Promise<boolean> => {
    try {
      const contract = getContract();
      return await contract.isDocumentStored(hash);
    } catch (err: any) {
      console.error('❌ Error al verificar existencia:', err);
      setError(err.message);
      return false;
    }
  }, [getContract]);

  return {
    storeDocument,
    verifyDocument,
    getDocumentInfo,
    isDocumentStored,
    loading,
    error
  };
}
