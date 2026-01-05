# ETH Database Document - dApp de Verificación de Documentos

Sistema completo de verificación de documentos en blockchain usando Ethereum, Foundry, Next.js y Ethers.js.

## 📋 Descripción

Este proyecto permite:
- ✅ Calcular hashes criptográficos de documentos
- ✅ Firmar documentos digitalmente con wallets de Anvil
- ✅ Almacenar hashes y firmas en la blockchain de Ethereum
- ✅ Verificar la autenticidad de documentos
- ✅ Interfaz web intuitiva sin necesidad de MetaMask

## 🏗️ Arquitectura

```
eth-database-document/
├── contracts/              # Smart Contracts Solidity
│   ├── DocumentRegistry.sol
│   └── interfaces/
│       └── IDocumentRegistry.sol
├── script/                # Scripts de despliegue
│   └── Deploy.s.sol
├── test/                  # Tests de contratos
│   └── DocumentRegistry.t.sol
├── dapp/                  # Aplicación Next.js
│   ├── app/              # App Router de Next.js
│   ├── components/       # Componentes React
│   ├── contexts/         # React Context (MetaMask)
│   ├── hooks/            # Custom Hooks
│   ├── utils/            # Utilidades (Ethers, Hash)
│   └── types/            # TypeScript Types
└── foundry.toml          # Configuración de Foundry
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ y npm
- Foundry (Forge, Cast, Anvil)

### 1. Instalar Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Clonar y configurar el proyecto

```bash
cd eth-database-document
```

### 3. Instalar dependencias de OpenZeppelin

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

### 4. Compilar contratos

```bash
forge build
```

### 5. Ejecutar tests de contratos

```bash
forge test -vv
```

## 🔧 Despliegue y Ejecución

### Terminal 1: Iniciar Anvil (Blockchain local)

```bash
anvil
```

Esto iniciará una blockchain local en `http://localhost:8545` con 10 wallets precargadas.

### Terminal 2: Desplegar el contrato

```bash
forge script script/Deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**Importante**: Copia la dirección del contrato desplegado que aparece en la consola.

### Terminal 3: Configurar e iniciar la dApp

```bash
cd dapp

# Instalar dependencias
npm install

# Actualizar .env.local con la dirección del contrato
nano .env.local
# Cambiar NEXT_PUBLIC_CONTRACT_ADDRESS por la dirección desplegada

# Iniciar servidor de desarrollo
npm run dev
```

### 6. Abrir en el navegador

```
http://localhost:3000
```

## 📚 Uso de la Aplicación

### Firmar y Almacenar un Documento

1. **Conectar Wallet**: Haz clic en "Connect Wallet" y selecciona una de las 10 wallets de Anvil
2. **Subir Archivo**: En la pestaña "Firmar Documento", arrastra o selecciona un archivo
3. **Firmar**: Haz clic en "Firmar Documento" para generar la firma digital
4. **Almacenar**: Haz clic en "Almacenar en Blockchain" para guardar el hash y firma en la cadena

### Verificar un Documento

1. **Subir Archivo**: En la pestaña "Verificar Documento", sube el archivo a verificar
2. **Ingresar Dirección**: Ingresa la dirección Ethereum del firmante esperado
3. **Verificar**: Haz clic en "Verificar Documento"
4. **Resultado**: El sistema mostrará si el documento es válido y sus detalles

## 🔐 Wallets de Anvil Predefinidas

El proyecto incluye 10 wallets de Anvil precargadas con 10,000 ETH cada una:

| Index | Dirección |
|-------|-----------|
| 0 | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 |
| 1 | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 |
| 2 | 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC |
| ... | ... |

## 🧪 Testing

### Tests de Smart Contracts

```bash
# Ejecutar todos los tests
forge test

# Tests con detalle
forge test -vv

# Tests con trazas completas
forge test -vvvv

# Test específico
forge test --match-test testStoreDocument
```

### Cobertura de código

```bash
forge coverage
```

## 📦 Smart Contract: DocumentRegistry

### Funciones Principales

```solidity
// Almacenar hash de documento
function storeDocumentHash(
    bytes32 hash,
    uint256 timestamp,
    bytes memory signature
) external

// Verificar documento
function verifyDocument(
    bytes32 hash,
    address signer,
    bytes memory signature
) external returns (bool)

// Obtener información de documento
function getDocumentInfo(bytes32 hash) 
    external 
    view 
    returns (
        bytes32,
        uint256,
        address,
        bytes memory,
        bool
    )

// Verificar si documento existe
function isDocumentStored(bytes32 hash) 
    external 
    view 
    returns (bool)
```

### Eventos

```solidity
event DocumentStored(
    bytes32 indexed hash,
    address indexed signer,
    uint256 timestamp,
    bytes signature
)
```

## 🛠️ Tecnologías Utilizadas

### Smart Contracts
- **Solidity** 0.8.20
- **Foundry** (Forge, Cast, Anvil)
- **OpenZeppelin** (ECDSA para verificación de firmas)

### Frontend
- **Next.js** 14 (App Router)
- **React** 18
- **TypeScript** 5
- **Tailwind CSS** 3
- **Ethers.js** 6
- **Lucide React** (Iconos)

## 🔒 Seguridad

⚠️ **IMPORTANTE**: Este proyecto está diseñado SOLO para desarrollo local y fines educativos.

- NO usar en producción
- NO usar en redes públicas (Mainnet, Testnets)
- Las claves privadas están hardcodeadas para desarrollo local
- En producción, usar servicios de wallet como MetaMask o WalletConnect

## 📝 Variables de Entorno

Archivo `dapp/.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

## 🐛 Troubleshooting

### El contrato no se despliega
```bash
# Verificar que Anvil esté corriendo
ps aux | grep anvil

# Reiniciar Anvil si es necesario
pkill anvil
anvil
```

### La dApp no se conecta al contrato
1. Verificar que la dirección del contrato en `.env.local` sea correcta
2. Asegurarse de que Anvil esté corriendo en el puerto 8545
3. Reiniciar el servidor de Next.js (`npm run dev`)

### Errores de compilación de contratos
```bash
# Limpiar caché de Foundry
forge clean

# Reinstalar dependencias
rm -rf lib
forge install OpenZeppelin/openzeppelin-contracts

# Recompilar
forge build
```

## 📖 Comandos Útiles

```bash
# Foundry
forge build              # Compilar contratos
forge test              # Ejecutar tests
forge clean             # Limpiar artefactos
forge fmt               # Formatear código
cast call <addr> <sig>  # Llamar función view

# Next.js
npm run dev             # Servidor de desarrollo
npm run build           # Build de producción
npm run start           # Servidor de producción
npm run lint            # Linter

# Anvil
anvil                   # Blockchain local
anvil --port 8546       # Puerto personalizado
```

## 🤝 Contribución

Este es un proyecto educativo. Las contribuciones son bienvenidas:

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - Este proyecto es de código abierto y gratuito.

## 👨‍💻 Autor

Desarrollado como proyecto educativo para aprender desarrollo de dApps en Ethereum.

## 🙏 Agradecimientos

- OpenZeppelin por sus contratos seguros
- Foundry por las herramientas de desarrollo
- Next.js por el framework de React
- Ethers.js por la integración con Ethereum

---

**⚠️ Recordatorio**: Este proyecto es SOLO para desarrollo local. No usar en producción sin las debidas modificaciones de seguridad.
