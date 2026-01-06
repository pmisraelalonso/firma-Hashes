// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract DocumentRegistry {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

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
    ) external view returns (bool) {
        bytes32 ethSignedHash = hash.toEthSignedMessageHash();
        address recoveredSigner = ethSignedHash.recover(signature);
        
        return (recoveredSigner == signer);
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
