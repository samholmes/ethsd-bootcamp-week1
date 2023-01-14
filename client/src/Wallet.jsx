function Wallet({ address, balance, phrase, onChangePhrase }) {
  return (
    <div className="box wallet">
      <h1>Your Wallet</h1>

      <label>
        Secret Phrase
        <input placeholder="Type your secret phrase" value={phrase} onChange={ev => onChangePhrase(ev.target.value)}></input>
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
