#!/bin/bash

# Comandos útiles para el proyecto ETH Database Document

show_help() {
    cat << EOF

╔═══════════════════════════════════════════════════════════════╗
║          ETH DATABASE DOCUMENT - COMANDOS ÚTILES             ║
╚═══════════════════════════════════════════════════════════════╝

📋 Uso: ./commands.sh <comando>

COMANDOS DISPONIBLES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔨 COMPILACIÓN Y TESTS:

  build           Compilar contratos
  test            Ejecutar tests
  test-v          Ejecutar tests con detalles
  coverage        Ver cobertura de tests
  clean           Limpiar artefactos
  gas             Ver reporte de gas

🚀 DEPLOYMENT:

  deploy          Desplegar contrato en Anvil
  verify          Verificar compilación

🔍 BLOCKCHAIN:

  anvil           Iniciar blockchain local
  logs            Ver logs de blockchain
  balance         Ver balance de wallet 0

🌐 DAPP:

  install         Instalar dependencias de dApp
  dev             Iniciar servidor de desarrollo
  build-dapp      Build de producción
  lint            Ejecutar linter

🛠️ UTILIDADES:

  setup           Setup completo del proyecto
  reset           Reset completo (limpiar todo)
  status          Ver estado del proyecto

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EJEMPLOS:
  ./commands.sh build          # Compilar contratos
  ./commands.sh test           # Ejecutar tests
  ./commands.sh deploy         # Desplegar en Anvil
  ./commands.sh dev            # Iniciar dApp

EOF
}

# Funciones de comandos

cmd_build() {
    echo "🔨 Compilando contratos..."
    forge build
}

cmd_test() {
    echo "🧪 Ejecutando tests..."
    forge test
}

cmd_test_v() {
    echo "🧪 Ejecutando tests (verbose)..."
    forge test -vv
}

cmd_coverage() {
    echo "📊 Generando reporte de cobertura..."
    forge coverage
}

cmd_clean() {
    echo "🧹 Limpiando artefactos..."
    forge clean
    rm -rf dapp/.next dapp/node_modules
}

cmd_gas() {
    echo "⛽ Generando reporte de gas..."
    forge test --gas-report
}

cmd_deploy() {
    echo "🚀 Desplegando contrato..."
    ./deploy.sh
}

cmd_verify() {
    echo "✅ Verificando compilación..."
    forge build --force
    [ $? -eq 0 ] && echo "✅ Compilación exitosa" || echo "❌ Error en compilación"
}

cmd_anvil() {
    echo "🔷 Iniciando Anvil..."
    anvil
}

cmd_logs() {
    echo "📜 Mostrando logs de blockchain..."
    cast logs --rpc-url http://localhost:8545
}

cmd_balance() {
    echo "💰 Balance de wallet 0..."
    cast balance 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --rpc-url http://localhost:8545
}

cmd_install() {
    echo "📦 Instalando dependencias de dApp..."
    cd dapp && npm install
}

cmd_dev() {
    echo "🌐 Iniciando servidor de desarrollo..."
    cd dapp && npm run dev
}

cmd_build_dapp() {
    echo "🏗️ Building dApp para producción..."
    cd dapp && npm run build
}

cmd_lint() {
    echo "🔍 Ejecutando linter..."
    cd dapp && npm run lint
}

cmd_setup() {
    echo "⚙️ Setup completo del proyecto..."
    ./setup.sh
}

cmd_reset() {
    echo "🔄 Reset completo..."
    echo "⚠️  Esto eliminará todos los artefactos y dependencias"
    read -p "¿Continuar? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        forge clean
        rm -rf lib out cache
        rm -rf dapp/.next dapp/node_modules dapp/out
        echo "✅ Reset completado"
    else
        echo "❌ Operación cancelada"
    fi
}

cmd_status() {
    echo "📊 Estado del proyecto:"
    echo ""
    
    echo "🔷 Foundry:"
    [ -d "out" ] && echo "  ✅ Contratos compilados" || echo "  ❌ Contratos no compilados"
    [ -d "lib/openzeppelin-contracts" ] && echo "  ✅ OpenZeppelin instalado" || echo "  ❌ OpenZeppelin no instalado"
    
    echo ""
    echo "🔷 dApp:"
    [ -d "dapp/node_modules" ] && echo "  ✅ Dependencias instaladas" || echo "  ❌ Dependencias no instaladas"
    [ -f "dapp/.env.local" ] && echo "  ✅ Configuración presente" || echo "  ❌ Sin configuración"
    
    echo ""
    echo "🔷 Blockchain:"
    nc -z localhost 8545 2>/dev/null && echo "  ✅ Anvil corriendo" || echo "  ❌ Anvil no está corriendo"
}

# Main

case "$1" in
    build)          cmd_build ;;
    test)           cmd_test ;;
    test-v)         cmd_test_v ;;
    coverage)       cmd_coverage ;;
    clean)          cmd_clean ;;
    gas)            cmd_gas ;;
    deploy)         cmd_deploy ;;
    verify)         cmd_verify ;;
    anvil)          cmd_anvil ;;
    logs)           cmd_logs ;;
    balance)        cmd_balance ;;
    install)        cmd_install ;;
    dev)            cmd_dev ;;
    build-dapp)     cmd_build_dapp ;;
    lint)           cmd_lint ;;
    setup)          cmd_setup ;;
    reset)          cmd_reset ;;
    status)         cmd_status ;;
    help|--help|-h) show_help ;;
    *)
        echo "❌ Comando desconocido: $1"
        echo "💡 Usa './commands.sh help' para ver comandos disponibles"
        exit 1
        ;;
esac
