const axios = require('axios')

// const token = process.env.TELEGRAM_BOT_TOKEN
// const chatId = process.env.TELEGRAM_CHAT_ID
const TELEGRAM_BOT_TOKEN = ''
const TELEGRAM_CHAT_ID = ''

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set')
}

async function sendMessage(chatId) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  // const currentTokenList = await getCurrentTokenList()
  // const newToken = await getNewToken(newTokenList, currentTokenList)

  // if (!newToken) {
  //   console.log('No new token has been added')
  //   return
  // }

  // mock
  const newToken = {
    name: 'Dai Stablecoin V2',
    address: '0x2502F488D481Df4F5054330C71b95d93D41625C2',
    symbol: 'DAI V2',
    decimals: 18,
    chainId: 122,
    logoURI:
      'https://raw.githubusercontent.com/voltfinance/swap-default-token-list/master/logos/0x440B63C0e7b21a57A3784D8AB8E819B9dA383FDf/logo.png',
  }

  const text = `
    There has been a new listing!
      - Token address: ${newToken.address}
      - Name: ${newToken.name}
      - Symbol: ${newToken.symbol}
      - Decimals: ${newToken.decimals}
    `

  try {
    console.log(text)
    const response = await axios.post(url, {
      chat_id: chatId,
      text: text,
    })
    console.log('Message sent:', response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error message:', error.message)
      if (error.response) {
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
        console.error('Response headers:', error.response.headers)
      }
    } else {
      console.error('Unexpected error:', error)
    }
  }
}

sendMessage(TELEGRAM_CHAT_ID)
