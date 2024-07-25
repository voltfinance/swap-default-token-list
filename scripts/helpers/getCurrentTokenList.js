module.exports = async function getCurrentTokenList() {
    const response = await fetch(
      'https://raw.githubusercontent.com/voltfinance/swap-default-token-list/master/build/voltage-swap-default.tokenlist.json',
    )
  
    if (!response.ok) throw new Error(`Response status: ${response.status}`)
  
    return response.json()
}
