// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "./verifier.sol"; 

/**
 * Un esempio di NFT che rappresenta un "biglietto" digitale
 * con un focus particolare sulla verifica dell'età. Q
 *       
 * Caratteristiche principali:
 *  - Il token è un "soulbound", cioè legato permanentemente a un singolo individuo
 *    e non può essere trasferito a terzi.
 *  - Prima di emettere un biglietto, il contratto verifica che l'età dell'utente
 *    oddisfi un requisito specificato tramite ZKP.
 *  - Una volta emesso, il biglietto rimane associato all'indirizzo dell'utente
 *    e non può essere trasferito o venduto.
 *
 */
contract SoulboundTicket is ERC721Burnable {
    Verifier public verifier;

    constructor(address _verifier) ERC721("SoulboundTicket", "SBT") {
        verifier = Verifier(_verifier);
    }

    function mint(address to, uint256 tokenId, Verifier.Proof memory proof) external {
        require(verifyAge(proof), "L'eta deve essere maggiore di 18");
        _mint(to, tokenId);
    }

    function verifyAge(Verifier.Proof memory proof) internal view returns (bool) {
        return verifier.verifyTx(proof);
    }
}
