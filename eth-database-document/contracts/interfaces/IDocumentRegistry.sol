// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

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
    ) external view returns (bool);

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
