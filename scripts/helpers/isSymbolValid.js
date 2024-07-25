module.exports = async function isSymbolValid(newToken, tokenList) {
  const foundDuplicate = tokenList.tokens.find(
    (token) => token.symbol === newToken.symbol,
  )

  if (foundDuplicate) return 'Symbol is duplicate'

  return null
}
