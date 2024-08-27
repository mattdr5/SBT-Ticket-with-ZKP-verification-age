const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

describe("Verifier", function () {
    let Verifier, verifier;

    before(async function () {
        Verifier = await ethers.getContractFactory("Verifier");
        verifier = await Verifier.deploy();
        await verifier.waitForDeployment()
    });

    it("Dovrebbe restituire false per una prova di età valida", async function () {

        const proofPath = path.join(__dirname, "../proofs/proof.json");
        const proofJson = JSON.parse(fs.readFileSync(proofPath, "utf8"));

        const proof = proofJson.proof;

        const isValid = await verifier.verifyTx(proof);
        expect(isValid).to.be.true;
    });

    it("Dovrebbe restituire false per una prova di età non valida", async function () {
        // Leggi il file proof.json, la prova generata con zokrates
        const proofPath = path.join(__dirname, "../proofs/fake_proof.json");
        const proofJson = JSON.parse(fs.readFileSync(proofPath, "utf8"));

        const proof = proofJson.proof;
        
        const isValid = await verifier.verifyTx(proof);
        expect(isValid).to.be.false; 
    });

describe("SoulboundTicket", function () {

    let SoulboundTicket, Verifier, sbt, verifier;
    let deployer, addr1;

    before(async function () {
        [deployer, addr1] = await ethers.getSigners();

        Verifier = await ethers.getContractFactory("Verifier");
        verifier = await Verifier.deploy();
        await verifier.waitForDeployment()

        SoulboundTicket = await ethers.getContractFactory("SoulboundTicket");
        sbt = await SoulboundTicket.deploy(verifier.target);
        await sbt.waitForDeployment()
    });

    it("Dovrebbe creare il SBT, prova di età valida", async function () {
        
        const proofPath = path.join(__dirname, "../proofs/proof.json");
        const proofJson = JSON.parse(fs.readFileSync(proofPath, "utf8"));

        // Estrai la proof dal JSON
        const proof = {
            a: [
                proofJson.proof.a[0],
                proofJson.proof.a[1]
            ],
            b: [
                [proofJson.proof.b[0][0], proofJson.proof.b[0][1]],
                [proofJson.proof.b[1][0], proofJson.proof.b[1][1]]
            ],
            c: [
                proofJson.proof.c[0],
                proofJson.proof.c[1]
            ]
        };

          
        // Mint del ticket
        const tx = await sbt.mint(addr1.address, 1, proof);
        const receipt = await tx.wait();

        // Stampa i dettagli della transazione
        console.log(`Gas used for minting: ${receipt.gasUsed.toString()}`);
        
        const owner = await sbt.ownerOf(1);
        expect(owner).to.equal(addr1.address);
    });

    it("Non ovrebbe creare il SBT, prova di età valida", async function () {
        // Prova con dati non validi per simulare un'età non valida
        const invalidProof = {
            a: [
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                "0x0000000000000000000000000000000000000000000000000000000000000000"
            ],
            b: [
                ["0x0000000000000000000000000000000000000000000000000000000000000000", 
                 "0x0000000000000000000000000000000000000000000000000000000000000000"],
                ["0x0000000000000000000000000000000000000000000000000000000000000000", 
                 "0x0000000000000000000000000000000000000000000000000000000000000000"]
            ],
            c: [
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                "0x0000000000000000000000000000000000000000000000000000000000000000"
            ]
        };

        // Prova che il mint fallisce con una prova non valida
        await expect(sbt.mint(addr1.address, 2, invalidProof))
            .to.be.revertedWith("L'eta deve essere maggiore di 18");
    });
});


});