const fs = require('fs/promises')

module.exports = async function getNewTokenList() {
  const newTokenList = await fs.readFile(
    './build/voltage-swap-default.tokenlist.json',
    'utf8',
  )

  return JSON.parse(newTokenList)
}
