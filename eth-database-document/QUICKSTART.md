# 🚀 Inicio Rápido - ETH Database Document

## ⚡ Comandos para empezar en 3 pasos

### 1️⃣ Preparar el proyecto

```bash
cd eth-database-document

# Instalar OpenZeppelin y compilar
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge build
forge test
```

### 2️⃣ Desplegar (3 terminales)

**Terminal 1 - Blockchain:**
```bash
anvil
```

**Terminal 2 - Deploy del contrato:**
```bash
# Usando el script
./deploy.sh

# O manualmente
forge script script/Deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

⚠️ **IMPORTANTE**: Copia la dirección del contrato desplegado

**Terminal 3 - dApp:**
```bash
cd dapp

# Instalar dependencias
npm install

# Actualizar .env.local con la dirección del contrato
nano .env.local
# Cambiar: NEXT_PUBLIC_CONTRACT_ADDRESS=<dirección_copiada>

# Iniciar servidor
npm run dev
```

### 3️⃣ Usar la aplicación

Abrir en el navegador: **http://localhost:3000**

## 📖 Uso básico

### Firmar un documento
1. Click en "Connect Wallet"
2. Seleccionar una wallet (0-9)
3. Subir un archivo
4. Click en "Firmar Documento"
5. Click en "Almacenar en Blockchain"

### Verificar un documento
1. Ir a la pestaña "Verificar Documento"
2. Subir el archivo a verificar
3. Ingresar la dirección del firmante
4. Click en "Verificar Documento"

## 🔑 Wallets de Anvil

Las 10 primeras direcciones con 10,000 ETH cada una:

```
0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
... (7 más disponibles)
```

## 🧪 Testing

```bash
# Tests de contratos
forge test -vv

# Cobertura
forge coverage

# Gas report
forge test --gas-report
```

## 🛠️ Comandos útiles

```bash
# Limpiar y recompilar
forge clean && forge build

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
