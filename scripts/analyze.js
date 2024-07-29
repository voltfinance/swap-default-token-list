const fs = require('fs/promises')
const Mustache = require('mustache')

const isLiquidityValid = require('./helpers/isLiquidityValid')
const isNameValid = require('./helpers/isNameValid')
const isSymbolValid = require('./helpers/isSymbolValid')
const getNewTokenList = require('./helpers/getNewTokenList')
const getCurrentTokenList = require('./helpers/getCurrentTokenList')
const getNewToken = require('./helpers/getNewToken')
const getContributors = require('./helpers/getContributors')

async function analyze() {
  const errors = []

  const contributors = await getContributors()
  const newTokenList = await getNewTokenList()
  const currentTokenList = await getCurrentTokenList()
  const newToken = await getNewToken(newTokenList, currentTokenList)

  if (!newToken) {
    
    return
  }

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
    contributors: contributors.map(c => `@${c}`).join(" "),
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
    view,
  )

  await fs.writeFile('summary.txt', summary.trim())
}

analyze()
