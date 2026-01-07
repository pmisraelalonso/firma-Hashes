#!/bin/bash
cd "$(dirname "$0")"
npx hardhat run scripts/deploy.js --network localhost
