const fs = require('fs/promises')
const Mustache = require('mustache')
const fetch = require('node-fetch')

const isLiquidityValid = require('./helpers/isLiquidityValid')
const isNameValid = require('./helpers/isNameValid')
const isSymbolValid = require('./helpers/isSymbolValid')
const getNewTokenList = require('./helpers/getNewTokenList')
const getCurrentTokenList = require('./helpers/getCurrentTokenList')

async function getNewToken(newTokenList, currentTokenList) {
  const currentIds = new Set(
    currentTokenList.tokens.map((token) => token.address),
  )

  const newTokens = newTokenList.tokens.filter(
    (token) => !currentIds.has(token.address),
  )

  return newTokens[0]
}

async function analyze() {
  const errors = []

  const newTokenList = await getNewTokenList()
  const currentTokenList = await getCurrentTokenList()

  const newToken = await getNewToken(newTokenList, currentTokenList)

  if (!newToken) return

  const nameError = await isNameValid(newToken, currentTokenList)
  if (nameError) errors.push(nameError)

  const symbolError = await isSymbolValid(newToken, currentTokenList)
  if (symbolError) errors.push(symbolError)

  const liquidityError = await isLiquidityValid(newToken)
  if (liquidityError) errors.push(liquidityError)

  const view = {
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
      ❌{{.}}
      {{/errors}}
      {{/errors.length}}
      ![{{name}} logo]({{{logoURI}}})
      @mul53 @darkpaladi
    `,
    view,
  )

  await fs.writeFile('summary.txt', summary.trim())
}

analyze()
