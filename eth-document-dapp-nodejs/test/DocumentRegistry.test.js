const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("DocumentRegistry", function () {
  // Fixture para desplegar el contrato
  async function deployDocumentRegistryFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
    const registry = await DocumentRegistry.deploy();

    return { registry, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Debería desplegar correctamente", async function () {
      const { registry } = await loadFixture(deployDocumentRegistryFixture);
      expect(await registry.getAddress()).to.be.properAddress;
    });
  });

  describe("Store Document", function () {
    it("Debería almacenar un documento correctamente", async function () {
      const { registry, owner } = await loadFixture(deployDocumentRegistryFixture);

      const documentHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = "0x1234";

      await expect(registry.storeDocumentHash(documentHash, timestamp, signature))
        .to.emit(registry, "DocumentStored")
        .withArgs(documentHash, owner.address, timestamp, signature);

      const [hash, ts, signer, sig, exists] = await registry.getDocumentInfo(documentHash);
      
      expect(hash).to.equal(documentHash);
      expect(ts).to.equal(timestamp);
      expect(signer).to.equal(owner.address);
      expect(sig).to.equal(signature);
      expect(exists).to.be.true;
    });

    it("No debería permitir documentos duplicados", async function () {
      const { registry } = await loadFixture(deployDocumentRegistryFixture);

      const documentHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = "0x1234";

      await registry.storeDocumentHash(documentHash, timestamp, signature);

      await expect(
        registry.storeDocumentHash(documentHash, timestamp, signature)
      ).to.be.revertedWith("Document already exists");
    });
  });

  describe("Verify Document", function () {
    it("Debería verificar si un documento está almacenado", async function () {
      const { registry } = await loadFixture(deployDocumentRegistryFixture);

      const documentHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      
      expect(await registry.isDocumentStored(documentHash)).to.be.false;

      await registry.storeDocumentHash(documentHash, Date.now(), "0x1234");

      expect(await registry.isDocumentStored(documentHash)).to.be.true;
    });

    it("Debería verificar firma ECDSA correctamente", async function () {
      const { registry, owner } = await loadFixture(deployDocumentRegistryFixture);

      // Crear mensaje y firmarlo
      const message = "Important Document";
      const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
      const signature = await owner.signMessage(ethers.getBytes(messageHash));

      // Almacenar documento
      await registry.storeDocumentHash(messageHash, Date.now(), signature);

      // Verificar firma
      const isValid = await registry.verifyDocument(messageHash, owner.address, signature);
      expect(isValid).to.be.true;
    });

    it("Debería rechazar firma inválida", async function () {
      const { registry, owner, addr1 } = await loadFixture(deployDocumentRegistryFixture);

      const message = "Important Document";
      const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
      const signature = await owner.signMessage(ethers.getBytes(messageHash));

      await registry.storeDocumentHash(messageHash, Date.now(), signature);

      // Intentar verificar con dirección incorrecta
      const isValid = await registry.verifyDocument(messageHash, addr1.address, signature);
      expect(isValid).to.be.false;
    });
  });

  describe("Get Document Info", function () {
    it("Debería obtener información completa del documento", async function () {
      const { registry, owner } = await loadFixture(deployDocumentRegistryFixture);

      const documentHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = "0xabcdef";

      await registry.storeDocumentHash(documentHash, timestamp, signature);

      const [hash, ts, signer, sig, exists] = await registry.getDocumentInfo(documentHash);

      expect(hash).to.equal(documentHash);
      expect(ts).to.equal(timestamp);
      expect(signer).to.equal(owner.address);
      expect(sig).to.equal(signature);
      expect(exists).to.be.true;
    });
  });

  describe("Get Document Signature", function () {
    it("Debería obtener la firma de un documento", async function () {
      const { registry } = await loadFixture(deployDocumentRegistryFixture);

      const documentHash = ethers.keccak256(ethers.toUtf8Bytes("test document"));
      const signature = "0xabcdef123456";

      await registry.storeDocumentHash(documentHash, Date.now(), signature);

      const retrievedSignature = await registry.getDocumentSignature(documentHash);
      expect(retrievedSignature).to.equal(signature);
    });

    it("Debería fallar al obtener firma de documento inexistente", async function () {
      const { registry } = await loadFixture(deployDocumentRegistryFixture);

      const documentHash = ethers.keccak256(ethers.toUtf8Bytes("nonexistent"));

      await expect(
        registry.getDocumentSignature(documentHash)
      ).to.be.revertedWith("Document does not exist");
    });
  });

  describe("Complete Signature Workflow", function () {
    it("Debería completar un flujo completo de firma y verificación", async function () {
      const { registry, owner } = await loadFixture(deployDocumentRegistryFixture);

      // 1. Crear documento
      const documentContent = "This is a legal contract";
      const documentHash = ethers.keccak256(ethers.toUtf8Bytes(documentContent));

      // 2. Firmar documento
      const signature = await owner.signMessage(ethers.getBytes(documentHash));
      const timestamp = Math.floor(Date.now() / 1000);

      // 3. Almacenar en blockchain
      await registry.storeDocumentHash(documentHash, timestamp, signature);

      // 4. Verificar que existe
      expect(await registry.isDocumentStored(documentHash)).to.be.true;

      // 5. Obtener información
      const [hash, ts, signer, sig, exists] = await registry.getDocumentInfo(documentHash);
      
      expect(hash).to.equal(documentHash);
      expect(signer).to.equal(owner.address);
      expect(exists).to.be.true;

      // 6. Verificar firma
      const isValid = await registry.verifyDocument(documentHash, owner.address, signature);
      expect(isValid).to.be.true;
    });
  });

  describe("Gas Optimization", function () {
    it("Debería reportar gas usado en store", async function () {
      const { registry } = await loadFixture(deployDocumentRegistryFixture);

      const documentHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const tx = await registry.storeDocumentHash(documentHash, Date.now(), "0x1234");
      const receipt = await tx.wait();

      console.log("       Gas usado para store:", receipt.gasUsed.toString());
      expect(receipt.gasUsed).to.be.lessThan(150000);
    });
  });
});
