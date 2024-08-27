# SoulboundTicket Project

Questo progetto dimostra come creare e gestire un biglietto digitale "soulbound" utilizzando ZoKrates per la verifica dell'età e Hardhat per il deployment su Ethereum. Un token soulbound è un NFT che non può essere trasferito e rimane associato permanentemente al proprietario iniziale, perfetto per applicazioni come biglietti per eventi.

## Prerequisiti

Assicurati di avere installato sulla tua macchina i seguenti software:

- [Node.js](https://nodejs.org/): Versione usata v18.20.1 
- [npm](https://www.npmjs.com/): Versione usata 9.2.0
- [ZoKrates](https://zokrates.github.io/): Versione usata ZoKrates 0.8.8
- [Hardhat](https://hardhat.org/): Versione usata 9.2.0
- Ambiente Linux - usato Linux kali 6.8.11-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.8.11-1kali2 (2024-05-30) x86_64 GNU/Linux

## Installazione e Configurazione

### 1. Installare ZoKrates

1. **Installazione di ZoKrates su Linux**

   ```curl -LSfs get.zokrat.es | sh```

2. Aggiungere ZoKrates al PATH

Dopo l'installazione, è necessario aggiungere ZoKrates al tuo PATH per poter eseguire i comandi di ZoKrates da qualsiasi directory. 

   ```export PATH=$PATH:/home/<tuo-username>/.zokrates/bin```

   Sostituisci <tuo-username> con il tuo nome utente. Questo comando assicura che la directory di ZoKrates sia inclusa nel tuo PATH.

### 3. Verificare l'installazione riuscita di ZoKrates

   Dopo aver aggiornato il PATH:
   
   ```zokrates --version```
    
   Questo comando dovrebbe restituire la versione di ZoKrates installata


### Configurazione del Progetto Hardhat

## 1. Clonare il Progetto

Clona il repository del progetto:

    git clone <URL-del-repository>
    cd <nome-del-repository>

## 2. Installare le Dipendenze

Installa le dipendenze del progetto utilizzando npm:

    npm install

## 3. Configurare e compilare i contratti

### 3.1 Avviare la rete Hardhat in locale

Avvia una rete locale Hardhat in un terminale separato:

    npx hardhat node

### 3.2 Compilare i contratti

In un altro terminale, compila i contratti:

    npx hardhat compile

### 3.3 Distribuire i contratti

Distribuisci i contratti sulla rete locale avviata:

    npx hardhat run scripts/deploy.js --network localhost

## 4. Eseguire i test

Esegui i test per verificare il corretto funzionamento del codice:

    npx hardhat test


## Generazione della Proof con ZoKrates

### 1. Scrivere il Programma ZoKrates

Il programma ZoKrates è scritto in un file con estensione `.zok`. Questo file contiene la logica per la verifica dell'età. 

### 2. Compilare il Programma

Compila il programma ZoKrates:

```zokrates compile -i <nome-del-file.zok>```

3. Generare la Proof
Genera la prova per il programma compilato:

- Setup: Esegui la configurazione iniziale necessaria per generare prove:

    ```zokrates setup```

- Compute Witness: Calcola il testimone (witness) utilizzando i parametri di input:
    ```zokrates compute-witness -a <input-parameters>```
Inserire l'età 

- Generazione della prova (Proof): Genera la prova utilizzando il testimone calcolato:


    ```zokrates generate-proof```
4. Export del Verifier: Genera il codice Solidity del verifier:
    
     ```zokrates export-verifier```

# In sintesi le fasi di generazione e utilizzo delle prove con ZoKrates

1. Scrittura e Compilazione del Programma ZoKrates

    - Programma ZoKrates (.zok): Il file .zok contiene la logica per la verifica dell'età. Questo programma viene scritto utilizzando il linguaggio di ZoKrates.
    - Compilazione: La compilazione del programma produce i file necessari per la generazione della proof. Questo processo crea file come program che rappresentano la logica del programma compilata.

2. Setup

    - Configurazione Iniziale: Esegui il comando zokrates setup.    
    Questo comando genera le chiavi pubbliche e private necessarie per la generazione e verifica delle prove. I file creati includono:
    - **proving.key**: La chiave privata utilizzata per generare la prova.
    - **verification.key**: La chiave pubblica utilizzata per verificare la prova.

3. Calcolo del testimone

- Compute Witness: Utilizzando il comando zokrates compute-witness -a <input-parameters>, calcoli il testimone (witness). Questo file contiene le informazioni necessarie per dimostrare che l'input soddisfa la condizione senza rivelare i dati stessi. Non ci sono file specifici generati per questo passaggio, ma i dati vengono utilizzati internamente per creare la proof.

4. Generazione della proof

 - zokrates generate-proof. 
 Questo comando utilizza il testimone calcolato e la chiave privata (proving.key) per generare una prova, che viene salvata tipicamente in un file chiamato proof.json. Questo file è criptato e non leggibile direttamente, ma è utilizzato come input per il verifier.

5. Verifica della Proof
 Il comando 'zokrates verify' utilizza la chiave pubblica (verification.key) per verificare la prova generata. Questo passaggio conferma che la prova sia valida senza rivelare i dettagli specifici dell'input.


6. Export del Verifier

Utilizza zokrates export-verifier per generare il codice Solidity del verifier. Questo codice è necessario per integrare la verifica della proof nel contratto smart su Ethereum. Il file esportato contiene la logica per verificare la proof sulla blockchain.

### Caso d'uso d'esempio

1. Utente: L'utente vuole partecipare a un evento che richiede un'età minima di 18 anni.

2. Generazione della prova: L'utente fornisce la propria età, ad esempio 21, al sistema che genera una prova criptata (proof.json).

3. Interazione con il contratto Smart: L'utente invia la prova generata allo smart contract su Ethereum.

4. Verifica del contratto: Lo smart contract utilizza la chiave pubblica per verificare la prova. La verifica conferma che l'utente ha più di 18 anni senza rivelare l'età effettiva.

5. Esito della verifica: Se la prova è valida, il contratto autorizza l'utente a partecipare all'evento, magari con l'emissione di un qualcosa. Altrimenti, l'accesso è negato.
