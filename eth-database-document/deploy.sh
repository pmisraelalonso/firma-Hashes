#!/bin/bash

# Script para desplegar el contrato en Anvil

echo "🚀 Desplegando DocumentRegistry en Anvil..."

# Verificar que Anvil esté corriendo
if ! nc -z localhost 8545 2>/dev/null; then
    echo "❌ Anvil no está corriendo en el puerto 8545"
    echo "Inicia Anvil con: anvil"
    exit 1
fi

# Clave privada de la wallet 0 de Anvil
PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

# Desplegar el contrato
echo "📝 Desplegando contrato..."
forge script script/Deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key $PRIVATE_KEY

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Contrato desplegado exitosamente!"
    echo ""
    echo "📋 Actualiza la dirección del contrato en dapp/.env.local"
    echo "NEXT_PUBLIC_CONTRACT_ADDRESS=<dirección_del_contrato>"
else
    echo ""
    echo "❌ Error al desplegar el contrato"
    exit 1
fi
