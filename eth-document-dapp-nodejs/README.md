# 🚀 ETH Document dApp - Node.js Edition

Una aplicación descentralizada (dApp) completa construida con **Node.js**, **Hardhat**, **Next.js** y **Solidity** para firmar y verificar documentos en la blockchain de Ethereum.

## 📋 Stack Tecnológico

### Backend (Smart Contracts)
- **Hardhat**: Framework de desarrollo Ethereum
- **Solidity**: ^0.8.24
- **OpenZeppelin**: Contratos seguros y auditados
- **Ethers.js**: v6.9 - Librería de interacción con Ethereum
- **Chai**: Testing framework

### Frontend
- **Next.js**: 14.2.35 (App Router)
- **React**: 18.2.0
- **TypeScript**: 5.3.0
- **Tailwind CSS**: 3.3.0
- **Lucide React**: Iconos modernos

## 🏗️ Estructura del Proyecto

```
eth-document-dapp-nodejs/
├── contracts/              # Smart Contracts en Solidity
│   └── DocumentRegistry.sol
├── scripts/                # Scripts de deployment y utilidades
│   ├── deploy.js
│   └── verify-deployment.js
├── test/                   # Tests con Hardhat y Chai
│   └── DocumentRegistry.test.js
├── frontend/               # Aplicación Next.js
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── utils/
│   └── types/
├── deployments/            # Información de deployments
├── hardhat.config.js       # Configuración de Hardhat
├── package.json            # Dependencias Node.js
└── .env.example            # Variables de entorno ejemplo
```

## ⚡ Inicio Rápido

### 1. Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd eth-document-dapp-nodejs

# Instalar dependencias del backend
npm install

# Instalar dependencias del frontend
cd frontend
npm install
cd ..
```

### 2. Configuración

```bash
# Copiar archivo de environment
cp .env.example .env

# Editar .env con tus configuraciones
nano .env
```

### 3. Desarrollo Local

#### Opción A: Todo en uno (Recomendado)
```bash
# Inicia nodo local, despliega contrato y frontend
npm run dev
```

#### Opción B: Paso a paso
```bash
# Terminal 1: Iniciar nodo local de Hardhat
npm run node

# Terminal 2: Desplegar contrato
npm run deploy:local

# Terminal 3: Iniciar frontend
npm run frontend:dev
```

### 4. Acceder a la dApp
```
http://localhost:3000
```

## 📝 Scripts Disponibles

### Backend (Smart Contracts)

```bash
# Compilar contratos
npm run compile

# Ejecutar tests
npm run test

# Test con cobertura
npm run test:coverage

# Limpiar artifacts
npm run clean

# Iniciar nodo local
npm run node

# Desplegar en local
npm run deploy:local

# Desplegar en Sepolia
npm run deploy:sepolia

# Verificar contrato
npm run verify
```

### Frontend

```bash
# Desarrollo
npm run frontend:dev

# Build de producción
npm run frontend:build

# Iniciar producción
npm run frontend:start
```

## 🧪 Testing

### Ejecutar todos los tests
```bash
npm test
```

### Tests con reporte de gas
```bash
REPORT_GAS=true npm test
```

### Cobertura de código
```bash
npm run test:coverage
```

### Tests individuales
```bash
npx hardhat test test/DocumentRegistry.test.js
```

## 📦 Smart Contract: DocumentRegistry

### Funciones Principales

#### `storeDocumentHash()`
Almacena un documento firmado en la blockchain.

```javascript
await registry.storeDocumentHash(
  documentHash,    // bytes32: Hash SHA-256 del documento
  timestamp,       // uint256: Marca de tiempo
  signature        // bytes: Firma ECDSA
);
```

#### `verifyDocument()`
Verifica la firma de un documento.

```javascript
const isValid = await registry.verifyDocument(
  documentHash,    // bytes32: Hash del documento
  signerAddress,   // address: Dirección del firmante
  signature        // bytes: Firma a verificar
);
```

#### `getDocumentInfo()`
Obtiene toda la información de un documento.

```javascript
const [hash, timestamp, signer, signature, exists] = 
  await registry.getDocumentInfo(documentHash);
```

#### `isDocumentStored()`
Verifica si un documento existe.

```javascript
const exists = await registry.isDocumentStored(documentHash);
```

### Eventos

```solidity
event DocumentStored(
    bytes32 indexed hash,
    address indexed signer,
    uint256 timestamp,
    bytes signature
);

event DocumentVerified(
    bytes32 indexed hash,
    address indexed signer,
    bool isValid
);
```

## 🌐 Deployment

### Local (Hardhat Network)

```bash
# Iniciar nodo
npm run node

# Desplegar (en otra terminal)
npm run deploy:local
```

### Testnet (Sepolia)

```bash
# 1. Configurar .env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_key

# 2. Desplegar
npm run deploy:sepolia

# 3. Verificar en Etherscan
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### Mainnet

```bash
# 1. Configurar .env con mainnet RPC
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key

# 2. Auditar el contrato antes de desplegar
# 3. Desplegar
npx hardhat run scripts/deploy.js --network mainnet
```

## 🔧 Configuración de Redes

### hardhat.config.js

```javascript
networks: {
  localhost: {
    url: "http://127.0.0.1:8545",
    chainId: 31337
  },
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 11155111
  },
  mainnet: {
    url: process.env.MAINNET_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 1
  }
}
```

## 💻 Desarrollo del Frontend

### Estructura de Componentes

```
frontend/
├── app/
│   ├── page.tsx              # Página principal
│   └── layout.tsx            # Layout global
├── components/
│   ├── DocumentSigner.tsx    # Componente de firma
│   ├── DocumentVerifier.tsx  # Componente verificación
│   ├── DocumentHistory.tsx   # Historial
│   ├── ContractDebug.tsx     # Panel de debug
│   ├── FileUploader.tsx      # Subida de archivos
│   └── WalletSelector.tsx    # Selector de wallet
├── hooks/
│   ├── useContract.ts        # Hook del contrato
│   └── useFileHash.ts        # Hook para hashing
├── contexts/
│   └── MetaMaskContext.tsx   # Contexto de wallet
└── utils/
    ├── ethers.ts             # Utilidades Ethers.js
    └── hash.ts               # Utilidades de hash
```

### Integración con el Contrato

```typescript
// hooks/useContract.ts
import { ethers } from 'ethers';
import contractABI from './abi/DocumentRegistry.json';

export function useContract() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL
  );
  
  const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    provider
  );
  
  return contract;
}
```

## 📊 Métricas de Gas

| Operación | Gas Estimado | Costo @ 20 gwei |
|-----------|--------------|-----------------|
| Deploy | ~1,000,000 | ~0.02 ETH |
| Store Document | ~130,000 | ~0.0026 ETH |
| Verify Document | 0 (view) | 0 ETH |
| Get Info | 0 (view) | 0 ETH |

## 🔒 Seguridad

### Best Practices Implementadas

- ✅ Uso de OpenZeppelin (contratos auditados)
- ✅ Verificación ECDSA
- ✅ Prevención de duplicados
- ✅ Events para tracking
- ✅ View functions (sin modificación de estado)
- ✅ Tests comprehensivos
- ✅ No almacenamiento de private keys en código
- ✅ Validación de inputs

### Auditoría

Antes de desplegar en mainnet:
1. Ejecutar `npm run test:coverage` (100% cobertura)
2. Revisar reporte de gas
3. Auditoría externa si es posible
4. Desplegar primero en testnet
5. Probar exhaustivamente

## 🐛 Troubleshooting

### Error: Cannot find module 'hardhat'
```bash
npm install
```

### Error: Network 'localhost' not found
```bash
# Asegúrate de que el nodo local esté corriendo
npm run node
```

### Error: Contract not deployed
```bash
# Verifica que hayas desplegado el contrato
npm run deploy:local
```

### Frontend no conecta con el contrato
```bash
# Verifica las variables de entorno en frontend/.env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

## 🚀 Roadmap

### Phase 1: MVP ✅
- [x] Smart contract con Hardhat
- [x] Tests comprehensivos
- [x] Scripts de deployment
- [x] Frontend básico con Next.js
- [x] Integración completa

### Phase 2: Mejoras 🚧
- [ ] MetaMask integration
- [ ] WalletConnect support
- [ ] IPFS para archivos grandes
- [ ] GraphQL API
- [ ] Subgraph para indexing

### Phase 3: Producción 📋
- [ ] Deploy en testnet pública
- [ ] Auditoría de seguridad
- [ ] Optimización de gas
- [ ] CI/CD con GitHub Actions
- [ ] Documentación completa

### Phase 4: Escalabilidad 🔮
- [ ] Layer 2 (Arbitrum/Optimism)
- [ ] Multi-chain support
- [ ] Mobile app
- [ ] API pública
- [ ] Batch operations

## 📚 Recursos

- [Documentación de Hardhat](https://hardhat.org/docs)
- [Ethers.js Docs](https://docs.ethers.org/)
- [OpenZeppelin](https://docs.openzeppelin.com/)
- [Next.js](https://nextjs.org/docs)
- [Solidity](https://docs.soliditylang.org/)

## 🤝 Contribuir

```bash
# 1. Fork el proyecto
# 2. Crear branch
git checkout -b feature/amazing-feature

# 3. Commit cambios
git commit -m 'Add amazing feature'

# 4. Push
git push origin feature/amazing-feature

# 5. Abrir Pull Request
```

## 📄 Licencia

MIT License - Ver archivo LICENSE

## 👥 Soporte

- GitHub Issues: [Issues](https://github.com/your-repo/issues)
- Email: support@example.com

---

**Última actualización:** 7 de enero de 2026  
**Versión:** 2.0.0 - Node.js Edition

🎉 **Proyecto completamente funcional con Node.js y Hardhat!**
