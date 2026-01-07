#!/bin/bash

# Script de inicio completo para la dApp Node.js

PROJECT_DIR="/home/israel/codecrypto/Firma-Hashes/firma-Hashes/eth-document-dapp-nodejs"
cd "$PROJECT_DIR" || exit 1

echo "🚀 Iniciando dApp DocumentRegistry (Node.js/Hardhat)..."
echo ""

# Verificar si hay procesos previos corriendo
echo "🧹 Limpiando procesos anteriores..."
pkill -f "hardhat node" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2

# Iniciar nodo de Hardhat en background
echo "🔗 Iniciando nodo local de Hardhat..."
npx hardhat node > /tmp/hardhat-node.log 2>&1 &
HARDHAT_PID=$!
echo "   PID del nodo: $HARDHAT_PID"

# Esperar a que el nodo esté listo
echo "⏳ Esperando que el nodo esté listo..."
sleep 5

# Verificar que el nodo esté corriendo
if ! ps -p $HARDHAT_PID > /dev/null; then
    echo "❌ Error: El nodo de Hardhat no se inició correctamente"
    echo "   Ver logs en: /tmp/hardhat-node.log"
    exit 1
fi

echo "✅ Nodo de Hardhat corriendo"
echo ""

# Desplegar el contrato
echo "📝 Desplegando contrato DocumentRegistry..."
npx hardhat run scripts/deploy.js --network localhost

if [ $? -ne 0 ]; then
    echo "❌ Error al desplegar el contrato"
    kill $HARDHAT_PID
    exit 1
fi

echo ""
echo "✅ Contrato desplegado exitosamente"
echo ""

# Iniciar frontend
echo "🎨 Iniciando frontend de Next.js..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo "✅ ¡dApp iniciada exitosamente!"
echo "=========================================="
echo ""
echo "📌 Servicios corriendo:"
echo "   - Hardhat Node:  http://127.0.0.1:8545"
echo "   - Frontend:      http://localhost:3000"
echo ""
echo "📝 PIDs de procesos:"
echo "   - Hardhat:  $HARDHAT_PID"
echo "   - Frontend: $FRONTEND_PID"
echo ""
echo "🛑 Para detener todos los servicios ejecuta:"
echo "   ./STOP.sh"
echo ""
echo "📊 Para ver logs del nodo:"
echo "   tail -f /tmp/hardhat-node.log"
echo ""
echo "=========================================="
echo ""

# Mantener el script corriendo
wait
