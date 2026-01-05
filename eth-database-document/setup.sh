#!/bin/bash

# Script de inicio rápido para el proyecto ETH Database Document

echo "🚀 ETH Database Document - Inicio Rápido"
echo "========================================"
echo ""

# Verificar que Foundry esté instalado
if ! command -v forge &> /dev/null; then
    echo "❌ Foundry no está instalado"
    echo "Instálalo con: curl -L https://foundry.paradigm.xyz | bash"
    exit 1
fi

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

echo "✅ Dependencias verificadas"
echo ""

# Instalar dependencias de OpenZeppelin si no existen
if [ ! -d "lib/openzeppelin-contracts" ]; then
    echo "📦 Instalando OpenZeppelin Contracts..."
    forge install OpenZeppelin/openzeppelin-contracts --no-commit
fi

# Compilar contratos
echo "🔨 Compilando contratos..."
forge build

if [ $? -eq 0 ]; then
    echo "✅ Contratos compilados exitosamente"
else
    echo "❌ Error al compilar contratos"
    exit 1
fi

# Ejecutar tests
echo ""
echo "🧪 Ejecutando tests..."
forge test

if [ $? -eq 0 ]; then
    echo "✅ Tests pasaron exitosamente"
else
    echo "❌ Algunos tests fallaron"
    exit 1
fi

echo ""
echo "✅ Proyecto configurado correctamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Terminal 1: anvil"
echo "2. Terminal 2: forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
echo "3. Terminal 3: cd dapp && npm install && npm run dev"
echo "4. Abrir http://localhost:3000"
echo ""
