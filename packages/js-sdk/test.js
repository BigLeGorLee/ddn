import ByteBuffer from 'bytebuffer'
const bb = new ByteBuffer()
console.log('bb', bb)
console.log('bb.toArrayBuffer()', bb.toArrayBuffer())
const arrayBuffer = new Uint8Array(bb.toArrayBuffer())
console.log('arrayBuffer', arrayBuffer)
bb.writeString('Hello world!')
console.log('bb', bb)
bb.flip()
console.log('bb', bb)
console.log('bb.toBuffer', bb.toBuffer())

const evidence = {
  ipid: 'IPIDasdf20180501221md',
  title: 'title',
  hash: 'fileHash',
  url: 'filePath',
  author: 'Evanlai',
  size: 'size',
  type: 'fileType',
  tags: 'world,cup,test'
}
console.log('evidence', evidence)
// 注册区块链
// let transaction = DdnJS.evidence.createEvidence(evidence,"dfasdf");
