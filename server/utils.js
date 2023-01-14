const { keccak256 } = require('ethereum-cryptography/keccak')
const { getPublicKey } = require('ethereum-cryptography/secp256k1')
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils')


// Address:

function secretToAddress(secret) {
  const privateKey = secretToPrivateKey(secret)
  const publicKey = privateKeyToPublicKey(privateKey)
  const address = publicKeyToAddress(publicKey)
  return address
}

function secretToPrivateKey(secret) {
  const hash = hashMessage(secret)
  const hex = toHex(hash)
  return hex
}

function privateKeyToPublicKey(privateKey) {
  return getPublicKey(privateKey);
}

function publicKeyToAddress(publicKey) {
  const [firstByte, ...rest] = publicKey
  const hash = keccak256(new Uint8Array(rest))
  const slice = hash.slice(hash.length - 20)
  return `0x${toHex(slice)}`
}

// Etc:

function hashMessage(message) {
    const b = utf8ToBytes(message)
    const h = keccak256(b)
    return h 
}

module.exports = {
  secretToAddress,
  secretToPrivateKey,
  privateKeyToPublicKey,
  publicKeyToAddress,
  hashMessage,
}