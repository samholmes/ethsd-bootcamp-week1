import axios from "axios";
import { useEffect, useState } from "react";

import { secretToAddress } from './utils.js'

function Generate() {
  const [phrase, setPhrase] = useState("")
  const [address, setAddress] = useState("");
  const [generating, setGenerating] = useState(false)

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setGenerating(true)
    try {
      const generate = axios.create({
        baseURL: "http://localhost:1337",
      });
      const response = await generate.get('phrase')
      const phrase = response.data.phrase.replace(/"|/g, '')
      setPhrase(phrase)
      setAddress(secretToAddress(phrase))
      setGenerating(false)
    } catch (error) {
      alert(`Failed to generate phrase: ${String(error)}`)
    }
  }

  return (
    <form className="box wallet" onSubmit={handleSubmit}>
      <h1>Generate address</h1>

      <label>
        Secret Phrase
        <input placeholder="Secret phrase will appear here..." value={phrase} disabled></input>
      </label>

      <label>
        Address
        <input placeholder="Address will appear here..." value={address} disabled></input>
      </label>

      <input type="submit" className="button" value="Generate" disabled={generating} />

    </form>
  );
}

export default Generate;
