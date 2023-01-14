import { useEffect, useState } from "react";

function Transaction({ onChangeTransaction, onSubmitTransaction }) {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  useEffect(() => {
    onChangeTransaction(recipient, parseInt(amount))
  }, [recipient, amount])

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const phrase = prompt("Enter your secret phrase...")
    onSubmitTransaction(phrase)
  }

  return (
    <form className="box transfer" onSubmit={handleSubmit}>
      <h1>Create Transaction</h1>

      <label>
        Send Amount
        <input
          type="number"
          placeholder="Enter amount..."
          value={amount}
          onChange={(ev) => setAmount(ev.target.value)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Enter address..."
          value={recipient}
          onChange={(ev) => setRecipient(ev.target.value)}
        ></input>
      </label>

      <input type="submit" className="button" value="Send" />
    </form>
  );
}

export default Transaction;
