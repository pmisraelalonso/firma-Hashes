#!/bin/bash

# Script para detener todos los servicios de la dApp

echo "🛑 Deteniendo todos los servicios de la dApp..."
echo ""

# Detener Hardhat
echo "   Deteniendo Hardhat node..."
pkill -f "hardhat node"

# Detener Next.js
echo "   Deteniendo Next.js..."
pkill -f "next dev"

# Esperar a que los procesos terminen
sleep 2

# Verificar que se detuvieron
if pgrep -f "hardhat node" > /dev/null || pgrep -f "next dev" > /dev/null; then
    echo "⚠️  Algunos procesos aún están corriendo, intentando forzar..."
    pkill -9 -f "hardhat node"
    pkill -9 -f "next dev"
    sleep 1
fi

echo ""
echo "✅ Todos los servicios detenidos"
echo ""
