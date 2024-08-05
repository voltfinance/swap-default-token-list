module.exports = async function getNewToken(newTokenList, currentTokenList) {
  const currentIds = new Set(
    currentTokenList.tokens.map((token) => token.address),
  )

  const newTokens = newTokenList.tokens.filter(
    (token) => !currentIds.has(token.address),
  )

  return newTokens[0]
}
