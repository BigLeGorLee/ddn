/* ---------------------------------------------------------------------------------------------
 *  Created by DDN Team on Wed Mar 14 2017 22:29:23
 *
 *  Copyright (c) 2019 DDN Foundation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

const crypto = require('crypto')
const ByteBuffer = require('bytebuffer')
const node = require('./variables.js')

function getBytes (trs) {
  try {
    var bb = new ByteBuffer(1, true)
    bb.writeInt(trs.timestamp)
    bb.writeString(trs.fee)

    var senderPublicKeyBuffer = Buffer.from(trs.senderPublicKey, 'hex')
    for (var i = 0; i < senderPublicKeyBuffer.length; i++) {
      bb.writeByte(senderPublicKeyBuffer[i])
    }
    bb.writeString(trs.func)
    for (let i = 0; i < trs.args.length; ++i) {
      bb.writeString(trs.args[i])
    }

    bb.flip()
  } catch (e) {
    throw Error(e.toString())
  }
  return bb.toBuffer()
}

describe('benchmarks', function () {
  it('sha256', function (done) {
    const COUNT = 10000
    const bytes = Buffer.allocUnsafe(256)
    const label = 'time usage for ' + COUNT + ' sha256 hashes'
    console.time(label)
    for (let i = 0; i < COUNT; ++i) {
      crypto.createHash('sha256').update(bytes).digest()
    }
    console.timeEnd(label)
    done()
  })

  it('ByteBuffer', function (done) {
    const COUNT = 1000
    const trs = {
      fee: '0',
      timestamp: 0,
      senderPublicKey: '9a5b9e40d9da50731c38b806da63a5186f8809afc0f7058c7da28d443d6e0b35',
      func: 'core.transfer',
      args: [
        'CNY',
        '100000000000000',
        'A8QCwz5Vs77UGX9YqBg9kJ6AZmsXQBC8vj'
      ],
      signature: '2bc08b74ad066e93b55bc5f1d8bbaf7e85aed8f67471569616c321f141568b4eabe09cc77176e06e43cb214aa41c0015afc87532f9d6533601b85b52ab47430d',
      id: '387f53fbce1710155ffd99492682d560e4ba69364bea5e8a7b52c49cf1ddeb95'
    }
    const payloadHash = crypto.createHash('sha256')
    const label = 'time usage for ' + COUNT + ' getBytes'
    console.time(label)
    for (let i = 0; i < COUNT; ++i) {
      payloadHash.update(getBytes(trs))
    }
    console.timeEnd(label)
    done()
  })

  it('json-sql', function (done) {
    const jsonSql = require('json-sql')({ separatedValues: false })
    const COUNT = 5000
    const label = 'time usage for ' + COUNT + ' json-sql build'
    console.time(label)
    for (let i = 0; i < COUNT; ++i) {
      jsonSql.build({
        type: 'insert',
        table: 'test',
        values: {
          fee: '0',
          timestamp: 0,
          senderPublicKey: '9a5b9e40d9da50731c38b806da63a5186f8809afc0f7058c7da28d443d6e0b35',
          func: 'core.transfer',
          signature: '2bc08b74ad066e93b55bc5f1d8bbaf7e85aed8f67471569616c321f141568b4eabe09cc77176e06e43cb214aa41c0015afc87532f9d6533601b85b52ab47430d',
          id: '387f53fbce1710155ffd99492682d560e4ba69364bea5e8a7b52c49cf1ddeb95'
        }
      })
    }
    console.timeEnd(label)
    done()
  })
})
