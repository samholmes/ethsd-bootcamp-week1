import axios from "axios";
import { useEffect, useState } from "react";

import "./App.scss";

import { secretToAddress, secretToPrivateKey, signMessage } from './utils.js'
import Transaction from "./Transaction";
import Generate from "./Generate";
import InfoScan from "./InfoScan";

function App() {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [addressInfo, setAddressInfo] = useState([]);

  useEffect(() => {
    const call = async () => {
      const server = axios.create({
        baseURL: "http://localhost:3042",
      });
      const response = await server.get('addressInfo')
      setAddressInfo(response.data.addressInfo)
    }
    call()
  }, [])

  function handleChangeRecipient(recipient) {
    setRecipient(recipient)
  }
  function handleBalanceChange(balance) {
    setBalance(balance)
  }
  async function handleChangeTransaction(recipient, amount) {
    setAmount(amount)
    setRecipient(recipient)
  }
  async function handleSubmitTransaction(phrase) {
    const address = secretToAddress(phrase)
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
      const server = axios.create({
        baseURL: "http://localhost:3042",
      });
      const {
        data: { balance },
      } = await server.post(`send`, payload);

      // Update address info
      const response = await server.get('addressInfo')
      setAddressInfo(response.data.addressInfo)
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <div className="app">
      <div className="container">
        <Transaction onChangeTransaction={handleChangeTransaction} onSubmitTransaction={handleSubmitTransaction} />
        <Generate />
      </div>
      <div className="container">
        <InfoScan addressInfo={addressInfo} />
      </div>
    </div>
  );
}

export default App;
