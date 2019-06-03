const router = require('koa-router')()

const accountController = require("../controller/account")
const transactionController = require("../controller/transaction")
const tokenController = require("../controller/token")
const HTcontroller = require("../controller/HT")
const TrxAccount = require("../controller/Trx")
const XrpAccount = require("../controller/rippleInfo")
const NeoAccount = require("../controller/neoAccount")
const BnbAccount = require("../controller/bnbTransaction")
const NexoAccount = require("../controller/nexoTransaction")

router.get('/', accountController.getAccountList);

router.post('/', (ctx) => {

    const body = ctx.request.body;

    ctx.body = 'Hello Router POST '+ JSON.stringify(body);
    });
//创建账号相关接口
router.post('/account/create',accountController.createAccount)
router.post('/account/privatekey',accountController.getAccountByPrivatekey)
router.post('/account/keystore',accountController.getAccountByKeystore)
router.post('/account/bip',accountController.getAccountmnemonic)
router.post('/account/trx',TrxAccount.createTrxAccount)
router.post('/account/xrp',XrpAccount.createXrpAccount)
router.post('/account/neo',NeoAccount.createNeoAccount)

//页面相关接口
router.get('/transaction', transactionController.transaction)
router.get('/bit',transactionController.Bitcoin)
router.get('/nav',transactionController.Nav)
router.get('/list',transactionController.List)
router.post('/transaction/send', transactionController.sendTransaction)

//转账相关接口
router.post('/tran/hash',transactionController.getTransFromHash)
router.post('/token/send', tokenController.sendTokenTransaction)
router.post('/token/HT',HTcontroller.sendHT)
router.post('/token/trx',TrxAccount.sendTrx)
router.post('/token/xrp',XrpAccount.sendXrp)
router.post('/token/bnb',BnbAccount.sendBnb)
router.post('/token/nexo',NexoAccount.sendNexo)
module.exports = router
