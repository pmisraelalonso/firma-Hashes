#!/bin/bash

# Script para generar la estructura completa del proyecto ETH Database Document
# Uso: bash setup-project.sh

echo "🚀 Iniciando configuración del proyecto ETH Database Document..."

# Crear directorio principal
PROJECT_NAME="eth-database-document"
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

echo "📁 Creando estructura de carpetas..."

# ==========================================
# 1. CONFIGURACIÓN DE FOUNDRY (Smart Contracts)
# ==========================================

echo "🔨 Configurando proyecto Foundry..."

# Inicializar Foundry
forge init --no-commit .

# Crear estructura de carpetas para contratos
mkdir -p contracts/interfaces
mkdir -p script
mkdir -p test

# Crear foundry.toml
cat > foundry.toml << 'EOF'
[profile.default]
src = "contracts"
out = "out"
libs = ["lib"]
solc_version = "0.8.20"

[rpc_endpoints]
anvil = "http://localhost:8545"

[etherscan]
anvil = { key = "verifyContract" }
EOF

# ==========================================
# CONTRATO PRINCIPAL: DocumentRegistry.sol
# ==========================================

cat > contracts/DocumentRegistry.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract DocumentRegistry {
    using ECDSA for bytes32;

    struct Document {
        bytes32 hash;
        uint256 timestamp;
        address signer;
        bytes signature;
        bool exists;
    }

    mapping(bytes32 => Document) private documents;

    event DocumentStored(
        bytes32 indexed hash,
        address indexed signer,
        uint256 timestamp,
        bytes signature
    );
    
    event DocumentVerified(
        bytes32 indexed hash,
        address indexed signer,
        bool isValid
    );

    function storeDocumentHash(
        bytes32 hash,
        uint256 timestamp,
        bytes memory signature
    ) external {
        require(!documents[hash].exists, "Document already exists");
        
        documents[hash] = Document({
            hash: hash,
            timestamp: timestamp,
            signer: msg.sender,
            signature: signature,
            exists: true
        });

        emit DocumentStored(hash, msg.sender, timestamp, signature);
    }

    function verifyDocument(
        bytes32 hash,
        address signer,
        bytes memory signature
    ) external returns (bool) {
        bytes32 ethSignedHash = hash.toEthSignedMessageHash();
        address recoveredSigner = ethSignedHash.recover(signature);
        
        bool isValid = (recoveredSigner == signer);
        emit DocumentVerified(hash, signer, isValid);
        
        return isValid;
    }

    function getDocumentInfo(bytes32 hash) 
        external 
        view 
        returns (
            bytes32,
            uint256,
            address,
            bytes memory,
            bool
        ) 
    {
        Document memory doc = documents[hash];
        return (doc.hash, doc.timestamp, doc.signer, doc.signature, doc.exists);
    }

    function isDocumentStored(bytes32 hash) external view returns (bool) {
        return documents[hash].exists;
    }

    function getDocumentSignature(bytes32 hash) 
        external 
        view 
        returns (bytes memory) 
    {
        require(documents[hash].exists, "Document does not exist");
        return documents[hash].signature;
    }
}
EOF

# ==========================================
# INTERFAZ DEL CONTRATO
# ==========================================

cat > contracts/interfaces/IDocumentRegistry.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IDocumentRegistry {
    event DocumentStored(
        bytes32 indexed hash,
        address indexed signer,
        uint256 timestamp,
        bytes signature
    );
    
    event DocumentVerified(
        bytes32 indexed hash,
        address indexed signer,
        bool isValid
    );

    function storeDocumentHash(
        bytes32 hash,
        uint256 timestamp,
        bytes memory signature
    ) external;

    function verifyDocument(
        bytes32 hash,
        address signer,
        bytes memory signature
    ) external returns (bool);

    function getDocumentInfo(bytes32 hash) 
        external 
        view 
        returns (
            bytes32,
            uint256,
            address,
            bytes memory,
            bool
        );

    function isDocumentStored(bytes32 hash) external view returns (bool);

    function getDocumentSignature(bytes32 hash) 
        external 
        view 
        returns (bytes memory);
}
EOF

# ==========================================
# SCRIPT DE DEPLOY
# ==========================================

cat > script/Deploy.s.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/DocumentRegistry.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        DocumentRegistry registry = new DocumentRegistry();
        
        console.log("DocumentRegistry deployed to:", address(registry));
        
        vm.stopBroadcast();
    }
}
EOF

# ==========================================
# TESTS DEL CONTRATO
# ==========================================

cat > test/DocumentRegistry.t.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/DocumentRegistry.sol";

contract DocumentRegistryTest is Test {
    DocumentRegistry public registry;
    address public user1;
    address public user2;

    function setUp() public {
        registry = new DocumentRegistry();
        user1 = address(0x1);
        user2 = address(0x2);
    }

    function testStoreDocument() public {
        bytes32 hash = keccak256("test document");
        uint256 timestamp = block.timestamp;
        bytes memory signature = hex"1234";

        vm.prank(user1);
        registry.storeDocumentHash(hash, timestamp, signature);

        (
            bytes32 storedHash,
            uint256 storedTimestamp,
            address signer,
            bytes memory storedSignature,
            bool exists
        ) = registry.getDocumentInfo(hash);

        assertEq(storedHash, hash);
        assertEq(storedTimestamp, timestamp);
        assertEq(signer, user1);
        assertEq(storedSignature, signature);
        assertTrue(exists);
    }

    function testCannotStoreDuplicateDocument() public {
        bytes32 hash = keccak256("test document");
        uint256 timestamp = block.timestamp;
        bytes memory signature = hex"1234";

        vm.prank(user1);
        registry.storeDocumentHash(hash, timestamp, signature);

        vm.prank(user2);
        vm.expectRevert("Document already exists");
        registry.storeDocumentHash(hash, timestamp, signature);
    }

    function testIsDocumentStored() public {
        bytes32 hash = keccak256("test document");
        
        assertFalse(registry.isDocumentStored(hash));

        vm.prank(user1);
        registry.storeDocumentHash(hash, block.timestamp, hex"1234");

        assertTrue(registry.isDocumentStored(hash));
    }
}
EOF

echo "✅ Contratos inteligentes configurados"

# ==========================================
# 2. CONFIGURACIÓN DE NEXT.JS (dApp)
# ==========================================

echo "⚛️  Configurando aplicación Next.js..."

# Crear directorio de la dApp
mkdir -p dapp
cd dapp

# Crear package.json
cat > package.json << 'EOF'
{
  "name": "eth-database-document-dapp",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "ethers": "^6.9.0",
    "lucide-react": "^0.294.0",
    "@tanstack/react-query": "^5.12.0",
    "next-themes": "^0.2.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0"
  }
}
EOF

# Crear estructura de carpetas
mkdir -p app
mkdir -p components
mkdir -p contexts
mkdir -p hooks
mkdir -p utils
mkdir -p types

# Configuración Next.js y archivos continuarían aquí...
echo "✅ Estructura básica de Next.js creada"

cd ..
echo "✅ Proyecto base generado. Continúa con los archivos de la dApp..."
