import { useState } from "react";

function Transfer({ address, onSubmitSend }) {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const handleSubmit = (ev) => {
    ev.preventDefault()
    onSubmitSend(recipient, amount)
  }

  return (
    <form className="container transfer" onSubmit={handleSubmit}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={amount}
          onChange={(ev) => setAmount(parseInt(ev.target.value))}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={(ev) => setRecipient(ev.target.value)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
