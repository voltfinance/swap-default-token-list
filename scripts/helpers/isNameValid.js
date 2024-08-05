module.exports =  async function isNameValid(newToken, tokenList) {
  const foundDuplicate = tokenList.tokens.find(
    (token) => token.name === newToken.name,
  )

  if (foundDuplicate) return 'Name is duplicate'

  return null
}
