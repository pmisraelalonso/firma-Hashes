#!/bin/bash
PROJECT_DIR="/home/israel/codecrypto/Firma-Hashes/firma-Hashes/eth-document-dapp-nodejs"
cd "$PROJECT_DIR" || exit 1
npx hardhat run scripts/deploy.js --network localhost
