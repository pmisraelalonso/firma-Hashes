# 📑 Índice de Archivos - ETH Database Document

## 📂 Estructura Completa del Proyecto

### 🏗️ Raíz del Proyecto

```
eth-database-document/
├── 📖 README.md                     → Documentación completa del proyecto
├── 🚀 QUICKSTART.md                 → Guía de inicio rápido (3 pasos)
├── 📝 PROJECT_SUMMARY.md            → Resumen ejecutivo del proyecto
├── 📑 FILE_INDEX.md                 → Este archivo (índice de navegación)
├── ⚙️ foundry.toml                  → Configuración de Foundry
├── 🙈 .gitignore                    → Archivos a ignorar en Git
├── 🔧 setup.sh                      → Script de setup automático
├── 🚀 deploy.sh                     → Script de despliegue en Anvil
└── 💡 commands.sh                   → Script con comandos útiles
```

---

## 📁 Estructura por Categorías

### 1️⃣ Smart Contracts (Solidity)

#### 📂 contracts/
Contratos principales del proyecto

| Archivo | Descripción | Líneas |
|---------|-------------|---------|
| `DocumentRegistry.sol` | Contrato principal con lógica de negocio | ~90 |
| `interfaces/IDocumentRegistry.sol` | Interfaz del contrato | ~40 |

**Funciones principales:**
- `storeDocumentHash()` - Almacenar documento
- `verifyDocument()` - Verificar firma
- `getDocumentInfo()` - Obtener información
- `isDocumentStored()` - Verificar existencia

#### 📂 script/
Scripts de despliegue

| Archivo | Descripción |
|---------|-------------|
| `Deploy.s.sol` | Script de despliegue automatizado |

#### 📂 test/
Tests unitarios

| Archivo | Descripción | Tests |
|---------|-------------|-------|
| `DocumentRegistry.t.sol` | Suite de tests del contrato | 3 |

---

### 2️⃣ dApp (Next.js + React)

#### 📂 dapp/app/
Aplicación Next.js (App Router)

| Archivo | Descripción | Tipo |
|---------|-------------|------|
| `layout.tsx` | Layout principal con metadata | Layout |
| `page.tsx` | Página principal con tabs | Page |
| `providers.tsx` | Providers de React Context | Provider |
| `globals.css` | Estilos globales Tailwind | CSS |

#### 📂 dapp/components/
Componentes reutilizables de UI

| Archivo | Descripción | Props | Estado |
|---------|-------------|-------|--------|
| `DocumentSigner.tsx` | Firmar y almacenar documentos | - | file, hash, signature, txHash |
| `DocumentVerifier.tsx` | Verificar autenticidad | - | hash, result |
| `FileUploader.tsx` | Upload con drag & drop | onFileSelect, accept, maxSize | file, dragActive |
| `WalletSelector.tsx` | Selector de 10 wallets | - | isOpen |

#### 📂 dapp/contexts/
React Context para estado global

| Archivo | Descripción | Exports |
|---------|-------------|---------|
| `MetaMaskContext.tsx` | Context de wallets Anvil | MetaMaskProvider, useMetaMask |

**Funciones del Context:**
- `connect(walletIndex)` - Conectar wallet
- `disconnect()` - Desconectar
- `signMessage(message)` - Firmar mensaje
- `getBalance()` - Obtener balance

#### 📂 dapp/hooks/
Custom React Hooks

| Archivo | Descripción | Returns |
|---------|-------------|---------|
| `useContract.ts` | Interacción con el contrato | storeDocument, verifyDocument, getDocumentInfo, isDocumentStored |
| `useFileHash.ts` | Cálculo de hashes | hash, loading, error, calculateHash, reset |

#### 📂 dapp/utils/
Utilidades y helpers

| Archivo | Descripción | Exports |
|---------|-------------|---------|
| `ethers.ts` | Wrapper de Ethers.js | EthersUtils, ANVIL_WALLETS |
| `hash.ts` | Utilidades de hashing | HashUtils |

**EthersUtils:**
- `getProvider()` - Obtener provider
- `getWallet(privateKey)` - Crear wallet
- `signMessage(privateKey, message)` - Firmar
- `verifyMessage(message, signature)` - Verificar
- `getBalance(address)` - Balance

**HashUtils:**
- `calculateFileHash(file)` - Hash de archivo
- `hashString(text)` - Hash de string
- `bytesToHex(bytes)` - Bytes a hex
- `hexToBytes(hex)` - Hex a bytes

#### 📂 dapp/types/
Definiciones TypeScript

| Archivo | Descripción | Interfaces |
|---------|-------------|------------|
| `ethereum.d.ts` | Tipos de Ethereum | Document, WalletInfo, AnvilWallet |

#### ⚙️ dapp/config/
Archivos de configuración

| Archivo | Descripción |
|---------|-------------|
| `package.json` | Dependencias y scripts npm |
| `tsconfig.json` | Configuración TypeScript |
| `tailwind.config.js` | Configuración Tailwind CSS |
| `next.config.js` | Configuración Next.js |
| `postcss.config.js` | Configuración PostCSS |
| `.eslintrc.json` | Configuración ESLint |
| `.env.local` | Variables de entorno |
| `.env.example` | Ejemplo de variables |
| `.gitignore` | Archivos a ignorar |

---

## 📚 Archivos de Documentación

| Archivo | Contenido | Tamaño |
|---------|-----------|---------|
| `README.md` | Documentación completa y detallada | ~7.8 KB |
| `QUICKSTART.md` | Guía de inicio rápido | ~2.5 KB |
| `PROJECT_SUMMARY.md` | Resumen ejecutivo del proyecto | ~4.0 KB |
| `FILE_INDEX.md` | Este archivo (índice navegable) | ~2.0 KB |

---

## 🔧 Scripts de Automatización

| Archivo | Descripción | Comandos |
|---------|-------------|----------|
| `setup.sh` | Setup completo del proyecto | 1 |
| `deploy.sh` | Despliegue en Anvil | 1 |
| `commands.sh` | 20+ comandos útiles | 20 |

**Comandos disponibles en commands.sh:**
- `build`, `test`, `test-v`, `coverage`, `clean`, `gas`
- `deploy`, `verify`, `anvil`, `logs`, `balance`
- `install`, `dev`, `build-dapp`, `lint`
- `setup`, `reset`, `status`, `help`

---

## 🗂️ Flujo de Archivos

### Para Firmar un Documento:

```
User → FileUploader.tsx
    → useFileHash.ts → hash.ts → HashUtils.calculateFileHash()
    → MetaMaskContext.tsx → ethers.ts → EthersUtils.signMessage()
    → useContract.ts → DocumentRegistry.sol → storeDocumentHash()
```

### Para Verificar un Documento:

```
User → FileUploader.tsx
    → useFileHash.ts → hash.ts → HashUtils.calculateFileHash()
    → useContract.ts → DocumentRegistry.sol → getDocumentInfo()
    → DocumentVerifier.tsx → Display result
```

---

## 📊 Estadísticas de Archivos

### Por Tipo:

- **Solidity (.sol)**: 3 archivos
- **TypeScript (.ts/.tsx)**: 12 archivos
- **JavaScript (.js)**: 3 archivos
- **JSON**: 3 archivos
- **CSS**: 1 archivo
- **Markdown (.md)**: 4 archivos
- **Shell (.sh)**: 3 archivos
- **Config (.toml)**: 1 archivo

**Total: 31 archivos principales**

### Por Categoría:

- **Smart Contracts**: 3 archivos
- **dApp Frontend**: 19 archivos
- **Configuración**: 5 archivos
- **Documentación**: 4 archivos
- **Scripts**: 3 archivos

---

## 🚀 Archivos de Inicio Rápido

Para empezar, consultar en este orden:

1. **README.md** - Visión general completa
2. **QUICKSTART.md** - Pasos rápidos para ejecutar
3. **commands.sh help** - Ver comandos disponibles
4. **PROJECT_SUMMARY.md** - Resumen ejecutivo

---

## 🔍 Búsqueda Rápida

### Buscar por funcionalidad:

- **Firma digital**: `DocumentSigner.tsx`, `ethers.ts`, `DocumentRegistry.sol`
- **Verificación**: `DocumentVerifier.tsx`, `useContract.ts`
- **Hashing**: `useFileHash.ts`, `hash.ts`
- **Wallets**: `MetaMaskContext.tsx`, `WalletSelector.tsx`, `ethers.ts`
- **Blockchain**: `useContract.ts`, `DocumentRegistry.sol`

### Buscar por tecnología:

- **Solidity**: `contracts/*.sol`, `script/*.sol`, `test/*.sol`
- **React**: `components/*.tsx`, `app/*.tsx`
- **TypeScript**: `*.ts`, `*.tsx`
- **Tailwind**: `globals.css`, `tailwind.config.js`
- **Next.js**: `app/`, `next.config.js`

---

## 📖 Lectura Recomendada por Perfil

### 👨‍💻 Desarrollador Backend (Solidity):
1. `contracts/DocumentRegistry.sol`
2. `test/DocumentRegistry.t.sol`
3. `script/Deploy.s.sol`
4. `foundry.toml`

### 🎨 Desarrollador Frontend (React):
1. `dapp/app/page.tsx`
2. `dapp/components/Document*.tsx`
3. `dapp/hooks/*.ts`
4. `dapp/utils/*.ts`

### 🔧 DevOps / Configuración:
1. `setup.sh`
2. `deploy.sh`
3. `commands.sh`
4. `foundry.toml`
5. `dapp/package.json`

### 📚 Documentación / QA:
1. `README.md`
2. `QUICKSTART.md`
3. `PROJECT_SUMMARY.md`
4. `test/DocumentRegistry.t.sol`

---

## ✅ Checklist de Archivos Críticos

Antes de empezar, verificar que existen:

- [ ] `contracts/DocumentRegistry.sol`
- [ ] `script/Deploy.s.sol`
- [ ] `dapp/package.json`
- [ ] `dapp/.env.local`
- [ ] `setup.sh`, `deploy.sh`, `commands.sh`
- [ ] `README.md`, `QUICKSTART.md`

---

**📌 Nota**: Este índice es una referencia rápida. Para detalles completos, consultar cada archivo individual.
