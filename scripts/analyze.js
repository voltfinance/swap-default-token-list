const path = require('path')
const fs = require('fs/promises')
const Mustache = require('mustache')

const newToken = require('../src/new-token.json')

const isNameValid = require('./helpers/isNameValid')
const isSymbolValid = require('./helpers/isSymbolValid')
const getContributors = require('./helpers/getContributors')
const isLiquidityValid = require('./helpers/isLiquidityValid')
const getCurrentTokenList = require('./helpers/getCurrentTokenList')

// Deprecated
// const getNewToken = require('./helpers/getNewToken')
// const getNewTokenList = require('./helpers/getNewTokenList')

const getLogoURI = (tokenAddress) =>
  `https://raw.githubusercontent.com/voltfinance/swap-default-token-list/master/logos/${tokenAddress}/logo.png`

async function analyze() {
  const errors = []

  const contributors = await getContributors()
  const currentTokenList = await getCurrentTokenList()

  if (newToken?.name.length == 0) {
    return
  }

  const nameError = await isNameValid(newToken, currentTokenList)
  if (nameError) {
    errors.push(nameError)
  }

  const symbolError = await isSymbolValid(newToken, currentTokenList)
  if (symbolError) {
    errors.push(symbolError)
  }

  const liquidityError = await isLiquidityValid(newToken)
  if (liquidityError) {
    errors.push(liquidityError)
  }

  const view = {
    name: newToken.name,
    address: newToken.address,
    symbol: newToken.symbol,
    decimals: newToken.decimals,
    logoURI: newToken.logoURI,
    contributors: contributors.map((c) => `@${c}`).join(' '),
    errors,
  }

  const summary = Mustache.render(
    `
      **PR Summary**:
      * Token address: {{address}}
      * Name: **{{name}}**
      * Symbol: **{{symbol}}**
      * Decimals: **{{decimals}}**
      {{#errors.length}}
      *Token check error:
      {{#errors}}
      *❌{{.}}
      {{/errors}}
      {{/errors.length}}
      {{^errors.length}}
      *Token check ok:
      ✅
      {{/errors.length}}
      ![{{name}} logo]({{{logoURI}}})
      {{contributors}}
    `,
    view
  )

  await fs.writeFile('summary.txt', summary.trim())

  try {
    const fuseFilePath = path.join(__dirname, '../src/tokens/fuse.json')
    const fuseTokens = JSON.parse(await fs.readFile(fuseFilePath, 'utf8'))

    const newTokenObject = {
      name: newToken.name,
      address: newToken.address,
      symbol: newToken.symbol,
      decimals: newToken.decimals,
      chainId: newToken.chainId,
      logoURI: newToken.logoURI,
    }

    // Add the new token to the list
    fuseTokens.push(view)

    // Write the updated list back to the file
    await fs.writeFile(fuseFilePath, JSON.stringify(fuseTokens, null, 2))
  } catch (err) {
    console.error(err)
  }
}

analyze()
