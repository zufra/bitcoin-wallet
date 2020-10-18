const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const bip39 = require("bip39");
const bip32 = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const sendTx = require("./sendTx");
const axios = require("axios");
const { resolve } = require("path");

let introText = "Para importar un mnemonic y crear una address ingrese '1'.\n";
introText +=
  "Para que se cree un mnemonic nuevo y una address a partir de este ingrese '2'.\n";
introText += "Para mostrar el balance de una cuenta ingrese '3'.\n";
introText += "Para listar transacciones asociadas a la cuenta ingrese '4'.\n";
introText += "Para transferir BTCs ingrese '5'.\n";
introText += "Para salir escriba 'exit'.\n";

let mnemonic;
let address;
let app = true;

const getMnemonicValue = () => {
  return new Promise((resolve, reject) => {
    readline.question("Ingrese su mnemonic:", (userMnemonic) => {
      if (userMnemonic) resolve(userMnemonic);
    });
  });
};

const createAddress = (mnemonic) => {
  return new Promise((resolve, reject) => {
    try {
      const seed = bip39.mnemonicToSeedSync(mnemonic);
      const node = bip32.fromSeed(seed, bitcoin.networks.testnet);
      const address = bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: bitcoin.networks.testnet,
      }).address;
      resolve(address);
    } catch (error) {
      reject(error);
    }
  });
};

const getAddress = () => {
  return new Promise((resolve, reject) => {
    readline.question("Ingrese su address:", (userAddress) => {
      if (userAddress) resolve(userAddress);
    });
  });
};

const getDestinationAddress = () => {
  return new Promise((resolve, reject) => {
    readline.question(
      "Ingrese el address a la cual desea transferir BTC:",
      (destAddress) => {
        if (destAddress) resolve(destAddress);
      }
    );
  });
};

const getBalance = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.get(
        "https://api.blockcypher.com/v1/btc/test3/addrs/" + address + "/balance"
      );
      resolve(result.data.balance);
    } catch (error) {
      reject(error);
    }
  });
};

const getTransactions = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.get(
        "https://api.blockcypher.com/v1/btc/main/addrs/" + address + "/full"
      );
      resolve(result.data.txs);
    } catch (error) {
      reject(error);
    }
  });
};

const getMontoSatoshis = () => {
  return new Promise((resolve, reject) => {
    readline.question(
      "Ingrese el monto de Satoshis que desea transferir:",
      (monto) => {
        if (monto) resolve(monto);
      }
    );
  });
};

const getFee = () => {
  return new Promise((resolve, reject) => {
    readline.question(
      "Ingrese la fee que está dispuesto a pagar (en Satoshis):",
      (fee) => {
        if (fee) resolve(fee);
      }
    );
  });
};

const wallet = () => {
  try {
    readline.question(introText, async (ans) => {
      switch (ans) {
        case "1":
          mnemonic = await getMnemonicValue();
          address = await createAddress(mnemonic);
          console.log("Su address es: " + address);
          wallet();
          break;
        case "2":
          mnemonic = bip39.generateMnemonic();
          console.log("Su mnemonic es: " + mnemonic);
          address = await createAddress(mnemonic);
          console.log("Su address es: " + address);
          wallet();
          break;
        case "3":
          address = await getAddress();
          balance = await getBalance(address);
          console.log(balance + " satoshis");
          wallet();
          break;
        case "4":
          address = await getAddress();
          txs = await getTransactions(address);

          formattedTxs = txs.map((transaction) => {
            confirmedDate = new Date(transaction.confirmed); //se toma esta date como la de creacion de la tx
            formattedTransaction = {
              hash: transaction.hash,
              creationDate: confirmedDate.toLocaleDateString(),
              inputs: transaction.inputs.map((input) => {
                formattedInput = {
                  addresses: input.addresses,
                  output_value: input.output_value,
                };
                return formattedInput;
              }),

              outputs: transaction.outputs.map((output) => {
                formattedOutput = {
                  addresses: output.addresses,
                  value: output.value,
                  spent: output.spent_by ? true : false,
                };
                return formattedOutput;
              }),
            };

            return formattedTransaction;
          });

          //Se hace JSON.strigify para que sea vea todo el contenido del obj en la consola
          console.log(JSON.stringify(formattedTxs));
          wallet();
          break;
        case "5":
          //TO DO: Send btc a un address especificada usando sentTx
          break;
        case "exit":
          readline.close();
          break;
        default:
          console.log("Solo puede ingresar 1, 2, 3, 4 o 5.");
          wallet();
          break;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

wallet();
