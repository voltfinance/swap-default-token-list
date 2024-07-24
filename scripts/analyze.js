const fs = require('fs/promises')
const Mustache = require('mustache')
const { execSync } = require('child_process')
const fetch = require('node-fetch')

async function getNewTokenList() {
  const newTokenList = await fs.readFile(
    './build/voltage-swap-default.tokenlist.json',
    'utf8',
  )

  return JSON.parse(newTokenList)
}

let fetchedTokenList
async function getCurrentTokenList() {
  if (fetchedTokenList) return fetchedTokenList

  const response = await fetch(
    'https://raw.githubusercontent.com/voltfinance/swap-default-token-list/master/build/voltage-swap-default.tokenlist.json',
  )

  if (!response.ok) throw new Error(`Response status: ${response.status}`)

  const json = await response.json()

  fetchedTokenList = json

  return fetchedTokenList
}

async function getNewToken() {
  const newTokenList = await getNewTokenList()
  const currentTokenList = await getCurrentTokenList()

  const currentIds = new Set(
    currentTokenList.tokens.map((token) => token.address),
  )

  const newTokens = newTokenList.tokens.filter(
    (token) => !currentIds.has(token.address),
  )

  return newTokens[0]
}

async function isNameValid(newToken) {
  const currentTokenList = await getCurrentTokenList()

  const foundDuplicate = currentTokenList.tokens.find(
    (token) => token.name === newToken.name,
  )

  if (foundDuplicate) return 'Name is duplicate'

  return null
}

async function isSymbolValid(newToken) {
  const currentTokenList = await getCurrentTokenList()

  const foundDuplicate = currentTokenList.tokens.find(
    (token) => token.symbol === newToken.symbol,
  )

  if (foundDuplicate) return 'Symbol is duplicate'

  return null
}

async function analyze() {
  const errors = []

  const newToken = await getNewToken()

  if (!newToken) return

  const nameError = await isNameValid(newToken)
  if (nameError) errors.push(nameError)

  const symbolError = await isSymbolValid(newToken)
  if (symbolError) errors.push(symbolError)

  const variables = {
    address: newToken.address,
    name: newToken.name,
    symbol: newToken.symbol,
    decimals: newToken.decimals,
    logoURI: newToken.logoURI,
    errors: errors,
  }

  const summary = Mustache.render(
    `
      **PR Summary**
      Token in PR: ERC20 {{address}}
      Name: **{{name}}**, Symbol: **{{symbol}}**, Decimals: **{{decimals}}**
      {{#errors.length}}
      Token check error:
      {{#errors}}
      {{.}}
      {{/errors}}
      {{/errors.length}}
      ![{{name}} logo]({{{logoURI}}})
    `,
    variables,
  )

  await fs.writeFile('summary.txt', summary.trim())
}

analyze()
