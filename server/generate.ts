import { config } from 'dotenv'
import { ChatGPTAPIBrowser } from 'chatgpt'
import { readFileSync } from 'fs'
import { generateMnemonic } from 'ethereum-cryptography/bip39'
import readline from 'readline'

config()

const OPENAI_EMAIL = process.env.OPENAI_EMAIL
const OPENAI_PASSWORD = process.env.OPENAI_PASSWORD

const wordText = readFileSync('./words.txt', 'utf-8')
const words = wordText.split('\n')


async function main() {
  if (OPENAI_EMAIL == null || OPENAI_PASSWORD == null) throw new Error('missing un/pw')

  const api = new ChatGPTAPIBrowser({
      email: OPENAI_EMAIL,
      password: OPENAI_PASSWORD 
    })

  await api.initSession()

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.on('line', async () => {
    await generate(api)
  })
}

main().catch(console.error)

async function generate(api: ChatGPTAPIBrowser) {

  const mnemonic = generateMnemonic(words)
  const five = mnemonic.split(' ').slice(0, 5).join(', ')

  console.log(`Using words: ${five}`)

  const prompt = `Write a short sentence using 5 of the words in this list: ${five}. The sentence must be no more than 9 words long. The sentences should require no punctuation. The sentence should be coherent and make sense.Add filler words to the sentence like an, the, a, etc. And, add unique, random, and distinct adjectives to some nouns.`

  // console.log(prompt)

  const respond = async (msg: string): Promise<void> => {
    const result = await api.sendMessage(msg)
    console.log(`\n\t${result.response}`)
  }

  respond(prompt)
}
