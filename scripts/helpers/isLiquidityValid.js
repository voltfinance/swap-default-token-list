const {
  POOL_DEPLOYER_ADDRESS,
  POOL_INIT_CODE_HASH,
} = require('@voltage-finance/v3-sdk')
const { getCreate2Address } = require('@ethersproject/address')
const { defaultAbiCoder } = require('@ethersproject/abi')
const { keccak256 } = require('web3-utils')
const { gql, request } = require('graphql-request')

const WFUSE_ADDRESS = '0x0BE9e53fd7EDaC9F859882AfdDa116645287C629'
const MINIMUM_THRESHOLD = 10000

function getPoolAddress(tokenA, tokenB, fee) {
  const [token0, token1] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]

  return getCreate2Address(
    POOL_DEPLOYER_ADDRESS,
    keccak256(
      ['bytes'],
      [
        defaultAbiCoder.encode(
          ['address', 'address', 'uint24'],
          [token0, token1, fee],
        ),
      ],
    ),
    POOL_INIT_CODE_HASH,
  )
}

async function fetchPoolData(poolIds) {
  return await request(
    'https://api.studio.thegraph.com/query/78455/exchange-v3/v0.0.1',
    gql`
      query getPoolAddresses($ids: [String!]!) {
        pools(where: { id_in: $ids }) {
          id
          totalValueLockedToken0
          totalValueLockedToken1
          token0 {
            id
          }
          token1 {
            id
          }
        }
      }
    `,
    { ids: poolIds },
  )
}

function getLiquidity(pool) {
  if (pool.token0.id === WFUSE_ADDRESS) {
    return parseFloat(pool.totalValueLockedToken0)
  } else {
    return parseFloat(pool.totalValueLockedToken1)
  }
}

function getTopPoolByLiquidity(pools) {
  return pools.sort((poolA, poolB) => {
    const liquidityA = getLiquidity(poolA)
    const liquidityB = getLiquidity(poolB)
    return liquidityB - liquidityA
  })[0]
}

function hasSufficientLiquidity(pool) {
  const liquidity = getLiquidity(pool)
  return liquidity >= MINIMUM_THRESHOLD
}

module.exports = async function isLiquidityValid(newToken) {
  const feeAmounts = [100, 500, 3000, 10000]

  const pools = feeAmounts
    .map((feeAmount) =>
      getPoolAddress(newToken.address, WFUSE_ADDRESS, feeAmount),
    )
    .map((poolAddress) => poolAddress.toLowerCase())

  const result = await fetchPoolData(pools)

  const topPool = getTopPoolByLiquidity(result.pools)

  if (topPool && !hasSufficientLiquidity(topPool)) {
    return `Pool liquidity less than minimum threshold of ${MINIMUM_THRESHOLD} WFUSE`
  }

  return null
}
