# Adding a New Token

To add a new token to the repository, please follow these steps:

## Step 1: Fill in the Token Information

You need to add the relevant information for the new token in the `src/new-token.json` file. The format for the JSON object is as follows:

```json
  {
    "name": "Token Name",
    "address": "<tokenAddress>",
    "symbol": "TokenSymbol",
    "decimals": 18,
    "chainId": 122,
    "logoURI": "https://raw.githubusercontent.com/voltfinance/swap-default-token-list/master/logos/<tokenAddress>/logo.png",
    "oneLiner": "A brief description or tagline for the token.",
    "bullishSentence": "A sentence highlighting any bullish aspects of the token, such as utility, burn mechanisms, or airdrops.",
    "socials": {
      "website": "https://tokenwebsite.com",
      "twitter": "https://twitter.com/tokenhandle",
      "discord": "https://discord.com/invite/tokeninvite",
      "telegram": "https://t.me/tokenhandle"
    }
  }
```

- **name**: The full name of the token.
- **address**: The token contract address in checksum format.
- **symbol**: The ticker symbol of the token.
- **decimals**: Typically, ERC-20 tokens have 18 decimals. If your token is different, specify the correct number of decimals.
- **chainId**: This should be `122` (for Fuse).
- **logoURI**: Replace `<tokenAddress>` with your token's contract address in checksum format.
- **oneLiner**: A brief description or tagline for the token.
- **bullishSentence**: A sentence highlighting any bullish aspects of the token, such as utility, burn mechanisms, or airdrops.
- **socials**: Provide the relevant social media links (optional but recommended).

## Step 2: Add Token Logo

You need to add a logo for your token:

1. Navigate to the `logos/` directory in the repository.
2. Create a new folder named after your token’s address in checksum format.
3. Add a PNG file named `logo.png` with the dimensions 250x250 pixels inside the folder.

Example:

```
logos/<tokenAddress>/logo.png
```

## Step 3: Submit a Pair with WFUSE

For a new token to be accepted, a trading pair with `10,000 WFUSE` as the initial liquidity must exist:

- Ensure that the pair is live and that liquidity provision is enabled.

## Example JSON Submission

```json
  {
    "name": "Example Token",
    "address": "0x1234567890ABCDEF1234567890ABCDEF12345678",
    "symbol": "EXT",
    "decimals": 18,
    "chainId": 122,
    "logoURI": "https://raw.githubusercontent.com/voltfinance/swap-default-token-list/master/logos/0x1234567890ABCDEF1234567890ABCDEF12345678/logo.png",
    "oneLiner": "Example Token is revolutionizing decentralized finance.",
    "bullishSentence": "With a built-in burn mechanism and upcoming airdrop, Example Token is poised for growth.",
    "socials": {
      "website": "https://exampletoken.com",
      "twitter": "https://twitter.com/exampletoken",
      "discord": "https://discord.com/invite/exampletoken",
      "telegram": "https://t.me/exampletoken"
    }
  }
```

## Step 4: Submit a Pull Request

After you've filled out the `src/new-token.json` file and added the logo:

1. Commit your changes.
2. Push your branch to your forked repository.
3. Open a pull request to the main repository.

Please ensure that all information is accurate and that the pull request follows the repository's guidelines. The maintainers will review your submission and provide feedback if necessary.
