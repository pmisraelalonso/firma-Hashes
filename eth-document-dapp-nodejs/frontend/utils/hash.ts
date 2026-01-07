import { ethers } from 'ethers';

export class HashUtils {
  static async calculateFileHash(file: File): Promise<string> {
    console.log('📄 Calculando hash del archivo:', file.name);
    
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const hash = ethers.keccak256(uint8Array);
    
    console.log('✅ Hash calculado:', hash);
    return hash;
  }

  static hashString(text: string): string {
    return ethers.keccak256(ethers.toUtf8Bytes(text));
  }

  static bytesToHex(bytes: Uint8Array): string {
    return ethers.hexlify(bytes);
  }

  static hexToBytes(hex: string): Uint8Array {
    return ethers.getBytes(hex);
  }
}
