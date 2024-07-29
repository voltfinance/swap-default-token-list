const fs = require('fs/promises')

module.exports = async function getContributors() {
    const contributors = await fs.readFile('./contributors', { encoding: 'utf8' })
    return contributors.split('\n')
}
