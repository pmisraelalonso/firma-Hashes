// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title DocumentRegistry
 * @dev Smart contract para registro y verificación de documentos firmados
 * @notice Almacena hashes de documentos con sus firmas ECDSA para verificación posterior
 */
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

    /**
     * @dev Almacena un documento firmado en la blockchain
     * @param hash Hash SHA-256 del documento
     * @param timestamp Marca de tiempo de la firma
     * @param signature Firma ECDSA del hash
     */
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

    /**
     * @dev Verifica la firma de un documento
     * @param hash Hash del documento a verificar
     * @param signer Dirección esperada del firmante
     * @param signature Firma a verificar
     * @return bool True si la firma es válida
     */
    function verifyDocument(
        bytes32 hash,
        address signer,
        bytes memory signature
    ) external pure returns (bool) {
        bytes32 ethSignedHash = hash.toEthSignedMessageHash();
        address recoveredSigner = ethSignedHash.recover(signature);
        
        return (recoveredSigner == signer);
    }

    /**
     * @dev Obtiene toda la información de un documento
     * @param hash Hash del documento
     * @return Estructura completa del documento
     */
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

    /**
     * @dev Verifica si un documento está almacenado
     * @param hash Hash del documento
     * @return bool True si existe
     */
    function isDocumentStored(bytes32 hash) external view returns (bool) {
        return documents[hash].exists;
    }

    /**
     * @dev Obtiene la firma de un documento almacenado
     * @param hash Hash del documento
     * @return bytes Firma del documento
     */
    function getDocumentSignature(bytes32 hash) 
        external 
        view 
        returns (bytes memory) 
    {
        require(documents[hash].exists, "Document does not exist");
        return documents[hash].signature;
    }
}
