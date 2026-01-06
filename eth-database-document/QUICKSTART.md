# 🚀 Inicio Rápido - ETH Database Document

Guía completa para ejecutar el proyecto de firma y verificación de documentos en blockchain.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18.x o superior ([descargar](https://nodejs.org/))
- **npm** v9.x o superior (viene con Node.js)
- **Foundry** ([instalar](https://book.getfoundry.sh/getting-started/installation))
  ```bash
  curl -L https://foundry.paradigm.xyz | bash
  foundryup
  ```
- **Git** (para clonar el repositorio)

---

## ⚡ Inicio Rápido (3 Pasos)

### 🎯 Paso 1: Clonar y Configurar

```bash
# Clonar el repositorio
git clone https://github.com/pmisraelalonso/firma-Hashes.git
cd firma-Hashes/eth-database-document

# Instalar dependencias de Foundry
forge install foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts

# Compilar contratos
forge build

# Ejecutar tests (opcional)
forge test -vv
```

**✅ Resultado esperado:** Compilación exitosa y 3 tests pasando.

---

### 🎯 Paso 2: Desplegar Blockchain Local (3 Terminales)

#### Terminal 1️⃣ - Iniciar Blockchain Local (Anvil)

```bash
anvil
```

**📌 Mantén esta terminal abierta** - Anvil debe seguir ejecutándose en segundo plano.

**✅ Verás:** 10 cuentas con 10,000 ETH cada una y sus private keys.

---

#### Terminal 2️⃣ - Desplegar Smart Contract

```bash
cd eth-database-document

# Opción A: Usar script automático (recomendado)
./deploy.sh

# Opción B: Deploy manual
forge script script/Deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**⚠️ IMPORTANTE:** 
1. Busca en el output: `Contract deployed at: 0x...`
2. **Copia esa dirección** (ejemplo: `0x5FbDB2315678afecb367f032d93F642f64180aa3`)

**✅ Resultado esperado:**
```
Contract deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
✓ Deployment successful!
```

---

#### Terminal 3️⃣ - Configurar y Ejecutar dApp

```bash
cd eth-database-document/dapp

# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
# Edita el archivo .env.local con la dirección del contrato
nano .env.local
```

**Contenido de `.env.local`:**
```env
# Reemplaza con la dirección que copiaste del deploy
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

**Guarda el archivo:** `Ctrl+O`, `Enter`, `Ctrl+X`

```bash
# 3. Verificar configuración (opcional)
npm run type-check
npm run lint

# 4. Iniciar servidor de desarrollo
npm run dev
```

**✅ Resultado esperado:**
```
▲ Next.js 14.2.35
- Local:        http://localhost:3000
- Ready in 2.1s
```

---

### 🎯 Paso 3: Abrir la Aplicación

1. Abre tu navegador en: **http://localhost:3000**
2. Verás la interfaz de firma y verificación de documentos

---

## 📖 Guía de Uso de la Aplicación

### 🔐 Conectar Wallet

1. Click en **"Seleccionar Wallet"** (esquina superior derecha)
2. Elige una de las 10 wallets de Anvil (0-9)
3. Verás la dirección conectada

**💡 Tip:** Usa diferentes wallets para simular múltiples usuarios.

---

### ✍️ Firmar un Documento

1. **Selecciona un archivo:**
   - Click en "Seleccionar Archivo" o arrastra un archivo
   - Cualquier tipo de archivo funciona (PDF, TXT, imagen, etc.)

2. **Ver el hash:**
   - El hash SHA-256 se calculará automáticamente
   - Ejemplo: `0x123abc...`

3. **Firmar:**
   - Click en **"Firmar Documento"**
   - La firma ECDSA se genera localmente (sin gas)
   - Verás la firma en formato hexadecimal

4. **Almacenar en blockchain:**
   - Click en **"Almacenar en Blockchain"**
   - Espera ~1-2 segundos (confirmación de Anvil)
   - ✅ Verás "Documento almacenado exitosamente"

**⛽ Gas usado:** ~134,000 gas (~$0.00 en testnet)

---

### ✅ Verificar un Documento

1. **Ir a la pestaña "Verificar":**
   - Click en el tab "Verificar Documento"

2. **Seleccionar archivo:**
   - Sube el mismo archivo que firmaste anteriormente
   - El hash se calculará automáticamente

3. **Ingresar dirección del firmante:**
   - Pega la dirección de la wallet que firmó el documento
   - Ejemplo: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

4. **Ingresar firma:**
   - Pega la firma que obtuviste en el paso de firma
   - Formato: `0x123abc...` (130 caracteres)

5. **Verificar:**
   - Click en **"Verificar Documento"**
   - La verificación es **instantánea** (0 gas, local)
   - ✅ Resultado: "Documento verificado correctamente" o "Firma inválida"

---

## 🔑 Wallets de Anvil (Pre-configuradas)

Todas las wallets tienen **10,000 ETH** en Anvil local:

| # | Dirección | Private Key |
|---|-----------|-------------|
| 0 | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec...` |
| 1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e9...` |
| 2 | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | `0x5de4111a...` |
| 3 | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | `0x7c852118...` |
| 4 | `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65` | `0x47e179ec...` |
| 5 | `0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc` | `0x8b3a350c...` |
| 6 | `0x976EA74026E726554dB657fA54763abd0C3a0aa9` | `0x92db14e4...` |
| 7 | `0x14dC79964da2C08b23698B3D3cc7Ca32193d9955` | `0x4bbbf85c...` |
| 8 | `0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f` | `0xdbda1821...` |
| 9 | `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720` | `0x2a871d0...` |

**💡 Están pre-cargadas en el dApp** - solo selecciona el número de wallet.

---

## 🧪 Testing y Validación

### Tests de Smart Contracts

```bash
cd eth-database-document

# Ejecutar todos los tests
forge test -vv

# Tests con reporte de gas
forge test --gas-report

# Tests con cobertura
forge coverage

# Test específico
forge test --match-test testStoreDocument -vvv
```

**✅ Esperado:** 3 tests pasando
- `testStoreDocument()` 
- `testCannotStoreDuplicateDocument()`
- `testIsDocumentStored()`

---

### Tests de dApp

```bash
cd dapp

# Type checking (TypeScript)
npm run type-check

# Linting (ESLint)
npm run lint

# Build de producción
npm run build
```

**✅ Todos deben pasar sin errores.**

---

## 🛠️ Comandos Útiles

### Foundry

```bash
# Limpiar y recompilar
forge clean && forge build

# Ver configuración de Foundry
forge config

# Verificar formato de código Solidity
forge fmt --check

# Aplicar formato
forge fmt

# Ver tamaño de contratos
forge build --sizes
```

### Next.js dApp

```bash
cd dapp

# Desarrollo
npm run dev          # Servidor en localhost:3000

# Producción
npm run build        # Compilar para producción
npm start            # Ejecutar build de producción

# Calidad de código
npm run lint         # ESLint
npm run type-check   # TypeScript
```

### Anvil

```bash
# Iniciar con fork de mainnet
anvil --fork-url https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# Con block time específico
anvil --block-time 2

# Con gas price fijo
anvil --gas-price 0
```

---

## 🔄 Reiniciar desde Cero

Si algo sale mal, reinicia completamente:

```bash
# 1. Detener todos los procesos
# Ctrl+C en cada terminal (Anvil, dApp)

# 2. Limpiar compilaciones
cd eth-database-document
forge clean
rm -rf out cache

# 3. Limpiar dApp
cd dapp
rm -rf .next node_modules
npm install

# 4. Recompilar contratos
cd ..
forge build

# 5. Volver al Paso 2 (Desplegar)
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module '@openzeppelin/contracts'"

```bash
cd eth-database-document
forge install OpenZeppelin/openzeppelin-contracts
forge build
```

### Error: "Invalid contract address" en dApp

1. Verifica que Anvil esté ejecutándose
2. Asegúrate de copiar correctamente la dirección del deploy
3. Revisa que `.env.local` tenga la dirección correcta
4. Reinicia el servidor Next.js: `npm run dev`

### Error: "Failed to fetch" al firmar

1. Verifica que Anvil esté corriendo en `http://localhost:8545`
2. Chequea que `.env.local` tenga `NEXT_PUBLIC_RPC_URL=http://localhost:8545`
3. Reinicia Anvil y vuelve a desplegar el contrato

### Tests fallan

```bash
# Actualizar dependencias
forge update

# Re-instalar desde cero
rm -rf lib
forge install foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts
forge build
forge test -vv
```

### Puerto 3000 ocupado

```bash
# Cambiar puerto
PORT=3001 npm run dev

# O matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

---

## 📊 Métricas y Performance

### Gas Costs

| Operación | Gas | Costo ETH ($2000/ETH) |
|-----------|-----|------------------------|
| Store Document | ~134,000 | ~$0.268 |
| Verify Document | **0** (off-chain) | **$0** |
| Query Document | ~30,000 | ~$0.06 |

### Bundle Sizes

| Archivo | Tamaño | First Load |
|---------|--------|------------|
| / (main) | 7.17 KB | 222 KB |
| 404 | 875 B | 88.1 KB |
| Shared | 87.2 KB | - |

---

## 🚀 Próximos Pasos

Una vez que todo funcione localmente:

1. **Deploy en Testnet (Sepolia):**
   ```bash
   forge script script/Deploy.s.sol \
     --rpc-url $SEPOLIA_RPC_URL \
     --broadcast \
     --private-key $PRIVATE_KEY \
     --verify --etherscan-api-key $ETHERSCAN_KEY
   ```

2. **Configurar dApp para testnet:**
   - Actualiza `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - Cambia `NEXT_PUBLIC_RPC_URL` a Sepolia
   - Usa MetaMask real en lugar de wallets Anvil

3. **Deploy en producción:**
   - Vercel/Netlify para el frontend
   - IPFS para hosting descentralizado
   - ENS para dominio (.eth)

---

## 📚 Recursos Adicionales

- [README.md](README.md) - Documentación completa
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Resumen técnico
- [FILE_INDEX.md](FILE_INDEX.md) - Índice de archivos
- [TEST_REPORT.md](test-results/TEST_REPORT.md) - Reporte de tests
- [CORRECTIONS.md](CORRECTIONS.md) - Correcciones aplicadas

---

## 💡 Tips Avanzados

### Usar con MetaMask

1. Agregar red Anvil a MetaMask:
   - Network Name: `Anvil Local`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `31337`
   - Currency: `ETH`

2. Importar wallet de Anvil:
   - Usar private key de cuenta #0
   - Tendrás 10,000 ETH para testear

### Debugging

```bash
# Ver logs detallados de Foundry
forge test -vvvv

# Ver stack traces completos
forge test --show-progress

# Debug interactivo
forge test --debug testStoreDocument
```

---

## 🎉 ¡Listo!

Ahora tienes un sistema completo de firma y verificación de documentos en blockchain funcionando localmente.

**¿Preguntas?** Abre un issue en: https://github.com/pmisraelalonso/firma-Hashes/issues

---

**Última actualización:** 2026-01-05  
**Versión:** 1.0.0

# Ver logs de blockchain
cast logs --rpc-url http://localhost:8545

# Ver balance de una wallet
cast balance 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --rpc-url http://localhost:8545
```

## ⚠️ Troubleshooting

### Error: Cannot find module
```bash
cd dapp
rm -rf node_modules package-lock.json
npm install
```

### Error: Contract not deployed
1. Verificar que Anvil esté corriendo
2. Redesplegar el contrato
3. Actualizar `.env.local` con la nueva dirección

### Error de compilación
```bash
forge clean
rm -rf lib
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge build
```

---

✅ **Proyecto listo para desarrollo!**
