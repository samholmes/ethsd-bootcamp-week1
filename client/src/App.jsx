import { useEffect, useState } from "react";

import "./App.scss";

import { secretToAddress, secretToPrivateKey, signMessage } from './utils.js'
import server from "./server";
import Transfer from "./Transfer";
import Wallet from "./Wallet";

function App() {
  const [phrase, setPhrase] = useState("")
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);

  function handleChangePhrase(phrase) {
    setPhrase(phrase)
  }
  function handleBalanceChange(balance) {
    setBalance(balance)
  }

  useEffect(() => {
    const address = secretToAddress(phrase)
    setAddress(address)
  }, [phrase])

  useEffect(() => {
    let stop = false
    const handler = async () => {
      if (address) {
        const response = await server.get(`balance/${address}`);
        if (stop) return
        const { data: { balance } } = response
        setBalance(balance);
      } else {
        setBalance(0);
      }
    }
    handler().then(console.error)
    return () => {
      stop = true
    }
  }, [address])

  async function handleSubmitSend(recipient, amount) {
    const privateKey = secretToPrivateKey(phrase)
    const payload = {
      sender: address,
      amount: amount,
      recipient,
    }
    const message = JSON.stringify(payload)
    const [signature, recovery] = await signMessage(message, privateKey)
    payload.signature = signature
    payload.recovery = recovery

    console.log(payload)
    
    try {
      const {
        data: { balance },
      } = await server.post(`send`, payload);
      setBalance(balance - amount);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }


  return (
    <div className="app">
      <Wallet
        address={address}
        balance={balance}
        phrase={phrase}
        onChangePhrase={handleChangePhrase}
      />
      <Transfer address={address} onChangeBalance={handleBalanceChange} onSubmitSend={handleSubmitSend} />
    </div>
  );
}

export default App;
