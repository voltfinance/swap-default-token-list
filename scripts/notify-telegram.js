const path = require('path')
const axios = require('axios')
const fs = require('fs/promises')

const newToken = require('../src/new-token.json')

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set')
}

async function sendMessage(chatId) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  const text = `
⚡ [#VoltageDEX]: 

Voltage Finance DEX just listed a new token: ${newToken.symbol}

${newToken.oneLiner}

${newToken.bullishSentence}

💎 ${newToken.name} - ${newToken.address}

💧 Trade & provide liquidity now: https://voltage.finance/swap

🌐 [Website](${newToken.socials.website})
🐦 [Twitter](${newToken.socials.twitter})
💬 [Telegram](${newToken.socials.telegram})
`

  try {
    console.log(text)
    const response = await axios.post(url, {
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown',
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

  try {
    const newTokensPath = path.join(__dirname, '../src/new-token.json')

    const newTokenObject = {
      name: '',
      address: '',
      symbol: '',
      decimals: 18,
      chainId: 122,
      logoURI: '',
      oneLiner: '',
      bullishSentence: '',
      socials: {
        website: '',
        twitter: '',
        telegram: '',
      },
    }

    // Write the updated list back to the file
    await fs.writeFile(newTokensPath, JSON.stringify(newTokenObject, null, 2))
  } catch (err) {
    console.log(err)
  }
}

sendMessage(TELEGRAM_CHAT_ID)
