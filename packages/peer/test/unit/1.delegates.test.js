/**
 * passed
 */
import Debug from 'debug'
import DdnUtils from '@ddn/utils'
import node from '@ddn/node-sdk/lib/test'

const debug = Debug('debug')

let Raccount = node.randomAccount()
while (Raccount.username === Raccount.username.toUpperCase()) {
  Raccount = node.randomAccount()
}

const R2account = node.randomAccount()
R2account.username = Raccount.username.toUpperCase()

jest.setTimeout(50000)

beforeAll(async () => {
  const { body } = await node.openAccountAsync({ secret: Raccount.password })
  debug('open accountRaccount', body)
  node.expect(body).to.have.property('success').to.be.true
  node.expect(body).to.have.property('account').that.is.an('object')
  node.expect(body.account.balance).be.equal(0)
})

// 注册受托人，没有费用失败
describe('PUT /delegates without funds', () => {
  it('Using valid parameters. Should fail', done => {
    node.api.put('/delegates')
      .set('Accept', 'application/json')
      .send({
        secret: Raccount.password,
        username: Raccount.username
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug('register delegates without funds', body)
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.false
        node.expect(body).to.have.property('error')
        node.expect(body.error).to.contain('Account not found')
        done()
      })
  })
})

// 投票，没钱不好使
describe('PUT /accounts/votes without funds', () => {
  it('When upvoting. Should fail', done => {
    node.api.post('/accounts/open')
      .set('Accept', 'application/json')
      .send({
        secret: Raccount.password
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug(JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.true
        node.expect(body).to.have.property('account').that.is.an('object')
        Raccount.address = body.account.address
        Raccount.publicKey = body.account.publicKey
        Raccount.balance = body.account.balance

        node.onNewBlock(err => {
          node.expect(err).to.be.not.ok
          node.api.put('/accounts/votes')
            .set('Accept', 'application/json')
            .send({
              secret: Raccount.password,
              delegates: [`+${node.Eaccount.publicKey}`]
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, { body }) => {
              debug('upvoting without funds fail', JSON.stringify(body))
              node.expect(err).be.not.ok
              node.expect(body).to.have.property('success').to.be.false
              node.expect(body).to.have.property('error')
              node.expect(body.error).to.contain('Account not found')
              done()
            })
        })
      })
  })

  it('When downvoting. Should fail', done => {
    node.onNewBlock(err => {
      node.expect(err).be.not.ok
      node.api.put('/accounts/votes')
        .set('Accept', 'application/json')
        .send({
          secret: Raccount.password,
          delegates: [`-${node.Eaccount.publicKey}`]
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, { body }) => {
          debug('downvoting without funds fail', JSON.stringify(body))
          node.expect(err).be.not.ok
          node.expect(body).to.have.property('success').to.be.false
          node.expect(body).to.have.property('error')
          node.expect(body.error).to.contain('Account not found')
          done()
        })
    })
  })
})

// 投票，需要费用
describe('PUT /accounts/votes with funds', () => {
  const randomCoin = node.randomCoin()

  beforeAll(done => {
    node.api.put('/transactions')
      .set('Accept', 'application/json')
      .send({
        secret: node.Gaccount.password,
        amount: `${randomCoin}`,
        recipientId: Raccount.address
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        node.expect(err).be.not.ok
        debug('give money', JSON.stringify(body))
        node.expect(body).to.have.property('success').to.be.true
        node.expect(body).to.have.property('transactionId')
        node.expect(body.transactionId).to.be.a('string')
        Raccount.amount = DdnUtils.bignum.plus(Raccount.amount, randomCoin).toString()
        done()
      })
  })

  beforeAll(done => {
    node.onNewBlock(err => {
      node.expect(err).to.be.not.ok

      node.api.post('/accounts/open')
        .set('Accept', 'application/json')
        .send({
          secret: Raccount.password
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, { body }) => {
          debug(JSON.stringify(body))
          node.expect(err).be.not.ok
          node.expect(body).to.have.property('success').to.be.true
          node.expect(`${body.account.balance}`).be.equal(randomCoin)

          done()
        })
    })
  })

  it('When upvoting same delegate multiple times. Should fail', done => {
    const votedDelegate = `'+${node.Eaccount.publicKey}','+${node.Eaccount.publicKey}'`
    node.onNewBlock(err => {
      node.expect(err).be.not.ok
      node.api.put('/accounts/votes')
        .set('Accept', 'application/json')
        .send({
          secret: Raccount.password,
          delegates: [votedDelegate]
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, { body }) => {
          debug(JSON.stringify(body))
          node.expect(err).be.not.ok
          node.expect(body).to.have.property('success').to.be.false
          node.expect(body).to.have.property('error')

          done()
        })
    })
  }, 50000)

  it('When downvoting same delegate multiple times. Should fail', done => {
    const votedDelegate = `'-${node.Eaccount.publicKey}','-${node.Eaccount.publicKey}'`
    node.onNewBlock(err => {
      node.expect(err).be.not.ok
      node.api.put('/accounts/votes')
        .set('Accept', 'application/json')
        .send({
          secret: Raccount.password,
          delegates: [votedDelegate]
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, { body }) => {
          debug(JSON.stringify(body))
          node.expect(err).be.not.ok
          node.expect(body).to.have.property('success').to.be.false
          node.expect(body).to.have.property('error')

          done()
        })
    })
  }, 50000)

  it('When upvoting and downvoting within same request. Should fail', done => {
    const votedDelegate = `'+${node.Eaccount.publicKey}','-${node.Eaccount.publicKey}'`

    node.onNewBlock(err => {
      node.expect(err).be.not.ok
      node.api.put('/accounts/votes')
        .set('Accept', 'application/json')
        .send({
          secret: Raccount.password,
          delegates: [votedDelegate]
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, { body }) => {
          debug('upvoting and downvoting within same request', JSON.stringify(body))
          node.expect(err).be.not.ok
          node.expect(body).to.have.property('success').to.be.false
          node.expect(body).to.have.property('error')

          done()
        })
    })
  }, 50000)

  it('When upvoting. Should be ok', done => {
    node.api.put('/accounts/votes')
      .set('Accept', 'application/json')
      .send({
        secret: Raccount.password,
        delegates: ['+' + node.Eaccount.publicKey]
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug('upvoting ok', JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.true
        node.expect(body).to.have.property('transaction').that.is.an('object')
        node.expect(body.transaction.type).to.equal(node.AssetTypes.VOTE)
        node.expect(body.transaction.amount).to.equal('0')
        node.expect(body.transaction.senderPublicKey).to.equal(Raccount.publicKey)
        node.expect(body.transaction.fee).to.equal(node.Fees.voteFee)

        done()
      })
  }, 50000)

  it('When upvoting again from same account. Should fail', done => {
    node.onNewBlock(err => {
      node.expect(err).be.not.ok
      node.api.put('/accounts/votes')
        .set('Accept', 'application/json')
        .send({
          secret: Raccount.password,
          delegates: [`+${node.Eaccount.publicKey}`]
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, { body }) => {
          debug('upvoting again, fail', JSON.stringify(body))
          node.expect(err).be.not.ok
          node.expect(body).to.have.property('success').to.be.false
          node.expect(body).to.have.property('error')
          node.expect(body.error.toLowerCase()).to.contain('already voted')

          done()
        })
    })
  }, 50000)

  it('When downvoting. Should be ok', done => {
    node.onNewBlock(err => {
      node.expect(err).to.be.not.ok
      node.api.put('/accounts/votes')
        .set('Accept', 'application/json')
        .send({
          secret: Raccount.password,
          delegates: [`-${node.Eaccount.publicKey}`]
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, { body }) => {
          debug('downvoting ok', JSON.stringify(body))
          node.expect(err).be.not.ok
          node.expect(body).to.have.property('success').to.be.true
          node.expect(body).to.have.property('transaction').that.is.an('object')
          node.expect(body.transaction.type).to.equal(node.AssetTypes.VOTE)
          node.expect(body.transaction.amount).to.equal('0')
          node.expect(body.transaction.senderPublicKey).to.equal(Raccount.publicKey)
          node.expect(body.transaction.fee).to.equal(node.Fees.voteFee)

          done()
        })
    })
  }, 50000)

  it('When downvoting again from same account. Should fail', done => {
    node.onNewBlock(err => {
      node.expect(err).be.not.ok
      node.api.put('/accounts/votes')
        .set('Accept', 'application/json')
        .send({
          secret: Raccount.password,
          delegates: [`-${node.Eaccount.publicKey}`]
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, { body }) => {
          debug('downvoting again, fail', JSON.stringify(body))
          node.expect(err).be.not.ok
          node.expect(body).to.have.property('success').to.be.false
          node.expect(body).to.have.property('error')
          node.expect(body.error.toLowerCase()).to.contain('not voted')

          done()
        })
    })
  }, 50000)

  it('When upvoting using a blank pasphrase. Should fail', done => {
    node.api.put('/accounts/votes')
      .set('Accept', 'application/json')
      .send({
        secret: '',
        delegates: [`+${node.Eaccount.publicKey}`]
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug('upvoting using a blank pasphrase, fail', JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.false
        node.expect(body).to.have.property('error')
        done()
      })
  })

  it('When downvoting using a blank pasphrase. Should fail', done => {
    node.api.put('/accounts/votes')
      .set('Accept', 'application/json')
      .send({
        secret: '',
        delegates: [`-${node.Eaccount.publicKey}`]
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug('downvoting using a blank pasphrase', JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.false
        node.expect(body).to.have.property('error')
        done()
      })
  })

  it('When upvoting without any delegates. Should fail', done => {
    node.onNewBlock(() => {
      node.api.put('/accounts/votes')
        .set('Accept', 'application/json')
        .send({
          secret: Raccount.password,
          delegates: ['+']
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, { body }) => {
          debug('upvoting without any delegates, fail', JSON.stringify(body))
          node.expect(err).be.not.ok
          node.expect(body).to.have.property('success').to.be.false
          node.expect(body).to.have.property('error')
          done()
        })
    })
  })

  it('When downvoting without any delegates. Should fail', done => {
    node.onNewBlock(() => {
      node.api.put('/accounts/votes')
        .set('Accept', 'application/json')
        .send({
          secret: Raccount.password,
          delegates: ['-']
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, { body }) => {
          debug('downvoting without any delegates', JSON.stringify(body))
          node.expect(err).be.not.ok
          node.expect(body).to.have.property('success').to.be.false
          node.expect(body).to.have.property('error')
          done()
        })
    })
  })

  it('Without any delegates. Should fail', function (done) {
    node.api.put('/accounts/votes')
      .set('Accept', 'application/json')
      .send({
        secret: Raccount.password,
        delegates: ''
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug('Without any delegates, fail', JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.false
        node.expect(body).to.have.property('error')
        done()
      })
  })
})

// 注册，有费用
describe('PUT /delegates to regist with funds', () => {
  const randomCoin = node.randomCoin()

  beforeAll(done => {
    node.api.post('/accounts/open')
      .set('Accept', 'application/json')
      .send({
        secret: R2account.password
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug(JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.true
        node.expect(body).to.have.property('account').that.is.an('object')
        R2account.address = body.account.address
        R2account.publicKey = body.account.publicKey
        R2account.balance = body.account.balance

        node.onNewBlock(err => {
          node.expect(err).to.be.not.ok
          node.api.put('/transactions')
            .set('Accept', 'application/json')
            .send({
              secret: node.Gaccount.password,
              amount: `${randomCoin}`,
              recipientId: R2account.address
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, { body }) => {
              debug('transfer ok', JSON.stringify(body))
              node.expect(err).be.not.ok
              node.expect(body).to.have.property('success').to.be.true
              node.expect(body).to.have.property('transactionId')
              node.expect(body.transactionId).to.be.a('string')
              // DdnUtils.bignum update R2account.amount += node.randomCoin;
              R2account.amount = DdnUtils.bignum.plus(R2account.amount, randomCoin).toString()

              done()
            })
        })
      })

    beforeAll(done => {
      node.onNewBlock(err => {
        node.expect(err).to.be.not.ok
        node.api.post('/accounts/open')
          .set('Accept', 'application/json')
          .send({
            secret: R2account.password
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, { body }) => {
            debug(JSON.stringify(body))
            node.expect(err).be.not.ok
            node.expect(body).to.have.property('success').to.be.true
            node.expect(body.account.balance).be.equal(`${randomCoin}`)

            done()
          })
      })
    })
  })

  it('Using blank pasphrase. Should fail', done => {
    node.api.put('/delegates')
      .set('Accept', 'application/json')
      .send({
        secret: '',
        username: Raccount.username
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug(JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.false
        node.expect(body).to.have.property('error')
        done()
      })
  })

  it('Using invalid pasphrase. Should fail', function (done) {
    node.api.put('/delegates')
      .set('Accept', 'application/json')
      .send({
        secret: [],
        username: Raccount.username
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug(JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.false
        node.expect(body).to.have.property('error')
        done()
      })
  })

  it('Using invalid username. Should fail', function (done) {
    node.api.put('/delegates')
      .set('Accept', 'application/json')
      .send({
        secret: Raccount.password,
        username: '~!@#$%^&*()_+.,?/'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug(JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.false
        node.expect(body).to.have.property('error')
        done()
      })
  })

  it('Using username longer than 20 characters. Should fail', function (done) {
    node.api.put('/delegates')
      .set('Accept', 'application/json')
      .send({
        secret: Raccount.password,
        username: 'ABCDEFGHIJKLMNOPQRSTU'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug(JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.false
        node.expect(body).to.have.property('error')
        done()
      })
  })

  it('Using blank username. Should fail', function (done) {
    node.api.put('/delegates')
      .set('Accept', 'application/json')
      .send({
        secret: Raccount.password,
        username: ''
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug('blank username, fail', JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.false
        node.expect(body).to.have.property('error').to.match(/^Username is undefined/)
        done()
      })
  })

  it(`Using uppercase username: ${R2account.username}. Should be ok and delegate should be registered in lower case`, done => {
    node.onNewBlock(err => {
      node.expect(err).be.not.ok
      node.api.put('/delegates')
        .set('Accept', 'application/json')
        .send({
          secret: R2account.password,
          username: R2account.username
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, { body }) => {
          debug('uppercase username, ok', JSON.stringify(body))
          node.expect(err).be.not.ok
          node.expect(body).to.have.property('success').to.be.true
          node.expect(body).to.have.property('transaction').that.is.an('object')
          node.expect(body.transaction.fee).to.equal(node.Fees.delegateRegistrationFee)
          node.expect(body.transaction.asset.delegate.username).to.equal(R2account.username.toLowerCase())
          node.expect(body.transaction.asset.delegate.publicKey).to.equal(R2account.publicKey)
          node.expect(body.transaction.type).to.equal(node.AssetTypes.DELEGATE)
          node.expect(body.transaction.amount).to.equal('0')

          done()
        })
    })
  })

  it('Using same account. Should fail', done => {
    node.onNewBlock(err => {
      node.expect(err).to.be.not.ok
      node.api.put('/delegates')
        .set('Accept', 'application/json')
        .send({
          secret: Raccount.password,
          username: Raccount.username
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, { body }) => {
          debug('same account, fail', JSON.stringify(body))
          node.expect(err).be.not.ok
          node.expect(body).to.have.property('success').to.be.false
          node.expect(body).to.have.property('error')
          done()
        })
    })
  })

  it(`Using existing username but different case: ${R2account.username}. Should fail`, done => {
    node.onNewBlock(err => {
      node.expect(err).to.be.not.ok
      debug(JSON.stringify({
        secret: R2account.password,
        username: R2account.username
      }))
      node.api.put('/delegates')
        .set('Accept', 'application/json')
        .send({
          secret: R2account.password,
          username: R2account.username
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, { body }) => {
          debug('different case, fail', JSON.stringify(body))
          node.expect(err).be.not.ok
          node.expect(body).to.have.property('success').to.be.false
          node.expect(body).to.have.property('error')
          done()
        })
    })
  })
})

// 检索受托人
describe('GET /delegates', () => {
  it('Using no parameters. Should be ok', done => {
    const limit = 10
    const offset = 0

    const noParameterUrl = `/delegates?limit=${limit}&offset=${offset}&orderBy=vote:asc`;
    node.api.get(noParameterUrl)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug('get /delegates? no parameters, ok', JSON.stringify(body))
        debug('noParameterUrl', noParameterUrl)
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.true
        node.expect(body).to.have.property('delegates').that.is.an('array')
        node.expect(body).to.have.property('totalCount').that.is.at.least(0)
        node.expect(body.delegates).to.have.length.of.at.most(limit)
        const num_of_delegates = body.delegates.length
        debug('Limit is ' + limit + '. Number of delegates returned is: ' + num_of_delegates)
        debug('Total Number of delegates returned is: ' + body.totalCount)
        if (num_of_delegates >= 1) {
          for (let i = 0; i < num_of_delegates; i++) {
            if (body.delegates[i + 1] !== null) {
              node.expect(body.delegates[i].vote).to.be.at.most(body.delegates[i + 1].vote)
              node.expect(body.delegates[i]).to.have.property('username')
              node.expect(body.delegates[i]).to.have.property('address')
              node.expect(body.delegates[i]).to.have.property('publicKey')
              node.expect(body.delegates[i]).to.have.property('vote')
              node.expect(body.delegates[i]).to.have.property('rate')
              node.expect(body.delegates[i]).to.have.property('productivity')
            }
          }
        } else {
          debug('Got 0 delegates')
          node.expect('TEST').to.equal('FAILED')
        }
        done()
      })
  })

  it('Using valid parameters. Should be ok', done => {
    const limit = 20
    const offset = 10

    node.api.get(`/delegates?limit=${limit}&offset=${offset}&orderBy=rate:desc`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug('/delegates? valid parameters ok', JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.true
        node.expect(body).to.have.property('delegates').that.is.an('array')
        node.expect(body).to.have.property('totalCount').that.is.at.least(0)
        node.expect(body.delegates).to.have.length.of.at.most(limit)
        const num_of_delegates = body.delegates.length
        debug('Limit is: ' + limit + '. Number of delegates returned is: ' + num_of_delegates)
        debug('Total Number of delegates returned is: ' + body.totalCount)
        if (num_of_delegates >= 1) {
          for (let i = 0; i < num_of_delegates; i++) {
            if (body.delegates[i + 1] !== null) {
              node.expect(body.delegates[i].rate).to.be.at.least(body.delegates[i + 1].rate)
            }
          }
        } else {
          debug('Got 0 delegates')
          node.expect('TEST').to.equal('FAILED')
        }
        done()
      })
  })

  it('Using invalid parameters. Should be fail', done => {
    // Should be ok because invalid parameters that we send are optional parameters

    const limit = 'invalid'
    const offset = 'invalid'

    node.api.get(`/delegates?limit=${limit}&offset=${offset}&orderBy=invalid`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug('/delegates? valid parameters fail', JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.false
        node.expect(body).to.have.property('error')
        done()
      })
  })
})

describe('GET /accounts/votes?address=', () => {
  it('Using valid address. Should be ok', done => {
    node.api.get(`/accounts/votes?address=${node.Gaccount.address}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug('get delegates valid address ok')
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.true
        node.expect(body).to.have.property('delegates').that.is.an('array')
        node.expect(body.delegates).to.have.length.of.at.least(1)
        node.expect(body.delegates[0]).to.have.property('username')
        node.expect(body.delegates[0]).to.have.property('address')
        node.expect(body.delegates[0]).to.have.property('publicKey')
        node.expect(body.delegates[0]).to.have.property('vote')
        node.expect(body.delegates[0]).to.have.property('rate')
        node.expect(body.delegates[0]).to.have.property('productivity')
        done()
      })
  })

  it('Using invalid address. Should fail', done => {
    node.api.get('/accounts/votes?address=NOTaDdnAddress')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug('invalid address fail', JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.false
        node.expect(body).to.have.property('error')
        done()
      })
  })
})

describe('GET /delegates/count', () => {
  it('Should be ok', done => {
    node.api.get('/delegates/count')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug('GET /delegates/count', JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.true
        node.expect(body).to.have.property('count').to.least(101) // 此处数量根据运行次数会有测试案例新增的受托人进来，但至少101个
        done()
      })
  })
})

describe('GET /delegates/voters', () => {
  beforeAll(done => {
    debug(JSON.stringify({
      secret: Raccount.password,
      delegates: ['+' + node.Eaccount.publicKey]
    }))
    node.onNewBlock(err => {
      node.expect(err).to.be.not.ok
      node.api.put('/accounts/votes')
        .set('Accept', 'application/json')
        .send({
          secret: Raccount.password,
          delegates: [`+${node.Eaccount.publicKey}`]
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, { body }) => {
          // debug(JSON.stringify(body));
          debug('/accounts/votes')
          node.expect(err).be.not.ok
          node.expect(body).to.have.property('success').to.be.true
          done()
        })
    })
  })

  it('Using no publicKey. Should fail', done => {
    node.api.get('/delegates/voters?publicKey=')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug('get votes no publicKey fail', JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').be.true
        node.expect(body).to.have.property('accounts')
        node.expect(body.accounts.length).to.be.equal(0)

        done()
      })
  })

  it('Using invalid publicKey. Should fail', done => {
    node.api.get('/delegates/voters?publicKey=NotAPublicKey')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, { body }) => {
        debug('get votes invalid publicKey fail', JSON.stringify(body))
        node.expect(err).be.not.ok
        node.expect(body).to.have.property('success').to.be.false
        node.expect(body).to.have.property('error')
        done()
      })
  })

  it('Using valid publicKey. Should be ok', done => {
    node.onNewBlock(err => {
      node.expect(err).be.not.ok
      node.api.get(`/delegates/voters?publicKey=${node.Eaccount.publicKey}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, { body }) => {
          debug('get votes valid publicKey ok', JSON.stringify(body))
          node.expect(err).be.not.ok
          node.expect(body).to.have.property('success').to.be.true
          node.expect(body).to.have.property('accounts').that.is.an('array')
          let flag = 0
          for (let i = 0; i < body.accounts.length; i++) {
            if (body.accounts[i].address === Raccount.address) {
              flag = 1
            }
          }
          node.expect(flag).to.equal(1)
          done()
        })
    })
  })
})
