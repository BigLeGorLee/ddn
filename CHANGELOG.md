
## [3.5.2](https://github.com/ddnlink/ddn/compare/v3.3.0...v3.5.2) (2020-07-01)


### Bug Fixes

* 🐛 Add 404 error handler ([b67eae5](https://github.com/ddnlink/ddn/commit/b67eae5218bacfceb09def0d83db8cb2d07c274a))
* 🐛 Add parseInt transfer to fix req.query integer ([baa562d](https://github.com/ddnlink/ddn/commit/baa562df1c85ce33836934908740b9291ac1724b))
* 🐛 Check and fix some bus with eslint ([da1b32b](https://github.com/ddnlink/ddn/commit/da1b32bbe2470a9e262f81fc3dfd9be083b625a6))
* 🐛 Fix @ddn/dao 1 bug and pass its tests ([c5795dd](https://github.com/ddnlink/ddn/commit/c5795dd10a12c6490cb9ee468bbe9c416dde7805))
* 🐛 Fix a few of bugs about crypto and transaction ([71fbddd](https://github.com/ddnlink/ddn/commit/71fbddd6c27a424d4ecce22ebaab61eae069441c))
* 🐛 Fix all util.isArray and approval error ([d025aa2](https://github.com/ddnlink/ddn/commit/d025aa2dced511037639ba2e8ec29dd2edc907a6))
* 🐛 Fix bugs about @ddn/dao ([c6e107d](https://github.com/ddnlink/ddn/commit/c6e107d4ee403ae7d6e8e9b7ce835caade637750))
* 🐛 Fix bugs about multisignature and dao ([54d6fcc](https://github.com/ddnlink/ddn/commit/54d6fcca52feb38e5c990fc8667623ed9a4c6e88))
* 🐛 Fix can`t get account by the publicKey ([6602eaa](https://github.com/ddnlink/ddn/commit/6602eaa2189926916261223d2e5288d36f5505b0))
* 🐛 Fix gitId, getHash to async/await ([67ca112](https://github.com/ddnlink/ddn/commit/67ca1122c376d04842a399d61912b784ef176e09))
* 🐛 Fix some apis ([233555f](https://github.com/ddnlink/ddn/commit/233555ffcd51b057e2d08d37f17ae511b97083c8))
* 🐛 Fix the errors on assetTypes and sender_id etc ([a2a5513](https://github.com/ddnlink/ddn/commit/a2a551322c57b214b67fee4af7fedad88dab987a)), closes [#74](https://github.com/ddnlink/ddn/issues/74)
* 🐛 Fix verify and verifySecendSign bugs ([0458781](https://github.com/ddnlink/ddn/commit/0458781379330e0a57063e9b756eef6feed93ccf))
* 🐛 Refactor @ddn/core and fix some field type errors ([9e9173c](https://github.com/ddnlink/ddn/commit/9e9173ccab1073532b25d4d56163f435076b45f4))
* 🐛 Update logger.js ([b6a702d](https://github.com/ddnlink/ddn/commit/b6a702db9e897455c64baeebc0f5160e92b841b3))
* 🐛 Update references to multiple packages ([4d7569c](https://github.com/ddnlink/ddn/commit/4d7569c16cbaf957443f28aa02b7abe95a256fb3))
* **peer:** change lodash.pluck to .map ([aa2d578](https://github.com/ddnlink/ddn/commit/aa2d578951c6e05edcac8b3ad343f56fdcf76a55))
* **peer:** fix a few of Promise warnings in db operations ([766508f](https://github.com/ddnlink/ddn/commit/766508f19b6831403226eafa75345d6e5c108c6b))


### Code Refactoring

* 💡 Update all crypto to tweetnacl ([1a74c8e](https://github.com/ddnlink/ddn/commit/1a74c8e78eede3d4323970454c483c9d981f2b31))
* 💡 Update all cryptos to @ddn/crypto, and constants ([d761742](https://github.com/ddnlink/ddn/commit/d761742b12e2304ed8fbb1ee1f8f7f1e0d218ca0))
* 💡 Update AoB to fix some bugs and pass all aob tests ([188bc74](https://github.com/ddnlink/ddn/commit/188bc749812b08f35fca646a12a4e54e24906f15))


### Features

* 🎸 Add a feat to get apis list of DDN ([2a0f87a](https://github.com/ddnlink/ddn/commit/2a0f87af579c53983549c3647dc68f92d3072e53)), closes [#68](https://github.com/ddnlink/ddn/issues/68)
* 🎸 Add ddn cli to generate a new blockchain or dapp ([dd917f2](https://github.com/ddnlink/ddn/commit/dd917f27a3c8a4bde06e481f60dfae3f345b1279))
* 🎸 Optimize the use of protobuf and modify multiple bugs ([0d079c9](https://github.com/ddnlink/ddn/commit/0d079c9be52065d30c9af2d006028d6a6328ac2e))
* 🎸 Output ddn-js for wallet app ([fc4832c](https://github.com/ddnlink/ddn/commit/fc4832c028411bab80cf823bfb74aa94ea43047a))
* 🎸 Update eslint to standardize and format the code ([db438fb](https://github.com/ddnlink/ddn/commit/db438fb6639cbe5be7582357ba7b44c4b2a1918f))
* **@ddn/ddn:** update dapp template and fix a few of bugs ([53b387c](https://github.com/ddnlink/ddn/commit/53b387c9a270b2cb0af98a0730af036631f39a53))
* **@ddn/sandbox:** add sandbox for @ddn/dapp ([ee17a69](https://github.com/ddnlink/ddn/commit/ee17a69218624a17ca2d5bd716623b309a8c0e3f))


### Performance Improvements

* **ddn:** update to ES6 modules and fix some bugs ([9385113](https://github.com/ddnlink/ddn/commit/938511366a396e6923bf106fcaa19aee39e9010e))


### BREAKING CHANGES

* 🧨 Update Aob and pass all tests, fix some bugs about AoB, You can release
Token use it.
* 🧨 Update all crypto hash to sha512, sign to nacl.sign, and update ddn-cli
to generate new genesisBlock.json
* 🧨 Refactor: update @ddn/crypto
* **ddn:** Update to ES6 and Module rules are standardized





## [3.2.0](https://github.com/ddnlink/ddn/compare/v3.1.0...v3.2.0) (2020-02-10)

### Features

* update to v3.2.0 that delete all the ddn prefix ([c700347](https://github.com/ddnlink/ddn/commit/c700347))
* **ddn-asset-*:** improve DDN asset to make its development configuration simpler ([dc1e902](https://github.com/ddnlink/ddn/commit/dc1e902))
* **ddn-cli:** change command line tools ddn-cli to ddn, and add generating blockchain from template ([d46d3f9](https://github.com/ddnlink/ddn/commit/d46d3f9))
* **ddn-crypto:** add ddn-crypto module to handle all the functions of encryption and decryption ([2c60168](https://github.com/ddnlink/ddn/commit/2c60168))

### improvement

* **ddn-crypto:** change js-nacl to tweetnacl.js etc ([a3ad7ad](https://github.com/ddnlink/ddn/commit/a3ad7ad))

### BREAKING CHANGES

* All modules are in @ddn with no ddn prefix, and command line has the same name ddn.
* **ddn-crypto:** Improved encryption algorithm, unified encryption management and improved
comprehensive performance
* **ddn-crypto:** Focus on Cryptography
* **ddn-cli:** 1. change command line tool ddn-cli to ddn;2. Add new functions

## [3.1.1](https://github.com/ddnlink/ddn/compare/v3.1.0...v3.1.1) (2020-01-16)

### Features

* **ddn-peer:** add a new module ddn-peer and example blockchain ([4f3a5c2](https://github.com/ddnlink/ddn/commit/4f3a5c2))

### BREAKING CHANGES

* **ddn-peer:** The new chain is built on the core peer and its components.

## [3.1.0](https://github.com/ddnlink/ddn/compare/v3.0.0...v3.1.0) (2020-01-07)

### Bug Fixes

* **ddn:** fix a warning about promise ([5f8b906](https://github.com/ddnlink/ddn/commit/5f8b906))
* **ddn:** fix a warning about promise ([9a92ebf](https://github.com/ddnlink/ddn/commit/9a92ebf))
* **ddn:** modified the addressUtil and configs ([9c2a232](https://github.com/ddnlink/ddn/commit/9c2a232))
* **ddn:** fix bignum-utils instead of ddn-utils ([6d3d36a](https://github.com/ddnlink/ddn/commit/6d3d36a))
* **node-sdk:** fix a few bugs about var not being defined ([d65ad07](https://github.com/ddnlink/ddn/commit/d65ad07))
* **packages:** fix some bugs in ddn-utils, test, and asset-aob ([e01a79e](https://github.com/ddnlink/ddn/commit/e01a79e))


### Features

* **component:** add scripts and lerna-changelog to project ([0268614](https://github.com/ddnlink/ddn/commit/0268614))

### Improvement

* **core:** configured according to different environments ([6c717a4](https://github.com/ddnlink/ddn/commit/6c717a4))

### BREAKING CHANGES

* **core:** The config can be specified by distinguishing different environments through the environment variable 'DDN_ENV'
