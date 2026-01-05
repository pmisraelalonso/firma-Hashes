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
