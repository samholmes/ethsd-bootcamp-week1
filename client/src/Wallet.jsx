import { useEffect, useState } from "react";

import server from "./server";
import { secretToAddress } from './utils.js'

function Wallet({ balance, setBalance, onChangeAddress }) {
  const [phrase, setPhrase] = useState("")
  const [address, setAddress] = useState("")

  function handleChangePhrase(evt) {
    const phrase = evt.target.value;
    setPhrase(phrase)

    const address = secretToAddress(phrase)

    setAddress(address)
    onChangeAddress(address);
  }

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

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Secret Phrase
        <input placeholder="Type your secret phrase" value={phrase} onChange={handleChangePhrase}></input>
      </label>

      <label>
        Address
        <input placeholder="Type your secret phrase to see address" value={address} disabled></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
