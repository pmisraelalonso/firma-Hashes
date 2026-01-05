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
