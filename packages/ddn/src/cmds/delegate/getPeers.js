import { init, getPeers } from '../../plugins/api'

module.exports = {
  command: 'getPeers',
  aliases: ['gp', 'peers'],
  desc: 'Get peers list',
  builder: {
    offset: {
      alias: 'o',
      describe: 'Offset'
    },
    limit: {
      alias: 'l',
      describe: 'Limit'
    },
    state: {
      alias: 't',
      describe: 'State',
      choices: [0, 1, 2]
    },
    version: {
      alias: 'v',
      describe: 'version'
    },
    port: {
      alias: 'p',
      describe: 'port'
    },
    os: {
      describe: 'os'
    },
    sort: {
      alias: 's',
      describe: 'port:asc ...'
    }
  },

  handler: function (argv) {
    init(argv)
    getPeers(argv)
  }
}
