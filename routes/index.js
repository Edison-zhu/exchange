const router = require('koa-router')()

const accountController = require("../controller/account")
const transactionController = require("../controller/transaction")
const tokenController = require("../controller/token")
const HTcontroller = require("../controller/HT")
const TrxAccount = require("../controller/Trx")
const XrpAccount = require("../controller/rippleInfo")

router.get('/', accountController.getAccountList);

router.post('/', (ctx) => {

    const body = ctx.request.body;
  
    ctx.body = 'Hello Router POST '+ JSON.stringify(body);
    });
//创建账号相关接口
router.post('/account/create',accountController.createAccount)
router.post('/account/privatekey',accountController.getAccountByPrivatekey)
router.post('/account/keystore',accountController.getAccountByKeystore)
router.post('/account/trx',TrxAccount.createTrxAccount)
router.post('/account/xrp',XrpAccount.createXrpAccount)

//页面相关接口
router.get('/transaction', transactionController.transaction)
router.get('/bit',transactionController.Bitcoin)
router.get('/nav',transactionController.Nav)
router.get('/list',transactionController.List)
router.post('/transaction/send', transactionController.sendTransaction)

//转账相关接口
router.post('/token/send', tokenController.sendTokenTransaction)
router.post('/token/HT',HTcontroller.sendHT)
router.post('/token/trx',TrxAccount.sendTrx)
module.exports = router