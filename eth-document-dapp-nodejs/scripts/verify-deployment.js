const hre = require("hardhat");

async function main() {
  const networkName = hre.network.name;
  console.log(`📡 Verificando estado en ${networkName}...`);

  // Obtener información de la red
  const provider = hre.ethers.provider;
  const blockNumber = await provider.getBlockNumber();
  const network = await provider.getNetwork();
  
  console.log("\n🌐 Información de la Red:");
  console.log("   - Network:", networkName);
  console.log("   - Chain ID:", network.chainId.toString());
  console.log("   - Bloque actual:", blockNumber);

  // Obtener cuentas
  const accounts = await hre.ethers.getSigners();
  console.log("\n👛 Cuentas disponibles:");
  
  for (let i = 0; i < Math.min(accounts.length, 5); i++) {
    const balance = await provider.getBalance(accounts[i].address);
    console.log(`   ${i}: ${accounts[i].address} - ${hre.ethers.formatEther(balance)} ETH`);
  }

  // Cargar contrato si está desplegado
  const fs = require("fs");
  const path = require("path");
  const deploymentPath = path.join(__dirname, "../deployments", `${networkName}.json`);
  
  if (fs.existsSync(deploymentPath)) {
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    console.log("\n📜 Contrato Desplegado:");
    console.log("   - Dirección:", deployment.contractAddress);
    console.log("   - Deployer:", deployment.deployer);
    console.log("   - Timestamp:", deployment.timestamp);
    
    // Obtener información del contrato
    const DocumentRegistry = await hre.ethers.getContractFactory("DocumentRegistry");
    const registry = DocumentRegistry.attach(deployment.contractAddress);
    
    // Intentar obtener eventos
    try {
      const filter = registry.filters.DocumentStored();
      const events = await registry.queryFilter(filter);
      console.log("   - Documentos almacenados:", events.length);
    } catch (error) {
      console.log("   - No se pudieron obtener eventos");
    }
  } else {
    console.log("\n⚠️  No hay contrato desplegado en esta red");
    console.log("   Ejecuta: npm run deploy:local");
  }

  console.log("\n✅ Verificación completada");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
