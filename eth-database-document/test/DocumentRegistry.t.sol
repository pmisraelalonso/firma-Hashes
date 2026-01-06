// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

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

    function testHashSignatureVerification() public {
        // Crear una clave privada y su dirección correspondiente
        uint256 privateKey = 0xA11CE;
        address signer = vm.addr(privateKey);
        
        // Crear el hash del documento
        bytes32 documentHash = keccak256("Important Document Content");
        
        // Crear el hash firmado según estándar Ethereum
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", documentHash)
        );
        
        // Firmar el hash con la clave privada
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, ethSignedHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        // Almacenar el documento con la firma
        vm.prank(signer);
        registry.storeDocumentHash(documentHash, block.timestamp, signature);
        
        // Verificar que el documento está almacenado
        assertTrue(registry.isDocumentStored(documentHash));
        
        // Verificar la firma
        bool isValid = registry.verifyDocument(documentHash, signer, signature);
        assertTrue(isValid, "Signature should be valid");
        
        // Verificar que la firma no es válida para otro firmante
        bool isInvalidForOther = registry.verifyDocument(documentHash, user1, signature);
        assertFalse(isInvalidForOther, "Signature should be invalid for different signer");
    }

    function testGetDocumentSignature() public {
        bytes32 hash = keccak256("test document");
        bytes memory signature = hex"abcdef1234567890";
        
        vm.prank(user1);
        registry.storeDocumentHash(hash, block.timestamp, signature);
        
        bytes memory retrievedSignature = registry.getDocumentSignature(hash);
        assertEq(retrievedSignature, signature);
    }

    function testGetDocumentSignatureRevertsForNonExistent() public {
        bytes32 hash = keccak256("non existent document");
        
        vm.expectRevert("Document does not exist");
        registry.getDocumentSignature(hash);
    }

    function testDocumentStoredEvent() public {
        bytes32 hash = keccak256("test document");
        uint256 timestamp = block.timestamp;
        bytes memory signature = hex"1234";

        vm.expectEmit(true, true, false, true);
        emit DocumentRegistry.DocumentStored(hash, user1, timestamp, signature);

        vm.prank(user1);
        registry.storeDocumentHash(hash, timestamp, signature);
    }

    function testCompleteSignatureWorkflow() public {
        // Simular un flujo completo de firma y verificación
        uint256 privateKey = 0xB0B;
        address documentOwner = vm.addr(privateKey);
        
        // Documento a firmar
        string memory documentContent = "This is a legal contract that needs verification";
        bytes32 documentHash = keccak256(abi.encodePacked(documentContent));
        
        // Preparar el mensaje según el estándar de Ethereum
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", documentHash)
        );
        
        // Firmar
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, ethSignedHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        uint256 timestamp = block.timestamp;
        
        // Almacenar en el registro
        vm.prank(documentOwner);
        registry.storeDocumentHash(documentHash, timestamp, signature);
        
        // Recuperar información del documento
        (
            bytes32 storedHash,
            uint256 storedTimestamp,
            address storedSigner,
            bytes memory storedSignature,
            bool exists
        ) = registry.getDocumentInfo(documentHash);
        
        // Verificar todos los datos
        assertEq(storedHash, documentHash, "Hash should match");
        assertEq(storedTimestamp, timestamp, "Timestamp should match");
        assertEq(storedSigner, documentOwner, "Signer should match");
        assertTrue(exists, "Document should exist");
        
        // Verificar la firma (usando variables ya existentes)
        bool isValid = registry.verifyDocument(storedHash, storedSigner, storedSignature);
        assertTrue(isValid, "Signature verification should pass");
    }
}
