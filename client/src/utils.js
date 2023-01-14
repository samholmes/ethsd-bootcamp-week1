import { keccak256 } from 'ethereum-cryptography/keccak'
import { getPublicKey } from 'ethereum-cryptography/secp256k1'
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils'

export function secretToAddress(secret) {
  const privateKey = secretToPrivateKey(secret)
  const publicKey = privateKeyToPublicKey(privateKey)
  const address = publicKeyToAddress(publicKey)
  return address
}

export function secretToPrivateKey(secret) {
  const bytes = utf8ToBytes(secret) 
  const hash = keccak256(bytes)
  const hex = toHex(hash)
  return hex
}

export function privateKeyToPublicKey(privateKey) {
  return getPublicKey(privateKey);
}

export function publicKeyToAddress(publicKey) {
  const [firstByte, ...rest] = publicKey
  const hash = keccak256(new Uint8Array(rest))
  const slice = hash.slice(hash.length - 20)
  return `0x${toHex(slice)}`
}