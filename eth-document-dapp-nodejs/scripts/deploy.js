const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Desplegando DocumentRegistry...");

  // Obtener el deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Desplegando con la cuenta:", deployer.address);

  // Obtener balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy del contrato
  const DocumentRegistry = await hre.ethers.getContractFactory("DocumentRegistry");
  const registry = await DocumentRegistry.deploy();
  
  await registry.waitForDeployment();
  const address = await registry.getAddress();

  console.log("✅ DocumentRegistry desplegado en:", address);

  // Guardar la dirección del contrato
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  // Crear directorio de deployments si no existe
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Guardar información del deployment
  const deploymentPath = path.join(
    deploymentsDir,
    `${hre.network.name}.json`
  );
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Información del deployment guardada en:", deploymentPath);

  // Si estamos en una red de prueba, intentar verificar
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("⏳ Esperando confirmaciones para verificar...");
    await registry.deploymentTransaction().wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("✅ Contrato verificado en Etherscan");
    } catch (error) {
      console.log("⚠️ Error al verificar:", error.message);
    }
  }

  // Crear archivo .env.local para el frontend
  const frontendEnvPath = path.join(__dirname, "../frontend/.env.local");
  const envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
`;
  
  if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
    fs.writeFileSync(frontendEnvPath, envContent);
    console.log("💾 Configuración del frontend actualizada");
  }

  console.log("\n🎉 Deployment completado exitosamente!");
  console.log("\n📋 Resumen:");
  console.log("   - Red:", hre.network.name);
  console.log("   - Contrato:", address);
  console.log("   - Deployer:", deployer.address);
  console.log("   - Block:", deploymentInfo.blockNumber);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
