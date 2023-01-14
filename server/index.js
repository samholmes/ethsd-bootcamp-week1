const express = require("express");
const { secretToAddress, hashMessage, publicKeyToAddress } = require("./utils");
const { recoverPublicKey } = require('ethereum-cryptography/secp256k1')
const { toHex } = require('ethereum-cryptography/utils')
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  [secretToAddress('hello')]: 100, // hello
  [secretToAddress('ethereum')]: 50, // ethereum
  [secretToAddress('world')]: 75, // world
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, recovery, ...payload } = req.body;
  const { sender, recipient, amount } = payload
  const message = JSON.stringify(payload)
  const messageHex = `${toHex(hashMessage(message))}`
  const signatureHex = `${signature}`

  //
  // Validation
  //
  
  // Valid recipient address
  if (!recipient || recipient.length !== 42) {
    res.status(400).send({ message: "Invalid recipient address!" });
    return
  }

  // Valid signature
  const expectedSenderPublicKey = recoverPublicKey(messageHex, signatureHex, recovery);
  const expectedAddress = publicKeyToAddress(expectedSenderPublicKey)
  if (expectedAddress !== sender)
  {
    res.status(400).send({ message: "Invalid signature!" });
    return
  }

  
  //
  // Update ledger
  //
  
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
    return
  }  

  balances[sender] -= amount;
  balances[recipient] += amount;
  res.send({ balance: balances[sender] });

  console.log(`Transferred ${amount} from ${sender} to ${recipient}`)
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
