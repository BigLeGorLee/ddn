/**
 * 资产加载注册器
 * @Author: wangxm
 * @Date: 2018-12-28 11:08:30
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-12 20:34:41
 */

// import express from 'express';
// import pluralize from 'pluralize';
// import _ from 'lodash';
import DdnUtils from '@ddn/utils'
import Transfer from './system/transfer'
import Signatures from './system/signature'
import Delegate from './system/delegate'
import Vote from './system/vote'
import Multisignatures from './system/multisignature'
import Lock from './system/lock'

import Router from './router'

const { assetTypes } = DdnUtils

class Loader {
  constructor (context) {
    Object.assign(this, context)
    this._context = context

    this._assets = {}
    this._assetsNames = {}

    this._router = new Router(this._context)
  }

  _getAssetKey (type) {
    return `asset_${type}`
  }

  _registerAsset (type, inst, assetName) {
    if (inst && typeof (inst.create) === 'function' &&
            typeof (inst.getBytes) === 'function' &&
            typeof (inst.calculateFee) === 'function' &&
            typeof (inst.verify) === 'function' &&
            typeof (inst.objectNormalize) === 'function' &&
            typeof (inst.dbRead) === 'function' &&
            typeof (inst.apply) === 'function' &&
            typeof (inst.undo) === 'function' &&
            typeof (inst.applyUnconfirmed) === 'function' &&
            typeof (inst.undoUnconfirmed) === 'function' &&
            typeof (inst.ready) === 'function' &&
            typeof (inst.process) === 'function') {
      this._assets[this._getAssetKey(type)] = inst

      if (assetName) {
        this._assetsNames[assetName.toLowerCase()] = inst
      }
    } else {
      throw Error('Invalid asset interface')
    }
  }

  /**
     * 加载所有系统配置的资产插件
     */
  async _attachAssetPlugins () {
    for (let i = 0; i < this.assetPlugins.getTransactionCount(); i++) {
      const transConfig = this.assetPlugins.getTransactionByIndex(i)
      const transCls = global._require_runtime_(transConfig.package)[transConfig.name]
      const transInst = new transCls(this._context, transConfig)

      this._registerAsset(transConfig.type, transInst, transConfig.name)
      await this._router.attachAssetPluginApi(transConfig, transInst)
    }
  }

  mountAssetApis (expressApp) {
    this._router.mountAssetApis(expressApp)
  }

  /**
     * 根据资产配置名称获取资产实例
     * @param {*} assetName
     */
  findInstanceByName (assetName) {
    if (assetName) {
      const keys = Object.getOwnPropertyNames(this._assetsNames)
      for (const p in keys) {
        const key = keys[p]
        if (key.toLowerCase() == assetName.toLowerCase()) {
          return this._assetsNames[key]
        }
      }
    }
    return null
  }

  /**
     * 为指定的资产插件生成API路由
     * @param {*} assetConfig
     * @param {*} assetInst
     */
  // async _attachAssetPluginApi(assetConfig, assetInst) {
  //     if (assetConfig && assetInst) {
  //         const apiSubPaths = pluralize.plural(assetConfig.name);
  //         const apiSubPath = _.snakeCase(apiSubPaths).replace('_', '/');

  //         const router = express.Router();
  //         // Asset attachApi firstly
  //         if (typeof (assetInst.attachApi) == "function") {
  //             await assetInst.attachApi(router);
  //         }

  //         // Common api secendly
  //         const apis = await this._attachAssetPluginApiRouter(router, assetConfig, assetInst);

  //         // rustful api, for example: new api: /api/aob/assets -> old api: /api/aobasset/all
  //         this._assetsApi.push({
  //             path: `/api/${apiSubPath}`,
  //             router,
  //             apis
  //         });
  //     }
  // }

  // mountAssetApis(expressApp) {
  //     for (let i = 0; i < this._assetsApi.length; i++) {
  //         const apiInfo = this._assetsApi[i];
  //         expressApp.use(apiInfo.path, apiInfo.router);

  //         // for (let j = 0; j < apiInfo.apis.length; j++) {
  //         //     this.logger.info(`mounted asset api: ${apiInfo.path}${apiInfo.apis[j]}`);
  //         // }
  //     }
  // }

  // _assetAssetPluginApiDetail(assetType, paramName, assetInst) {
  //     const func = ({ params, query }, res, next) => {
  //         const parseSortItem = (sort, item) => {
  //             const subItems = item.split("=");
  //             if (subItems.length == 2) {
  //                 if (subItems[0].replace(/\s*/, "") != "") {
  //                     sort.push(subItems);
  //                 }
  //             }
  //         };

  //         const where = {
  //             trs_type: assetType,
  //             [paramName]: params[paramName]
  //         };

  //         const orders = [];
  //         let sortItems = query.sort;

  //         if (sortItems) {
  //             if (!sortItems.splice) {
  //                 sortItems = [sortItems];
  //             }

  //             for (let i = 0; i < sortItems.length; i++) {
  //                 const sortItem = sortItems[i];
  //                 if (sortItem.replace(/\s*/, "") != "") {
  //                     const pos = sortItem.indexOf("=");
  //                     if (pos >= 0) {
  //                         parseSortItem(orders, sortItem);
  //                     } else {
  //                         orders.push(sortItem);
  //                     }
  //                 }
  //             }
  //         }

  //         assetInst.queryAsset(where, orders, false, 1, 1)
  //             .then(rows => {
  //                 res.status(200).json({ success: true, result: rows && rows.length > 0 ? rows[0] : null });
  //             }).catch(err => {
  //                 res.status(200).json({ success: false, error: err.toString() });
  //             });
  //     };

  //     return func;
  // }

  // _assetAssetPluginApiList(assetType, paramName, assetInst) {
  //     const func = ({ params, query }, res, next) => {
  //         const parseSortItem = (sort, item) => {
  //             const subItems = item.split(":");
  //             if (subItems.length == 2) {
  //                 if (subItems[0].replace(/\s*/, "") != "") {
  //                     sort.push(subItems);
  //                 }
  //             }
  //         };

  //         const where = {
  //             trs_type: assetType
  //         };
  //         if (paramName) {
  //             where[paramName] = params[paramName];
  //         }

  //         const pageIndex = query.pageindex || 1;
  //         const pageSize = query.pagesize || 50;
  //         delete query.pageindex;
  //         delete query.pagesize;

  //         const orders = [];
  //         let sortItems = query.sort;
  //         delete query.sort;

  //         // 请求参数 /?pagesize=1&sort=id 不在 where 里
  //         if (query) {
  //             for (const p in query) {
  //                 where[p] = query[p];
  //             }
  //         }

  //         if (sortItems) {
  //             if (!sortItems.splice) {
  //                 sortItems = [sortItems];
  //             }

  //             for (let i = 0; i < sortItems.length; i++) {
  //                 const sortItem = sortItems[i];
  //                 if (sortItem.replace(/\s*/, "") != "") {
  //                     const pos = sortItem.indexOf(":");
  //                     if (pos >= 0) {
  //                         parseSortItem(orders, sortItem);
  //                     } else {
  //                         orders.push(sortItem);
  //                     }
  //                 }
  //             }
  //         }

  //         assetInst.queryAsset(where, orders, true, pageIndex, pageSize)
  //             .then(rows => {
  //                 res.status(200).json({ success: true, result: rows });
  //             }).catch(err => {
  //                 res.status(200).json({ success: false, error: err.toString() });
  //             });
  //     };

  //     return func;
  // }

  // TODO: 优化路由，使其更符合 rustful api
  // async _attachAssetPluginApiRouter(router, { type }, assetInst) {
  //     const allApis = [];

  //     const props = await assetInst.propsMapping();
  //     for (let i = 0; i < props.length; i++) {
  //         const currProp = props[i];
  //         if (currProp.required) {
  //             if (!/_ext$/.test(currProp.field)) {

  //                 // 根据某个属性，获取单条记录
  //                 const detailPath = `/${currProp.prop.toLowerCase()}/:${currProp.prop.toLowerCase()}`;
  //                 router.get(detailPath, this._assetAssetPluginApiDetail(type, currProp.prop.toLowerCase(), assetInst));
  //                 allApis.push(detailPath);

  //                 // 根据某个属性，获取多条记录
  //                 const listPath = `/${currProp.prop.toLowerCase()}/:${currProp.prop.toLowerCase()}/all`;
  //                 router.get(listPath, this._assetAssetPluginApiList(type, currProp.prop.toLowerCase(), assetInst));
  //                 allApis.push(listPath);
  //             }
  //         }
  //     }

  //     // 资产的某个交易
  //     router.get("/transaction/:trs_id", this._assetAssetPluginApiDetail(type, "trs_id", assetInst));
  //     allApis.push("/transaction/:trs_id");

  //     // 该方法可以被插件对应方法覆盖，本方法将不再有意义
  //     router.get("/all", this._assetAssetPluginApiList(type, null, assetInst));
  //     allApis.push("/");

  //     return allApis;
  // }

  async _addAsesstModels () {
    const { dao } = this
    const assetsPackageList = []
    for (let i = 0; i < this.assetPlugins.getTransactionCount(); i++) {
      const trans = this.assetPlugins.getTransactionByIndex(i)
      if (!assetsPackageList.includes(trans.package)) {
        assetsPackageList.push(trans.package)
      }
    }

    assetsPackageList.map((packageName) => {
      let assetModels
      try {
        assetModels = global._require_runtime_(`${packageName}/lib/define-models`) || []
      } catch (err) {
        this.logger.info(`${packageName} 资产包不包含自定义数据模型内容。`)
        return
      }

      if (assetModels) {
        assetModels.map(({ name, data }) => {
          // 挂载方法
          dao.buildModel(name, data)
          // 创建表
          dao.createTable(name, false, (err) => {
            if (err) {
              this.logger.err(`${packageName} 资产包自定义数据模型生成失败。`, err)
              process.emit('cleanup')
            }
          })
        })
      }
    })
  }

  async init () {
    const transfer = new Transfer(this._context)
    this._registerAsset(assetTypes.TRANSFER, transfer)

    const signature = new Signatures(this._context)
    this._registerAsset(assetTypes.SIGNATURE, signature)

    const delegate = new Delegate(this._context)
    this._registerAsset(assetTypes.DELEGATE, delegate)

    const vote = new Vote(this._context)
    this._registerAsset(assetTypes.VOTE, vote)

    const multisignature = new Multisignatures(this._context)
    this._registerAsset(assetTypes.MULTISIGNATURE, multisignature)

    const lock = new Lock(this._context)
    this._registerAsset(assetTypes.LOCK, lock)

    await this._attachAssetPlugins()
    await this._addAsesstModels()
  }

  hasType (type) {
    const key = this._getAssetKey(type)
    return !!this._assets[key]
  }

  getAsset (type) {
    if (this.hasType(type)) {
      const key = this._getAssetKey(type)
      return this._assets[key]
    }
    return null
  }

  /**
     * 在所有加载的扩展资产上执行指定方法
     * @param {*} funcName
     */
  async execAssetFunc (funcName) {
    const args = []
    for (let i = 1; i < arguments.length; i++) {
      args.push(arguments[i])
    }

    const keys = Object.getOwnPropertyNames(this._assets)
    for (const p in keys) {
      const key = keys[p]
      const inst = this._assets[key]
      if (inst != null &&
                typeof (inst[funcName]) === 'function') {
        try {
          await inst[funcName](...args)
        } catch (err) {
          this.logger.error(err)
        }
      }
    }
  }
}

export default Loader
