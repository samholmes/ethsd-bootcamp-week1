import express from "express"
import { config } from 'dotenv'
import { ChatGPTAPIBrowser } from 'chatgpt'
import { readFileSync } from 'fs'
import { generateMnemonic } from 'ethereum-cryptography/bip39'
import readline from 'readline'
import crypto from 'crypto'

config()

const OPENAI_EMAIL = process.env.OPENAI_EMAIL
const OPENAI_PASSWORD = process.env.OPENAI_PASSWORD

const wordText = readFileSync('./words.txt', 'utf-8')
const wordList = wordText.split('\n')

const app = express();
const cors = require("cors");
const port = 1337;

let api: ChatGPTAPIBrowser | undefined
let ready = false

app.use(cors());
app.use(express.json());

app.use('/phrase', (req, res) => {
  if (api == null || !ready) return res.status(500).send('Waiting on chappie...')

  const header = `REST request`
  console.log(header)
  console.log(Array.from(header).map(() => '-').join(''))
  generate(api).then(phrase => {
    console.log(phrase)
    console.log(Array.from(header).map(() => '-').join(''))
    res.send({ phrase })
  }).catch(err => {
    res.status(500).send(err)
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

async function main() {
  if (OPENAI_EMAIL == null || OPENAI_PASSWORD == null) throw new Error('missing un/pw')

  api = new ChatGPTAPIBrowser({
      email: OPENAI_EMAIL,
      password: OPENAI_PASSWORD 
    })

    
    await api.initSession()

  ready = true

  console.log(`Ready for sweet sweet mnemonics!`)
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  rl.on('line', async () => {
    if (api == null)  throw new Error('unexpected null api')
    const phrase = await generate(api)
  })

}

main().catch(console.error)

async function generate(api: ChatGPTAPIBrowser): Promise<string> {
  const picks = []
    while (picks.length < 5) {

    const index = crypto.randomInt(0, wordList.length)
    const word = wordList[index]
    picks.push(word)
  }


  const header = `Using words: [${picks}]`
  console.log(header)
  console.log(Array.from(header).map(() => '-').join(''))

  // console.log(prompt)

  const chat = async (msg: string): Promise<string> => {
    const result = await api.sendMessage(msg)
    console.log('\t' + result.response)
    return result.response
  }

  const final = await chat(`Write a short sentence using all of the words in this list: ${picks}. `
    +`The sentence must be exactly 12 words long. `
    +`The sentences so that no punctuation is used. `
    +`The sentence to be coherent and make sense. `
    +`The sentence to include determiner words. `
    +`Add one or more adjective the nouns in the sentence that are not included in the BIP39 word list.`)

  process.stdout.write(Array.from(header).map(() => '-').join(''))

  return final
}
